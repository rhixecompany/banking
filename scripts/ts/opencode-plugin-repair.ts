#!/usr/bin/env node
/**
 * OpenCode Plugin Repair
 * Restores plugin runtime state by cleaning stale installs and reinstalling
 * all plugins listed across project and global configs.
 *
 * Safe by default (dry-run mode). Pass --apply to perform changes.
 *
 * Config sources (in priority order):
 *   1. .opencode/opencode.json  (project)
 *   2. .opencode/tui.json       (project)
 *   3. ~/.config/opencode/opencode.json  (global)
 *   4. ~/.config/opencode/tui.json       (global)
 *
 * All functions are async for consistent performance and error handling.
 */
import { exec, execFile } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Types ────────────────────────────────────────────────────────────────────

interface CliArgs {
  apply: boolean;
  printLogs: boolean;
  skipReinstall: boolean;
  skipVerify: boolean;
  skipMissingFix: boolean;
  skipExtraFix: boolean;
  useCachedRuntime: boolean;
}

interface ConfigSet {
  projectOpencode: null | Record<string, unknown>;
  projectTui: null | Record<string, unknown>;
  globalOpencode: null | Record<string, unknown>;
  globalTui: null | Record<string, unknown>;
}

interface NormalizeReport {
  configSources: {
    projectOpencode: string;
    projectTui: string;
    globalOpencode: string;
    globalTui: string;
  };
  originalCount: number;
  dedupedCount: number;
  removedPlugins: string[];
  changed: boolean;
  timestamp: string;
}

interface OSCompatResult {
  compatible: boolean;
  reason: string;
}

interface RepairReport {
  timestamp: string;
  configChanged: boolean;
  cleanupTargets: string[];
  reinstallSummary: {
    globalPlugins: number;
    projectPlugins: number;
    total: number;
  };
  skippedPlugins: string[];
  missingPlugins: string[];
  extraPlugins: string[];
  fixedMissing: string[];
  fixedExtras: string[];
  diskSpace: {
    freeBytes: number;
    freeGB: number;
    status: "ok" | "warn" | "critical";
  };
  schemaAnalysis: null | {
    extensionTypes: string[];
    configLocations: Record<string, string>;
    fileExists: boolean;
  };
  verifyReportRead: boolean;
  osCompatSummary: Record<string, { compatible: boolean; reason?: string }>;
}

// ─── Paths ────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, "../..");
const REPORT_DIR =
  process.env.REPORT_DIR ?? path.join(REPO_ROOT, ".opencode/reports");

const PROJECT_OPENCODE_CONFIG =
  process.env.PROJECT_OPENCODE_CONFIG ??
  path.join(REPO_ROOT, ".opencode/opencode.json");
const PROJECT_TUI_CONFIG =
  process.env.PROJECT_TUI_CONFIG ?? path.join(REPO_ROOT, ".opencode/tui.json");
const GLOBAL_CONFIG_DIR =
  process.env.OPENCODE_CONFIG_DIR ??
  path.join(os.homedir(), ".config/opencode");
const GLOBAL_OPENCODE_CONFIG = path.join(GLOBAL_CONFIG_DIR, "opencode.json");
const GLOBAL_TUI_CONFIG = path.join(GLOBAL_CONFIG_DIR, "tui.json");
const CACHE_DIR =
  process.env.OPENCODE_CACHE_DIR ?? path.join(os.homedir(), ".cache/opencode");
const NORMALIZE_REPORT = path.join(
  REPORT_DIR,
  "opencode-plugin-normalize.json",
);
const OS_COMPAT_REPORT = path.join(REPORT_DIR, "opencode-os-compat.json");
const VERIFY_REPORT_PATH = path.join(REPORT_DIR, "opencode-plugin-verify.json");
const DEBUG_CONFIG_REPORT = path.join(
  REPORT_DIR,
  "opencode-debug-config.runtime.json",
);
const SCHEMA_DESIGN_DOC = path.join(REPO_ROOT, "docs/schema-design.md");
const VERIFY_SCRIPT = path.join(
  REPO_ROOT,
  "scripts/ts/opencode-plugin-verify.ts",
);
const REPAIR_REPORT = path.join(REPORT_DIR, "opencode-plugin-repair.json");
const DISK_SPACE_CRITICAL_GB = 0.5;
const DISK_SPACE_WARN_GB = 1.0;

// ─── System info ─────────────────────────────────────────────────────────────

const OS_PLATFORM = os.platform();
const ARCH = os.arch();
const NODE_VERSION = process.version;

