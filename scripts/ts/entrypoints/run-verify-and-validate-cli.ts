#!/usr/bin/env ts-node
import { main as verifyMain } from "../../run-verify-and-validate";
import { parseCli, printDryRunResult } from "../utils/cli";

async function run() {
  const cli = parseCli();
  if (cli.dryRun) {
    printDryRunResult(
      "Would run format, type-check, lint:strict, verify:rules",
      { steps: ["format", "type-check", "lint:strict", "verify:rules"] },
    );
    return;
  }
  await verifyMain();
}

if (require.main === module)
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
