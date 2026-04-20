#!/usr/bin/env ts-node
/**
 * Description: Port of branch-compare.sh - compares two branches and shows summary
 * CreatedBy: convert-scripts
 * TODO: Add options for format and output file
 */
import { spawnSync } from "child_process";

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("Usage: branch-compare <base> <head>");
  process.exit(2);
}

const [base, head] = args;

function run(cmd: string, args: string[]) {
  const res = spawnSync(cmd, args, { stdio: "inherit" });
  return res.status ?? 0;
}

// Show commits in head not in base
console.log(`Comparing ${base}..${head}`);
let status = run("git", [
  "rev-list",
  "--left-right",
  "--count",
  `${base}...${head}`,
]);
if (status !== 0) process.exit(status);

status = run("git", ["log", "--oneline", `${base}..${head}`]);
if (status !== 0) process.exit(status);

console.log("--- Diff summary ---");
status = run("git", ["diff", "--stat", `${base}..${head}`]);
process.exit(status);
