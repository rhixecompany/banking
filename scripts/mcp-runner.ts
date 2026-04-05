#!/usr/bin/env node
/* eslint-disable n/no-process-env */
// Small helper to run an MCP package using bun if available, otherwise npx.
// Usage: npx tsx .scripts/mcp-runner.ts <package> [args...]

import { spawn, spawnSync, type ChildProcess } from "child_process";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {string[]}
 */
const args: string[] = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: npx tsx .scripts/mcp-runner.ts <package> [args...]");
  process.exit(2);
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {string}
 */
const pkg: string = args[0];
/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {string[]}
 */
const extra: string[] = args.slice(1);

/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {string} name
 * @returns {boolean}
 */
function hasCommand(name: string): boolean {
  try {
    const r = spawnSync(name, ["--version"], { stdio: "ignore" });
    return r.status === 0;
  } catch {
    return false;
  }
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {boolean}
 */
let useBun: boolean = hasCommand("bun");
/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {(string | null)}
 */
let bunPath: null | string = null;

// If bun isn't on PATH, check the default Windows install location.
if (!useBun) {
  try {
    const candidate: string =
      "C:\\Users\\" +
      (process.env["USERNAME"] ?? process.env["USER"] ?? "") +
      "\\.bun\\bin\\bun.exe";
    const r = spawnSync(candidate, ["--version"], { stdio: "ignore" });
    if (r.status === 0) {
      useBun = true;
      bunPath = candidate;
    }
  } catch {
    // bun not found at default Windows path — fall through to npx
  }
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {boolean}
 */
const useNpx: boolean = hasCommand("npx");
/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {boolean}
 */
const useNpm: boolean = hasCommand("npm");

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {string}
 */
let cmd: string;
/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {string[]}
 */
let cmdArgs: string[];

if (useBun) {
  cmd = bunPath ?? "bun";
  cmdArgs = ["x", pkg, ...extra];
} else if (useNpx) {
  cmd = "npx";
  cmdArgs = ["--yes", pkg, ...extra];
} else if (useNpm) {
  cmd = "npm";
  cmdArgs = ["exec", "--yes", pkg, "--", ...extra];
} else {
  console.error(
    "Neither bun, npx, nor npm is available in PATH. Install Node.js (which provides npm) or Bun.",
  );
  console.error(
    "Windows: install Node.js from https://nodejs.org/ or install Bun from https://bun.sh/",
  );
  console.error("After installing, re-run the scripts command.");
  process.exit(2);
}

// Spawn the MCP server process and forward stdio so OpenCode can communicate with it.
/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {ChildProcess}
 */
const child: ChildProcess = spawn(cmd, cmdArgs, {
  env: process.env,
  stdio: "inherit",
});

// Forward termination signals to the child so it can shut down cleanly.
/**
 * Description placeholder
 * @author [object Object]
 *
 * @param {NodeJS.Signals} signal
 */
function forwardSignal(signal: NodeJS.Signals): void {
  if (!child.killed) {
    child.kill(signal);
  }
}

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

child.on("error", (err: Error) => {
  console.error("Failed to start MCP process:", err.message);
  process.exit(1);
});

child.on("exit", (code: null | number, signal: NodeJS.Signals | null) => {
  if (signal !== null) {
    console.error(`MCP process terminated with signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 0);
});
