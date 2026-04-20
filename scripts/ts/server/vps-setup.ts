#!/usr/bin/env ts-node
/**
 * Description: Port of vps-setup scripts
 * CreatedBy: convert-scripts
 * TODO: Add idempotent checks and logging
 */
import { spawnSync } from "child_process";

const scriptSh = "scripts/server/vps-setup.sh";
const scriptPs1 = "scripts/server/vps-setup.ps1";

if (process.platform === "win32") {
  spawnSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPs1],
    { stdio: "inherit" },
  );
} else {
  spawnSync("bash", [scriptSh], { stdio: "inherit" });
}
