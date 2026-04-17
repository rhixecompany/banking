import { execSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

test("run-ci-checks.sh --dry-run produces ci-summary.json with DRY-RUN statuses", () => {
  const script = join(__dirname, "../../scripts/utils/run-ci-checks.sh");
  const tmpDir = join(__dirname, "../../tmp/test-runner-reports");
  try {
    execSync(`chmod +x ${script}`);
  } catch {
    // ignore on platforms where chmod is not available
  }
  // run the script in dry-run mode
  execSync(`${script} --dry-run --report-dir ${tmpDir}`, { stdio: "inherit" });
  const summary = join(tmpDir, "ci-summary.json");
  expect(existsSync(summary)).toBe(true);
  const content = readFileSync(summary, "utf8");
  expect(content).toContain("DRY-RUN");
});
