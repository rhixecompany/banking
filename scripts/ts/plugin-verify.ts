#!/usr/bin/env node
/**
 * OpenCode Plugin Verifier
 * Validates that plugins in project config match runtime plugins
 *
 * Enhancements:
 * - Uses opencode debug config for runtime config
 * - Loads project config from multiple paths
 * - Reads and understands .opencode/report.json and docs/schema-design.md
 * - Detects missing plugins, extra plugins, missing configurations, duplicates
 * - Ensures plugins are compatible with OS and system
 * - All functions are async for better performance
 */
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

import {
  ARCH,
  NODE_VERSION,
  OS_PLATFORM,
  analyzeDiskUsage,
  checkDiskSpace,
  checkOsCompatibility,
  dedupePlugins,
  ensureDir,
  extractJsonFromRaw,
  extractPlugins,
  findDuplicates,
  runCommand,
  type DiskAnalysis,
} from "./utils/plugin-shared";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface VerifyReport {
  timestamp: string;
  ok: boolean;
  projectConfig: string;
  runtimeConfig: string;
  expectedCount: number;
  runtimeCount: number;
  missing: string[];
  extras: string[];
  projectDuplicates: string[];
  runtimeDuplicates: string[];
  missingConfigurations: string[];
  configComparison: Record<string, { source: string; present: boolean }>;
  schemaAnalysis: null | Record<string, unknown>;
  reportAnalysis: null | Record<string, unknown>;
  osCompatibility: Record<string, { compatible: boolean; reason?: string }>;
  diskSpace: {
    freeBytes: number;
    freeGB: number;
    status: "critical" | "ok" | "warn";
    analysis?: DiskAnalysis;
  };
  mcpHealthSummary: {
    total: number;
    ok: number;
    authRequired: number;
    unreachable: number;
    error: number;
  };
}

const REPO_ROOT = path.resolve(__dirname, "../..");
const REPORT_DIR =
  process.env.REPORT_DIR || path.join(REPO_ROOT, ".opencode/reports");