// ─── Logging ──────────────────────────────────────────────────────────────────

function log(msg: string): void {
  console.log(`[opencode-plugin-repair] ${msg}`);
}

function fail(msg: string): never {
  console.error(`[opencode-plugin-repair] ERROR: ${msg}`);
  process.exit(1);
}

function dryLog(parts: string[]): void {
  console.log(`DRY-RUN: ${parts.join(" ")}`);
}

// ─── CLI Args ──────────────────────────────────────────────────────────────────

function parseArgs(): CliArgs {
  const raw = process.argv.slice(2);
  const args: CliArgs = {
    apply: false,
    printLogs: false,
    skipReinstall: false,
    skipVerify: false,
    skipMissingFix: false,
    skipExtraFix: false,
    useCachedRuntime: false,
  };

  for (const arg of raw) {
    switch (arg) {
      case "--apply":
        args.apply = true;
        break;
      case "--print-logs":
        args.printLogs = true;
        break;
      case "--skip-reinstall":
        args.skipReinstall = true;
        break;
      case "--skip-verify":
        args.skipVerify = true;
        break;
      case "--skip-missing-fix":
        args.skipMissingFix = true;
        break;
      case "--skip-extra-fix":
        args.skipExtraFix = true;
        break;
      case "--use-cached-runtime":
        args.useCachedRuntime = true;
        break;
      case "-h":
      case "--help":
        printUsage();
        process.exit(0);
        break;
      default:
        fail(`Unknown option: ${arg}`);
    }
  }

  return args;
}

function printUsage(): void {
  console.log(`Usage: bunx tsx scripts/ts/opencode-plugin-repair.ts [options]

Options:
  --apply                restore plugin runtime state (with dry-run mode, only plan is shown)
  --print-logs           enable verbose logging
  --skip-reinstall       skip full reinstall phase (phase 11)
  --skip-verify          skip verification phase
  --skip-missing-fix     skip fixing missing plugins (phase 9)
  --skip-extra-fix       skip fixing extra plugins (phase 10)
  --use-cached-runtime   use cached runtime config instead of running 'bunx opencode debug config'
  -h, --help             show this help message

Safe by default (dry-run):
  without --apply   prints the repair plan only
  with --apply      backs up changed configs, clears plugin runtime state,
                    fixes missing/extra plugins, reinstalls, and verifies

Config sources (in priority order):
  .opencode/opencode.json              (project)
  .opencode/tui.json                   (project)
  ~/.config/opencode/opencode.json     (global)
  ~/.config/opencode/tui.json          (global)`);
}

// ─── Async File Helpers ───────────────────────────────────────────────────────

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

async function readFile(filePath: string): Promise<null | string> {
  return new Promise((resolve) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        resolve(null);
      } else {
        resolve(data.trim());
      }
    });
  });
}

/**
 * Load and parse a JSON config file.
 * @param filePath - path to the JSON file
 * @param strict   - if true, exit with error on parse failure
 */
async function loadConfig(
  filePath: string,
  strict: boolean,
): Promise<null | Record<string, unknown>> {
  if (!fs.existsSync(filePath)) return null;

  const content = await readFile(filePath);
  if (!content) return null;

  try {
    const parsed = JSON.parse(content) as Record<string, unknown>;
    if (!parsed || Object.keys(parsed).length === 0) return null;
    return parsed;
  } catch (e) {
    if (strict) {
      const msg = e instanceof Error ? e.message : String(e);
      fail(
        `Failed to parse config at ${filePath}: ${msg}\nFix the JSON syntax error before running repair.`,
      );
    }
    return null;
  }
}

async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// ─── Plugin Helpers ───────────────────────────────────────────────────────────

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

function pluginDirName(spec: string): string {
  const key = pluginKey(spec);
  if (key.startsWith("github:")) {
    return key.slice("github:".length).split("/").pop() ?? key;
  }
  return key.split("/").pop() ?? key;
}

function extractPlugins(config: null | Record<string, unknown>): string[] {
  if (!config?.plugin) return [];
  return Array.isArray(config.plugin)
    ? config.plugin.filter((p): p is string => typeof p === "string")
    : [];
}

function dedupePlugins(plugins: string[]): string[] {
  const dedupedReversed: string[] = [];
  const seen = new Set<string>();
  for (let i = plugins.length - 1; i >= 0; i--) {
    const spec = plugins[i];
    const key = pluginKey(spec);
    if (seen.has(key)) continue;
    seen.add(key);
    dedupedReversed.push(spec);
  }
  return dedupedReversed.reverse();
}

