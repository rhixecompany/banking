#!/usr/bin/env tsx
import { execa } from "execa";
import { promises as fs } from "fs";
import path from "path";

async function runCmd(cmd: string, args: string[] = []) {
  const p = execa(cmd, args, { stdio: "inherit", shell: true });
  await p;
}

async function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  console.log("CI helpers entry. --apply=" + apply);

  // 1. Run CI wrapper to generate reports
  console.log("Running CI wrapper: npm run ci:checks:run");
  try {
    await runCmd("npm", ["run", "ci:checks:run"]);
  } catch (e) {
    console.warn("CI wrapper exited with non-zero (expected in some cases)");
  }

  // 2. Parse reports
  const parseScript = path.resolve(
    process.cwd(),
    "scripts/utils/ci-helpers/parse-reports.ts",
  );
  await runCmd("npx", ["tsx", parseScript]);

  const summary = JSON.parse(
    await fs.readFile(path.resolve(process.cwd(), "ci-summary.json"), "utf8"),
  );
  console.log("Summary:");
  for (const k of Object.keys(summary)) {
    const s = summary[k];
    console.log(k, s.status, s.ok ? `size=${s.size}` : s.error);
  }

  // simple next step: if lint failed and --apply provided, run eslint --fix
  const lintReport = summary["lint-fix-report.txt"];
  const lintStrict = summary["lint-strict-report.txt"];
  if (
    apply &&
    (lintReport?.status === "failed" || lintStrict?.status === "failed")
  ) {
    console.log("Running eslint --fix (apply=true)");
    await runCmd("npm", ["run", "lint:fix"]);
    console.log("Re-running CI wrapper to update reports");
    try {
      await runCmd("npm", ["run", "ci:checks:run"]);
    } catch {}
    await runCmd("npx", ["tsx", parseScript]);
  }

  console.log("Done. Inspect ci-summary.json for details.");
}

// Entry
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
