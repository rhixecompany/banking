#!/usr/bin/env ts-node
/**
 * Description: Run verification for agents scripts and helpers
 * CreatedBy: convert-scripts
 * TODO: Improve to parse outputs and create structured reports
 */
import { spawnSync } from "child_process";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{}}
 */
const cmds = [
  ["bash", "scripts/verify-agents.sh"],
  [
    "powershell",
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    "scripts/verify-agents.ps1",
  ],
];

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string[]} cmd
 * @param {boolean} [skipIfWindows=false]
 */
function tryRun(cmd: string[], skipIfWindows = false) {
  if (process.platform === "win32" && cmd[0] === "bash") return;
  if (process.platform !== "win32" && cmd[0].startsWith("powershell")) return;
  const res = spawnSync(cmd[0], cmd.slice(1), {
    stdio: "inherit",
    shell: false,
  });
  if (res.status !== 0) process.exit(res.status ?? 1);
}

for (const c of cmds) tryRun(c);