// ─── OS Compatibility ─────────────────────────────────────────────────────────

function checkOsCompatibility(plugin: string): OSCompatResult {
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
      if (
        constraints.platforms &&
        !constraints.platforms.includes(OS_PLATFORM)
      ) {
        return {
          compatible: false,
          reason: `Not supported on ${OS_PLATFORM}. ${constraints.reason}`,
        };
      }
      return { compatible: true, reason: constraints.reason };
    }
  }

  if (OS_PLATFORM === "win32") {
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

  if (OS_PLATFORM === "darwin" && ARCH === "arm64") {
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

  return { compatible: true, reason: "" };
}

// ─── Runtime Command ──────────────────────────────────────────────────────────

async function runCommand(
  cmd: string,
  args: string[],
  envOverrides?: Record<string, string>,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, ...envOverrides } as NodeJS.ProcessEnv;
    execFile(
      cmd,
      args,
      { env, maxBuffer: 10 * 1024 * 1024 },
      (err, _stdout, stderr) => {
        if (err) {
          reject(
            new Error(
              `Command failed: ${cmd} ${args.join(" ")}\n${stderr || err.message}`,
            ),
          );
        } else {
          resolve();
        }
      },
    );
  });
}

// ─── Removal Helpers ──────────────────────────────────────────────────────────

