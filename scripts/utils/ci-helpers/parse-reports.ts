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

async function readReport(file: string) {
  try {
    const p = path.resolve(process.cwd(), file);
    const content = await fs.readFile(p, "utf8");
    return { file, ok: true, size: content.length, content };
  } catch (err: any) {
    return { file, ok: false, error: String(err) };
  }
}

async function main() {
  const results: Record<string, any> = {};
  for (const r of REPORTS) {
    // eslint-disable-next-line no-await-in-loop
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
  console.log("Wrote", outPath);
}

// Entry
main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
