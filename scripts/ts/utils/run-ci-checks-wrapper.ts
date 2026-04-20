#!/usr/bin/env ts-node
/**
 * Description: Wrapper to run CI checks defined in scripts/utils/run-ci-checks.sh/ps1
 * CreatedBy: convert-scripts
 * TODO: Convert logic to native Node
 */
import { spawnSync } from "child_process";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/utils/run-ci-checks.sh"}
 */
const cmdSh = "scripts/utils/run-ci-checks.sh";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/utils/run-ci-checks.ps1"}
 */
const cmdPs1 = "scripts/utils/run-ci-checks.ps1";

if (process.platform === "win32") {
  spawnSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", cmdPs1],
    { stdio: "inherit" },
  );
} else {
  spawnSync("bash", [cmdSh], { stdio: "inherit" });
}
