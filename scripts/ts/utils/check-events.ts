#!/usr/bin/env ts-node
/**
 * Check for bugcheck/power-related events in System log
 * Cross-platform implementation for Windows Event Viewer
 */
import { spawnSync } from "child_process";

const PROVIDERS = [
  "BugCheck",
  "Kernel-Power",
  "Power-Troubleshooter",
  "WHEA-Logger",
  "microsoft-windows-kernel",
];

const MAX_EVENTS = 100;

function checkWindowsEvents(): void {
  const psScript = `
Get-WinEvent -FilterHashtable @{LogName='System';Level=1,2} -MaxEvents ${MAX_EVENTS} |
    Where-Object {
        $_.ProviderName -match 'BugCheck|Kernel-Power|Power-Troubleshooter|WHEA-Logger|microsoft-windows-kernel'
    } |
    Select-Object TimeCreated, ProviderName, Id, Message |
    Format-List
`;

  const result = spawnSync("powershell", ["-NoProfile", "-Command", psScript], {
    stdio: "inherit",
  });

  process.exit(result.status);
}

if (require.main === module) {
  if (process.platform === "win32") {
    checkWindowsEvents();
  } else {
    console.error("This script is only supported on Windows");
    process.exit(1);
  }
}