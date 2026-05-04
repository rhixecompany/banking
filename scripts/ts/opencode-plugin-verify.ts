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
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface VerifyReport {
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
  schemaAnalysis: Record<string, unknown> | null;
  reportAnalysis: Record<string, unknown> | null;
  osCompatibility: Record<string, { compatible: boolean; reason?: string }>;
}

const REPO_ROOT = path.resolve(__dirname, "../..");
const PROJECT_CONFIG =
  process.env.PROJECT_CONFIG || path.join(REPO_ROOT, "aiconfig.json");
const REPORT_DIR =
  process.env.REPORT_DIR || path.join(REPO_ROOT, ".opencode/reports");

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

function log(msg: string): void {
  console.log(`[opencode-plugin-verify] ${msg}`);
}

function fail(msg: string): void {
  console.error(`[opencode-plugin-verify] ERROR: ${msg}`);
  process.exit(1);
}

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function runCommand(cmd: string, args: string[]): string {
  const result = spawnSync(cmd, args, { encoding: "utf-8" });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      `Command failed with status ${result.status}: ${cmd} ${args.join(" ")}`,
    );
  }
  return result.stdout;
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

function loadProjectConfigs(): {
  opencodeConfig: object | null;
  tuiConfig: object | null;
  globalOpencodeConfig: object | null;
  globalTuiConfig: object | null;
} {
  const configs = {
    opencodeConfig: null as object | null,
    tuiConfig: null as object | null,
    globalOpencodeConfig: null as object | null,
    globalTuiConfig: null as object | null,
  };

  for (const configPath of CONFIG_PATHS) {
    if (!fs.existsSync(configPath)) continue;

    try {
      const content = fs.readFileSync(configPath, "utf-8");
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
      log(`Warning: Failed to parse ${configPath}: ${e}`);
    }
  }

  return configs;
}

function extractPlugins(config: object | null): string[] {
  if (!config || typeof config !== "object") return [];
  const c = config as Record<string, unknown>;
  if (Array.isArray(c.plugin)) {
    return c.plugin.filter((p): p is string => typeof p === "string");
  }
  return [];
}

function compareConfigurations(
  projectConfig: object | null,
  globalConfig: object | null,
): Record<string, { source: string; present: boolean }> {
  const comparison: Record<string, { source: string; present: boolean }> = {};
  const allKeys = new Set<string>();

  const project = projectConfig as Record<string, unknown> | null;
  const global = globalConfig as Record<string, unknown> | null;

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
      comparison[key] = { source: "none", present: false };
    } else if (inProject && inGlobal) {
      comparison[key] = { source: "both", present: true };
    } else if (inProject) {
      comparison[key] = { source: "project", present: true };
    } else {
      comparison[key] = { source: "global", present: true };
    }
  }

  return comparison;
}

