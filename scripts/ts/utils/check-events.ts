#!/usr/bin/env ts-node
/**
 * Description: Lightweight port of scripts/utils/check-events.sh/.ps1
 * CreatedBy: convert-scripts
 * TODO: Add structured output and filters
 */
import { spawnSync } from "child_process";

const scriptSh = "scripts/utils/check-events.sh";
const scriptPs1 = "scripts/utils/check-events.ps1";

if (process.platform === "win32") {
  spawnSync(
    "powershell",
    ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPs1],
    { stdio: "inherit" },
  );
} else {
  spawnSync("bash", [scriptSh], { stdio: "inherit" });
}
