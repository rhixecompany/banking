#!/usr/bin/env ts-node
/**
 * Description: Port of branch-compare.sh - compares two branches and shows summary
 * CreatedBy: convert-scripts
 * TODO: Add options for format and output file
 */
import { spawnSync } from "child_process";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const args = process.argv.slice(2);
if (args.length < 2) {
  logger.error("Usage: branch-compare <base> <head>");
  process.exit(2);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const [base, head] = args;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} cmd
 * @param {string[]} args
 * @returns {*}
 */
function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit" });
  return res.status ?? 0;
}

// Show commits in head not in base
logger.info(`Comparing ${base}..${head}`);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
let status = run("git", [
  "rev-list",
  "--left-right",
  "--count",
  `${base}...${head}`,
]);
if (status !== 0) process.exit(status);

status = run("git", ["log", "--oneline", `${base}..${head}`]);
if (status !== 0) process.exit(status);

logger.info("--- Diff summary ---");
status = run("git", ["diff", "--stat", `${base}..${head}`]);
process.exit(status);
