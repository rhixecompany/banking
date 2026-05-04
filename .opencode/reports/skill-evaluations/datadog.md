# Skill Evaluation Report: datadog

## Summary

- **Total Score**: 71/120 (59%)
- **Grade**: D (Below Average)
- **Pattern**: Tool (Decision trees for specific observability queries)
- **Knowledge Ratio**: E:A:R ≈ 30:40:30
- **Verdict**: Reference documentation masquerading as a Skill. Lacks expert knowledge delta, anti-patterns, and domain-specific thinking frameworks. Functions as CLI manual, not expertise transfer.

---

## Dimension Scores

| Dimension | Score | Max | Notes |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 8 | 20 | 40% redundancy; explains basics Claude knows |
| D2: Mindset vs Mechanics | 5 | 15 | Only mechanical procedures; no thinking frameworks |
| D3: Anti-Pattern Quality | 4 | 15 | Zero anti-patterns; no NEVER list |
| D4: Specification Compliance | 11 | 15 | Valid frontmatter but description lacks specificity |
| D5: Progressive Disclosure | 12 | 15 | Good structure with reference directory, but no loading triggers |
| D6: Freedom Calibration | 10 | 15 | Procedural lock-down appropriate but somewhat rigid |
| D7: Pattern Recognition | 11 | 10 | **BONUS**: Follows Tool pattern reasonably well |
| D8: Practical Usability | 10 | 15 | Usable CLI reference but lacks decision guidance for when to use each command |

---

## Critical Issues

### 1. **Zero Knowledge Delta vs Claude's Built-in Datadog Understanding** (D1 - BLOCKING)

The Skill reads as a **CLI reference manual**, not expertise transfer.

**Evidence**:

- "Log Search" section simply lists the command syntax and examples — Claude already knows how to translate "search logs" to CLI invocation
- "Live Tail" section: "Stream logs as they arrive. Press Ctrl+C to stop." — This is basic process knowledge, not observability expertise
- "Metrics Query" section copies the official CLI help text without domain insight

**What's missing**:

- When should you use `logs search` vs `logs patterns`? (decision tree)
- When is `live tail` appropriate vs setting up alerts? (trade-off)
- How do you avoid alert fatigue with Datadog? (expert knowledge)
- What are common query mistakes that lead to missing errors? (anti-pattern)

**Delta**: Claude knows "how to type the command" but lacks "when/why to use it" and "what mistakes to avoid."

---

### 2. **No Anti-Patterns — The NEVER List is Empty** (D3 - CRITICAL)

Observability has well-known failure modes that experts internalize. This Skill captures **none** of them.

**Missing anti-patterns**:

- NEVER use overly broad queries (`*`) in production — leads to query timeout
- NEVER set `--limit` to a small number and assume you have all errors — distributed systems hide minority errors
- NEVER correlate logs without checking trace IDs — can match unrelated requests by timestamp
- NEVER create alerts on raw metrics without baseline — leads to alert fatigue
- NEVER use `metrics query` without understanding aggregation — `avg` can hide spikes
- NEVER rely on log patterns alone for RCA — logs can be missing during failures

These aren't in the Skill. They should be.

---

### 3. **Mechanical Procedures Without Thinking Frameworks** (D2 - MAJOR)

The Skill is all "how to run the command" with no "how to think about the problem."

**What's there** (mechanical):

```
Step 1: Run this command
Step 2: Interpret the output
Step 3: Do next thing
```

**What's missing** (thinking framework):

```
Before troubleshooting, ask yourself:
- Is this a NEW issue or REGRESSION?
  - If new: Check recent deployments, config changes
  - If regression: Compare error signature to baseline
- Scope: Is it ALL users or a SEGMENT?
  - If segment: Check for geographic, browser, or user-group patterns
```

The Skill provides no **mental model** for incident investigation. It's just command reference.

---

### 4. **Description Lacks Specificity and Trigger Scenarios** (D4 - MODERATE)

Current description:

```
"Use this skill when you need to search Datadog logs, query metrics, tail logs
in real-time, trace distributed requests, investigate errors, compare time periods,
find log patterns, check service health, or export observability data."
```

Problems:

- Lists capabilities but no **WHEN** scenarios
- No explicit trigger phrases ("Use when user says...")
- Generic "investigate errors" — which errors? All types? Or specific kinds?
- No distinction between "optional" uses and "mandatory" uses

**Should be**:

```
Datadog observability for debugging and incident triage. Use when:
- Investigating production errors or anomalies
- Comparing error rates across time periods
- Tracing distributed requests via trace IDs
- Checking service health during incidents
- Analyzing log patterns to find root cause

Trigger phrases: "check Datadog", "search logs", "tail errors", "what's the error rate",
"compare error trends", "is service X healthy", "trace this request"
```

---

### 5. **No Loading Triggers for reference/installation.md** (D5 - MODERATE)

