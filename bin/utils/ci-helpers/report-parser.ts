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
 * @interface ReportSummary
 * @typedef {ReportSummary}
 */
interface ReportSummary {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  file: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {boolean}
   */
  ok: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {("failed" | "missing" | "passed")}
   */
  status: "failed" | "missing" | "passed";
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?number}
   */
  size?: number;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string[]}
   */
  errors?: string[];
}

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
    return { content, file, ok: true, size: content.length } as any;
  } catch (err: any) {
    return { error: String(err), file, ok: false } as any;
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} content
 * @returns {{}}
 */
function analyzeContent(content: string) {
  const lower = content.toLowerCase();
  const errors: string[] = [];
  if (
    lower.includes("error") ||
    lower.includes("failed") ||
    lower.includes("fail")
  ) {
    // simple extract: collect lines that contain error/fail
    for (const l of content.split(/\r?\n/)) {
      const ll = l.toLowerCase();
      if (
        ll.includes("error") ||
        ll.includes("failed") ||
        ll.includes("fail")
      ) {
        errors.push(l.trim());
      }
    }
  }
  return errors;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function main() {
  const results: Record<string, ReportSummary> = {};
  for (const r of REPORTS) {
    const res: any = await readReport(r);
    const status: ReportSummary["status"] = "missing";
    const entry: ReportSummary = { file: r, ok: !!res.ok, status };
    if (res.ok) {
      const errors = analyzeContent(res.content as string);
      entry.size = res.size;
      entry.errors = errors;
      entry.status = errors.length > 0 ? "failed" : "passed";
    }
    results[r] = entry;
  }

  const out = path.resolve(process.cwd(), "ci-summary.json");
  await fs.writeFile(out, JSON.stringify(results, null, 2), "utf8");
  logger.info("Wrote parsed summary to", out);
}

main().catch((e) => {
  logger.error(e);
  process.exit(1);
});
