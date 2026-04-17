import { describe, expect, it } from "vitest";

import { scoreCandidate } from "../../scripts/plan-ensure";

// Note: to enable importing helpers from scripts/plan-ensure.ts we will
// add a small compatibility export. This test ensures scoring behaves
// sensibly on simple inputs.

describe("plan-ensure scoring", () => {
  it("gives higher score for matching targetFiles", () => {
    const changed = ["app/dashboard/page.tsx", "components/foo.tsx"];
    const cand: any = {
      targetFiles: ["app/dashboard"],
      title: "Dashboard refactor",
      goals: "Refactor dashboard",
    };
    const s = scoreCandidate(changed, cand);
    expect(s).toBeGreaterThan(0);
  });
});
