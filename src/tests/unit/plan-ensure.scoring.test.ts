import { scoreCandidate } from "scripts/plan-ensure";
import { describe, expect, it } from "vitest";

// Core scoring unit tests — validates that scoreCandidate function
// correctly evaluates plan candidates against changed files.

describe("plan-ensure scoring", () => {
  it("gives higher score for matching targetFiles", () => {
    const changed = ["app/dashboard/page.tsx", "components/foo.tsx"];
    const cand: any = {
      goals: "Refactor dashboard",
      targetFiles: ["app/dashboard"],
      title: "Dashboard refactor",
    };
    const s = scoreCandidate(changed, cand);
    expect(s).toBeGreaterThan(0);
  });

  it("returns zero score when no files match targetFiles", () => {
    const changed = ["lib/utils.ts", "types/index.ts"];
    const cand: any = {
      goals: "Refactor dashboard",
      targetFiles: ["app/dashboard"],
      title: "Dashboard refactor",
    };
    const s = scoreCandidate(changed, cand);
    expect(s).toBe(0);
  });

  it("handles multiple target files", () => {
    const changed = [
      "app/dashboard/page.tsx",
      "components/Header.tsx",
      "lib/auth.ts",
    ];
    const cand: any = {
      goals: "Refactor multiple areas",
      targetFiles: ["app/dashboard", "components", "lib"],
      title: "Major refactor",
    };
    const s = scoreCandidate(changed, cand);
    expect(s).toBeGreaterThan(0.5);
  });

  it("returns normalized score between 0 and 1", () => {
    const changed = ["app/page.tsx"];
    const cand: any = {
      goals: "Add feature",
      targetFiles: ["app"],
      title: "App feature",
    };
    const s = scoreCandidate(changed, cand);
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(1);
  });
});
