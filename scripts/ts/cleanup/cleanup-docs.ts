#!/usr/bin/env node
/**
 * cleanup-docs.ts - converted from cleanup-docs.sh
 * TODO: Review color handling on Windows; keep behavior parity with original shell script
 */
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";

function run(cmd: string, args: string[], opts: { cwd?: string } = {}) {
  const res = spawnSync(cmd, args, { stdio: "inherit", cwd: opts.cwd });
  if (res.error) throw res.error;
  if (res.status && res.status !== 0) process.exit(res.status);
}

// Basic port of shell logic: determine project root and find markdown files
const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const PROJECT_ROOT = path.resolve(SCRIPT_DIR, "..", "..");

console.log("Scanning documentation files...");

// Use a simple find via node FS - keep it conservative to preserve behavior
function findMdFiles(dir: string, out: string[] = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (
      full.includes("/node_modules/") ||
      full.includes("/.cursor/") ||
      full.includes("/.github/") ||
      full.includes("/.opencode/")
    )
      continue;
    if (e.isDirectory()) findMdFiles(full, out);
    else if (e.isFile() && full.endsWith(".md")) out.push(full);
  }
  return out;
}

const all = findMdFiles(PROJECT_ROOT);
const rel = all.map((p) => path.relative(PROJECT_ROOT, p).replace(/\\/g, "/"));

// Very small interactive menu fallback is not implemented; just print categorized lists
console.log("Found markdown files:", rel.length);
for (const r of rel.slice(0, 200)) console.log(" -", r);
console.log("TODO: Implement deletion menu in Node version if desired.");

process.exit(0);
