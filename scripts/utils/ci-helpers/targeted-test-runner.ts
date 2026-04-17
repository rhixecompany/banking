#!/usr/bin/env tsx
import { execa } from "execa";
import { promises as fs } from "fs";
import path from "path";

// Heuristic runner: parse test-browser-report.txt for failing test file paths
// and re-run them with vitest. Dry-run by default; pass --apply to execute.

const REPORT = "test-browser-report.txt";

function extractFilesFromReport(content: string): string[] {
  const files = new Set<string>();
  const lines = content.split(/\r?\n/);
  for (const l of lines) {
    // common vitest/jest style: "FAIL path/to/file.test.ts" or "at path/to/file.test.ts"
    const m = l.match(/FAIL\s+(.+\.(test|spec)\.(ts|tsx|js|jsx))/i);
    if (m) files.add(m[1]);
    // fallback: lines that look like file path with .test.
    const m2 = l.match(/(tests?\/.*\.(test|spec)\.(ts|tsx|js|jsx))/i);
    if (m2) files.add(m2[1]);
  }
  return Array.from(files);
}

async function runVitestOnFiles(files: string[], apply: boolean) {
  if (files.length === 0) {
    console.log("No failing test files detected in report.");
    return;
  }
  console.log("Targeted test files:", files);
  const cmd = "npx";
  const args = ["vitest", "--config=vitest.config.ts", "run", ...files];
  if (!apply) {
    console.log("Dry-run: would run:", `${cmd} ${args.join(" ")}`);
    return;
  }

  const p = execa(cmd, args, { shell: true, stdio: "inherit" });
  await p;
}

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
    console.warn(`Could not read ${REPORT}:`, err.message || String(err));
    console.log(
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
  console.error(e);
  process.exit(1);
});
