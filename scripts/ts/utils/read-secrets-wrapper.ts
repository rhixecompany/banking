#!/usr/bin/env ts-node
/**
 * Description: Wrapper that delegates to read-secrets scripts
 * CreatedBy: convert-scripts
 * TODO: Replace with secret manager integration
 */
import { spawnSync } from "child_process";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/utils/read-secrets.sh"}
 */
const sh = "scripts/utils/read-secrets.sh";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"scripts/utils/read-secrets.ps1"}
 */
const ps1 = "scripts/utils/read-secrets.ps1";

if (process.platform === "win32") {
  spawnSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps1],
    { stdio: "inherit" },
  );
} else {
  spawnSync("bash", [sh], { stdio: "inherit" });
}
