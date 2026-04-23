#!/usr/bin/env tsx
import { execa } from "execa";

import { logger } from "@/lib/logger";

// Lightweight helper to prepare DB and mocks for Playwright tests.
// It checks for .env.local presence and runs the seed script in dry-run by default.

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
  logger.info("seed-prep --apply=", apply);

  // Check .env.local
  try {
    // attempt to run seed in dry-run first
    if (!apply) {
      logger.info("Dry-run: npm run db:seed -- --dry-run");
      return;
    }

    await run("npm", ["run", "db:seed", "--", "--dry-run"]);
    logger.info("Now running actual seed (apply=true)");
    await run("npm", ["run", "db:seed"]);
  } catch (err: any) {
    logger.error("seed-prep failed:", err.message || String(err));
    process.exit(1);
  }
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
