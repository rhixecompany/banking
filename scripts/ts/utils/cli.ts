#!/usr/bin/env ts-node
import minimist from "minimist";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {*} [argv=process.argv.slice(2)]
 * @returns {{ readonly dryRun: any; readonly apply: any; readonly verbose: any; readonly help: any; readonly args: any; }}
 */
export function parseCli(argv = process.argv.slice(2)) {
  const args = minimist(argv, {
    alias: { h: "help", v: "verbose" },
    boolean: ["dry-run", "apply", "verbose", "help"],
  });
  return {
    apply: Boolean(args.apply),
    args,
    dryRun: Boolean(args["dry-run"]),
    help: Boolean(args.help),
    verbose: Boolean(args.verbose),
  } as const;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} summary
 * @param {unknown} json
 */
export function printDryRunResult(summary: string, json: unknown) {
  logger.info("DRY-RUN SUMMARY:");
  logger.info(summary);
  logger.info("---");
  logger.info(JSON.stringify(json, null, 2));
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {{ dryRun: boolean; apply: boolean }} opts
 */
export function ensureApplyOrDryRun(opts: { dryRun: boolean; apply: boolean }) {
  if (!opts.dryRun && !opts.apply) {
    logger.info(
      "No action specified. Use --dry-run to preview or --apply to make changes.",
    );
    process.exit(0);
  }
}
