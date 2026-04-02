#!/usr/bin/env node
// Small helper to run an MCP package using bun if available, otherwise npx.
// Usage: npx tsx .opencode/mcp-runner.ts <package> [args...]

import { spawn, spawnSync, type ChildProcess } from "child_process";

const args: string[] = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: npx tsx .opencode/mcp-runner.ts <package> [args...]");
  process.exit(2);
}

const pkg: string = args[0];
const extra: string[] = args.slice(1);

function hasCommand(name: string): boolean {
  try {
    const r = spawnSync(name, ["--version"], { stdio: "ignore" });
    return r.status === 0;
  } catch {
    return false;
  }
}

let useBun: boolean = hasCommand("bun");
let bunPath: string | null = null;

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

const useNpx: boolean = hasCommand("npx");
const useNpm: boolean = hasCommand("npm");

let cmd: string;
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
  console.error("After installing, re-run the opencode command.");
  process.exit(2);
}

// Spawn the MCP server process and forward stdio so OpenCode can communicate with it.
const child: ChildProcess = spawn(cmd, cmdArgs, {
  stdio: "inherit",
  env: process.env,
});

// Forward termination signals to the child so it can shut down cleanly.
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

child.on("exit", (code: number | null, signal: NodeJS.Signals | null) => {
  if (signal !== null) {
    console.error(`MCP process terminated with signal ${signal}`);
    process.exit(1);
  }
  process.exit(code ?? 0);
});