async function removeDir(dir: string, apply: boolean): Promise<void> {
  if (apply) {
    if (fs.existsSync(dir)) {
      return new Promise((resolve, reject) => {
        fs.rm(dir, { force: true, recursive: true }, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  } else {
    dryLog(["rm", "-rf", dir]);
  }
}

async function removeFile(filePath: string, apply: boolean): Promise<void> {
  if (apply) {
    if (fs.existsSync(filePath)) {
      return new Promise((resolve, reject) => {
        fs.rm(filePath, { force: true }, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  } else {
    dryLog(["rm", "-f", filePath]);
  }
}

// ─── Disk Space Check ─────────────────────────────────────────────────────────

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

      if (OS_PLATFORM === "win32") {
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
            if (OS_PLATFORM === "win32") {
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
    } catch (err) {
      clearTimeout(timeout);
      const errMsg = err instanceof Error ? err.message : String(err);
      log(`  ⚠  Disk space check error (using safe default): ${errMsg}`);
      resolve({ freeBytes: 0, freeGB: 0, status: "ok" });
    }
  });
}

// ─── Runtime Config Loading ───────────────────────────────────────────────────

function extractJsonFromRaw(raw: string): object {
  const start = raw.indexOf("{");
  if (start === -1) {
    throw new Error("Could not locate JSON payload in raw output");
  }
  return JSON.parse(raw.slice(start));
}

async function loadRuntimeConfig(
  args: CliArgs,
): Promise<null | Record<string, unknown>> {
  log("[3/11] Loading runtime config...");

  if (args.useCachedRuntime) {
    log("  Using cached runtime config from --use-cached-runtime flag");
    if (fs.existsSync(DEBUG_CONFIG_REPORT)) {
      try {
        const content = await readFile(DEBUG_CONFIG_REPORT);
        if (content) {
          const parsed = JSON.parse(content) as Record<string, unknown>;
          log(
            `  ✓ Loaded cached runtime config (${Object.keys(parsed).length} keys)`,
          );
          return parsed;
        }
      } catch (e) {
        log(`  ⚠  Failed to parse cached runtime config: ${e}`);
      }
    }
    log("  ⚠  Cached runtime config not found, will skip runtime analysis");
    return null;
  }

  try {
    const rawOutput = await runCommand(
      "bunx",
      ["opencode", "debug", "config"],
      { NODE_OPTIONS: "--max-old-space-size=4096" },
    );
    log(
      `  ✓ Retrieved runtime config (${(rawOutput as unknown as string).length} bytes)`,
    );
    const runtimeConfig = extractJsonFromRaw(rawOutput as unknown as string);
    return runtimeConfig as Record<string, unknown>;
  } catch (e) {
    log(`  ⚠  Failed to load runtime config: ${e}`);
    return null;
  }
}

// ─── Schema & Report Analysis ─────────────────────────────────────────────────

async function analyzeSchemaDesign(templatePath: string): Promise<null | {
  extensionTypes: string[];
  configLocations: Record<string, string>;
  fileExists: boolean;
}> {
  try {
    const content = await readFile(templatePath);
    if (!content) return null;

    const extensionTypes: string[] = [];
    const typeMatches = content.match(/### \d+\.\d+ `(\w+)`/g);
    if (typeMatches) {
      for (const match of typeMatches) {
        const typeMatch = match.match(/`(\w+)`/);
        if (typeMatch && typeMatch[1]) {
          extensionTypes.push(typeMatch[1]);
        }
      }
      log(`  ✓ Schema parsed: found ${extensionTypes.length} extension types`);
    }

    const configLocs: Record<string, string> = {};
    const configSection = content.match(
      /### 3\.\d+ [^\n]+\n\n([\s\S]*?)(?=###|$)/,
    );
    if (configSection) {
      const matches = [...configSection[1].matchAll(/`([^`]+)`/g)];
      for (let i = 0; i < matches.length - 1; i += 2) {
        const key = matches[i][1];
        const value = matches[i + 1][1];
        configLocs[key] = value;
      }
      if (Object.keys(configLocs).length > 0) {
        log(`  ✓ Found ${Object.keys(configLocs).length} config locations`);
      }
    }

    return {
      configLocations: configLocs,
      extensionTypes,
      fileExists: true,
    };
  } catch {
    return null;
  }
}

async function readVerifyReport(): Promise<null | Record<string, unknown>> {
  if (fs.existsSync(VERIFY_REPORT_PATH)) {
    try {
      const content = await readFile(VERIFY_REPORT_PATH);
      if (content) {
        return JSON.parse(content) as Record<string, unknown>;
      }
    } catch (e) {
      log(`  ⚠  Failed to parse verify report: ${e}`);
    }
  }
  return null;
}

async function readOsCompatReport(): Promise<null | Record<string, unknown>> {
  if (fs.existsSync(OS_COMPAT_REPORT)) {
    try {
      const content = await readFile(OS_COMPAT_REPORT);
      if (content) {
        return JSON.parse(content) as Record<string, unknown>;
      }
    } catch (e) {
      log(`  ⚠  Failed to parse OS compat report: ${e}`);
    }
  }
  return null;
}

// ─── Detect Missing & Extra Plugins ───────────────────────────────────────────

async function detectMissingAndExtras(
  expectedPlugins: string[],
  runtimePlugins: null | string[],
): Promise<{ missing: string[]; extras: string[] }> {
  log("[6/11] Detecting missing and extra plugins...");

  if (!runtimePlugins) {
    log("  ⚠  No runtime config available; skipping runtime comparison");
    return { missing: [], extras: [] };
  }

  const expected = new Set(expectedPlugins.map((p) => pluginKey(p)));
  const runtime = new Set(runtimePlugins.map((p) => pluginKey(p)));

  const missing: string[] = [];
  for (const plugin of expectedPlugins) {
    const key = pluginKey(plugin);
    if (!runtime.has(key)) {
      missing.push(plugin);
    }
  }

  const extras: string[] = [];
  for (const plugin of runtimePlugins) {
    const key = pluginKey(plugin);
    if (!expected.has(key)) {
      extras.push(plugin);
    }
  }

  if (missing.length > 0) log(`  Missing from runtime: ${missing.join(", ")}`);
  if (extras.length > 0) log(`  Extra in runtime: ${extras.join(", ")}`);

  return { missing, extras };
}

// ─── Fix Missing Plugins ──────────────────────────────────────────────────────

async function fixMissingPlugins(
  missing: string[],
  diskSpace: { status: string },
  args: CliArgs,
): Promise<string[]> {
  if (args.skipMissingFix) {
    log("[9/11] Skipping missing plugin fix (--skip-missing-fix provided)");
    return [];
  }

  log("[9/11] Fixing missing plugins...");

  if (diskSpace.status === "critical" && args.apply) {
    log("  ⚠  Skipping install due to critical disk space");
    return [];
  }

  const fixedMissing: string[] = [];
  const installArgs: string[] = ["--force"];
  if (args.printLogs) installArgs.push("--print-logs");

  // Filter compatible plugins
  const compatiblePlugins: string[] = [];
  for (const plugin of missing) {
    const compat = checkOsCompatibility(plugin);
    if (!compat.compatible) {
      log(`  SKIPPING incompatible plugin: ${plugin} (${compat.reason})`);
      continue;
    }
    compatiblePlugins.push(plugin);
  }

  // Process in parallel batches (max 3 concurrent installs)
  const BATCH_SIZE = 3;
  for (let i = 0; i < compatiblePlugins.length; i += BATCH_SIZE) {
    const batch = compatiblePlugins.slice(i, i + BATCH_SIZE);
    const promises = batch.map(async (plugin) => {
      log(`  Installing missing plugin: ${plugin}`);
      if (args.apply) {
        try {
          await runCommand("bunx", [
            "opencode",
            "plugin",
            plugin,
            ...installArgs,
          ]);
          fixedMissing.push(plugin);
          log(`    ✓ Installed ${plugin}`);
        } catch (e) {
          log(`    ⚠  Failed to install ${plugin}: ${e}`);
        }
      } else {
        dryLog(["bunx", "opencode", "plugin", plugin, ...installArgs]);
        fixedMissing.push(plugin);
      }
    });
    await Promise.all(promises);
  }

  log(
    `  ✓ Missing plugin fix complete: ${fixedMissing.length}/${missing.length} installed`,
  );
  return fixedMissing;
}

// ─── Fix Extra Plugins ────────────────────────────────────────────────────────

async function fixExtraPlugins(
  extras: string[],
  configs: ConfigSet,
  args: CliArgs,
): Promise<string[]> {
  if (args.skipExtraFix) {
    log("[10/11] Skipping extra plugin fix (--skip-extra-fix provided)");
    return [];
  }

  log("[10/11] Fixing extra plugins...");

  const fixedExtras: string[] = [];

  for (const plugin of extras) {
    const dirName = pluginDirName(plugin);
    const pluginDir = path.join(GLOBAL_CONFIG_DIR, dirName);
    const cachePluginDir = path.join(CACHE_DIR, dirName);

    // Check if plugin is in ANY config source
    const inAnyConfig =
      extractPlugins(configs.projectOpencode).some(
        (p) => pluginKey(p) === pluginKey(plugin),
      ) ||
      extractPlugins(configs.projectTui).some(
        (p) => pluginKey(p) === pluginKey(plugin),
      ) ||
      extractPlugins(configs.globalOpencode).some(
        (p) => pluginKey(p) === pluginKey(plugin),
      ) ||
      extractPlugins(configs.globalTui).some(
        (p) => pluginKey(p) === pluginKey(plugin),
      );

    if (inAnyConfig) {
      log(`  ℹ  Extra plugin found in config, skipping: ${plugin}`);
      continue;
    }

    log(`  Removing extra plugin from disk: ${plugin}`);
    await removeDir(pluginDir, args.apply);
    await removeDir(cachePluginDir, args.apply);
    fixedExtras.push(plugin);
  }

  log(
    `  ✓ Extra plugin fix complete: ${fixedExtras.length}/${extras.length} removed`,
  );
  return fixedExtras;
}

// ─── Config Loading ───────────────────────────────────────────────────────────

async function loadAllConfigs(): Promise<ConfigSet> {
  log("Loading configs from multiple sources:");
  const configFiles = [
    PROJECT_OPENCODE_CONFIG,
    PROJECT_TUI_CONFIG,
    GLOBAL_OPENCODE_CONFIG,
    GLOBAL_TUI_CONFIG,
  ];
  for (const cfg of configFiles) {
    log(`  - ${cfg} (exists: ${fs.existsSync(cfg) ? "yes" : "no"})`);
  }

  const [projectOpencode, projectTui, globalOpencode, globalTui] =
    await Promise.all([
      loadConfig(PROJECT_OPENCODE_CONFIG, true),
      loadConfig(PROJECT_TUI_CONFIG, false),
      loadConfig(GLOBAL_OPENCODE_CONFIG, false),
      loadConfig(GLOBAL_TUI_CONFIG, false),
    ]);

  return { globalOpencode, globalTui, projectOpencode, projectTui };
}

// ─── Plugin Normalization ─────────────────────────────────────────────────────

async function normalizeAndBackupConfigs(
  configs: ConfigSet,
  timestamp: string,
  args: CliArgs,
): Promise<{
  finalConfig: Record<string, unknown>;
  configChanged: boolean;
}> {
  log("[5/11] Merging and deduplicating plugin lists...");

  const allPlugins = [
    ...extractPlugins(configs.projectOpencode),
    ...extractPlugins(configs.projectTui),
    ...extractPlugins(configs.globalOpencode),
    ...extractPlugins(configs.globalTui),
  ];

  const dedupedPlugins = dedupePlugins(allPlugins);
  const removedPlugins = allPlugins.filter((spec, index) => {
    const key = pluginKey(spec);
    return (
      dedupedPlugins.findIndex((item) => pluginKey(item) === key) !== index
    );
  });

  // Build the updated project config
  let finalConfig: Record<string, unknown> = {};
  if (configs.projectOpencode?.plugin) {
    finalConfig = { ...configs.projectOpencode, plugin: dedupedPlugins };
  } else if (!configs.projectOpencode && configs.globalOpencode) {
    finalConfig = { ...configs.globalOpencode, plugin: dedupedPlugins };
  } else {
    finalConfig = { plugin: dedupedPlugins };
  }

  // Write normalize report
  const normalizeReport: NormalizeReport = {
    changed:
      JSON.stringify(configs.projectOpencode) !== JSON.stringify(finalConfig),
    configSources: {
      globalOpencode: GLOBAL_OPENCODE_CONFIG,
      globalTui: GLOBAL_TUI_CONFIG,
      projectOpencode: PROJECT_OPENCODE_CONFIG,
      projectTui: PROJECT_TUI_CONFIG,
    },
    dedupedCount: dedupedPlugins.length,
    originalCount: allPlugins.length,
    removedPlugins,
    timestamp,
  };
  await writeJsonFile(NORMALIZE_REPORT, normalizeReport);
  log(`✓ Normalization report: ${NORMALIZE_REPORT}`);
  console.log(JSON.stringify(normalizeReport, null, 2));

  // Backup and update project config if changed
  const originalJson = await readFile(PROJECT_OPENCODE_CONFIG);
  const nextJson = `${JSON.stringify(finalConfig, null, 2)}\n`;
  const configChanged = originalJson !== nextJson.trimEnd();

  if (configChanged) {
    if (args.apply) {
      const backupPath = `${PROJECT_OPENCODE_CONFIG}.bak.${timestamp}`;
      if (originalJson !== null) {
        return new Promise((resolve, reject) => {
          fs.copyFile(PROJECT_OPENCODE_CONFIG, backupPath, (err) => {
            if (err) {
              reject(err);
            } else {
              fs.writeFile(PROJECT_OPENCODE_CONFIG, nextJson, (err2) => {
                if (err2) reject(err2);
                else {
                  log(`✓ Updated ${PROJECT_OPENCODE_CONFIG}`);
                  log(`✓ Created backup ${backupPath}`);
                  resolve({ configChanged: true, finalConfig });
                }
              });
            }
          });
        });
      }
    } else {
      log("Project config will be rewritten with a deduplicated plugin list");
    }
  } else {
    log("✓ Project plugin list is already deduplicated");
  }

  return { configChanged, finalConfig };
}

// ─── Cleanup Targets ──────────────────────────────────────────────────────────

async function collectCleanupTargets(
  dedupedPlugins: string[],
  dedupedGlobalPlugins: string[],
): Promise<string[]> {
  log("[3/7] Collecting runtime cleanup targets...");

  const targets: string[] = [
    path.join(GLOBAL_CONFIG_DIR, "node_modules"),
    path.join(GLOBAL_CONFIG_DIR, "package-lock.json"),
    path.join(CACHE_DIR, "packages"),
    path.join(CACHE_DIR, "opencode-quota"),
  ];

  for (const plugin of dedupedPlugins) {
    const compat = checkOsCompatibility(plugin);
    if (!compat.compatible) continue;
    const dirName = pluginDirName(plugin);
    targets.push(path.join(GLOBAL_CONFIG_DIR, dirName));
    targets.push(path.join(CACHE_DIR, dirName));
  }

  for (const plugin of dedupedGlobalPlugins) {
    const dirName = pluginDirName(plugin);
    targets.push(path.join(GLOBAL_CONFIG_DIR, dirName));
    targets.push(path.join(CACHE_DIR, dirName));
  }

  for (const target of targets) {
    console.log(` - ${target}`);
  }

  return targets;
}

// ─── Execute Cleanup ──────────────────────────────────────────────────────────

async function executeCleanup(
  targets: string[],
  apply: boolean,
): Promise<void> {
  log("[4/7] Executing cleanup...");

  // Base cleanup targets
  await removeDir(path.join(GLOBAL_CONFIG_DIR, "node_modules"), apply);
  await removeFile(path.join(GLOBAL_CONFIG_DIR, "package-lock.json"), apply);
  await removeDir(path.join(CACHE_DIR, "packages"), apply);
  await removeDir(path.join(CACHE_DIR, "opencode-quota"), apply);

  // Plugin-specific cleanup
  for (const target of targets.slice(4)) {
    await removeDir(target, apply);
  }

  log(`✓ Cleanup complete (${apply ? "applied" : "dry-run"})`);
}

// ─── Reinstall Plugins ────────────────────────────────────────────────────────

async function reinstallPlugins(
  globalPlugins: string[],
  projectPlugins: string[],
  args: CliArgs,
): Promise<{
  reinstalled: number;
  skipped: string[];
}> {
  log("[5/7] Reinstalling plugins...");

  const installArgs: string[] = ["--force"];
  if (args.printLogs) installArgs.push("--print-logs");

  let reinstalled = 0;
  const skipped: string[] = [];

  // Global plugins first
  for (const plugin of globalPlugins) {
    const compat = checkOsCompatibility(plugin);
    if (!compat.compatible) {
      log(`SKIPPING incompatible plugin: ${plugin}`);
      skipped.push(plugin);
      continue;
    }
    log(`Reinstalling global plugin: ${plugin}`);
    if (args.apply) {
      try {
        await runCommand("bunx", [
          "opencode",
          "plugin",

          plugin,

          ...installArgs,
        ]);
        reinstalled++;
      } catch (e) {
        log(`Warning: Failed to reinstall ${plugin}: ${e}`);
      }
    } else {
      dryLog(["bunx", "opencode", "plugin", plugin, ...installArgs]);
      reinstalled++;
    }
  }

  // Project plugins
  for (const plugin of projectPlugins) {
    const compat = checkOsCompatibility(plugin);
    if (!compat.compatible) {
      log(`SKIPPING incompatible plugin: ${plugin}`);
      skipped.push(plugin);
      continue;
    }
    log(`Reinstalling project plugin: ${plugin}`);
    if (args.apply) {
      try {
        await runCommand("bunx", [
          "opencode",
          "plugin",
          plugin,
          ...installArgs,
        ]);
        reinstalled++;
      } catch (e) {
        log(`Warning: Failed to reinstall ${plugin}: ${e}`);
      }
    } else {
      dryLog(["bunx", "opencode", "plugin", plugin, ...installArgs]);
      reinstalled++;
    }
  }

  log(
    `✓ Reinstall complete: ${reinstalled} plugins ${args.apply ? "reinstalled" : "scheduled"}`,
  );
  return { reinstalled, skipped };
}

// ─── Verification ─────────────────────────────────────────────────────────────

async function runVerification(args: CliArgs): Promise<void> {
  if (!args.skipVerify) {
    log("[Post-1/2] Running verification...");
    if (args.apply) {
      try {
        await runCommand("bunx", ["tsx", VERIFY_SCRIPT]);
        log("✓ Verification passed");
      } catch (e) {
        log(`Warning: Verification reported issues: ${e}`);
      }
    } else {
      log(`DRY-RUN: verification would run via ${VERIFY_SCRIPT}`);
    }
  } else {
    log("[Post-1/2] Skipping verification (--skip-verify provided)");
  }
}

// ─── Write Final Report ────────────────────────────────────────────────────

async function writeRepairReport(report: RepairReport): Promise<void> {
  log("[Post-2/2] Writing repair report...");
  await writeJsonFile(REPAIR_REPORT, report);
  log(`✓ Repair report: ${REPAIR_REPORT}`);
  console.log(JSON.stringify(report, null, 2));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs();

  log(`========================================`);
  log(`OpenCode Plugin Repair Starting (11-Phase)`);
  log(`========================================`);
  log(`System: OS=${OS_PLATFORM}, Arch=${ARCH}, Node=${NODE_VERSION}`);

  // Ensure at least one config exists
  const configFiles = [
    PROJECT_OPENCODE_CONFIG,
    PROJECT_TUI_CONFIG,
    GLOBAL_OPENCODE_CONFIG,
    GLOBAL_TUI_CONFIG,
  ];
  const anyConfigExists = configFiles.some((f) => fs.existsSync(f));
  if (!anyConfigExists) {
    fail("No project or global config found");
  }

  await ensureDir(REPORT_DIR);

  const timestamp = new Date()
    .toISOString()
    .replaceAll(/[-:.Z]/g, "")
    .slice(0, 14);

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 1: Load 4-source configs
  // ─────────────────────────────────────────────────────────────────────────
  log("[1/11] Loading configs from multiple sources...");
  const configs = await loadAllConfigs();

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 2: Check disk space
  // ─────────────────────────────────────────────────────────────────────────
  log("[2/11] Checking disk space...");
  const diskSpace = await checkDiskSpace();
  log(
    `  ✓ Disk space: ${diskSpace.freeGB} GB free (status: ${diskSpace.status})`,
  );
  if (diskSpace.status === "critical" && args.apply) {
    fail(
      `CRITICAL: Only ${diskSpace.freeGB} GB free. Aborting to prevent data issues.`,
    );
  }
  if (diskSpace.status === "warn") {
    log(`  ⚠  WARNING: Low disk space - ${diskSpace.freeGB} GB free`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 3: Load runtime config
  // ─────────────────────────────────────────────────────────────────────────
  const runtimeConfig = await loadRuntimeConfig(args);
  const runtimePlugins =
    (runtimeConfig?.plugin as string[] | undefined) ?? null;

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 4: Read schema, verify report, OS compat report
  // ─────────────────────────────────────────────────────────────────────────
  log("[4/11] Analyzing schema and reports...");
  const schemaAnalysis = await analyzeSchemaDesign(SCHEMA_DESIGN_DOC);
  const verifyReport = await readVerifyReport();
  const osCompatReport = await readOsCompatReport();
  const verifyReportRead = verifyReport !== null;
  if (verifyReportRead) log("  ✓ Loaded verify report");
  if (schemaAnalysis) log("  ✓ Loaded schema design");
  if (osCompatReport) log("  ✓ Loaded OS compat report");

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 5: Normalize & dedup
  // ─────────────────────────────────────────────────────────────────────────
  const { configChanged, finalConfig } = await normalizeAndBackupConfigs(
    configs,
    timestamp,
    args,
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 6: Detect missing & extras
  // ─────────────────────────────────────────────────────────────────────────
  const projectPlugins = extractPlugins(finalConfig);
  const globalPlugins = extractPlugins(configs.globalOpencode);
  const dedupedPlugins = dedupePlugins(projectPlugins);
  const dedupedGlobalPlugins = dedupePlugins(globalPlugins);
  const allExpectedPlugins = [...dedupedPlugins, ...dedupedGlobalPlugins];

  const { missing, extras } = await detectMissingAndExtras(
    allExpectedPlugins,
    runtimePlugins,
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 7: Collect cleanup targets
  // ─────────────────────────────────────────────────────────────────────────
  log("[7/11] Collecting cleanup targets...");
  const cleanupTargets = await collectCleanupTargets(
    dedupedPlugins,
    dedupedGlobalPlugins,
  );

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 8: Execute cleanup (if not skipped)
  // ─────────────────────────────────────────────────────────────────────────
  if (!args.skipReinstall) {
    log("[8/11] Executing cleanup...");
    await executeCleanup(cleanupTargets, args.apply);
  } else {
    log("[8/11] Skipping cleanup (--skip-reinstall provided)");
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 9: Fix missing plugins (if not skipped)
  // ─────────────────────────────────────────────────────────────────────────
  const fixedMissing = await fixMissingPlugins(missing, diskSpace, args);

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 10: Fix extra plugins (if not skipped)
  // ─────────────────────────────────────────────────────────────────────────
  const fixedExtras = await fixExtraPlugins(extras, configs, args);

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 11: Full reinstall (if not skipped)
  // ─────────────────────────────────────────────────────────────────────────
  const { reinstalled, skipped } = !args.skipReinstall
    ? await reinstallPlugins(dedupedGlobalPlugins, dedupedPlugins, args)
    : { reinstalled: 0, skipped: [] };

  // ─────────────────────────────────────────────────────────────────────────
  // Post-Phase 1: Verification
  // ─────────────────────────────────────────────────────────────────────────
  await runVerification(args);

  // ─────────────────────────────────────────────────────────────────────────
  // Post-Phase 2: Build OS compat summary
  // ─────────────────────────────────────────────────────────────────────────
  const osCompatSummary: Record<
    string,
    { compatible: boolean; reason?: string }
  > = {};
  for (const plugin of allExpectedPlugins) {
    osCompatSummary[plugin] = checkOsCompatibility(plugin);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Write final report
  // ─────────────────────────────────────────────────────────────────────────
  const repairReport: RepairReport = {
    cleanupTargets,
    configChanged,
    diskSpace,
    extraPlugins: extras,
    fixedExtras,
    fixedMissing,
    missingPlugins: missing,
    osCompatSummary,
    reinstallSummary: {
      globalPlugins: dedupedGlobalPlugins.length,
      projectPlugins: dedupedPlugins.length,
      total: dedupedGlobalPlugins.length + dedupedPlugins.length,
    },
    schemaAnalysis,
    skippedPlugins: skipped,
    timestamp: new Date().toISOString(),
    verifyReportRead,
  };

  await writeRepairReport(repairReport);

  if (!args.apply) {
    log("");
    log("DRY-RUN complete. Run with --apply to execute the above changes.");
  }

  log(`========================================`);
  log(`OpenCode Plugin Repair Complete`);
  log(`========================================`);
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
