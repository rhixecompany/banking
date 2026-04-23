import { spawnSync } from "child_process";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

test("run-ci-checks.ps1 -DryRun produces ci-summary.json when pwsh available", () => {
  // Check if pwsh is available
  const which = spawnSync(
    "pwsh",
    ["-NoProfile", "-Command", "$PSVersionTable.PSVersion"],
    { shell: false },
  );
  if (which.error) {
    // Skip test if pwsh is not available in environment
    // eslint-disable-next-line no-console
    console.warn("pwsh not available; skipping PowerShell runner dry-run test");
    return;
  }

  const script = join(__dirname, "../../scripts/utils/run-ci-checks.ps1");
  const tmpDir = join(__dirname, "../../tmp/ps-reports");
  // Run the PowerShell script in dry-run mode
  const res = spawnSync(
    "pwsh",
    ["-NoProfile", "-File", script, "-DryRun", "-ReportDir", tmpDir],
    { stdio: "inherit" },
  );
  expect(res.status === 0 || res.status === null).toBeTruthy();
  const summary = join(tmpDir, "ci-summary.json");
  expect(existsSync(summary)).toBe(true);
  const content = readFileSync(summary, "utf8");
  expect(content).toContain("DRY-RUN");
});