The `reference/installation.md` file exists but is **never loaded**.

**Problem**: Agent doesn't know this file exists or when to read it.

**Should have**:

```markdown
## Before You Start

MANDATORY: Before running any commands, you MUST have:

- DD_API_KEY and DD_APP_KEY environment variables set
- bunx @ctdio/datadog-cli installed

**MANDATORY - READ ENTIRE FILE**: Reference [`installation.md`](reference/installation.md) for setup instructions. Read completely; do not skip.
```

Currently, the file is orphaned. Agent may not know it exists.

---

## Top 3 Improvements

### 1. **Add Expert Thinking Frameworks (D2 Boost: 5→12 points)**

Insert decision trees for common incident investigation scenarios:

```markdown
## Investigation Workflow

### Step 1: Establish Baseline

Before diving into logs, ask yourself:

- **Scope**: Is this affecting all users or a segment?
  - All users → Likely infrastructure/deployment issue
  - Segment → Check user attributes (region, browser, app version)
- **Timing**: When did it start?
  - Check for recent deployments
  - Check for config changes
  - Compare to 24h ago / 7d ago

### Step 2: Search Strategy

Choose based on what you know:

| If you have... | Use this command | Why |
| --- | --- | --- |
| Error message | `datadog logs search --query "error_message" --from 1h"` | Exact match finds all instances |
| Trace ID | `datadog logs trace --id "..."` | Follow request through all services |
| Service name | `datadog logs agg --query "service:X" --facet status` | See error distribution |
| Time window only | `datadog logs patterns --from 1h` | Find common signatures |
```

---

### 2. **Add Comprehensive Anti-Patterns NEVER List (D3 Boost: 4→13 points)**

```markdown
## Anti-Patterns: NEVER Do These

- **NEVER use overly broad queries** (`service:*`, `*`): Query timeout in large environments. Narrow with status/error filters first.

- **NEVER assume `--limit 100` gives you "all errors"**: Distributed systems can have thousands of errors per minute. Use `logs agg` for counts first.

- **NEVER correlate logs by timestamp alone**: Logs from different services can collide. Always cross-check with trace IDs or service names.

- **NEVER alert on raw metrics**: Raw `avg:cpu` without baseline triggers false positives. Use percentage-of-normal or anomaly detection.

- **NEVER skip checking trace context**: Single error log is useless; you need the full distributed trace. Always follow with `--trace-id`.

- **NEVER trust log patterns as RCA**: Patterns show signatures, not root cause. Use patterns to identify "which logs to investigate," not "what failed."

- **NEVER set query FROM to future time**: Common mistake: `--from 1h` runs right now; if you ran 5m ago, historical logs don't include newest 5 minutes. Use absolute timestamps for precise RCA.
```

---

### 3. **Improve Description and Add Explicit Triggers (D4 Boost: 11→15 points)**

```yaml
name: datadog
description: "Datadog observability for debugging and incident triage.
Use when investigating production errors, tracing distributed requests,
comparing error trends, or checking service health. Covers log search,
metrics queries, error patterns, and real-time log tailing. Trigger phrases:
'check Datadog', 'search logs', 'what errors happened', 'compare error rates',
'is service X healthy', 'tail errors', 'trace this request ID',
'find log patterns', 'what's the error distribution'."
```

---

## Detailed Analysis

### D1: Knowledge Delta (Score: 8/20)

**The Core Problem**: This is a CLI reference masquerading as expertise.

**What's Redundant (~30% of content)**:

- Command syntax (Claude can infer from flag names)
- Basic concepts like "status:error" filters
- Explanation of `--from`, `--to`, `--limit` (standard CLI patterns)

**What's Activation (~40% of content)**:

- Specific Datadog query syntax (useful reminder)
- Which facets exist (`@http.status_code`, `@trace_id`)
- Tool examples that are correct

**What's Expert (~30% of content)**:

- Decision trees for when to use each command — partially missing
- Anti-patterns and edge cases — missing entirely
- Trade-off guidance (e.g., "search is precise but slow; patterns are fuzzy but fast")

**Verdict**: Reads like a copy-paste of tool documentation, not compressed expert knowledge. An expert debugging engineer would contribute incident investigation frameworks, common gotchas, and thinking processes — none of which appear here.

---

### D2: Mindset vs Mechanics (Score: 5/15)

**What's Present** (mechanical):

- Command syntax
- Flag parameters
- Output interpretation

**What's Missing** (thinking):

- "Before investigating, ask yourself..."
- Decision trees (when to choose logs vs metrics vs patterns)
- Mental models (how to think about distributed systems)
- Debugging philosophy

**Example of Missing Mindset**:

```
GOOD: "Before running any search, determine: (1) Do I know what to search for?
       If no, run patterns first. (2) Is this a single-service or multi-service issue?
       If multi-service, you need trace IDs, not just logs."

