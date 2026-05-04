# Spec: skill-judge-targets

Scope: feature

# Feature Spec: Skill Judge & Enhance — Per-Skill Targets

## Overview

Defines acceptance criteria for all 23 local skills after judging with the skill-judge rubric (D1–D8, 120pts) and enhancement. This spec ensures consistency across parallel batch evaluation and provides clear "done" definition for each skill.

---

## Acceptance Criteria (per skill)

A skill is **DONE** when ALL of the following are true:

### Evaluation

- ✅ Evaluation report exists at `.opencode/reports/skill-evaluations/<skill-name>.md`
- ✅ Report contains D1–D8 dimension scores and reasoning
- ✅ Before/after scores recorded in master SCORECARD.md
- ✅ Grade determined (A, B, C, D, F)

### Quality Gates

- ✅ After-enhancement score ≥96/120 (grade B or above)
- ✅ Description in SKILL.md answers WHAT + WHEN + KEYWORDS
- ✅ NEVER list contains ≥3 specific items with non-obvious WHY reasoning
- ✅ Progressive disclosure: SKILL.md ≤500 lines (preferably ≤300)
- ✅ At least one thinking framework ("Before doing X, ask yourself…")
- ✅ Freedom calibration verified: constraint level matches task fragility

### File Changes

- ✅ SKILL.md modified in-place (no deletion, no renaming)
- ✅ Reference files in `skill/reference/` also enhanced if present
- ✅ No new files created outside `.opencode/reports/skill-evaluations/`

---

## Per-Batch Targets

### Batch 0 — Banking (Phase 0)

| Skill | Files | Min After-Score | Notes |
| --- | --- | --- | --- |
| banking | SKILL.md + validations.md + testing.md + dal-patterns.md | 100/120 | Critical domain skill; reference files also judged/enhanced |

### Batch 1 (Phase 1–2)

| Skill | Files | Min After-Score | Notes |
| --- | --- | --- | --- |
| asdf | SKILL.md only | 96/120 | Tutorial-heavy; expect D1 purge |
| caveman | SKILL.md only | 96/120 | Already high quality; refinement focus |
| caveman-commit | SKILL.md only | 96/120 | Tight, good quality |
| caveman-compress | SKILL.md only | 96/120 | Moderate refine |
| caveman-review | SKILL.md only | 96/120 | Moderate refine |
| code-docs | SKILL.md only | 96/120 | Good baseline |

### Batch 2 (Phase 3–4)

| Skill | Files | Min After-Score | Notes |
| --- | --- | --- | --- |
| content-research-writer | SKILL.md only | 96/120 | Flexible task; calibrate freedom high |
| datadog | SKILL.md only | 96/120 | Tool-heavy; ensure anti-pattern strength |
| file-organizer | SKILL.md only | 96/120 | **HIGH RISK**: ~90% generic file ops (D1 ~4/20) |
| glab | SKILL.md only | 96/120 | GitLab specifics; tool pattern |
| httpie | SKILL.md only | 96/120 | API testing; tool pattern |
| humanizer | SKILL.md only | 96/120 | Long (481 lines); may need progressive disclosure |

### Batch 3 (Phase 5–6)

| Skill | Files | Min After-Score | Notes |
| --- | --- | --- | --- |
| jira | SKILL.md only | 96/120 | Moderate refine |
| marp-slide | SKILL.md only | 96/120 | Creative task; high freedom |
| mcp-builder | SKILL.md only | 96/120 | 358 lines; Phase 1 section likely redundant |
| meeting-insights-analyzer | SKILL.md only | 96/120 | Moderate refine |
| mermaid-diagrams | SKILL.md only | 96/120 | Reference loading triggers need audit |
| project-docs | SKILL.md only | 96/120 | Documentation skill; moderate refine |

### Batch 4 (Phase 7–8)

| Skill | Files | Min After-Score | Notes |
| --- | --- | --- | --- |
| skill-judge | SKILL.md only | 96/120 | **META**: Evaluates itself; must maintain internal consistency |
| work-on-ticket | SKILL.md only | 96/120 | Jira/ticket workflow; tool pattern |
| worktrunk | SKILL.md only | 96/120 | Git worktree management; tool pattern |
| writing-clearly-and-concisely | SKILL.md only | 96/120 | 93 lines; high quality; fine-tune only |

---

## Known High-Risk Skills (estimated before enhancement)

| Skill | Risk | Reason | Expected D1–D3 Issues |
| --- | --- | --- | --- |
| file-organizer | 🔴 CRITICAL | ~435 lines; ~90% is "how to use basic OS features" (D1 ~4/20 before) | Massive redundancy purge needed; no anti-patterns |
| asdf | 🔴 CRITICAL | ~273 lines; tutorial/reference pattern; "When to Use" only in body (pattern violation) | D1 ~6/20; D4 trigger-placement issue; reference structure missing |
| banking | 🟡 HIGH | ~287 lines + 3 refs; vague loading triggers; NEVER list absent; reference file connections unclear | D3 ~5/15; D5 (progressive disclosure) issues; reference loading triggers |
| humanizer | 🟡 HIGH | 481 lines; very long; D1 strong but needs trimming; AI-pattern detection is good | D5 progressive disclosure; line count |
| mcp-builder | 🟡 HIGH | 358 lines; Phase 1 section (~100 lines) may be redundant; process pattern needs tightening | D1 Phase 1 tutorial; D2 procedure ordering |
| mermaid-diagrams | 🟠 MEDIUM | Large skill; reference loading triggers may need audit | D5 progressive disclosure triggers |

