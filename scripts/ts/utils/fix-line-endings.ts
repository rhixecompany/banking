#!/usr/bin/env node
/**
 * Fix line endings across all project files (convert CRLF to LF)
 * Supports --dry-run to preview changes
 */
import fs from "fs/promises";
import { globbySync } from "globby";

import { logger } from "@/lib/logger";
import { ensureApplyOrDryRun, parseCli } from "./cli";

async function main() {
  const opts = parseCli();

  if (opts.help) {
    logger.info(
      "Usage: bunx tsx scripts/ts/utils/fix-line-endings.ts [--dry-run | --apply] [--verbose]",
    );
    process.exit(0);
  }

  ensureApplyOrDryRun(opts);

  // Find all text files to process
  const files = globbySync(
    [
      "**/*.{ts,tsx,js,jsx,json,md,yaml,yml,css,scss,html,xml}",
      ".*",
      "Makefile",
      ".npmrc",
      ".gitignore",
      ".env*",
    ],
    {
      ignore: [
        "node_modules/**",
        ".next/**",
        ".git/**",
        "dist/**",
        "build/**",
        "*.bak.*",
        ".vscode/**",
        ".github/workflows/**",
      ],
    },
  );

  let count = 0;
  const failed: string[] = [];

  for (const file of files) {
    try {
      const before = await fs.readFile(file, "utf8");
      const after = before.replaceAll("\r\n", "\n");

      if (after !== before) {
        count++;
        if (!opts.dryRun) {
          await fs.writeFile(file, after, "utf8");
        }
        if (opts.verbose) {
          logger.info(`Fixed: ${file}`);
        }
      }
    } catch {
      if (opts.verbose) {
        failed.push(file);
      }
    }
  }

  const status = opts.dryRun ? "[DRY-RUN] Would fix" : "Fixed";
  logger.info(`${status} ${count} files with CRLF line endings`);

  if (failed.length > 0 && opts.verbose) {
    logger.warn(`Failed to process ${failed.length} files`);
  }

  process.exit(0);
}

main().catch((err) => {
  logger.error("Error:", err);
  process.exit(1);
});
