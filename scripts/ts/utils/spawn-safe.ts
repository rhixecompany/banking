#!/usr/bin/env node
import { spawnSync, type SpawnSyncOptions } from "child_process";
import os from "os";

import { logger } from "@/lib/logger";

export interface RunOptions {
  cwd?: string;
  env?: NodeJS.ProcessEnv;
  exitOnError?: boolean;
}

export interface CaptureResult {
  code: number;
  stdout: string;
  stderr: string;
}

/**
 * Cross-platform command runner.
 * Unix: shell:false, splits command string.
 * Windows: shell:true, passes full string.
 *
 * @export
 * @param {string} cmd - Command to run
 * @param {string[]} [args=[]] - Additional arguments
 * @param {RunOptions} [opts={}] - Options
 * @returns {number} Exit code
 */
export function run(
  cmd: string,
  args: string[] = [],
  opts: RunOptions = {},
): number {
  const { cwd, env, exitOnError = true } = opts;
  const isWin = os.platform() === "win32";

  const spawnOpts: SpawnSyncOptions = {
    cwd,
    env: { ...process.env, ...env },
    shell: isWin,
    stdio: "inherit",
  };

  let proc;
  if (isWin) {
    // Windows: pass full command string to shell
    const fullCmd = [cmd, ...args].join(" ");
    proc = spawnSync(fullCmd, [], spawnOpts);
  } else {
    // Unix: split command and pass as separate arguments
    const cmdParts = cmd.split(" ");
    const cmdName = cmdParts[0];
    const cmdArgs = [...cmdParts.slice(1), ...args];
    proc = spawnSync(cmdName, cmdArgs, spawnOpts);
  }

  if (proc.error) {
    logger.error(`Command failed: ${cmd}`, proc.error);
    if (exitOnError) process.exit(1);
    return 1;
  }
  return proc.status ?? 0;
}

/**
 * Run command and capture output (stdout/stderr)
 * Returns immediately without inheriting stdio
 *
 * @export
 * @param {string} cmd - Command to run
 * @param {string[]} [args=[]] - Additional arguments
 * @returns {CaptureResult} Exit code and captured output
 */
export function capture(cmd: string, args: string[] = []): CaptureResult {
  const isWin = os.platform() === "win32";

  const spawnOpts: SpawnSyncOptions = {
    encoding: "utf8" as const,
    shell: isWin,
  };

  let proc;
  if (isWin) {
    const fullCmd = [cmd, ...args].join(" ");
    proc = spawnSync(fullCmd, [], spawnOpts);
  } else {
    const cmdParts = cmd.split(" ");
    const cmdName = cmdParts[0];
    const cmdArgs = [...cmdParts.slice(1), ...args];
    proc = spawnSync(cmdName, cmdArgs, spawnOpts);
  }

  return {
    code: proc.status ?? 0,
    stderr: (proc.stderr as string) ?? "",
    stdout: (proc.stdout as string) ?? "",
  };
}

/**
 * Run command or log dry-run (skips execution if dryRun=true)
 *
 * @export
 * @param {boolean} dryRun - If true, logs command but skips execution
 * @param {string} cmd - Command to run
 * @param {string[]} [args=[]] - Additional arguments
 * @param {RunOptions} [opts={}] - Options
 * @returns {number} Exit code (0 on dry-run)
 */
export function runOrDry(
  dryRun: boolean,
  cmd: string,
  args: string[] = [],
  opts: RunOptions = {},
): number {
  if (dryRun) {
    logger.info(`[DRY-RUN] Would run: ${cmd} ${args.join(" ")}`);
    return 0;
  }
  return run(cmd, args, opts);
}
