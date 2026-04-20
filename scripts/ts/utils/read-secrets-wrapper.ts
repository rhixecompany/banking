#!/usr/bin/env ts-node
/**
 * Description: Wrapper that delegates to read-secrets scripts
 * CreatedBy: convert-scripts
 * TODO: Replace with secret manager integration
 */
import { spawnSync } from "child_process";

const sh = "scripts/utils/read-secrets.sh";
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
