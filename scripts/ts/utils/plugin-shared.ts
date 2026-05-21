#!/usr/bin/env node
/**
 * OpenCode Plugin Shared Utilities
 * Extracted common logic from opencode-plugin-repair.ts and opencode-plugin-verify.ts
 *
 * Provides:
 * - File I/O helpers (async/promise-based)
 * - Plugin parsing and deduplication
 * - OS compatibility checks
 * - Disk space analysis with per-plugin breakdown
 * - Command execution wrapper
 *
 * All functions use fs/promises pattern for consistency with project standards.
 */
import { exec, execFile } from "child_process";
import { promises as fs } from "fs";
import os from "os";
import path from "path";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OSCompatResult {
  compatible: boolean;
  reason: string;
}

export interface DiskSpaceResult {
  freeBytes: number;
  freeGB: number;
  totalBytes: number;
  totalGB: number;
  usedBytes: number;
  usedGB: number;
  status: "critical" | "ok" | "warn";
}

export interface DirSizeEntry {
  path: string;
  bytes: number;
  gb: number;
}

export interface DiskAnalysis {
  volume: DiskSpaceResult;
  dirs: Record<string, DirSizeEntry>;
  plugins: Record<string, DirSizeEntry>;
  cleanupSavingsBytes: number;
  cleanupSavingsGB: number;
  table: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

export const DISK_SPACE_CRITICAL_GB = 0.5;
export const DISK_SPACE_WARN_GB = 1.0;

export const OS_PLATFORM = os.platform();
export const ARCH = os.arch();
export const NODE_VERSION = process.version;

/**
 * Directories in ~/.config/opencode that are system directories, not plugin installs.
 * Used to detect orphaned plugin directories.
 */
export const KNOWN_SYSTEM_DIR_NAMES = new Set([
  "agents",
  "bin",
  "command",
  "commands",
  "dcp.jsonc",
  "examples",
  "logs",
  "mcp",
  "memory",
  "models.json",
  "node_modules",
  "opencode.json",
  "package.json",
  "package-lock.json",
  "plans",
  "plugins",
  "projects",
  "quota-provider-state",
  "reports",
  "resources",
  "rules",
  "skills",
  "snippet",
  "specs",
  "themes",
]);

// ─── File I/O Helpers ─────────────────────────────────────────────────────────

/**
 * Ensure a directory exists, creating it recursively if needed.
 */
export async function ensureDir(dir: string): Promise<void> {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    // Ignore EEXIST errors
    const error = err as NodeJS.ErrnoException;
    if (error.code !== "EEXIST") {
      throw err;
    }
  }
}

/**
 * Read a file as UTF-8 text.
 * Returns null if file doesn't exist or read fails.
 */
export async function readFile(filePath: string): Promise<null | string> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data.trim();
  } catch {
    return null;
  }
}

/**
 * Read and parse a JSON file.
 * Returns null if file doesn't exist or parse fails.
 */
