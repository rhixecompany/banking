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
import fs from "fs";
import os from "os";
import path from "path";
import { fileURLToPath } from "url";

import {
  ARCH,
  KNOWN_SYSTEM_DIR_NAMES,
  NODE_VERSION,
  OS_PLATFORM,
  analyzeDiskUsage,
  checkDiskSpace,
  checkOsCompatibility,
  dedupePlugins,
  ensureDir,
  extractJsonFromRaw,
  extractPlugins,
  getDirSizeBytes,
  pluginDirName,
  pluginKey,
  readFile,
  runCommand,
  writeJsonFile,
  type DiskAnalysis,
  type DiskSpaceResult,
  type OSCompatResult,
} from "./utils/plugin-shared.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Types ────────────────────────────────────────────────────────────────────

interface CliArgs {
  apply: boolean;
  diskAnalyze: boolean;
  diskCleanup: boolean;
  diskCleanupAll: boolean;
  diskCleanupOrphans: boolean;
  printLogs: boolean;
  skipExtraFix: boolean;
  skipMissingFix: boolean;
  skipReinstall: boolean;
  skipVerify: boolean;
  useCachedRuntime: boolean;
}

interface ConfigSet {
  globalOpencode: null | Record<string, unknown>;
  globalTui: null | Record<string, unknown>;
  projectOpencode: null | Record<string, unknown>;
  projectTui: null | Record<string, unknown>;
}

interface NormalizeReport {
  changed: boolean;
  configSources: {
    globalOpencode: string;
    globalTui: string;
    projectOpencode: string;
    projectTui: string;
  };
  dedupedCount: number;
  originalCount: number;
  removedPlugins: string[];
  timestamp: string;
}

interface DiskCleanupTarget {
  estimatedBytes: number;
  path: string;
  reason: string;
}

interface RepairReport {
  cleanupTargets: string[];
  configChanged: boolean;
  diskCleanup?: {
    removed: DiskCleanupTarget[];
    skipped: DiskCleanupTarget[];
    targets: DiskCleanupTarget[];
    totalFreedBytes: number;
    totalFreedGB: number;
  };
  diskSpace: {
    analysis: DiskAnalysis;
  } & DiskSpaceResult;
  extraPlugins: string[];
  fixedExtras: string[];
  fixedMissing: string[];
  missingPlugins: string[];
  osCompatSummary: Record<string, OSCompatResult>;
  reinstallSummary: {
    globalPlugins: number;
    projectPlugins: number;
    total: number;
  };
  schemaAnalysis: {
    configLocations: Record<string, string>;
    extensionTypes: string[];
    fileExists: boolean;
  } | null;
  skippedPlugins: string[];
  timestamp: string;
  verifyReportRead: boolean;
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
    diskAnalyze: false,
    diskCleanup: false,
    diskCleanupAll: false,
    diskCleanupOrphans: false,
    printLogs: false,
    skipExtraFix: false,
    skipMissingFix: false,
    skipReinstall: false,
    skipVerify: false,
    useCachedRuntime: false,
  };

  for (const arg of raw) {
    switch (arg) {
      case "--apply":
        args.apply = true;
        break;
      case "--disk-analyze":
        args.diskAnalyze = true;
        break;
      case "--disk-cleanup":
        args.diskCleanup = true;
        break;
      case "--disk-cleanup-all":
        args.diskCleanupAll = true;
        args.diskCleanup = true;
        args.diskCleanupOrphans = true;
        break;
      case "--disk-cleanup-orphans":
        args.diskCleanupOrphans = true;
        break;
      case "--print-logs":
        args.printLogs = true;
        break;
      case "--skip-extra-fix":
        args.skipExtraFix = true;
        break;
      case "--skip-missing-fix":
        args.skipMissingFix = true;
        break;
      case "--skip-reinstall":
        args.skipReinstall = true;
        break;
      case "--skip-verify":
        args.skipVerify = true;
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
  --apply                  restore plugin runtime state (with dry-run mode, only plan is shown)
  --disk-analyze           analyze disk usage and exit
  --disk-cleanup           opt-in: clean stale backups, old reports, temp/log files
  --disk-cleanup-orphans   opt-in: remove orphaned plugin dirs in ~/.config/opencode
  --disk-cleanup-all       shorthand for --disk-cleanup + --disk-cleanup-orphans
  --print-logs             enable verbose logging
  --skip-reinstall         skip full reinstall phase (phase 11)
  --skip-verify            skip verification phase
  --skip-missing-fix       skip fixing missing plugins (phase 9)
  --skip-extra-fix         skip fixing extra plugins (phase 10)
  --use-cached-runtime     use cached runtime config instead of running 'bunx opencode debug config'
  -h, --help               show this help message

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

// ─── Removal Helpers ──────────────────────────────────────────────────────────

async function removeDir(dir: string, apply: boolean): Promise<void> {
  if (apply) {
    if (fs.existsSync(dir)) {
      return new Promise((resolve, reject) => {
        fs.rm(
          dir,
          { force: true, recursive: true },
          (err: NodeJS.ErrnoException | null) => {
            if (err) reject(err);
            else resolve();
          },
        );
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
        fs.rm(
          filePath,
          { force: true },
          (err: NodeJS.ErrnoException | null) => {
            if (err) reject(err);
            else resolve();
          },
        );
      });
    }
  } else {
    dryLog(["rm", "-f", filePath]);
  }
}

// ─── Runtime Config Loading ───────────────────────────────────────────────────

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
    log(`  ✓ Retrieved runtime config (${rawOutput.length} bytes)`);
    const runtimeConfig = extractJsonFromRaw(rawOutput);
    return runtimeConfig as Record<string, unknown>;
  } catch (e) {
    log(`  ⚠  Failed to load runtime config: ${e}`);
    return null;
  }
}

