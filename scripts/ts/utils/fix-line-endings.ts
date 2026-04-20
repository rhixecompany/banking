#!/usr/bin/env ts-node
/**
 * Description: Port of fix-line-endings scripts
 * CreatedBy: convert-scripts
 * TODO: Add dry-run mode and file filters
 */
import { spawnSync } from "child_process";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/utils/fix-line-endings.sh"}
 */
const scriptSh = "scripts/utils/fix-line-endings.sh";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/utils/fix-line-endings.ps1"}
 */
const scriptPs1 = "scripts/utils/fix-line-endings.ps1";

if (process.platform === "win32") {
  spawnSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPs1],
    { stdio: "inherit" },
  );
} else {
  spawnSync("bash", [scriptSh], { stdio: "inherit" });
}
