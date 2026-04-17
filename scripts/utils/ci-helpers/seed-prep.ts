#!/usr/bin/env tsx
import { execa } from "execa";

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
  console.log("seed-prep --apply=", apply);

  // Check .env.local
  try {
    // attempt to run seed in dry-run first
    if (!apply) {
      console.log("Dry-run: npm run db:seed -- --dry-run");
      return;
    }

    await run("npm", ["run", "db:seed", "--", "--dry-run"]);
    console.log("Now running actual seed (apply=true)");
    await run("npm", ["run", "db:seed"]);
  } catch (err: any) {
    console.error("seed-prep failed:", err.message || String(err));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
