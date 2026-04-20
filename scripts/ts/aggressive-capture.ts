#!/usr/bin/env ts-node
/**
 * Description: Port of aggressive-capture.ps1/.sh - captures logs and diagnostics
 * CreatedBy: convert-scripts
 * TODO: Make non-destructive and add safe sampling limits
 */
import { spawnSync } from "child_process";

const cmds = [
  ["bash", "scripts/aggressive-capture.sh"],
  [
    "powershell",
    "-NoProfile",
    "-ExecutionPolicy",
    "Bypass",
    "-File",
    "scripts/aggressive-capture.ps1",
  ],
];

for (const c of cmds) {
  if (process.platform === "win32" && c[0] === "bash") continue;
  if (process.platform !== "win32" && c[0] === "powershell") continue;
  const res = spawnSync(c[0], c.slice(1), { stdio: "inherit" });
  if (res.status !== 0) {
    console.error(`Command failed: ${c.join(" ")} -> ${res.status}`);
    process.exit(res.status ?? 1);
  }
}
