#!/usr/bin/env ts-node
/**
 * Description: Port of server-setup scripts
 * CreatedBy: convert-scripts
 * TODO: Replace shell logic with native Node implementation
 */
import { spawnSync } from "child_process";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/server/server-setup.sh"}
 */
const scriptSh = "scripts/server/server-setup.sh";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/server/server-setup.ps1"}
 */
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
