#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} [base="origin/main"]
 * @returns {*}
 */
function gitDiffFiles(base = "origin/main") {
  const out = execSync(`git diff --name-only ${base} --`).toString();
  return out.split(/\r?\n/).filter(Boolean);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string[]} files
 * @returns {*}
 */
function expandOneLevel(files: string[]) {
  // Simple heuristic: find files that reference these files by scanning for literal strings
  const allFiles = execSync("git ls-files")
    .toString()
    .split(/\r?\n/)
    .filter(Boolean);
  const dependents = new Set<string>();
  for (const f of allFiles) {
    try {
      const content = fs.readFileSync(f, "utf-8");
      for (const changed of files) {
        // Normalize changed path to posix form for matching
        const changedPosix = changed.replaceAll("\\", "/");
        const withoutExt = changedPosix.replace(/\.(tsx?|jsx?|json|xml)$/, "");
        const variants = [
          changedPosix,
          `./${changedPosix}`,
          withoutExt,
          `@/${changedPosix}`,
          `@/${withoutExt}`,
        ];

        // Look for import/from patterns or any occurrence of the variant string
        let matched = false;
        for (const v of variants) {
          if (
            content.includes(`from "${v}"`) ||
            content.includes(`from '${v}'`) ||
            content.includes(v)
          ) {
            matched = true;
            break;
          }
        }

        if (matched) dependents.add(f);
      }
    } catch {
      // skip non-text
    }
  }
  return Array.from(dependents);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string[]} changed
 * @returns {*}
 */
function mapFilesToPages(changed: string[]) {
  const pages = new Set<string>();
  for (const f of changed) {
    if (f.startsWith("app/")) {
      const parts = f.split(path.posix.sep);
      // app/(root)/dashboard/page.tsx -> dashboard
      if (parts.length > 2) pages.add(parts[2]);
    }
    if (f.startsWith("components/")) {
      const parts = f.split(path.posix.sep);
      if (parts[1] === "layouts" || parts[1] === "home") pages.add("home");
    }
  }
  return Array.from(pages);
}

/**
 * Description placeholder
 * @author Adminbot
 */
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const baseIdx = args.indexOf("--diff-base");
  const base = baseIdx >= 0 ? args[baseIdx + 1] : "origin/main";

  const changed = gitDiffFiles(base);
  logger.warn("Changed files:", changed);

  const expanded = expandOneLevel(changed);
  logger.warn("One-level dependents:", expanded);

  const pages = mapFilesToPages([...changed, ...expanded]);
  logger.warn("Affected pages:", pages);

  if (dryRun) {
    logger.info(
      JSON.stringify({ changed: changed.length, ok: true, pages }, null, 2),
    );
    return;
  }

  // TODO: map to exact tests and run targeted test runner
  logger.info("Run targeted tests for:", pages.join(", "));
}

if (require.main === module) main();
