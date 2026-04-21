#!/usr/bin/env node
/**
 * Description: Node replacement for scripts/utils/run-ci-checks.ps1 (Windows variant)
 * CreatedBy: convert-scripts (fixer)
 * TODO: Keep parity with PowerShell helper behavior
 */
import { spawnSync } from "child_process";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const argv = process.argv.slice(2);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} cmd
 * @returns {*}
 */
function run(cmd: string) {
  const proc = spawnSync(cmd, { shell: true, stdio: "inherit" });
  if (proc.error) {
    console.error(proc.error);
    process.exit(1);
  }
  return proc.status ?? 0;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{}}
 */
const STEPS = [
  "format-check",
  "type-check",
  "lint-fix",
  "lint-strict",
  "build-debug",
  "test-browser",
  "test-ui",
  "build",
];

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {Record<string, string>}
 */
const COMMANDS: Record<string, string> = {
  build: "npm run build",
  "build-debug": "npm run build:debug",
  "format-check": "npm run format:check",
  "lint-fix": "npm run lint:fix",
  "lint-strict": "npm run lint:strict",
  "test-browser": "npm run test:browser",
  "test-ui": "npm run test:ui",
  "type-check": "npm run type-check",
};

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} name
 * @returns {*}
 */
function csvArg(name: string) {
  const m = argv.find(
    (a) => a.startsWith(`-${name}=`) || a.startsWith(`--${name}=`),
  );
  if (m)
    return m
      .split("=")[1]
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  const idx = argv.findIndex((a) => a === `-${name}` || a === `--${name}`);
  if (idx >= 0)
    return (argv[idx + 1] || "")
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);
  return [] as string[];
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const only = csvArg("Only");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const skip = csvArg("Skip");

if (only.length && skip.length) {
  console.error("Cannot use -Only and -Skip together");
  process.exit(1);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
let steps = STEPS.slice();
if (only.length) steps = STEPS.filter((s) => only.includes(s));
else if (skip.length) steps = STEPS.filter((s) => !skip.includes(s));

(function main() {
  if (steps.length === 0) {
    console.error("No steps to run after applying filters. Exiting.");
    process.exit(1);
  }
  const failed: string[] = [];
  for (const step of steps) {
    const cmd = COMMANDS[step];
    console.log(`==> Running: ${cmd}`);
    const rc = run(cmd);
    if (rc !== 0) failed.push(step);
  }
  if (failed.length) {
    console.error("Failed steps: " + failed.join(", "));
    process.exit(1);
  }
  console.log("All steps passed.");
})();
