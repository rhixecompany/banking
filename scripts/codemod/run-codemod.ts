#!/usr/bin/env ts-node
import { spawnSync } from "child_process";
import path from "path";

const ROOT = process.cwd();
const script = path.join(ROOT, "scripts", "codemod", "find-process-env.ts");
const args = process.argv.slice(2);

// Try to run via ts-node (npx ts-node ...) so Node can execute the TypeScript file.
const runner = process.env.TS_NODE ? process.env.TS_NODE : "npx";
const runnerArgs =
  runner === "npx" ? ["ts-node", script, ...args] : [script, ...args];
const res = spawnSync(runner, runnerArgs, { stdio: "inherit" });
if (res.error) {
  console.error("Failed to execute codemod runner:", res.error);
}
process.exitCode = res.status ?? 0;
