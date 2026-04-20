#!/usr/bin/env ts-node
import { main as deployMain } from "../deploy/deploy";
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
  ensureApplyOrDryRun({ dryRun: cli.dryRun, apply: cli.apply });
  if (cli.dryRun) {
    const summary = "This would run the deployment steps (dry-run).";
    const json = { ok: true, action: "deploy", files: [] };
    printDryRunResult(summary, json);
    return;
  }
  // apply mode
  await deployMain({ apply: cli.apply });
}

if (require.main === module)
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
