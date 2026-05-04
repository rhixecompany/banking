# Skill Evaluation Report: caveman

## Summary

- **Total Score**: 97/120 (80.8%)
- **Grade**: B
- **Pattern**: Philosophy (two-step: Philosophy → Express)
- **Knowledge Ratio**: E:A:R = 60:30:10
- **Verdict**: Strong Skill with genuine compression framework. Minor gaps in anti-pattern explicitness and trigger scenarios prevent A grade.

## Dimension Scores

| Dimension | Score | Max | Notes |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 16 | 20 | Strong framework with 6 intensity levels |
| D2: Mindset vs Mechanics | 11 | 15 | Mindset-focused, no domain procedures needed |
| D3: Anti-Pattern Quality | 10 | 15 | Implicit anti-patterns, no explicit NEVER list |
| D4: Specification Compliance | 12 | 15 | Good description, could be more explicit on triggers |
| D5: Progressive Disclosure | 14 | 15 | Appropriately concise, self-contained |
| D6: Freedom Calibration | 13 | 15 | Good for communication style |
| D7: Pattern Recognition | 9 | 10 | Clear Philosophy pattern |
| D8: Practical Usability | 12 | 15 | Good examples and intensity guidance |

## Critical Issues

### Issue 1: Missing Explicit NEVER List with WHY Reasoning (D3) — Medium Impact

**Problem**: Skill has implicit anti-patterns but no explicit NEVER list with non-obvious reasons.

**Evidence**:

- Line 17: "No revert after many turns" — implicit rule
- Line 70: "Drop caveman for: security warnings..." — operational guidance but no "NEVER" framing with reasoning

**Impact**: Expert anti-patterns should explain WHY, not just WHAT to avoid. For example: "NEVER drop caveman mid-error message because users need full context to debug."

**Fix**: Add explicit NEVER list section:

```markdown
## NEVER Do

- NEVER drop caveman mid-error message → users lose debugging context
- NEVER compress security warnings → precision critical
- NEVER use ultra in formal documentation → readability damage
```

### Issue 2: Description Lacks Explicit Trigger Scenarios (D4) — Low Impact

**Problem**: Description has keywords but could include more explicit WHEN scenarios.

**Evidence**:

- Current: "Supports 6 intensity levels... Use when user says 'caveman mode', 'talk like caveman'..."
- Missing: explicit scenarios like "Use when token budget is critical" or "Triggered by /caveman lite|full|ultra"

**Impact**: Agent might not always recognize when to activate.

**Fix**: Expand description with more trigger scenarios.

## Top 3 Improvements

1. **Add explicit NEVER list with non-obvious reasons** — Current implicit rules should become explicit anti-patterns with WHY explanations
2. **Expand description with more explicit trigger scenarios** — More WHEN keywords would improve activation
3. **Add wenyan-specific examples** — Classical Chinese compression examples would enhance the wenyan levels

## Detailed Analysis

### D1: Knowledge Delta (16/20)

**What works**: The 6-level intensity framework (lite, full, ultra, wenyan-lite, wenyan-full, wenyan-ultra) is genuine expert knowledge. The situational guidance table (lines 40-49) provides non-obvious decision guidance. Auto-clarity rules (when to drop caveman) prevent misapplication.

**What's borderline**: Token economy explanation (lines 9-13) provides useful framing but could be activation content.

**Verdict**: Strong E:A:R ratio (~60:30:10), mostly expert content.

### D3: Anti-Pattern Quality (10/15)

The skill has operational boundaries but lacks explicit "NEVER" statements with reasoning. Expert anti-patterns should include non-obvious reasons that come from experience. For example: "NEVER compress financial calculations" with the reason being that precision matters more than brevity.

**What exists**: Implicit anti-patterns (drop caveman for security, irreversible actions) **What's missing**: Explicit NEVER list with WHY explanations

### D4: Specification Compliance (12/15)

**Frontmatter**: Valid YAML with name "caveman" (lowercase, <64 chars)

**Description quality**:

- WHAT: "Ultra-compressed communication mode"
- WHEN: Lists trigger keywords ("caveman mode", "less tokens", "be brief")
- Could improve: More explicit trigger scenarios for better activation

## Recommendation

**Status**: APPROVED FOR PRODUCTION (Grade B)

This is a well-designed Skill with genuine expert knowledge in its intensity framework. The three improvements would raise score to 104-107/120 (A grade). The skill is ready for use as-is.
