#!/usr/bin/env ts-node
import { ensureApplyOrDryRun, parseCli, printDryRunResult } from "../utils/cli";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function run() {
  const cli = parseCli();
  ensureApplyOrDryRun({ apply: cli.apply, dryRun: cli.dryRun });
  if (cli.dryRun) {
    const summary = "This would run the deployment steps (dry-run).";
    const json = { action: "deploy", files: [], ok: true };
    printDryRunResult(summary, json);
    return;
  }
  // apply mode
  await import("../deploy/deploy");
}

if (require.main === module)
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
