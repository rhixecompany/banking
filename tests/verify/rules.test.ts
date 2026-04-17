import fs from "fs";
import { runChecks } from "../../scripts/verify-rules";

test("verify-rules runs and emits report", async () => {
  const report = await runChecks({
    out: ".opencode/reports/rules-test-report.json",
  });
  expect(report).toHaveProperty("generatedAt");
  expect(report).toHaveProperty("results");
  const raw = fs.readFileSync(
    ".opencode/reports/rules-test-report.json",
    "utf8",
  );
  expect(raw.length).toBeGreaterThan(0);
});
