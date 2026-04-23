#!/usr/bin/env tsx
import { execa } from "execa";
import { promises as fs } from "fs";
import path from "path";

import { logger } from "@/lib/logger";

// Heuristic runner: parse test-browser-report.txt for failing test file paths
// and re-run them with vitest. Dry-run by default; pass --apply to execute.

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {"test-browser-report.txt"}
 */
const REPORT = "test-browser-report.txt";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} content
 * @returns {string[]}
 */
function extractFilesFromReport(content: string): string[] {
  const files = new Set<string>();
  const lines = content.split(/\r?\n/);
  for (const l of lines) {
    // common vitest/jest style: "FAIL path/to/file.test.ts" or "at path/to/file.test.ts"
    // Use explicit space class to avoid super-linear backtracking in regex
    // Avoid complex quantified whitespace patterns; split by whitespace and
    // check the typical vitest fail line format: "FAIL <path>"
    const parts = l.trim().split(/\s+/);
    if (parts.length > 1 && parts[0].toUpperCase() === "FAIL") {
      const candidate = parts[1];
      if (/(.+\.(test|spec)\.(ts|tsx|js|jsx))$/i.test(candidate))
        files.add(candidate);
    }
    // fallback: lines that look like file path with .test.
    const m2 = l.match(/(tests?\/.*\.(test|spec)\.(ts|tsx|js|jsx))/i);
    if (m2) files.add(m2[1]);
  }
  return Array.from(files);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string[]} files
 * @param {boolean} apply
 * @returns {*}
 */
async function runVitestOnFiles(files: string[], apply: boolean) {
  if (files.length === 0) {
    logger.info("No failing test files detected in report.");
    return;
  }
  logger.info("Targeted test files:", files);
  const cmd = "npx";
  const args = ["vitest", "--config=vitest.config.ts", "run", ...files];
  if (!apply) {
    logger.info("Dry-run: would run:", `${cmd} ${args.join(" ")}`);
    return;
  }

  const p = execa(cmd, args, { shell: true, stdio: "inherit" });
  await p;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");

  try {
    const p = path.resolve(process.cwd(), REPORT);
    const content = await fs.readFile(p, "utf8");
    const files = extractFilesFromReport(content).map((f) =>
      path.resolve(process.cwd(), f),
    );
    await runVitestOnFiles(files, apply);
  } catch (err: any) {
    logger.warn(`Could not read ${REPORT}:`, err.message || String(err));
    logger.info(
      "You can pass explicit file paths: npx tsx scripts/utils/ci-helpers/targeted-test-runner.ts path/to/file.test.ts --apply",
    );
    // also support explicit files
    const provided = argv.filter((a) => a !== "--apply");
    if (provided.length > 0) {
      await runVitestOnFiles(
        provided.map((p) => path.resolve(process.cwd(), p)),
        apply,
      );
    }
  }
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
