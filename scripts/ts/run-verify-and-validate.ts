#!/usr/bin/env node
/**
 * Description: Run repository quick-validate steps in sequence: format, type-check, lint:strict, verify:rules
 * CreatedBy: convert-scripts (fixer batch 1)
 * TODO: optionally accept flags to skip steps
 */
import { spawnSync } from "child_process";

import { logger } from "@/lib/logger";

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