export async function readJsonFile<T>(filePath: string): Promise<null | T> {
  try {
    const content = await readFile(filePath);
    if (!content) return null;
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

/**
 * Write an object as formatted JSON to a file.
 */
export async function writeJsonFile(
  filePath: string,
  data: unknown,
): Promise<void> {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  await fs.writeFile(filePath, content, "utf-8");
}

// ─── Plugin Helpers ───────────────────────────────────────────────────────────

/**
 * Extract the canonical plugin key from a spec string.
 * Handles: scoped packages (@org/name), github: refs, semver specs.
 *
 * Examples:
 *  "my-plugin" → "my-plugin"
 *  "my-plugin@1.0.0" → "my-plugin"
 *  "@org/plugin" → "@org/plugin"
 *  "@org/plugin@1.0.0" → "@org/plugin"
 *  "github:owner/repo" → "github:owner/repo"
 */
export function pluginKey(spec: string): string {
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

/**
 * Extract the directory name for a plugin install.
 * Strips scopes and github: prefixes.
 *
 * Examples:
 *  "my-plugin" → "my-plugin"
 *  "@org/plugin" → "plugin"
 *  "github:owner/repo" → "repo"
 */
export function pluginDirName(spec: string): string {
  const key = pluginKey(spec);
  if (key.startsWith("github:")) {
    return key.slice("github:".length).split("/").pop() ?? key;
  }
  return key.split("/").pop() ?? key;
}

/**
 * Extract the "plugin" array from a config object.
 */
export function extractPlugins(
  config: null | Record<string, unknown>,
): string[] {
  if (!config?.plugin) return [];
  return Array.isArray(config.plugin)
    ? config.plugin.filter((p): p is string => typeof p === "string")
    : [];
}

/**
 * Deduplicate plugins, keeping the most recent (rightmost) occurrence.
 * Preserves order: deduped list has same relative order as input.
 */
export function dedupePlugins(plugins: string[]): string[] {
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

/**
 * Find all duplicate plugin keys in a list.
 */
export function findDuplicates(plugins: string[]): string[] {
  const counts = new Map<string, number>();
  for (const plugin of plugins) {
    const key = pluginKey(plugin);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([key]) => key);
}

// ─── OS & Compatibility ────────────────────────────────────────────────────────

/**
 * Check if a plugin is compatible with the current OS and architecture.
 */
export function checkOsCompatibility(plugin: string): OSCompatResult {
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

// ─── Command Execution ────────────────────────────────────────────────────────

/**
 * Execute a command and capture its stdout.
 * Rejects on command error or non-zero exit.
 */
export async function runCommand(
  cmd: string,
  args: string[],
  envOverrides?: Record<string, string>,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const env = { ...process.env, ...envOverrides } as NodeJS.ProcessEnv;

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

/**
 * Extract JSON from raw text output, finding the first '{' and parsing from there.
 */
export function extractJsonFromRaw(raw: string): object {
  const start = raw.indexOf("{");
  if (start === -1) {
    throw new Error("Could not locate JSON payload in raw output");
  }
  return JSON.parse(raw.slice(start));
}

// ─── Disk Space & Analysis ────────────────────────────────────────────────────

/**
 * Get the size of a directory in bytes by recursively walking it.
 * Returns 0 if directory doesn't exist.
 * Capped at 10s to avoid hanging on large directories.
 */
export async function getDirSizeBytes(dir: string): Promise<number> {
  return Promise.race([
    (async () => {
      try {
        if (!(await isDirExist(dir))) return 0;

        let totalBytes = 0;

        async function walk(dirPath: string): Promise<void> {
          try {
            const entries = await fs.readdir(dirPath, { withFileTypes: true });
            for (const entry of entries) {
              const fullPath = path.join(dirPath, entry.name);
              if (entry.isDirectory()) {
                await walk(fullPath);
              } else {
                try {
                  const stat = await fs.stat(fullPath);
                  totalBytes += stat.size;
                } catch {
                  // Ignore files we can't stat
                }
              }
            }
          } catch {
            // Ignore directories we can't read
          }
        }

        await walk(dir);
        return totalBytes;
      } catch {
        return 0;
      }
    })(),
    new Promise<number>((resolve) => setTimeout(() => resolve(0), 10000)),
  ]);
}

/**
 * Check if a directory exists.
 */
async function isDirExist(dir: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dir);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

/**
 * Check available disk space on the volume containing targetPath.
 * Returns total, used, free, and status.
 */
export async function checkDiskSpace(
  targetPath: string,
): Promise<DiskSpaceResult> {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      resolve({
        freeBytes: 0,
        freeGB: 0,
        status: "ok",
        totalBytes: 0,
        totalGB: 0,
        usedBytes: 0,
        usedGB: 0,
      });
    }, 3000);

    try {
      if (OS_PLATFORM === "win32") {
        // Windows: Disk space check via Get-Volume (fallback to safe default if check fails)
        // This allows repair to proceed even if disk check fails
        const drive = targetPath[0];

        // Use setTimeout to attempt the check with a quick timeout
        const checkTimeout = setTimeout(() => {
          // If PowerShell check times out, assume we have sufficient space
          // This prevents disk space issues from blocking the entire repair
          finalize(0, 0, 2 * 1024 * 1024 * 1024); // Assume 2GB free
        }, 1500);

        exec(
          `powershell -Command "([Math]::Round((Get-Volume -DriveLetter ${drive}).SizeRemaining / 1GB, 1)); ([Math]::Round((Get-Volume -DriveLetter ${drive}).Size / 1GB, 1))"`,
          { timeout: 1000 },
          (error: Error | null, stdout: string) => {
            clearTimeout(checkTimeout);
            clearTimeout(timeout);

            if (error || !stdout) {
              // Fallback: assume we have sufficient space
              finalize(0, 0, 2 * 1024 * 1024 * 1024); // Assume 2GB free
              return;
            }

            try {
              const [freeGBStr, totalGBStr] = stdout.trim().split(/\s+/);
              const freeGB = Number.parseFloat(freeGBStr) || 0;
              const totalGB = Number.parseFloat(totalGBStr) || 0;
              const freeBytes = freeGB * 1024 * 1024 * 1024;
              const totalBytes = totalGB * 1024 * 1024 * 1024;
              const usedBytes = totalBytes - freeBytes;
              finalize(totalBytes, usedBytes, freeBytes);
            } catch {
              // Fallback on parse error
              finalize(0, 0, 2 * 1024 * 1024 * 1024);
            }
          },
        );
      } else {
        // macOS/Linux: use df to get total, used, available
        const command = `df "${targetPath}" | tail -1 | awk '{print $2, $3, $4}'`;
        exec(
          command,
          { timeout: 2500 },
          (error: Error | null, stdout: string) => {
            clearTimeout(timeout);

            if (error || !stdout) {
              finalize(0, 0, 0);
              return;
            }

            // Parse: totalBlocks usedBlocks availableBlocks
            const parts = stdout.trim().split(/\s+/);
            if (parts.length >= 3) {
              const totalBlocks = Number.parseInt(parts[0], 10);
              const usedBlocks = Number.parseInt(parts[1], 10);
              const availBlocks = Number.parseInt(parts[2], 10);

              // 1K blocks to bytes
              const totalBytes = totalBlocks * 1024;
              const usedBytes = usedBlocks * 1024;
              const freeBytes = availBlocks * 1024;

              finalize(totalBytes, usedBytes, freeBytes);
            } else {
              finalize(0, 0, 0);
            }
          },
        );
      }

      function finalize(
        totalBytes: number,
        usedBytes: number,
        freeBytes: number,
      ) {
        const freeGB = Math.round((freeBytes / (1024 * 1024 * 1024)) * 10) / 10;
        const totalGB =
          Math.round((totalBytes / (1024 * 1024 * 1024)) * 10) / 10;
        const usedGB = Math.round((usedBytes / (1024 * 1024 * 1024)) * 10) / 10;

        let status: "critical" | "ok" | "warn" = "ok";
        if (freeGB < DISK_SPACE_CRITICAL_GB) {
          status = "critical";
        } else if (freeGB < DISK_SPACE_WARN_GB) {
          status = "warn";
        }

        resolve({
          freeBytes,
          freeGB,
          status,
          totalBytes,
          totalGB,
          usedBytes,
          usedGB,
        });
      }
    } catch {
      clearTimeout(timeout);
      resolve({
        freeBytes: 0,
        freeGB: 0,
        status: "ok",
        totalBytes: 0,
        totalGB: 0,
        usedBytes: 0,
        usedGB: 0,
      });
    }
  });
}

/**
 * Analyze disk usage with per-plugin breakdown.
 * Includes formatted ASCII table for console output.
 */
export async function analyzeDiskUsage(opts: {
  globalConfigDir: string;
  cacheDir: string;
  reportDir: string;
  pluginSpecs: string[];
  cleanupTargets?: string[];
}): Promise<DiskAnalysis> {
  const { cacheDir, cleanupTargets, globalConfigDir, pluginSpecs, reportDir } =
    opts;

  // Check disk space
  const volume = await checkDiskSpace(globalConfigDir);

  // Measure directories
  const dirs: Record<string, DirSizeEntry> = {};
  const plugins: Record<string, DirSizeEntry> = {};

  // Global config dir
  const globalBytes = await getDirSizeBytes(globalConfigDir);
  dirs.globalConfigDir = {
    bytes: globalBytes,
    gb: Math.round((globalBytes / (1024 * 1024 * 1024)) * 100) / 100,
    path: globalConfigDir,
  };

  // Cache dir
  const cacheBytes = await getDirSizeBytes(cacheDir);
  dirs.cacheDir = {
    bytes: cacheBytes,
    gb: Math.round((cacheBytes / (1024 * 1024 * 1024)) * 100) / 100,
    path: cacheDir,
  };

  // Report dir
  const reportBytes = await getDirSizeBytes(reportDir);
  dirs.reportDir = {
    bytes: reportBytes,
    gb: Math.round((reportBytes / (1024 * 1024 * 1024)) * 100) / 100,
    path: reportDir,
  };

  // Per-plugin directory sizes
  for (const spec of pluginSpecs) {
    const dirName = pluginDirName(spec);
    const pluginPath = path.join(globalConfigDir, dirName);
    const pluginBytes = await getDirSizeBytes(pluginPath);
    plugins[dirName] = {
      bytes: pluginBytes,
      gb: Math.round((pluginBytes / (1024 * 1024 * 1024)) * 100) / 100,
      path: pluginPath,
    };
  }

  // Estimate cleanup savings
  let cleanupSavingsBytes = 0;
  if (cleanupTargets) {
    for (const target of cleanupTargets) {
      const targetBytes = await getDirSizeBytes(target);
      cleanupSavingsBytes += targetBytes;
    }
  }
  const cleanupSavingsGB =
    Math.round((cleanupSavingsBytes / (1024 * 1024 * 1024)) * 100) / 100;

  // Format as ASCII table
  const lines: string[] = [];
  lines.push("┌─ Disk Usage Breakdown ─────────────────────────────────┐");
  lines.push(
    `│ Volume: ${volume.totalGB} GB total | ${volume.usedGB} GB used | ${volume.freeGB} GB free`,
  );
  lines.push(`│ Status: ${volume.status.toUpperCase().padEnd(45)} │`);
  lines.push("├──────────────────────────────────────────────────────────┤");
  lines.push("│ Directory                          Size      Percent     │");
  lines.push("├──────────────────────────────────────────────────────────┤");

  const allDirs = [...Object.entries(dirs), ...Object.entries(plugins)];
  for (const [name, entry] of allDirs) {
    const percent = volume.totalBytes
      ? Math.round((entry.bytes / volume.totalBytes) * 1000) / 10
      : 0;
    const nameCol = name.slice(0, 30).padEnd(30);
    const sizeCol = `${entry.gb.toFixed(2)} GB`.padStart(10);
    const percentCol = `${percent}%`.padStart(10);
    lines.push(`│ ${nameCol} ${sizeCol} ${percentCol} │`);
  }

  lines.push("├──────────────────────────────────────────────────────────┤");
  if (cleanupTargets && cleanupTargets.length > 0) {
    const cleanupPercent = volume.totalBytes
      ? Math.round((cleanupSavingsBytes / volume.totalBytes) * 1000) / 10
      : 0;
    const cleanupLine = `│ Cleanup savings estimate   ${cleanupSavingsGB.toFixed(2)} GB ${cleanupPercent}% │`;
    lines.push(cleanupLine);
    lines.push("└──────────────────────────────────────────────────────────┘");
  } else {
    lines.push("└──────────────────────────────────────────────────────────┘");
  }

  const table = lines.join("\n");

  return {
    cleanupSavingsBytes,
    cleanupSavingsGB,
    dirs,
    plugins,
    table,
    volume,
  };
}
