#!/usr/bin/env node
import { spawnSync } from "child_process";

import { logger } from "@/lib/logger";

import { parseCli, printDryRunResult } from "../utils/cli";

const STEPS = [
  { args: ["run", "format"], cmd: "bun" },
  { args: ["run", "type-check"], cmd: "bun" },
  { args: ["run", "lint:strict"], cmd: "bun" },
  { args: ["run", "verify:rules"], cmd: "bun" },
];

async function run() {
  const cli = parseCli();
  if (cli.dryRun) {
    printDryRunResult(
      "Would run format, type-check, lint:strict, verify:rules",
      { steps: ["format", "type-check", "lint:strict", "verify:rules"] },
    );
    return;
  }

  for (const s of STEPS) {
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

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
