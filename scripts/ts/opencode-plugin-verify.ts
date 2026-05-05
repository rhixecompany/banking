#!/usr/bin/env node
/**
 * OpenCode Plugin Verifier
 * Validates that plugins in project config match runtime plugins
 *
 * Enhancements:
 * - Uses bunx opencode debug config for runtime config
 * - Loads project config from multiple paths
 * - Reads and understands .opencode/report.json and docs/schema-design.md
 * - Detects missing plugins, extra plugins, missing configurations, duplicates
 * - Ensures plugins are compatible with OS and system
 * - All functions are async for better performance
 */
import { exec, execFile } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

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

const OS = os.platform();
const ARCH = os.arch();
const NODE_VERSION = process.version;

// Disk space thresholds (in GB)
const DISK_SPACE_CRITICAL_GB = 0.5;
const DISK_SPACE_WARN_GB = 1.0;

function log(msg: string): void {
  console.log(`[opencode-plugin-verify] ${msg}`);
}

function fail(msg: string): void {
  console.error(`[opencode-plugin-verify] ERROR: ${msg}`);
  process.exit(1);
}

async function ensureDir(dir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(dir)) {
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
}

async function runCommand(
  cmd: string,
  args: string[],
  envOverrides?: Record<string, string>,
): Promise<string> {
  return new Promise((resolve, reject) => {
    // Merge environment variables, preserving existing ones
    const env = { ...process.env, ...envOverrides };

    // Use execFile instead of exec to avoid shell injection vulnerabilities
    // execFile takes command and args separately, no shell interpretation
    execFile(
      cmd,
      args,
      { env, maxBuffer: 10 * 1024 * 1024 },
      (error: Error | null, stdout: string, stderr: string) => {
        if (error) {
          reject(
            new Error(
              `Command failed: ${cmd} ${args.join(" ")}\n${stderr || error.message}`,
            ),
          );
        } else {
          resolve(stdout);
        }
      },
    );
  });
}

function extractJsonFromRaw(raw: string): object {
  const start = raw.indexOf("{");
  if (start === -1) {
    throw new Error("Could not locate JSON payload in raw output");
  }
  return JSON.parse(raw.slice(start));
}

function pluginKey(spec: string): string {
  if (typeof spec !== "string") return String(spec);
  if (spec.startsWith("github:")) return spec;
  if (!spec.includes("@")) return spec;
  if (spec.startsWith("@")) {
    const slashIndex = spec.indexOf("/");
    const versionIndex = spec.indexOf("@", slashIndex + 1);
    return versionIndex === -1 ? spec : spec.slice(0, versionIndex);
  }
  return spec.slice(0, spec.lastIndexOf("@"));
}

function dedupe(plugins: string[]): string[] {
  const dedupedReversed: string[] = [];
  const seen = new Set<string>();
  for (let index = plugins.length - 1; index >= 0; index--) {
    const spec = plugins[index];
    const key = pluginKey(spec);
    if (seen.has(key)) continue;
    seen.add(key);
    dedupedReversed.push(spec);
  }
  return dedupedReversed.reverse();
}

