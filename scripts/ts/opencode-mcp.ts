#!/usr/bin/env ts-node
/**
 * Description: Wrapper to invoke scripts/opencode-mcp.ps1 or .sh
 * CreatedBy: convert-scripts
 * TODO: Replace shell invocation with native Node implementation
 */
import { spawnSync } from "child_process";
import path from "path";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const ROOT = process.cwd();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const ps1 = path.join(ROOT, "scripts", "opencode-mcp.ps1");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const sh = path.join(ROOT, "scripts", "opencode-mcp.sh");

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} cmd
 */
function run(cmd: string) {
  const res = spawnSync(cmd, { shell: true, stdio: "inherit" });
  process.exitCode = res.status ?? 0;
}

if (process.platform === "win32") {
  run(`powershell -NoProfile -ExecutionPolicy Bypass -File "${ps1}"`);
} else {
  run(`bash "${sh}"`);
}
