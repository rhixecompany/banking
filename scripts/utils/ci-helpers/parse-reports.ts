#!/usr/bin/env tsx
import { promises as fs } from "fs";
import path from "path";

import { logger } from "@/lib/logger";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{}}
 */
const REPORTS = [
  "format-check-report.txt",
  "type-check-report.txt",
  "lint-fix-report.txt",
  "lint-strict-report.txt",
  "build-debug-report.txt",
  "test-browser-report.txt",
  "test-ui-report.txt",
  "build-report.txt",
];

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} file
 * @returns {unknown}
 */
async function readReport(file: string) {
  try {
    const p = path.resolve(process.cwd(), file);
    const content = await fs.readFile(p, "utf8");
    return { content, file, ok: true, size: content.length };
  } catch (err: any) {
    return { error: String(err), file, ok: false };
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  const results: Record<string, any> = {};
  for (const r of REPORTS) {
    const res = await readReport(r);
    // simple heuristic: consider "ERROR" or "failed" as failure
    let status = "missing";
    if (res.ok) {
      const c = (res.content as string).toLowerCase();
      if (c.includes("error") || c.includes("failed") || c.includes("fail"))
        status = "failed";
      else status = "passed";
    }
    results[r] = { ...res, status };
  }

  const outPath = path.resolve(process.cwd(), "ci-summary.json");
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), "utf8");
  logger.info("Wrote", outPath);
}

// Entry
main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