// ─── Schema & Report Analysis ─────────────────────────────────────────────────

async function analyzeSchemaDesign(templatePath: string): Promise<{
  configLocations: Record<string, string>;
  extensionTypes: string[];
  fileExists: boolean;
} | null> {
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
): Promise<{ extras: string[]; missing: string[] }> {
  log("[6/11] Detecting missing and extra plugins...");

  if (!runtimePlugins) {
    log("  ⚠  No runtime config available; skipping runtime comparison");
    return { extras: [], missing: [] };
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

  return { extras, missing };
}

// ─── Fix Missing Plugins ──────────────────────────────────────────────────────

async function installPlugin(plugin: string, args: CliArgs): Promise<boolean> {
  const installArgs: string[] = ["--force"];
  if (args.printLogs) installArgs.push("--print-logs");

  if (args.apply) {
    try {
      await runCommand("bunx", ["opencode", "plugin", plugin, ...installArgs]);
      log(`    ✓ Installed ${plugin}`);
      return true;
    } catch (e) {
      log(`    ⚠  Failed to install ${plugin}: ${e}`);
      return false;
    }
  } else {
    dryLog(["bunx", "opencode", "plugin", plugin, ...installArgs]);
    return true;
  }
}

async function fixMissingPlugins(
  missing: string[],
  diskSpace: DiskSpaceResult,
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
      const installed = await installPlugin(plugin, args);
      if (installed) {
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
  configChanged: boolean;
  finalConfig: Record<string, unknown>;
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
          fs.copyFile(
            PROJECT_OPENCODE_CONFIG,
            backupPath,
            (err: NodeJS.ErrnoException | null) => {
              if (err) {
                reject(err);
              } else {
                fs.writeFile(
                  PROJECT_OPENCODE_CONFIG,
                  nextJson,
                  (err2: NodeJS.ErrnoException | null) => {
                    if (err2) reject(err2);
                    else {
                      log(`✓ Updated ${PROJECT_OPENCODE_CONFIG}`);
                      log(`✓ Created backup ${backupPath}`);
                      resolve({ configChanged: true, finalConfig });
                    }
                  },
                );
              }
            },
          );
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
  log("[7/11] Collecting runtime cleanup targets...");

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
  log("[8/11] Executing cleanup...");

  // Clean all targets (no fragile slicing)
  for (const target of targets) {
    if (target.endsWith(".json")) {
      // It's a file
      await removeFile(target, apply);
    } else {
      // It's a directory
      await removeDir(target, apply);
    }
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
  log("[11/11] Reinstalling plugins...");

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
    const installed = await installPlugin(plugin, args);
    if (installed) reinstalled++;
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
    const installed = await installPlugin(plugin, args);
    if (installed) reinstalled++;
  }

  log(
    `✓ Reinstall complete: ${reinstalled} plugins ${args.apply ? "reinstalled" : "scheduled"}`,
  );
  return { reinstalled, skipped };
}

// ─── Disk Cleanup (Opt-in) ────────────────────────────────────────────────────

async function collectDiskCleanupTargets(
  diskCleanupOrphans: boolean,
  cleanupTargets: string[],
): Promise<DiskCleanupTarget[]> {
  log("[12/12] Collecting disk cleanup targets...");

  const targets: DiskCleanupTarget[] = [];

  // Stale backups: keep newest 2, mark rest for deletion
  const backupGlob = `${PROJECT_OPENCODE_CONFIG}.bak.*`;
  const backupDir = path.dirname(PROJECT_OPENCODE_CONFIG);
  const backups = fs
    .readdirSync(backupDir)
    .filter((f: string) =>
      f.startsWith(path.basename(PROJECT_OPENCODE_CONFIG) + ".bak."),
    )
    .sort()
    .reverse();

  if (backups.length > 2) {
    for (const backup of backups.slice(2)) {
      const backupPath = path.join(backupDir, backup);
      const stat = fs.statSync(backupPath);
      targets.push({
        estimatedBytes: stat.size,
        path: backupPath,
        reason: "stale backup (keeping newest 2)",
      });
    }
  }

  // Old report JSONs: keep newest 3 per report type
  const reportDir = REPORT_DIR;
  if (fs.existsSync(reportDir)) {
    const files = fs.readdirSync(reportDir);
    const reportTypes = new Set<string>();

    for (const file of files) {
      if (file.endsWith(".json")) {
        // Extract report type (e.g., "opencode-plugin-verify" from "opencode-plugin-verify.json")
        const type = file.replace(".json", "");
        reportTypes.add(type);
      }
    }

    for (const type of reportTypes) {
      const related = files
        .filter((f: string) => f.startsWith(type))
        .map((f: string) => ({
          file: f,
          mtime: fs.statSync(path.join(reportDir, f)).mtime.getTime(),
          path: path.join(reportDir, f),
        }))
        .sort((a, b) => b.mtime - a.mtime);

      if (related.length > 3) {
        for (const old of related.slice(3)) {
          const stat = fs.statSync(old.path);
          targets.push({
            estimatedBytes: stat.size,
            path: old.path,
            reason: "old report JSON (keeping newest 3)",
          });
        }
      }
    }
  }

  // Temp/log files
  const tempFiles = [
    ...fs
      .readdirSync(GLOBAL_CONFIG_DIR)
      .filter((f) => f.endsWith(".tmp") || f.endsWith(".log"))
      .map((f) => path.join(GLOBAL_CONFIG_DIR, f)),
    ...fs
      .readdirSync(CACHE_DIR)
      .filter((f) => f.endsWith(".tmp") || f.endsWith(".log"))
      .map((f) => path.join(CACHE_DIR, f)),
  ];

  for (const file of tempFiles) {
    if (fs.existsSync(file)) {
      const stat = fs.statSync(file);
      targets.push({
        estimatedBytes: stat.size,
        path: file,
        reason: "temp/log file",
      });
    }
  }

  // Orphaned plugin directories
  if (diskCleanupOrphans) {
    const entries = fs.readdirSync(GLOBAL_CONFIG_DIR, {
      withFileTypes: true,
    });
    const expectedDirs = new Set(
      cleanupTargets
        .map((t) => path.basename(t))
        .filter((b) => !b.includes(".")),
    );

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (KNOWN_SYSTEM_DIR_NAMES.has(entry.name)) continue;
      if (expectedDirs.has(entry.name)) continue;

      // It's an orphaned plugin dir
      const orphanPath = path.join(GLOBAL_CONFIG_DIR, entry.name);
      const size = await getDirSizeBytes(orphanPath);
      targets.push({
        estimatedBytes: size,
        path: orphanPath,
        reason: "orphaned plugin directory",
      });
    }
  }

  for (const target of targets) {
    console.log(
      ` - ${target.path} (${(target.estimatedBytes / 1024 / 1024).toFixed(1)} MB, ${target.reason})`,
    );
  }

  return targets;
}

async function executeDiskCleanup(
  targets: DiskCleanupTarget[],
  apply: boolean,
): Promise<{
  removed: DiskCleanupTarget[];
  skipped: DiskCleanupTarget[];
  totalFreedBytes: number;
}> {
  const removed: DiskCleanupTarget[] = [];
  const skipped: DiskCleanupTarget[] = [];
  let totalFreedBytes = 0;

  for (const target of targets) {
    try {
      if (target.path.endsWith(".json")) {
        await removeFile(target.path, apply);
      } else {
        await removeDir(target.path, apply);
      }
      removed.push(target);
      if (apply) totalFreedBytes += target.estimatedBytes;
    } catch (e) {
      log(`  ⚠  Failed to clean ${target.path}: ${e}`);
      skipped.push(target);
    }
  }

  return { removed, skipped, totalFreedBytes };
}

// ─── Verification ─────────────────────────────────────────────────────────────

async function runVerification(args: CliArgs): Promise<void> {
  if (!args.skipVerify) {
    log("[Post-1/3] Running verification...");
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
    log("[Post-1/3] Skipping verification (--skip-verify provided)");
  }
}

// ─── Write Final Report ────────────────────────────────────────────────────

async function writeRepairReport(report: RepairReport): Promise<void> {
  log("[Post-2/3] Writing repair report...");
  await writeJsonFile(REPAIR_REPORT, report);
  log(`✓ Repair report: ${REPAIR_REPORT}`);
  console.log(JSON.stringify(report, null, 2));
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args = parseArgs();

  log(`========================================`);
  log(`OpenCode Plugin Repair Starting`);
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
  // Early exit for --disk-analyze (no repair needed)
  // ─────────────────────────────────────────────────────────────────────────
  if (args.diskAnalyze) {
    log("[ANALYZE] Running disk analysis...");
    const allPlugins = [
      ...extractPlugins(await loadConfig(PROJECT_OPENCODE_CONFIG, false)),
      ...extractPlugins(await loadConfig(GLOBAL_OPENCODE_CONFIG, false)),
    ];
    const cleanupTargets = [
      path.join(GLOBAL_CONFIG_DIR, "node_modules"),
      path.join(CACHE_DIR, "packages"),
    ];

    const analysis = await analyzeDiskUsage({
      cacheDir: CACHE_DIR,
      cleanupTargets,
      globalConfigDir: GLOBAL_CONFIG_DIR,
      pluginSpecs: allPlugins,
      reportDir: REPORT_DIR,
    });
    console.log(analysis.table);
    await writeJsonFile(
      path.join(REPORT_DIR, "opencode-disk-analysis.json"),
      analysis,
    );
    log("✓ Disk analysis complete");
    return;
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 1: Load 4-source configs
  // ─────────────────────────────────────────────────────────────────────────
  log("[1/11] Loading configs from multiple sources...");
  const configs = await loadAllConfigs();

  // ─────────────────────────────────────────────────────────────────────────
  // Phase 2: Check disk space
  // ─────────────────────────────────────────────────────────────────────────
  log("[2/11] Checking disk space...");
  const diskSpaceBase = await checkDiskSpace(REPO_ROOT);
  log(
    `  ✓ Disk space: ${diskSpaceBase.freeGB} GB free (status: ${diskSpaceBase.status})`,
  );
  if (diskSpaceBase.status === "critical" && args.apply) {
    fail(
      `CRITICAL: Only ${diskSpaceBase.freeGB} GB free. Aborting to prevent data issues.`,
    );
  }
  if (diskSpaceBase.status === "warn") {
    log(`  ⚠  WARNING: Low disk space - ${diskSpaceBase.freeGB} GB free`);
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

  const { extras, missing } = await detectMissingAndExtras(
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
  const fixedMissing = await fixMissingPlugins(missing, diskSpaceBase, args);

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
  // Phase 12: Disk Cleanup (Opt-in)
  // ─────────────────────────────────────────────────────────────────────────
  let diskCleanupResult:
    | {
        removed: DiskCleanupTarget[];
        skipped: DiskCleanupTarget[];
        targets: DiskCleanupTarget[];
        totalFreedBytes: number;
      }
    | undefined;

  if (args.diskCleanup || args.diskCleanupOrphans) {
    const diskCleanupTargets = await collectDiskCleanupTargets(
      args.diskCleanupOrphans,
      cleanupTargets,
    );

    const {
      removed,
      skipped: cleanupSkipped,
      totalFreedBytes,
    } = await executeDiskCleanup(diskCleanupTargets, args.apply);

    diskCleanupResult = {
      removed,
      skipped: cleanupSkipped,
      targets: diskCleanupTargets,
      totalFreedBytes,
    };

    log(
      `  ✓ Disk cleanup: ${removed.length} targets ${args.apply ? "removed" : "marked for removal"}, freed ${(totalFreedBytes / 1024 / 1024 / 1024).toFixed(2)} GB`,
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Post-Phase 1: Verification
  // ─────────────────────────────────────────────────────────────────────────
  await runVerification(args);

  // ─────────────────────────────────────────────────────────────────────────
  // Post-Phase 2: Disk Analysis
  // ─────────────────────────────────────────────────────────────────────────
  log("[Post-2/3] Analyzing disk usage...");
  const diskAnalysis = await analyzeDiskUsage({
    cacheDir: CACHE_DIR,
    cleanupTargets,
    globalConfigDir: GLOBAL_CONFIG_DIR,
    pluginSpecs: allExpectedPlugins,
    reportDir: REPORT_DIR,
  });
  console.log(diskAnalysis.table);
  const diskSpaceEnhanced: { analysis: DiskAnalysis } & DiskSpaceResult = {
    ...diskSpaceBase,
    analysis: diskAnalysis,
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Post-Phase 3: Build OS compat summary
  // ─────────────────────────────────────────────────────────────────────────
  const osCompatSummary: Record<string, OSCompatResult> = {};
  for (const plugin of allExpectedPlugins) {
    osCompatSummary[plugin] = checkOsCompatibility(plugin);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Write final report
  // ─────────────────────────────────────────────────────────────────────────
  const repairReport: RepairReport = {
    cleanupTargets,
    configChanged,
    diskCleanup: diskCleanupResult
      ? {
          removed: diskCleanupResult.removed,
          skipped: diskCleanupResult.skipped,
          targets: diskCleanupResult.targets,
          totalFreedBytes: diskCleanupResult.totalFreedBytes,
          totalFreedGB:
            Math.round(
              (diskCleanupResult.totalFreedBytes / (1024 * 1024 * 1024)) * 100,
            ) / 100,
        }
      : undefined,
    diskSpace: diskSpaceEnhanced,
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
