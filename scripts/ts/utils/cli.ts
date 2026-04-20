#!/usr/bin/env ts-node
import minimist from "minimist";

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
    boolean: ["dry-run", "apply", "verbose", "help"],
    alias: { h: "help", v: "verbose" },
  });
  return {
    dryRun: Boolean(args["dry-run"]),
    apply: Boolean(args.apply),
    verbose: Boolean(args.verbose),
    help: Boolean(args.help),
    args,
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
  console.log("DRY-RUN SUMMARY:");
  console.log(summary);
  console.log("---");
  console.log(JSON.stringify(json, null, 2));
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
    console.log(
      "No action specified. Use --dry-run to preview or --apply to make changes.",
    );
    process.exit(0);
  }
}