function findDuplicates(plugins: string[]): string[] {
  const counts = new Map<string, number>();
  for (const plugin of plugins) {
    const key = pluginKey(plugin);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([key]) => key);
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

function extractPlugins(config: null | object): string[] {
  if (!config || typeof config !== "object") return [];
  const c = config as Record<string, unknown>;
  if (Array.isArray(c.plugin)) {
    return c.plugin.filter((p): p is string => typeof p === "string");
  }
  return [];
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

function checkOSCompatibility(plugin: string): {
  compatible: boolean;
  reason?: string;
} {
  const pluginLower = plugin.toLowerCase();

  const incompatiblePlugins: Record<
    string,
    { platforms?: string[]; arches?: string[]; reason: string }
  > = {
    "@modelcontextprotocol/server-filesystem": {
      reason: "Cross-platform but requires proper path handling on Windows",
    },
    "@modelcontextprotocol/server-github": {
      reason: "Requires git to be installed and accessible in PATH",
    },
    "opencode-mem": {
      platforms: ["win32"],
      reason:
        "Memory plugin has known issues on Windows - use global config instead",
    },
  };

  for (const [pluginPattern, constraints] of Object.entries(
    incompatiblePlugins,
  )) {
    if (pluginLower.includes(pluginPattern.toLowerCase())) {
      if (constraints.platforms && !constraints.platforms.includes(OS)) {
        return {
          compatible: false,
          reason: `Not supported on ${OS}. ${constraints.reason}`,
        };
      }
      return { compatible: true, reason: constraints.reason };
    }
  }

  if (OS === "win32") {
    if (
      plugin.includes("shell") ||
      plugin.includes("bash") ||
      plugin.includes("zsh")
    ) {
      return {
        compatible: true,
        reason:
          "Shell plugins may require WSL on Windows for full functionality",
      };
    }
  }

  if (OS === "darwin" && ARCH === "arm64") {
    if (
      plugin.includes("apple") ||
      plugin.includes("m1") ||
      plugin.includes("intel")
    ) {
      return {
        compatible: true,
        reason: "ARM64 Mac detected - some npm packages may need Rosetta2",
      };
    }
  }

  return { compatible: true };
}

function getSystemInfo(): Record<string, string> {
  return {
    arch: ARCH,
    nodeVersion: NODE_VERSION,
    os: OS,
    platform:
      OS === "win32"
        ? "Windows"
        : OS === "darwin"
          ? "macOS"
          : OS === "linux"
            ? "Linux"
            : OS,
  };
}

async function checkDiskSpace(): Promise<{
  freeBytes: number;
  freeGB: number;
  status: "critical" | "ok" | "warn";
}> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({ freeBytes: 0, freeGB: 0, status: "ok" });
    }, 3000);

    try {
      let command = "";

      if (OS === "win32") {
        // Windows: use PowerShell Get-Volume
        command = `powershell -NoProfile -Command "(Get-Volume -DriveLetter ${REPO_ROOT[0]} | Select-Object -ExpandProperty SizeRemaining)"`;
      } else {
        // macOS/Linux: use df command
        command = `df -k "${REPO_ROOT}" | tail -1 | awk '{print $4}'`;
      }

      exec(
        command,
        { timeout: 2500 },
        (error: Error | null, stdout: string) => {
          clearTimeout(timeout);
          let freeBytes = 0;

          if (!error && stdout) {
            if (OS === "win32") {
              freeBytes = Number.parseInt(stdout.trim(), 10);
            } else {
              // df returns available blocks (1K blocks), convert to bytes
              const availableBlocks = Number.parseInt(stdout.trim(), 10);
              freeBytes = availableBlocks * 1024;
            }
          }

          finalize(freeBytes);
        },
      );

      function finalize(bytes: number) {
        const freeGB = bytes / (1024 * 1024 * 1024);
        let status: "critical" | "ok" | "warn" = "ok";
        if (freeGB < DISK_SPACE_CRITICAL_GB) {
          status = "critical";
        } else if (freeGB < DISK_SPACE_WARN_GB) {
          status = "warn";
        }
        resolve({
          freeBytes: bytes,
          freeGB: Math.round(freeGB * 10) / 10,
          status,
        });
      }
    } catch {
      clearTimeout(timeout);
      resolve({ freeBytes: 0, freeGB: 0, status: "ok" });
    }
  });
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

  log(`========================================`);
  log(`OpenCode Plugin Verifier Starting`);
  log(`========================================`);
  log(`System Info: OS=${OS}, Arch=${ARCH}, Node=${NODE_VERSION}`);
  log(`Repo Root: ${REPO_ROOT}`);
  log(`Report Directory: ${REPORT_DIR}`);
  log(`========================================`);

  if (diskOnlyMode) {
    log("Running in disk-only mode");
    const diskSpace = await checkDiskSpace();
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
    };
    console.log(JSON.stringify(report, null, 2));
    process.exit(diskSpace.status === "critical" ? 1 : 0);
  }

  log("[1/8] Ensuring report directory exists...");
  await ensureDir(REPORT_DIR);
  log("✓ Report directory ready");

  // Check disk space early (non-blocking)
  log("[2/8] Checking disk space...");
  const diskSpace = await checkDiskSpace();
  log(
    `✓ Disk space check complete: ${diskSpace.freeGB} GB free (status: ${diskSpace.status})`,
  );
  if (diskSpace.status === "warn") {
    log(`  WARNING: Low disk space - ${diskSpace.freeGB} GB free`);
  } else if (diskSpace.status === "critical") {
    log(`  CRITICAL: Critically low disk space - ${diskSpace.freeGB} GB free`);
  }

  log("[3/8] Running bunx opencode debug config...");
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

    log("[3.5/8] Writing raw debug output to file...");
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(RAW_REPORT, rawOutput, (err) => {
        if (err) reject(err);
        else {
          log(`✓ Wrote raw output to ${RAW_REPORT}`);
          resolve();
        }
      });
    });

    log("[3.6/8] Extracting JSON from raw output...");
    runtimeConfig = extractJsonFromRaw(rawOutput);
    log(
      `✓ Extracted runtime config with ${Object.keys(runtimeConfig as object).length} keys`,
    );

    log("[3.7/8] Writing normalized runtime config...");
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

  log("[4/8] Loading project configs from multiple paths...");
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

  const projectPlugins = extractPlugins(configs.opencodeConfig);
  const runtimePlugins = extractPlugins(runtimeConfig as object);

  const expected = dedupe(projectPlugins);
  const runtime = dedupe(runtimePlugins);

  log(`[5/8] Comparing plugin lists...`);
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

  log("[6/8] Analyzing configurations...");
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

  log("[6.5/8] Analyzing schema design...");
  const schemaPath = path.join(REPO_ROOT, "docs/schema-design.md");
  const schemaAnalysis = await analyzeSchemaDesign(schemaPath);
  log(
    `✓ Schema analysis complete (${schemaAnalysis ? Object.keys(schemaAnalysis).length : 0} sections found)`,
  );

  log("[6.6/8] Analyzing report file...");
  const reportPath = path.join(REPO_ROOT, ".opencode/report.json");
  const reportAnalysis = await analyzeReport(reportPath);
  log(
    `✓ Report analysis complete (${reportAnalysis ? Object.keys(reportAnalysis).length : 0} sections found)`,
  );

  log("[7/8] Checking OS compatibility...");
  const osCompatibility: Record<
    string,
    { compatible: boolean; reason?: string }
  > = {};
  for (const plugin of expected) {
    osCompatibility[plugin] = checkOSCompatibility(plugin);
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
    log(`  All plugins compatible with ${OS}`);
  }

  // Check MCP server health
  log("[8/8] Checking MCP server health...");
  const mcpHealth = await checkMCPServerHealth(configs.opencodeConfig || {});
  const mcpHealthValues = Object.values(mcpHealth);
  const mcpHealthSummary = {
    authRequired: mcpHealthValues.filter((h) => h.status === "auth-required")
      .length,
    error: mcpHealthValues.filter((h) => h.status === "error").length,
    ok: mcpHealthValues.filter((h) => h.status === "ok").length,
    total: mcpHealthValues.length,
    unreachable: mcpHealthValues.filter((h) => h.status === "unreachable")
      .length,
  };

  log(
    `✓ MCP server health check complete: ${mcpHealthSummary.ok}/${mcpHealthSummary.total} servers ok`,
  );

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

  log("[9/8] Writing verification reports...");
  await new Promise<void>((resolve, reject) => {
    fs.writeFile(VERIFY_REPORT, JSON.stringify(summary, null, 2), (err) => {
      if (err) reject(err);
      else {
        log(`✓ Verification report written to ${VERIFY_REPORT}`);
        resolve();
      }
    });
  });

  // Write MCP health details to separate report
  const mcpHealthReport = path.join(REPORT_DIR, "opencode-mcp-health.json");
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
    log(`  - MCP health: ${mcpHealthReport}`);
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
  log(`  - MCP health: ${mcpHealthReport}`);
  log(`  - Raw debug output: ${RAW_REPORT}`);
  log(`  - Normalized runtime config: ${RUNTIME_REPORT}`);
  log("========================================");
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
