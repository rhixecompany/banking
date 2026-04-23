#!/usr/bin/env node

import { spawnSync } from "child_process";

import { logger } from "@/lib/logger";

import { parseCli, printDryRunResult } from "./ts/utils/cli";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{}}
 */
const steps = [
  { args: ["run", "format"], cmd: "npm" },
  { args: ["run", "type-check"], cmd: "npm" },
  { args: ["run", "lint:strict"], cmd: "npm" },
  { args: ["run", "verify:rules"], cmd: "npm" },
];

/**
 * Description placeholder
 * @author Adminbot
 */
function runSteps() {
  for (const s of steps) {
    logger.info(`\n=== Running: ${s.cmd} ${s.args.join(" ")} ===`);
    const res = spawnSync(s.cmd, s.args, { stdio: "inherit" });
    if (res.status !== 0) {
      logger.error(
        `Step failed: ${s.cmd} ${s.args.join(" ")} -> exit ${res.status}`,
      );
      process.exit(res.status ?? 1);
    }
  }
  logger.info("All verification steps completed successfully.");
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @param {string[]} [argv=[]]
 * @returns {unknown}
 */
export async function main(argv: string[] = []) {
  const cli = parseCli(argv);
  if (cli.dryRun) {
    printDryRunResult(
      "This would run format, type-check, lint:strict and verify:rules",
      { steps },
    );
    return { ok: true, steps };
  }
  runSteps();
  return { ok: true };
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  require.main === module
) {
  main(process.argv.slice(2)).catch((e) => {
    logger.error(e);
    process.exitCode = 1;
  });
}