function resolveProjectConfigPath(): string {
  // Priority order: canonical, fallback, legacy, global
  const candidates = [
    path.join(REPO_ROOT, ".opencode/opencode.json"),
    path.join(REPO_ROOT, "opencode.json"),
    path.join(REPO_ROOT, "aiconfig.json"),
    path.join(os.homedir(), ".config/opencode/opencode.json"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  // Fallback to canonical path even if it doesn't exist
  return candidates[0];
}

const PROJECT_CONFIG = process.env.PROJECT_CONFIG || resolveProjectConfigPath();

const RAW_REPORT = path.join(REPORT_DIR, "opencode-debug-config.raw.txt");
const RUNTIME_REPORT = path.join(
  REPORT_DIR,
  "opencode-debug-config.runtime.json",
);
const VERIFY_REPORT = path.join(REPORT_DIR, "opencode-plugin-verify.json");

const CONFIG_PATHS = [
  path.join(REPO_ROOT, ".opencode/opencode.json"),
  path.join(REPO_ROOT, ".opencode/tui.json"),
  path.join(os.homedir(), ".config/opencode/opencode.json"),
  path.join(os.homedir(), ".config/opencode/tui.json"),
];

function log(msg: string): void {
  console.log(`[opencode-plugin-verify] ${msg}`);
}

function fail(msg: string): never {
  console.error(`[opencode-plugin-verify] ERROR: ${msg}`);
  process.exit(1);
}

async function loadProjectConfigs(): Promise<{
  opencodeConfig: null | object;
  tuiConfig: null | object;
  globalOpencodeConfig: null | object;
  globalTuiConfig: null | object;
}> {
  const configs = {
    globalOpencodeConfig: null as null | object,
    globalTuiConfig: null as null | object,
    opencodeConfig: null as null | object,
    tuiConfig: null as null | object,
  };

  for (const configPath of CONFIG_PATHS) {
    try {
      const content = await new Promise<string>((resolve, reject) => {
        fs.readFile(configPath, "utf-8", (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });
      const parsed = JSON.parse(content);

      const fileName = path.basename(configPath);
      if (fileName === "opencode.json") {
        if (configPath.includes(".opencode")) {
          configs.opencodeConfig = parsed;
        } else {
          configs.globalOpencodeConfig = parsed;
        }
      } else if (fileName === "tui.json") {
        if (configPath.includes(".opencode")) {
          configs.tuiConfig = parsed;
        } else {
          configs.globalTuiConfig = parsed;
        }
      }
    } catch (e) {
      // Only silently skip file-not-found errors; log other issues
      const error = e as NodeJS.ErrnoException;
      if (error.code !== "ENOENT") {
        // Log parse errors or permission issues, but don't fail the entire check
        const errorMsg =
          error instanceof SyntaxError
            ? `JSON parse error in ${configPath}: ${error.message}`
            : `Error reading ${configPath}: ${error.code || error.message}`;
        console.warn(`⚠️ Config warning: ${errorMsg}`);
      }
    }
  }

  return configs;
}

function compareConfigurations(
  projectConfig: null | object,
  globalConfig: null | object,
): Record<string, { source: string; present: boolean }> {
  const comparison: Record<string, { source: string; present: boolean }> = {};
  const allKeys = new Set<string>();

  const project = projectConfig as null | Record<string, unknown>;
  const global = globalConfig as null | Record<string, unknown>;

  if (project) {
    for (const key of Object.keys(project)) {
      allKeys.add(key);
    }
  }
  if (global) {
    for (const key of Object.keys(global)) {
      allKeys.add(key);
    }
  }

  for (const key of allKeys) {
    const inProject = project ? key in project : false;
    const inGlobal = global ? key in global : false;

    if (!inProject && !inGlobal) {
      comparison[key] = { present: false, source: "none" };
    } else if (inProject && inGlobal) {
      comparison[key] = { present: true, source: "both" };
    } else if (inProject) {
      comparison[key] = { present: true, source: "project" };
    } else {
      comparison[key] = { present: true, source: "global" };
    }
  }

  return comparison;
}

async function analyzeSchemaDesign(
  templatePath: string,
): Promise<null | Record<string, unknown>> {
  try {
    const content = await new Promise<string>((resolve, reject) => {
      fs.readFile(templatePath, "utf-8", (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });

    const schemaInfo: Record<string, unknown> = {
      configLocations: {} as Record<string, unknown>,
      contentLength: content.length,
      extensionTypes: [] as string[],
      fileExists: true,
      parseWarnings: [] as string[],
    };

    // Parse extension types with validation
    const typeMatches = content.match(/### \d+\.\d+ `(\w+)`/g);
    if (typeMatches) {
      const types: string[] = [];
      for (const match of typeMatches) {
        const typeMatch = match.match(/`(\w+)`/);
        if (typeMatch && typeMatch[1]) {
          types.push(typeMatch[1]);
        }
      }
      schemaInfo.extensionTypes = types;
      if (types.length === 0 && typeMatches.length > 0) {
        (schemaInfo.parseWarnings as string[]).push(
          "Found type section headers but no extractable type names",
        );
      }
    }

    // Parse config section with better validation
    const configSection = content.match(
      /### 3\.\d+ [^\n]+\n\n([\s\S]*?)(?=###|$)/,
    );
    if (configSection) {
      const configLocs: Record<string, string> = {};
      // Use matchAll to extract all backtick-quoted values via capturing groups
      const matches = [...configSection[1].matchAll(/`([^`]+)`/g)];
      for (let i = 0; i < matches.length - 1; i += 2) {
        const key = matches[i][1];
        const value = matches[i + 1][1];
        configLocs[key] = value;
      }
      // Warn if odd number of values (incomplete pairs)
      if (matches.length % 2 === 1) {
        (schemaInfo.parseWarnings as string[]).push(
          `Config section has odd number of backtick-quoted values (incomplete key-value pair)`,
        );
      }
      schemaInfo.configLocations = configLocs;
    }

    return schemaInfo;
  } catch {
    return null;
  }
}

async function analyzeReport(
  reportPath: string,
): Promise<null | Record<string, unknown>> {
  try {
    const content = await new Promise<string>((resolve, reject) => {
      fs.readFile(reportPath, "utf-8", (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
    const report = JSON.parse(content);

    const analysis: Record<string, unknown> = {
      fileExists: true,
      topLevelKeys: Object.keys(report),
    };

    if (report.plugins) {
      analysis.pluginCount = Array.isArray(report.plugins)
        ? report.plugins.length
        : 0;
    }

    if (report.mcp) {
      analysis.mcpServers = Object.keys(report.mcp);
    }

    return analysis;
  } catch {
    return null;
  }
}

function findMissingConfigurations(
  projectConfig: null | object,
  runtimeConfig: null | object,
): string[] {
  const missing: string[] = [];
  const project = projectConfig as null | Record<string, unknown>;
  const runtime = runtimeConfig as null | Record<string, unknown>;

  if (!project || !runtime) return missing;

  const importantFields = ["plugin", "mcp", "model", "provider", "agent"];
  for (const field of importantFields) {
    if (!(field in runtime) && field in project) {
      missing.push(field);
    }
  }

  return missing;
}

function getSystemInfo(): Record<string, string> {
  return {
    arch: ARCH,
    nodeVersion: NODE_VERSION,
    os: OS_PLATFORM,
    platform:
      OS_PLATFORM === "win32"
        ? "Windows"
        : OS_PLATFORM === "darwin"
          ? "macOS"
          : OS_PLATFORM === "linux"
            ? "Linux"
            : OS_PLATFORM,
  };
}

interface MCPServerHealth {
  status: "auth-required" | "error" | "ok" | "unreachable";
  exitCode: number;
  stdout: string;
  stderr: string;
  durationMs: number;
}

async function checkMCPServerHealth(
  config: object,
): Promise<Record<string, MCPServerHealth>> {
  const results: Record<string, MCPServerHealth> = {};
  const mcpServers = (config as Record<string, unknown>)?.mcp as Record<
    string,
    unknown
  >;
  if (!mcpServers || typeof mcpServers !== "object") {
    return results;
  }

  for (const serverName of Object.keys(mcpServers)) {
    const startTime = Date.now();
    try {
      const stdout = await runCommand(
        "bunx",
        ["opencode", "mcp", "debug", serverName],
        {
          NODE_OPTIONS: "--max-old-space-size=4096",
        },
      );
      const durationMs = Date.now() - startTime;

      results[serverName] = {
        durationMs,
        exitCode: 0,
        status: "ok",
        stderr: "",
        stdout: stdout.slice(0, 200),
      };
    } catch (e) {
      const durationMs = Date.now() - startTime;
      const errorStr = String(e);
      let status: "auth-required" | "error" | "ok" | "unreachable" = "error";

      if (errorStr.includes("401") || errorStr.includes("403")) {
        status = "auth-required";
      } else if (
        errorStr.includes("refused") ||
        errorStr.includes("timeout") ||
        errorStr.includes("ECONNREFUSED")
      ) {
        status = "unreachable";
      }

      results[serverName] = {
        durationMs,
        exitCode: 1,
        status,
        stderr: errorStr.slice(0, 200),
        stdout: "",
      };
    }
  }

  return results;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const diskOnlyMode = args.includes("--disk-only");
  const skipMcpHealth = args.includes("--skip-mcp-health");

  log(`========================================`);
  log(`OpenCode Plugin Verifier Starting`);
  log(`========================================`);
  log(`System Info: OS=${OS_PLATFORM}, Arch=${ARCH}, Node=${NODE_VERSION}`);
  log(`Repo Root: ${REPO_ROOT}`);
  log(`Report Directory: ${REPORT_DIR}`);
  log(`========================================`);

  if (diskOnlyMode) {
    log("Running in disk-only mode");
    const diskSpace = await checkDiskSpace(REPO_ROOT);

    // Enrich --disk-only with full disk analysis
    let analysis: DiskAnalysis | undefined;
    try {
      const configs = await loadProjectConfigs();
      const projectPlugins = extractPlugins(
        configs.opencodeConfig as null | Record<string, unknown>,
      );
      analysis = await analyzeDiskUsage({
        cacheDir: path.join(os.homedir(), ".cache/opencode"),
        globalConfigDir: path.join(os.homedir(), ".config/opencode"),
        pluginSpecs: projectPlugins,
        reportDir: REPORT_DIR,
      });
      if (analysis) {
        log("");
        log("Disk Usage Analysis:");
        log(analysis.table);
      }
    } catch (e) {
      log(`⚠️ Disk analysis failed: ${e}`);
    }

    const report = {
      freeGB: diskSpace.freeGB,
      message:
        diskSpace.status === "ok"
          ? "Disk space is adequate"
          : diskSpace.status === "warn"
            ? "Low disk space warning"
            : "Critical disk space alert",
      status: diskSpace.status,
      timestamp: new Date().toISOString(),
      ...(analysis && { analysis }),
    };
    console.log(JSON.stringify(report, null, 2));
    process.exit(diskSpace.status === "critical" ? 1 : 0);
  }

  log("[1/9] Ensuring report directory exists...");
  await ensureDir(REPORT_DIR);
  log("✓ Report directory ready");

  // Check disk space early (non-blocking)
  log("[2/9] Checking disk space...");
  const diskSpace = await checkDiskSpace(REPO_ROOT);
  log(
    `✓ Disk space check complete: ${diskSpace.freeGB} GB free (status: ${diskSpace.status})`,
  );
  if (diskSpace.status === "warn") {
    log(`  WARNING: Low disk space - ${diskSpace.freeGB} GB free`);
  } else if (diskSpace.status === "critical") {
    log(`  CRITICAL: Critically low disk space - ${diskSpace.freeGB} GB free`);
  }

  log("[3/9] Running opencode debug config...");
  let runtimeConfig = {};
  try {
    // Increase Node memory to prevent OutOfMemory errors in opencode CLI
    const rawOutput = await runCommand(
      "bunx",
      ["opencode", "debug", "config"],
      {
        NODE_OPTIONS: "--max-old-space-size=4096",
      },
    );
    log(`✓ Debug config retrieved (${rawOutput.length} bytes)`);

    log("[3.5/9] Writing raw debug output to file...");
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(RAW_REPORT, rawOutput, (err) => {
        if (err) reject(err);
        else {
          log(`✓ Wrote raw output to ${RAW_REPORT}`);
          resolve();
        }
      });
    });

    log("[3.6/9] Extracting JSON from raw output...");
    runtimeConfig = extractJsonFromRaw(rawOutput);
    log(
      `✓ Extracted runtime config with ${Object.keys(runtimeConfig as object).length} keys`,
    );

    log("[3.7/9] Writing normalized runtime config...");
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(
        RUNTIME_REPORT,
        JSON.stringify(runtimeConfig, null, 2),
        (err) => {
          if (err) reject(err);
          else {
            log(`✓ Wrote normalized config to ${RUNTIME_REPORT}`);
            resolve();
          }
        },
      );
    });
  } catch (e) {
    log(`⚠  Warning: Failed to run opencode debug config: ${e}`);
    log(`  Continuing with empty runtime config...`);
  }

  log("[4/9] Loading project configs from multiple paths...");
  const configs = await loadProjectConfigs();
  const configsLoaded = [
    configs.opencodeConfig ? ".opencode/opencode.json" : null,
    configs.globalOpencodeConfig ? "~/.opencode/opencode.json" : null,
    configs.tuiConfig ? ".opencode/tui.json" : null,
    configs.globalTuiConfig ? "~/.opencode/tui.json" : null,
  ].filter(Boolean);
  log(
    `✓ Loaded configs from: ${configsLoaded.length > 0 ? configsLoaded.join(", ") : "(none found)"}`,
  );

  const projectPlugins = extractPlugins(
    configs.opencodeConfig as null | Record<string, unknown>,
  );
  const runtimePlugins = extractPlugins(
    runtimeConfig as Record<string, unknown>,
  );

  const expected = dedupePlugins(projectPlugins);
  const runtime = dedupePlugins(runtimePlugins);

  log(`[5/9] Comparing plugin lists...`);
  log(`  Expected plugins (from project): ${expected.length} unique`);
  if (expected.length > 0) log(`    ${expected.join(", ")}`);
  log(`  Runtime plugins (from OpenCode): ${runtime.length} unique`);
  if (runtime.length > 0) log(`    ${runtime.join(", ")}`);

  const missing = expected.filter((p) => !runtime.includes(p));
  const extras = runtime.filter((p) => !expected.includes(p));
  const projectDuplicates = findDuplicates(projectPlugins);
  const runtimeDuplicates = findDuplicates(runtimePlugins);

  if (missing.length > 0) log(`  Missing from runtime: ${missing.join(", ")}`);
  if (extras.length > 0) log(`  Extra in runtime: ${extras.join(", ")}`);
  if (projectDuplicates.length > 0)
    log(`  Duplicates in project: ${projectDuplicates.join(", ")}`);
  if (runtimeDuplicates.length > 0)
    log(`  Duplicates in runtime: ${runtimeDuplicates.join(", ")}`);

  log("[6/9] Analyzing configurations...");
  const configComparison = compareConfigurations(
    configs.opencodeConfig,
    configs.globalOpencodeConfig,
  );
  log(`  Compared ${Object.keys(configComparison).length} configuration keys`);

  const missingConfigurations = findMissingConfigurations(
    configs.opencodeConfig,
    runtimeConfig as object,
  );
  if (missingConfigurations.length > 0)
    log(`  Missing configs: ${missingConfigurations.join(", ")}`);

  log("[6.5/9] Analyzing schema design...");
  const schemaPath = path.join(REPO_ROOT, "docs/schema-design.md");
  const schemaAnalysis = await analyzeSchemaDesign(schemaPath);
  log(
    `✓ Schema analysis complete (${schemaAnalysis ? Object.keys(schemaAnalysis).length : 0} sections found)`,
  );

  log("[6.6/9] Analyzing report file...");
  const reportPath = path.join(REPO_ROOT, ".opencode/report.json");
  const reportAnalysis = await analyzeReport(reportPath);
  log(
    `✓ Report analysis complete (${reportAnalysis ? Object.keys(reportAnalysis).length : 0} sections found)`,
  );

  log("[7/9] Checking OS compatibility...");
  const osCompatibility: Record<
    string,
    { compatible: boolean; reason?: string }
  > = {};
  for (const plugin of expected) {
    const result = checkOsCompatibility(plugin);
    osCompatibility[plugin] = {
      compatible: result.compatible,
      reason: result.reason,
    };
  }

  const osIncompatible = Object.entries(osCompatibility).filter(
    ([, v]) => !v.compatible,
  );
  if (osIncompatible.length > 0) {
    log(`  OS incompatible plugins found:`);
    for (const [plugin, info] of osIncompatible) {
      log(`    - ${plugin}: ${info.reason}`);
    }
  } else {
    log(`  All plugins compatible with ${OS_PLATFORM}`);
  }

  // Check MCP server health (optional)
  const mcpHealthSummary = {
    authRequired: 0,
    error: 0,
    ok: 0,
    total: 0,
    unreachable: 0,
  };
  let mcpHealth: Record<string, MCPServerHealth> = {};

  if (skipMcpHealth) {
    log("[8/9] Skipping MCP server health check (--skip-mcp-health)");
  } else {
    log("[8/9] Checking MCP server health...");
    mcpHealth = await checkMCPServerHealth(configs.opencodeConfig || {});
    const mcpHealthValues = Object.values(mcpHealth);
    mcpHealthSummary.authRequired = mcpHealthValues.filter(
      (h) => h.status === "auth-required",
    ).length;
    mcpHealthSummary.error = mcpHealthValues.filter(
      (h) => h.status === "error",
    ).length;
    mcpHealthSummary.ok = mcpHealthValues.filter(
      (h) => h.status === "ok",
    ).length;
    mcpHealthSummary.total = mcpHealthValues.length;
    mcpHealthSummary.unreachable = mcpHealthValues.filter(
      (h) => h.status === "unreachable",
    ).length;

    log(
      `✓ MCP server health check complete: ${mcpHealthSummary.ok}/${mcpHealthSummary.total} servers ok`,
    );
  }

  const ok =
    missing.length === 0 &&
    projectDuplicates.length === 0 &&
    runtimeDuplicates.length === 0 &&
    missingConfigurations.length === 0 &&
    osIncompatible.length === 0;

  const summary: VerifyReport = {
    configComparison,
    diskSpace,
    expectedCount: expected.length,
    extras,
    mcpHealthSummary,
    missing,
    missingConfigurations,
    ok,
    osCompatibility,
    projectConfig: PROJECT_CONFIG,
    projectDuplicates,
    reportAnalysis,
    runtimeConfig: RUNTIME_REPORT,
    runtimeCount: runtime.length,
    runtimeDuplicates,
    schemaAnalysis,
    timestamp: new Date().toISOString(),
  };

  log("[9/9] Writing verification reports...");
  await new Promise<void>((resolve, reject) => {
    fs.writeFile(VERIFY_REPORT, JSON.stringify(summary, null, 2), (err) => {
      if (err) reject(err);
      else {
        log(`✓ Verification report written to ${VERIFY_REPORT}`);
        resolve();
      }
    });
  });

  // Write MCP health details to separate report (unless skipped)
  const mcpHealthReport = path.join(REPORT_DIR, "opencode-mcp-health.json");
  if (skipMcpHealth) {
    log(`- MCP health check skipped; report not updated: ${mcpHealthReport}`);
  } else {
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(
        mcpHealthReport,
        JSON.stringify(
          {
            servers: mcpHealth,
            summary: mcpHealthSummary,
            timestamp: new Date().toISOString(),
          },
          null,
          2,
        ),
        (err) => {
          if (err) reject(err);
          else {
            log(`✓ MCP health report written to ${mcpHealthReport}`);
            resolve();
          }
        },
      );
    });
  }

  console.log(
    JSON.stringify(
      {
        ...summary,
        systemInfo: getSystemInfo(),
      },
      null,
      2,
    ),
  );

  if (!ok) {
    log("");
    log("========================================");
    log("VERIFICATION FAILED - Issues Found");
    log("========================================");
    if (missing.length > 0) {
      log(`Missing plugins (${missing.length}): ${missing.join(", ")}`);
    }
    if (extras.length > 0) {
      log(`Extra plugins in runtime (${extras.length}): ${extras.join(", ")}`);
    }
    if (projectDuplicates.length > 0) {
      log(
        `Duplicate plugins in project (${projectDuplicates.length}): ${projectDuplicates.join(", ")}`,
      );
    }
    if (runtimeDuplicates.length > 0) {
      log(
        `Duplicate plugins in runtime (${runtimeDuplicates.length}): ${runtimeDuplicates.join(", ")}`,
      );
    }
    if (missingConfigurations.length > 0) {
      log(
        `Missing configurations (${missingConfigurations.length}): ${missingConfigurations.join(", ")}`,
      );
    }
    if (osIncompatible.length > 0) {
      log(`OS incompatible plugins (${osIncompatible.length}):`);
      for (const [plugin, info] of osIncompatible) {
        log(`  - ${plugin}: ${info.reason}`);
      }
    }
    log("========================================");
    log(`Reports available:`);
    log(`  - Verify report: ${VERIFY_REPORT}`);
    if (skipMcpHealth) {
      log(`  - MCP health: skipped (--skip-mcp-health)`);
    } else {
      log(`  - MCP health: ${mcpHealthReport}`);
    }
    log(`  - Raw debug output: ${RAW_REPORT}`);
    process.exit(1);
  }

  log("");
  log("========================================");
  log("VERIFICATION PASSED ✓");
  log("========================================");
  log(`Expected plugins: ${expected.length} (${expected.join(", ")})`);
  log(`Runtime plugins: ${runtime.length} (${runtime.join(", ")})`);
  log(`No missing plugins, duplicates, or OS incompatibilities found`);
  log(
    `MCP health: ${mcpHealthSummary.ok}/${mcpHealthSummary.total} servers online`,
  );
  log(`Disk space: ${diskSpace.freeGB} GB free (status: ${diskSpace.status})`);
  log("");
  log("Reports written to:");
  log(`  - Verify report: ${VERIFY_REPORT}`);
  if (skipMcpHealth) {
    log(`  - MCP health: skipped (--skip-mcp-health)`);
  } else {
    log(`  - MCP health: ${mcpHealthReport}`);
  }
  log(`  - Raw debug output: ${RAW_REPORT}`);
  log(`  - Normalized runtime config: ${RUNTIME_REPORT}`);
  log("========================================");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