---

## Report Format & Location

Each skill report: `.opencode/reports/skill-evaluations/<skill-name>.md`

**Required sections:**

```markdown
# Skill Evaluation: [name]

## Summary

- **Before Score**: X/120 (X%)
- **After Score**: Y/120 (Y%)
- **Delta**: +Z
- **Grade**: [A/B/C/D/F]
- **Pattern**: [Mindset/Navigation/Philosophy/Process/Tool]
- **Lines Before**: X → **Lines After**: Y
- **Verdict**: [one sentence on overall quality change]

## Dimension Scores (Before → After)

| D#  | Dimension              | Before | After | Max | Notes        |
| --- | ---------------------- | ------ | ----- | --- | ------------ |
| 1   | Knowledge Delta        | X/20   | Y/20  | 20  | [brief note] |
| 2   | Mindset + Procedures   | X/15   | Y/15  | 15  |              |
| 3   | Anti-Pattern Quality   | X/15   | Y/15  | 15  |              |
| 4   | Description Quality    | X/15   | Y/15  | 15  |              |
| 5   | Progressive Disclosure | X/15   | Y/15  | 15  |              |
| 6   | Freedom Calibration    | X/15   | Y/15  | 15  |              |
| 7   | Pattern Recognition    | X/10   | Y/10  | 10  |              |
| 8   | Practical Usability    | X/15   | Y/15  | 15  |              |

## Critical Issues Found

[List before enhancement, ordered by impact]

## Enhancement Actions Taken

[Specific changes made and why, per dimension]

## Files Modified

- SKILL.md (lines X → Y; deletions/additions summary)
- [reference file if applicable]
```

**Master scorecard:** `.opencode/reports/skill-evaluations/SCORECARD.md`

```markdown
# Skill Enhancement Scorecard

| Skill              | Before | After  | Delta | Grade | Pattern |
| ------------------ | ------ | ------ | ----- | ----- | ------- |
| banking            | X/120  | Y/120  | +Z    | A/B   | Process |
| [all 23 skills...] |        |        |       |       |         |
| **TOTAL**          | X/2760 | Y/2760 | +Z    |       |         |
| **AVERAGE**        | X/120  | Y/120  | +Z    |       |         |

## Grade Distribution

| Grade       | Count Before | Count After |
| ----------- | ------------ | ----------- |
| A (109–120) | X            | Y           |
| B (96–108)  | X            | Y           |
| C (81–95)   | X            | Y           |
| D (66–80)   | X            | Y           |
| F (<66)     | X            | Y           |

## Batch Summaries

### Batch 0 (Banking)

- Banking + 3 refs: Y/120 (A)

### Batch 1 (6 skills)

- Total: Y/720; Average: Y/120
- All ≥96? [YES/NO]

### Batch 2 (6 skills)

- Total: Y/720; Average: Y/120
- All ≥96? [YES/NO]

### Batch 3 (6 skills)

- Total: Y/720; Average: Y/120
- All ≥96? [YES/NO]

### Batch 4 (4 skills)

- Total: Y/480; Average: Y/120
- All ≥96? [YES/NO]

## Meta-Notes

- [Any patterns observed across batches]
- [Reference file enhancements summary if applicable]
- [skill-judge self-evaluation result]
```

---

## Execution Constraints

1. **Batch execution**: Judge all 6 skills in a batch in **parallel** via subagents; enhance all 6 in **parallel**.
2. **Sequential gate**: Do not begin Batch N+1 until Batch N is 100% complete (all reports written, all files enhanced).
3. **Reference file handling**: If a skill has `skill/reference/` files, evaluate them as part of the skill's score (not separately), but enhance them in-place alongside SKILL.md.
4. **skill-judge meta-rule**: The skill-judge evaluation must verify it passes its own rubric; if it scores <96/120 by its own rules, it must be revised.
5. **No threshold culling**: All 23 skills must be enhanced regardless of before-score.
6. **Format & verify**: After all enhancements complete, run `bun run format && bun run verify:rules` to ensure no policy violations.

---

## Sign-Off

Plan is **READY FOR EXECUTION** when:

- ✅ This FEATURE spec is linked to plan `skill-judge-enhance`
- ✅ REPO spec `skill-quality-standards` is linked
- ✅ All 10 REPO-scope specs are appended (sequential)
- ✅ Report directory `.opencode/reports/skill-evaluations/` exists
- ✅ skill-judge rubric (D1–D8) is accessible and understood
