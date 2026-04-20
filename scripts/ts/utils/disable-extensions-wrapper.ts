#!/usr/bin/env ts-node
/**
 * Description: Wrapper for disable-extensions.sh/ps1
 * CreatedBy: convert-scripts
 * TODO: Implement native Node manipulation of VSCode settings
 */
import { spawnSync } from "child_process";

const sh = "scripts/utils/disable-extensions.sh";
const ps1 = "scripts/utils/disable-extensions.ps1";

if (process.platform === "win32") {
  spawnSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", ps1],
    { stdio: "inherit" },
  );
} else {
  spawnSync("bash", [sh], { stdio: "inherit" });
}