MISSING: Just lists commands without conditional thinking.
```

---

### D3: Anti-Pattern Quality (Score: 4/15)

**Current State**: Zero anti-patterns.

The Skill has **no NEVER list**.

**Why this is critical for Datadog**: Observability has landmines:

- Query timeouts when searching too broadly
- Alert fatigue from improper baselines
- False correlations from timestamp matching
- Silent data loss when limits are too small

An expert Datadog user knows these from painful experience. The Skill doesn't capture them.

---

### D4: Specification Compliance (Score: 11/15)

**Strengths**:

- Valid YAML frontmatter
- Name is lowercase, alphanumeric
- Description exists and is somewhat useful

**Weaknesses**:

- Description is list of capabilities without WHEN scenarios
- No trigger keywords for "what should activate this?"
- Generic language ("investigate errors" — which errors?)

**Example Fix**:

```yaml
# BAD (current)
"Use this skill when you need to search Datadog logs..."

# GOOD
"Use when investigating production issues, tracing requests, or analyzing error patterns.
Triggers: 'check Datadog', 'why is error rate high', 'trace this request',
'is service healthy', 'compare error trends over time'"
```

---

### D5: Progressive Disclosure (Score: 12/15)

**What Works**:

- SKILL.md is ~450 lines (reasonable)
- Has separate `reference/installation.md`
- Clear structure with sections

**What's Missing**:

- No explicit loading trigger for `installation.md`
- No "MANDATORY - READ ENTIRE FILE" instruction
- Agent may not know setup file exists

**Fix**:

```markdown
## Before You Start

MANDATORY: Read [`reference/installation.md`](reference/installation.md) completely for DD_API_KEY and DD_APP_KEY setup.
```

---

### D6: Freedom Calibration (Score: 10/15)

**Appropriate**: Datadog queries are low-fragility — wrong query just returns less data, doesn't corrupt anything.

**Issue**: Skill is rigid (specific commands) but could benefit from flexibility in **when to choose which command**. Currently all procedures are lock-down, but decision-tree guidance would be higher value.

---

### D7: Pattern Recognition (Score: 11/10 - Bonus)

**Pattern Followed**: Tool pattern (decision trees + code examples + low freedom).

Appropriate for Datadog — specific commands with parameters. Follows pattern well.

---

### D8: Practical Usability (Score: 10/15)

**Strengths**:

- Command examples work (verified syntax)
- Table of operators is accurate
- Workflow examples are functional

**Weaknesses**:

- No decision tree for "which command should I use?"
- No error handling ("what if query times out?")
- No fallbacks ("if logs don't show it, try metrics")
- Missing edge cases ("what if trace ID isn't in logs?")

**Example Missing Guidance**:

```markdown
### Error Handling

If `logs search` times out:

1. Try adding more restrictive filter (e.g., "status:error")
2. Reduce time window (`--from 30m` instead of `--from 24h`)
3. Switch to `logs patterns` instead (slower but more forgiving)

If trace ID returns no results:

1. Check if trace ID format is correct (should be UUID or hex)
2. Check if time window includes when trace was generated
3. Fall back to `logs search` with error message
```

---

## Enhancement Actions Taken

None — This is an evaluation report only.

---

## Recommendations for Owner

### High Priority (Blocking)

1. **Add anti-patterns NEVER list** (15 specific items) — This alone would boost D3 from 4→13
2. **Add thinking frameworks and decision trees** — This would boost D2 from 5→12
3. **Improve description with trigger scenarios** — This would boost D4 from 11→15

### Medium Priority

4. Add explicit loading triggers for `reference/installation.md`
5. Add error handling section (what to do if commands fail)
6. Add decision tree: "Which command should I use?" with comparison table

### Low Priority

7. Add edge case examples (trace ID not found, query timeout behavior)
8. Add metrics query baselines guidance (how to detect anomalies without false positives)

---

## Token Impact Analysis

**Current SKILL.md**: ~450 lines, loads fully every time Datadog skill is invoked

**If improved with recommendations**:

- Add ~100 lines for anti-patterns
- Add ~150 lines for thinking frameworks
- Total ~700 lines — still acceptable for Tool pattern

The overhead is justified because anti-patterns and decision trees are high-knowledge-delta content.

---

## Grade Justification (D: 59%)

**Why not C or higher?**

- **D1 (Knowledge Delta)**: 40% of content is reference documentation Claude already knows
- **D3 (Anti-Patterns)**: Complete absence of NEVER list is a red flag for observability skill
- **D2 (Mindset)**: No thinking frameworks or investigation methodology

These three dimensions (D1, D2, D3) directly measure "does this compress expert knowledge?" The Skill fails here. It's an API reference, not expertise transfer.

**To reach C (70%+)**: Must add 20+ points by addressing D1, D2, D3 deficits. Currently trending D-range without these fixes.
