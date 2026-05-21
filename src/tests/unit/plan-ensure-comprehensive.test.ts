/* eslint-disable security/detect-non-literal-fs-filename -- Test file with safe temp paths */
import fs from "fs";
import path from "path";
import { readPlanFile, scoreCandidate } from "scripts/plan-ensure";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("plan-ensure: scoreCandidate", () => {
  it("returns 0 when no files match", () => {
    const changed = ["api/route.ts", "lib/utils.ts"];
    const cand: any = {
      goals: "",
      targetFiles: ["app/dashboard"],
      title: "Dashboard",
    };

    const score = scoreCandidate(changed, cand);
    expect(score).toBe(0);
  });

  it("returns positive score for prefix match on targetFiles", () => {
    const changed = ["app/dashboard/page.tsx", "app/dashboard/layout.tsx"];
    const cand: any = {
      goals: "",
      targetFiles: ["app/dashboard"],
      title: "Dashboard",
    };

    const score = scoreCandidate(changed, cand);
    expect(score).toBeGreaterThan(0);
  });

  it("scores higher with more matching files", () => {
    const changed = [
      "app/dashboard/page.tsx",
      "app/dashboard/layout.tsx",
      "components/DashboardCard.tsx",
      "lib/dashboard-utils.ts",
    ];
    const cand: any = {
      goals: "",
      targetFiles: ["app/dashboard", "components", "lib"],
      title: "Dashboard Overhaul",
    };

    const score = scoreCandidate(changed, cand);
    expect(score).toBeGreaterThan(0.5); // More matches = higher score
  });

  it("returns normalized score between 0 and 1", () => {
    const changed = ["app/foo.ts", "app/bar.ts"];
    const cand: any = {
      goals: "",
      targetFiles: ["app"],
      title: "Test",
    };

    const score = scoreCandidate(changed, cand);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it("treats targetFiles as optional", () => {
    const changed = ["src/index.ts"];
    const cand: any = {
      goals: "",
      title: "No target files",
    };

    const score = scoreCandidate(changed, cand);
    expect(typeof score).toBe("number");
  });

  it("handles empty changed files array", () => {
    const changed: string[] = [];
    const cand: any = {
      goals: "",
      targetFiles: ["app/dashboard"],
      title: "Dashboard",
    };

    const score = scoreCandidate(changed, cand);
    expect(score).toBe(0);
  });

  it("handles empty targetFiles array", () => {
    const changed = ["app/page.tsx"];
    const cand: any = {
      goals: "",
      targetFiles: [],
      title: "Empty targets",
    };

    const score = scoreCandidate(changed, cand);
    expect(score).toBe(0);
  });

  it("performs case-sensitive prefix matching", () => {
    const changed = ["App/Dashboard.tsx"]; // Capital letters
    const cand: any = {
      goals: "",
      targetFiles: ["app/dashboard"], // lowercase
      title: "Case test",
    };

    const score = scoreCandidate(changed, cand);
    // Should be 0 because case doesn't match
    expect(score).toBe(0);
  });

  it("matches partial path prefixes", () => {
    const changed = ["components/ui/Button.tsx", "components/ui/Modal.tsx"];
    const cand: any = {
      goals: "",
      targetFiles: ["components/ui"],
      title: "UI Components",
    };

    const score = scoreCandidate(changed, cand);
    expect(score).toBeGreaterThan(0.3); // Path prefix match gives 0.35 per file
  });

  it("handles candidates without title or goals", () => {
    const changed = ["app/page.tsx"];
    const cand: any = {
      targetFiles: ["app"],
    };

    const score = scoreCandidate(changed, cand);
    expect(typeof score).toBe("number");
  });
});

describe("plan-ensure: readPlanFile", () => {
  let testDir: string;
  let testPlanFile: string;

  beforeAll(() => {
    // Create temporary test directory
    testDir = path.join("/tmp", `plan-ensure-test-${Date.now()}`);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    testPlanFile = path.join(testDir, "test.plan.md");
  });

  afterAll(() => {
    // Cleanup
    if (fs.existsSync(testPlanFile)) {
      fs.unlinkSync(testPlanFile);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
  });

  it("parses plan title from frontmatter", () => {
    const content = `# test-plan

## Goals
Test description`;

    fs.writeFileSync(testPlanFile, content, "utf-8");

    const result = readPlanFile(testPlanFile);

    expect(result.title).toBe("test-plan");
  });

  it("parses plan description from frontmatter", () => {
    const content = `# test-plan

## Goals
This is a test description`;

    fs.writeFileSync(testPlanFile, content, "utf-8");

    const result = readPlanFile(testPlanFile);

    expect(result.goals).toContain("This is a test description");
  });

  it("parses targetFiles from ## Required Specs section", () => {
    const content = `# test-plan

## Goals
Description

Target Files: auth-spec, wallet-spec, dashboard-spec

## Required Specs
- auth-spec
- wallet-spec
- dashboard-spec`;

    fs.writeFileSync(testPlanFile, content, "utf-8");

    const result = readPlanFile(testPlanFile);

    expect(result.targetFiles).toBeDefined();
    expect(Array.isArray(result.targetFiles)).toBe(true);
    expect(result.targetFiles?.length).toBeGreaterThan(0);
  });

  it("returns undefined for missing plan name", () => {
    const content = `## Goals
Content without a title`;

    fs.writeFileSync(testPlanFile, content, "utf-8");

    const result = readPlanFile(testPlanFile);

    // Should still parse but title will be undefined
    expect(result.title).toBeUndefined();
  });

  it("handles file not found gracefully", () => {
    const nonexistentPath = path.join(testDir, "nonexistent.plan.md");

    expect(() => {
      readPlanFile(nonexistentPath);
    }).toThrow();
  });

  it("parses empty file", () => {
    const emptyContent = "";

    fs.writeFileSync(testPlanFile, emptyContent, "utf-8");

    const result = readPlanFile(testPlanFile);

    expect(result).toBeDefined();
  });

  it("handles malformed YAML frontmatter", () => {
    const content = `---
plan name: test-plan
  invalid yaml:   [
plan status: active
---

## Idea
Content`;

    fs.writeFileSync(testPlanFile, content, "utf-8");

    // Should handle malformed YAML gracefully
    expect(() => {
      readPlanFile(testPlanFile);
    }).not.toThrow();
  });

  it("extracts metadata from well-formed plan file", () => {
    const content = `# comprehensive-test

Target Files: src/components, tests/unit, lib

## Goals
Comprehensive test plan with multiple scenarios

## Implementation
Multiple steps here

## Required Specs
- spec1
- spec2
- spec3`;

    fs.writeFileSync(testPlanFile, content, "utf-8");

    const result = readPlanFile(testPlanFile);

    expect(result.title).toBe("comprehensive-test");
    expect(result.goals).toContain("Comprehensive test plan");
    expect(result.targetFiles?.length).toBeGreaterThan(0);
    expect(result.targetFiles).toContain("src/components");
  });

  it("handles files with UTF-8 BOM", () => {
    const content = `---
plan name: bom-test
plan description: Testing BOM handling
plan status: active
---

## Idea
Content`;

    // Write with BOM
    fs.writeFileSync(testPlanFile, "\ufeff" + content, "utf-8");

    const result = readPlanFile(testPlanFile);

    expect(result).toBeDefined();
  });

  it("parses multiline descriptions", () => {
    const content = `---
plan name: multiline-plan
plan description: This is a description
  that spans multiple
  lines in YAML
plan status: active
---

## Idea
Multiline content`;

    fs.writeFileSync(testPlanFile, content, "utf-8");

    const result = readPlanFile(testPlanFile);

    expect(result).toBeDefined();
  });
});

// Integration-style tests for both functions together
describe("plan-ensure: integration", () => {
  let testDir: string;
  let testPlanFile: string;

  beforeAll(() => {
    testDir = path.join("/tmp", `plan-ensure-integration-${Date.now()}`);
    if (!fs.existsSync(testDir)) {
      fs.mkdirSync(testDir, { recursive: true });
    }
    testPlanFile = path.join(testDir, "integration.plan.md");
  });

  afterAll(() => {
    if (fs.existsSync(testPlanFile)) {
      fs.unlinkSync(testPlanFile);
    }
    if (fs.existsSync(testDir)) {
      fs.rmdirSync(testDir);
    }
  });

  it("reads plan file and scores it against changed files", () => {
    const planContent = `---
plan name: wallet-feature
plan description: Add wallet feature
plan status: active
---

## Idea
Add wallet linking and management

## Required Specs
- wallet-spec`;

    fs.writeFileSync(testPlanFile, planContent, "utf-8");

    const plan = readPlanFile(testPlanFile);
    const changedFiles = [
      "dal/wallet.dal.ts",
      "components/WalletCard.tsx",
      "actions/wallet.actions.ts",
    ];

    // Create a candidate object from the plan
    const candidate: any = {
      goals: plan.goals,
      targetFiles: plan.targetFiles,
      title: plan.title,
    };

    const score = scoreCandidate(changedFiles, candidate);

    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });
});
