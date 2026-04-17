#!/usr/bin/env tsx
import { execa } from "execa";
import { existsSync, promises as fs } from "fs";
import os from "os";
import path from "path";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @param {string} cmd
 * @param {string[]} [args=[]]
 * @returns {*}
 */
async function runCmd(cmd: string, args: string[] = []) {
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
  console.log("CI helpers entry. --apply=" + apply);
  // 1. Run CI wrapper to generate reports. Use bash wrapper if available, otherwise run npm scripts individually.
  let hasBash = false;
  try {
    hasBash = os.platform() !== "win32" || existsSync("/bin/bash");
  } catch {
    hasBash = os.platform() !== "win32";
  }

  if (hasBash) {
    console.log("Running CI wrapper: npm run ci:checks:run (via bash)");
    try {
      await runCmd("npm", ["run", "ci:checks:run"]);
    } catch {
      console.warn("CI wrapper exited with non-zero (expected in some cases)");
    }
  } else {
    console.log(
      "/bin/bash not available or running on Windows — running npm scripts sequentially (conservative)",
    );
    const seq: [string, string[]][] = [
      ["npm", ["run", "format:markdown:check"]],
      ["npm", ["run", "format:check"]],
      ["npm", ["run", "type-check"]],
      // lint:fix is potentially mutating: only run when --apply is provided
      ...(apply
        ? ([["npm", ["run", "lint:fix"]]] as [string, string[]][])
        : []),
      ["npm", ["run", "lint:strict"]],
      ["npm", ["run", "build:debug"]],
      ["npm", ["run", "test:browser"]],
      // test:ui requires port checks and env; skip by default
    ];
    for (const [c, a] of seq) {
      try {
        console.log(`Running ${c} ${a.join(" ")}`);
        await runCmd(c, a);
      } catch {
        console.warn(`Command ${c} ${a.join(" ")} failed — continuing`);
      }
    }
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
