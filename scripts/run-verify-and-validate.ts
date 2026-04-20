#!/usr/bin/env ts-node
import { spawnSync } from "child_process";

const steps = [
  { cmd: "npm", args: ["run", "format"] },
  { cmd: "npm", args: ["run", "type-check"] },
  { cmd: "npm", args: ["run", "lint:strict"] },
  { cmd: "npm", args: ["run", "verify:rules"] },
];

for (const s of steps) {
  console.log(`\n=== Running: ${s.cmd} ${s.args.join(" ")} ===`);
  const res = spawnSync(s.cmd, s.args, { stdio: "inherit" });
  if (res.status !== 0) {
    console.error(
      `Step failed: ${s.cmd} ${s.args.join(" ")} -> exit ${res.status}`,
    );
    process.exit(res.status ?? 1);
  }
}
console.log("All verification steps completed successfully.");
