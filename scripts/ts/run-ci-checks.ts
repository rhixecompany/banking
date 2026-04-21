#!/usr/bin/env node
/**
 * Description: Node replacement for scripts/utils/run-ci-checks.sh
 * CreatedBy: convert-scripts (fixer)
 * TODO: keep parity with bash/ps1 implementations; enhance targeted-run helper support
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
 * @param {string[]} [args=[]]
 * @returns {*}
 */
function run(cmd: string, args: string[] = []) {
  const parts = cmd.split(" ");
  const proc = spawnSync(parts[0], parts.slice(1).concat(args), {
    shell: false,
    stdio: "inherit",
  });
  if (proc.error) {
    console.error(proc.error);
    process.exit(1);
  }
  return proc.status ?? 0;
}

// Minimal mapping: run canonical npm scripts in order, honour --only/--skip by simple CSV parsing
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
 * @param {?string} [s]
 * @returns {*}
 */
function splitCsv(s?: string) {
  if (!s) return [];
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const only = (() => {
  const m = argv.find((a) => a.startsWith("--only="));
  if (m) return splitCsv(m.split("=")[1]);
  const idx = argv.indexOf("--only");
  if (idx >= 0) return splitCsv(argv[idx + 1]);
  return [] as string[];
})();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const skip = (() => {
  const m = argv.find((a) => a.startsWith("--skip="));
  if (m) return splitCsv(m.split("=")[1]);
  const idx = argv.indexOf("--skip");
  if (idx >= 0) return splitCsv(argv[idx + 1]);
  return [] as string[];
})();

if (only.length && skip.length) {
  console.error("Cannot use --only and --skip together");
  process.exit(1);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
let steps = STEPS.slice();
if (only.length) {
  for (const name of only)
    if (!STEPS.includes(name)) {
      console.error("Unknown step in --only: " + name);
      process.exit(1);
    }
  steps = STEPS.filter((s) => only.includes(s));
} else if (skip.length) {
  for (const name of skip)
    if (!STEPS.includes(name)) {
      console.error("Unknown step in --skip: " + name);
      process.exit(1);
    }
  steps = STEPS.filter((s) => !skip.includes(s));
}

(async function main() {
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