function analyzeSchemaDesign(templatePath: string): Record<string, unknown> | null {
  if (!fs.existsSync(templatePath)) {
    log(`Schema design not found: ${templatePath}`);
    return null;
  }

  try {
    const content = fs.readFileSync(templatePath, "utf-8");

    const schemaInfo: Record<string, unknown> = {
      fileExists: true,
      contentLength: content.length,
      extensionTypes: [] as string[],
      configLocations: {} as Record<string, unknown>,
    };

    const typeMatches = content.match(/### \d+\.\d+ `(\w+)`/g);
    if (typeMatches) {
      schemaInfo.extensionTypes = typeMatches.map(m => m.match(/`(\w+)`/)?.[1] || "").filter(Boolean);
    }

    const configSection = content.match(/### 3\.\d+ [\w\s]+\n\n([\s\S]*?)(?=###|$)/);
    if (configSection) {
      const paths = configSection[1].match(/`[^`]+`/g);
      const configLocs: Record<string, string> = {};
      if (paths) {
        paths.forEach(p => {
          const match = p.match(/`([^`]+)`.*?`([^`]+)`/);
          if (match) {
            configLocs[match[2]] = match[1];
          }
        });
      }
      schemaInfo.configLocations = configLocs;
    }

    return schemaInfo;
  } catch (e) {
    log(`Warning: Failed to analyze schema design: ${e}`);
    return null;
  }
}

function analyzeReport(reportPath: string): Record<string, unknown> | null {
  if (!fs.existsSync(reportPath)) {
    log(`Report not found: ${reportPath}`);
    return null;
  }

  try {
    const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

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
  } catch (e) {
    log(`Warning: Failed to analyze report: ${e}`);
    return null;
  }
}

function findMissingConfigurations(
  projectConfig: object | null,
  runtimeConfig: object | null,
): string[] {
  const missing: string[] = [];
  const project = projectConfig as Record<string, unknown> | null;
  const runtime = runtimeConfig as Record<string, unknown> | null;

  if (!project || !runtime) return missing;

  const importantFields = ["plugin", "mcp", "model", "provider", "agent"];
  for (const field of importantFields) {
    if (!(field in runtime) && field in project) {
      missing.push(field);
    }
  }

  return missing;
}

function checkOSCompatibility(plugin: string): { compatible: boolean; reason?: string } {
  const pluginLower = plugin.toLowerCase();

  const incompatiblePlugins: Record<string, { platforms?: string[]; arches?: string[]; reason: string }> = {
    "opencode-mem": {
      platforms: ["win32"],
      reason: "Memory plugin has known issues on Windows - use global config instead"
    },
    "@modelcontextprotocol/server-filesystem": {
      reason: "Cross-platform but requires proper path handling on Windows"
    },
    "@modelcontextprotocol/server-github": {
      reason: "Requires git to be installed and accessible in PATH"
    },
  };

  for (const [pluginPattern, constraints] of Object.entries(incompatiblePlugins)) {
    if (pluginLower.includes(pluginPattern.toLowerCase())) {
      if (constraints.platforms && !constraints.platforms.includes(OS)) {
        return { compatible: false, reason: `Not supported on ${OS}. ${constraints.reason}` };
      }
      return { compatible: true, reason: constraints.reason };
    }
  }

  if (OS === "win32") {
    if (plugin.includes("shell") || plugin.includes("bash") || plugin.includes("zsh")) {
      return { 
        compatible: true, 
        reason: "Shell plugins may require WSL on Windows for full functionality" 
      };
    }
  }

  if (OS === "darwin" && (ARCH === "arm64")) {
    if (plugin.includes("apple") || plugin.includes("m1") || plugin.includes("intel")) {
      return { 
        compatible: true, 
        reason: "ARM64 Mac detected - some npm packages may need Rosetta2" 
      };
    }
  }

  return { compatible: true };
}

function getSystemInfo(): Record<string, string> {
  return {
    os: OS,
    arch: ARCH,
    nodeVersion: NODE_VERSION,
    platform: OS === "win32" ? "Windows" : OS === "darwin" ? "macOS" : OS === "linux" ? "Linux" : OS,
  };
}

async function main(): Promise<void> {
  log(`System Info: OS=${OS}, Arch=${ARCH}, Node=${NODE_VERSION}`);

  try {
    spawnSync("node", ["--version"], { stdio: "ignore" });
  } catch {
    fail("Missing required command: node");
  }

  try {
    spawnSync("bun", ["--version"], { stdio: "ignore" });
  } catch {
    fail("Missing required command: bun");
  }

  ensureDir(REPORT_DIR);

  log("Running bunx opencode debug config");
  let rawOutput = "";
  try {
    rawOutput = runCommand("bunx", ["opencode", "debug", "config"]);
  } catch (e) {
    fail(`Failed to run opencode debug config: ${e}`);
  }
  fs.writeFileSync(RAW_REPORT, rawOutput);

  const runtimeConfig = extractJsonFromRaw(rawOutput);
  fs.writeFileSync(RUNTIME_REPORT, JSON.stringify(runtimeConfig, null, 2));

  log("Loading project configs from multiple paths");
  const configs = loadProjectConfigs();

  const projectPlugins = extractPlugins(configs.opencodeConfig);
  const runtimePlugins = extractPlugins(runtimeConfig as object);

  const expected = dedupe(projectPlugins);
  const runtime = dedupe(runtimePlugins);

  const missing = expected.filter((p) => !runtime.includes(p));
  const extras = runtime.filter((p) => !expected.includes(p));
  const projectDuplicates = findDuplicates(projectPlugins);
  const runtimeDuplicates = findDuplicates(runtimePlugins);

  const configComparison = compareConfigurations(
    configs.opencodeConfig,
    configs.globalOpencodeConfig,
  );

  const missingConfigurations = findMissingConfigurations(
    configs.opencodeConfig,
    runtimeConfig as object,
  );

  const schemaPath = path.join(REPO_ROOT, "docs/schema-design.md");
  const schemaAnalysis = analyzeSchemaDesign(schemaPath);

  const reportPath = path.join(REPO_ROOT, ".opencode/report.json");
  const reportAnalysis = analyzeReport(reportPath);

  const osCompatibility: Record<string, { compatible: boolean; reason?: string }> = {};
  for (const plugin of expected) {
    osCompatibility[plugin] = checkOSCompatibility(plugin);
  }

  const osIncompatible = Object.entries(osCompatibility).filter(([, v]) => !v.compatible);

  const ok =
    missing.length === 0 &&
    projectDuplicates.length === 0 &&
    runtimeDuplicates.length === 0 &&
    missingConfigurations.length === 0 &&
    osIncompatible.length === 0;

  const summary: VerifyReport = {
    expectedCount: expected.length,
    extras,
    missing,
    ok,
    projectConfig: PROJECT_CONFIG,
    projectDuplicates,
    runtimeConfig: RUNTIME_REPORT,
    runtimeCount: runtime.length,
    runtimeDuplicates,
    missingConfigurations,
    configComparison,
    schemaAnalysis,
    reportAnalysis,
    osCompatibility,
  };

  fs.writeFileSync(VERIFY_REPORT, JSON.stringify(summary, null, 2));

  log(`Verification summary written to ${VERIFY_REPORT}`);
  console.log(JSON.stringify({
    ...summary,
    systemInfo: getSystemInfo(),
  }, null, 2));

  if (!ok) {
    log("Verification failed - issues found:");
    if (missing.length > 0) {
      log(`  - Missing plugins: ${missing.join(", ")}`);
    }
    if (extras.length > 0) {
      log(`  - Extra plugins in runtime: ${extras.join(", ")}`);
    }
    if (projectDuplicates.length > 0) {
      log(`  - Duplicate plugins in project: ${projectDuplicates.join(", ")}`);
    }
    if (runtimeDuplicates.length > 0) {
      log(`  - Duplicate plugins in runtime: ${runtimeDuplicates.join(", ")}`);
    }
    if (missingConfigurations.length > 0) {
      log(`  - Missing configurations: ${missingConfigurations.join(", ")}`);
    }
    if (osIncompatible.length > 0) {
      log(`  - OS incompatible plugins:`);
      for (const [plugin, info] of osIncompatible) {
        log(`    - ${plugin}: ${info.reason}`);
      }
    }
    process.exit(1);
  }

  log("Verification passed");
  log(`Raw debug output: ${RAW_REPORT}`);
  log(`Normalized runtime config: ${RUNTIME_REPORT}`);
  log(`Verification report: ${VERIFY_REPORT}`);
}

main();