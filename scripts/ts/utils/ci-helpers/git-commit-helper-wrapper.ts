#!/usr/bin/env ts-node
/**
 * Description: Thin wrapper for git-commit-helper script
 * CreatedBy: convert-scripts
 * TODO: Import and reuse scripts/utils/ci-helpers/git-commit-helper.ts logic
 */
import { spawnSync } from "child_process";

const sh = "scripts/utils/ci-helpers/git-commit-helper.sh";
if (process.platform === "win32") {
  console.warn(
    "git-commit-helper wrapper not implemented for Windows; call underlying TS helper instead",
  );
  process.exit(0);
}

spawnSync("bash", [sh], { stdio: "inherit" });
