#!/usr/bin/env node
import minimist from "minimist";

import { logger } from "@/lib/logger";

/**
 * Split comma-separated value into trimmed array
 */
function splitCsv(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * Parse CLI arguments with extended flags for scripts
 *
 * @export
 * @param {*} [argv=process.argv.slice(2)]
 * @returns {CliOptions}
 */
export function parseCli(argv = process.argv.slice(2)) {
  const args = minimist(argv, {
    alias: { h: "help", v: "verbose", f: "force" },
    boolean: ["dry-run", "apply", "verbose", "help", "ci", "force", "pretty"],
    string: ["only", "skip", "output", "env-file", "name", "report", "confirm"],
  });
  return {
    apply: Boolean(args.apply),
    args,
    ci: Boolean(args.ci),
    confirm: args.confirm as string | undefined,
    dryRun: Boolean(args["dry-run"]),
    envFile: args["env-file"] as string | undefined,
    force: Boolean(args.force),
    help: Boolean(args.help),
    name: args.name as string | undefined,
    only: args.only ? splitCsv(String(args.only)) : [],
    output: args.output as string | undefined,
    pretty: Boolean(args.pretty),
    report: (args.report as "json" | "text" | undefined) ?? "text",
    skip: args.skip ? splitCsv(String(args.skip)) : [],
    verbose: Boolean(args.verbose),
  } as const;
}

export type CliOptions = ReturnType<typeof parseCli>;

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
