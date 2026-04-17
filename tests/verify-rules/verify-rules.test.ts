import fs from "fs";
import path from "path";
import { runChecks } from "../../scripts/verify-rules";

describe("verify-rules basic checks", () => {
  it("generates a report and respects allowlist", async () => {
    const out = path.join(
      process.cwd(),
      ".opencode/reports/test-rules-report.json",
    );
    const report = await runChecks({
      out,
      patterns: ["scripts/**/*.ts"],
      allowlist: ["scripts/**"],
    });
    expect(report).toBeDefined();
    expect(fs.existsSync(out)).toBe(true);
    // Ensure no critical issues when scripts are allowlisted
    const critical = report.results.some((r: any) => r.severity === "critical");
    expect(critical).toBe(false);
  });
});
