#!/usr/bin/env tsx
import { promises as fs } from "fs";
import path from "path";

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

interface ReportSummary {
  file: string;
  ok: boolean;
  status: "failed" | "missing" | "passed";
  size?: number;
  errors?: string[];
}

async function readReport(file: string) {
  try {
    const p = path.resolve(process.cwd(), file);
    const content = await fs.readFile(p, "utf8");
    return { content, file, ok: true, size: content.length } as any;
  } catch (err: any) {
    return { error: String(err), file, ok: false } as any;
  }
}

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
  console.log("Wrote parsed summary to", out);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
