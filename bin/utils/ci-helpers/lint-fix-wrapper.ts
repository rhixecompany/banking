#!/usr/bin/env tsx
import { execa } from "execa";

import { logger } from "@/lib/logger";

// Wrapper for running eslint --fix with safety and reporting remaining warnings.
// Dry-run by default; pass --apply to actually run --fix.

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} cmd
 * @param {string[]} args
 * @returns {*}
 */
async function run(cmd: string, args: string[]) {
  const p = execa(cmd, args, { shell: true, stdio: "inherit" });
  await p;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  logger.info("lint-fix-wrapper --apply=", apply);

  // Show what would be run
  const cmd = "npm";
  const baseArgs = ["run", "lint:fix:all"];
  if (!apply) {
    logger.info("Dry-run: would run:", `${cmd} ${baseArgs.join(" ")}`);
    logger.info("To apply fixes: add --apply");
    return;
  }

  await run(cmd, baseArgs);

  // After running, show lint strict to report remaining errors
  await run("npm", ["run", "lint:strict"]).catch(() => {
    logger.warn("lint:strict failed — remaining warnings/errors exist");
  });
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
