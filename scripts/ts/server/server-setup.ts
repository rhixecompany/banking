#!/usr/bin/env ts-node
/**
 * Description: Port of server-setup scripts
 * CreatedBy: convert-scripts
 * TODO: Replace shell logic with native Node implementation
 */
import { spawnSync } from "child_process";

const scriptSh = "scripts/server/server-setup.sh";
const scriptPs1 = "scripts/server/server-setup.ps1";

if (process.platform === "win32") {
  spawnSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPs1],
    { stdio: "inherit" },
  );
} else {
  spawnSync("bash", [scriptSh], { stdio: "inherit" });
}
