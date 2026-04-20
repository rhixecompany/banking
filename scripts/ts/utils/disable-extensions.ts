#!/usr/bin/env ts-node
/**
 * Description: Port of scripts/utils/disable-extensions.ps1/.sh
 * CreatedBy: convert-scripts
 * TODO: Add safe simulation mode
 */
import { spawnSync } from "child_process";

const scriptSh = "scripts/utils/disable-extensions.sh";
const scriptPs1 = "scripts/utils/disable-extensions.ps1";

if (process.platform === "win32") {
  spawnSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPs1],
    { stdio: "inherit" },
  );
} else {
  spawnSync("bash", [scriptSh], { stdio: "inherit" });
}
