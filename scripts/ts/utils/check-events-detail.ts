#!/usr/bin/env ts-node
/**
 * Description: Port of scripts/utils/check-events-detail
 * CreatedBy: convert-scripts
 * TODO: Improve parsing and output formatting
 */
import { spawnSync } from "child_process";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/utils/check-events-detail.sh"}
 */
const scriptSh = "scripts/utils/check-events-detail.sh";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/utils/check-events-detail.ps1"}
 */
const scriptPs1 = "scripts/utils/check-events-detail.ps1";

if (process.platform === "win32") {
  spawnSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPs1],
    { stdio: "inherit" },
  );
} else {
  spawnSync("bash", [scriptSh], { stdio: "inherit" });
}
