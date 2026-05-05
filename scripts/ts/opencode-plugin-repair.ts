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
import { execFile } from "child_process";
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
}

interface ConfigSet {
  projectOpencode: Record<string, unknown> | null;
  projectTui: Record<string, unknown> | null;
  globalOpencode: Record<string, unknown> | null;
  globalTui: Record<string, unknown> | null;
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
const VERIFY_SCRIPT = path.join(
  REPO_ROOT,
  "scripts/ts/opencode-plugin-verify.ts",
);
const REPAIR_REPORT = path.join(REPORT_DIR, "opencode-plugin-repair.json");

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
  console.log(`Usage: bunx tsx scripts/ts/opencode-plugin-repair.ts [--apply] [--print-logs] [--skip-reinstall] [--skip-verify]

Safe by default (dry-run):
  without --apply   prints the repair plan only
  with --apply      backs up changed configs, clears plugin runtime state,
                    reinstalls plugins, and verifies the result

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

async function readFile(filePath: string): Promise<string | null> {
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
): Promise<Record<string, unknown> | null> {
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

function extractPlugins(config: Record<string, unknown> | null): string[] {
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
    return {
      compatible: true,
      reason: "ARM64 Mac detected - some npm packages may need Rosetta2",
    };
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
        fs.rm(dir, { recursive: true, force: true }, (err) => {
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

  return { projectOpencode, projectTui, globalOpencode, globalTui };
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
  log("[2/7] Merging and deduplicating plugin lists...");

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
    configSources: {
      projectOpencode: PROJECT_OPENCODE_CONFIG,
      projectTui: PROJECT_TUI_CONFIG,
      globalOpencode: GLOBAL_OPENCODE_CONFIG,
      globalTui: GLOBAL_TUI_CONFIG,
    },
    originalCount: allPlugins.length,
    dedupedCount: dedupedPlugins.length,
    removedPlugins,
    changed:
      JSON.stringify(configs.projectOpencode) !== JSON.stringify(finalConfig),
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
                  resolve({ finalConfig, configChanged: true });
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

  return { finalConfig, configChanged };
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
          "add",
          plugin,
          "--global",
          ...installArgs,
        ]);
        reinstalled++;
      } catch (e) {
        log(`Warning: Failed to reinstall ${plugin}: ${e}`);
      }
    } else {
      dryLog([
        "bunx",
        "opencode",
        "plugin",
        "add",
        plugin,
        "--global",
        ...installArgs,
      ]);
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
          "add",
          plugin,
          ...installArgs,
        ]);
        reinstalled++;
      } catch (e) {
        log(`Warning: Failed to reinstall ${plugin}: ${e}`);
      }
    } else {
      dryLog(["bunx", "opencode", "plugin", "add", plugin, ...installArgs]);
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
    log("[6/7] Running verification...");
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
    log("[6/7] Skipping verification (--skip-verify provided)");
  }
}

// ─── Write Final Report ────────────────────────────────────────────────────────

async function writeRepairReport(report: RepairReport): Promise<void> {
  log("[7/7] Writing repair report...");
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
    .replace(/[-:.Z]/g, "")
    .slice(0, 14);

  log("[1/7] Loading configs from multiple sources...");
  const configs = await loadAllConfigs();

  const { finalConfig, configChanged } = await normalizeAndBackupConfigs(
    configs,
    timestamp,
    args,
  );

  // Extract deduplicated plugins
  const projectPlugins = extractPlugins(finalConfig);
  const globalPlugins = extractPlugins(configs.globalOpencode);
  const dedupedPlugins = dedupePlugins(projectPlugins);
  const dedupedGlobalPlugins = dedupePlugins(globalPlugins);

  const cleanupTargets = await collectCleanupTargets(
    dedupedPlugins,
    dedupedGlobalPlugins,
  );

  if (!args.skipReinstall) {
    await executeCleanup(cleanupTargets, args.apply);
  } else {
    log("[4/7] Skipping cleanup (--skip-reinstall provided)");
  }

  const { reinstalled, skipped } = !args.skipReinstall
    ? await reinstallPlugins(dedupedGlobalPlugins, dedupedPlugins, args)
    : { reinstalled: 0, skipped: [] };

  await runVerification(args);

  // Write final report
  const repairReport: RepairReport = {
    timestamp: new Date().toISOString(),
    configChanged,
    cleanupTargets,
    reinstallSummary: {
      globalPlugins: dedupedGlobalPlugins.length,
      projectPlugins: dedupedPlugins.length,
      total: dedupedGlobalPlugins.length + dedupedPlugins.length,
    },
    skippedPlugins: skipped,
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
