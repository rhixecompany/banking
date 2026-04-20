#!/usr/bin/env node
/**
 * Robust exec wrapper
 * CreatedBy: assistant
 * Description: Execute a shell command string in a cross-platform way and forward stdout/stderr.
 * Usage: node scripts/tools/exec-wrapper.js "echo hello && node -v"
 * Notes: Uses child_process.spawnSync with shell:true so callers supply a single string.
 */
const { spawnSync } = require("child_process");

function usage() {
  console.error('Usage: node scripts/tools/exec-wrapper.js "<command-string>"');
  process.exit(2);
}

const cmd = process.argv.slice(2).join(" ");
if (!cmd) usage();

try {
  // Use a single command string and shell mode to avoid array/paths edge-cases in spawn
  const res = spawnSync(cmd, {
    stdio: "inherit",
    shell: true,
    cwd: process.cwd(),
    windowsHide: true,
  });
  process.exitCode = res.status === null ? 1 : res.status;
} catch (err) {
  console.error(
    "exec-wrapper failed:",
    err && err.stack ? err.stack : String(err),
  );
  process.exitCode = 1;
}
