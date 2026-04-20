#!/usr/bin/env ts-node
/**
 * Description: Wrapper to invoke scripts/opencode-mcp.ps1 or .sh
 * CreatedBy: convert-scripts
 * TODO: Replace shell invocation with native Node implementation
 */
import { spawnSync } from "child_process";
import path from "path";

const ROOT = process.cwd();
const ps1 = path.join(ROOT, "scripts", "opencode-mcp.ps1");
const sh = path.join(ROOT, "scripts", "opencode-mcp.sh");

function run(cmd: string) {
  const res = spawnSync(cmd, { stdio: "inherit", shell: true });
  process.exitCode = res.status ?? 0;
}

if (process.platform === "win32") {
  run(`powershell -NoProfile -ExecutionPolicy Bypass -File "${ps1}"`);
} else {
  run(`bash "${sh}"`);
}
