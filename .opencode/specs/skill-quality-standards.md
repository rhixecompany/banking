# Spec: skill-quality-standards

Scope: repo

# Skill Quality Standards — Banking Repository

## Purpose

Defines what a "passing" skill looks like in this repo and what enhancement targets each dimension must reach. Use this spec when evaluating or rewriting any skill under `.opencode/skills/`.

---

## Grade Targets (post-enhancement)

All 23 local skills must reach **grade B or above (≥96/120)** after enhancement. Skills that scored A before enhancement should be refined to score A+ (≥110/120).

---

## Dimension Standards

### D1: Knowledge Delta (target ≥16/20)

**Required:**

- Zero "What is X" explanations for concepts Claude already knows
- No step-by-step tutorials for standard operations (git add, file read, etc.)
- At least one non-obvious decision tree or trade-off per major scenario
- Edge cases drawn from real operational experience, not theoretical examples
- "Why" reasoning for every rule — not just the rule itself

**Forbidden:**

- Explaining what JSON, TypeScript, or common libraries are
- Generic best-practices boilerplate ("write clean code", "handle errors", "be consistent")
- Library documentation paraphrasing (link to it instead)

### D2: Mindset + Procedures (target ≥12/15)

**Required:**

- At least one "Before doing X, ask yourself…" framework per domain task
- Domain-specific procedures Claude couldn't derive from general knowledge
- Correct non-obvious ordering with reasons ("validate BEFORE packing, not after")

**Forbidden:**

- Mechanical step sequences for generic operations (open file → edit → save → test)
- Procedures the user could find by reading `--help` output

### D3: Anti-Patterns (target ≥12/15)

**Required:**

- Explicit `NEVER` list with ≥3 specific items per skill
- Each anti-pattern must include a non-obvious WHY
- Anti-patterns from real operational pain, not obvious mistakes

**Forbidden:**

- Vague warnings: "be careful", "avoid errors", "handle edge cases"
- Anti-patterns so obvious a junior developer would know them

### D4: Description Quality (target ≥14/15)

Every skill description **must** answer all three:

1. **WHAT** — specific capabilities (not "helps with X tasks")
2. **WHEN** — explicit trigger scenarios ("Use when…", "When user asks for…")
3. **KEYWORDS** — domain terms, file extensions, action verbs, command names

**Required format elements:**

- Starts with capability statement
- Contains at least one "Use when…" or "Trigger for…" clause
- Lists 3+ specific trigger keywords or scenarios
- "When to use" content belongs ONLY in `description:` — never duplicated in body

**Forbidden:**

- Vague descriptions: "A helpful skill for various tasks"
- Missing trigger scenarios (Agent must know exactly when to activate)
- Trigger info that exists only in the SKILL.md body (Agent never sees body before deciding)

### D5: Progressive Disclosure (target ≥12/15)

**Required:**

- SKILL.md ≤300 lines preferred; ≤500 lines absolute maximum
- Heavy reference content (examples, full command lists, templates) moved to `references/`
- Loading triggers must be **embedded at the workflow decision point** (not listed at end)
- Format: `**MANDATORY — READ ENTIRE FILE**: [file](./references/file.md) before proceeding with [scenario].`
- Include `**Do NOT load**` guidance to prevent over-loading

**Forbidden:**

- All content dumped into SKILL.md with no reference structure
- References listed but with no loading triggers
- Reference section that's just a file list at the bottom

### D6: Freedom Calibration (target ≥12/15)

Match constraint level to task fragility:

| Task Type | Freedom Level | Guidance Style |
| --- | --- | --- |
| Creative / communication | High | Principles, examples, "explore X direction" |
| Code review / analysis | Medium | Priority rubrics, judgment frameworks |
| File format / API / DB ops | Low | Exact scripts, specific commands, "MANDATORY" labels |
| Security / destructive ops | Minimum | Explicit confirmation requirements, no variation |

**Forbidden:**

- Exact step-by-step scripts for inherently creative tasks
- Vague principles for operations that must be exactly correct

### D7: Pattern Recognition (target ≥8/10)

Each skill must clearly follow one of these five patterns:

| Pattern | Lines | Use For |
| --- | --- | --- |
| Mindset | ~50 | Creative tasks needing taste/judgment |
| Navigation | ~30 | Multiple distinct sub-scenarios |
| Philosophy | ~150 | Art/craft requiring originality |
| Process | ~200 | Complex multi-step projects |
| Tool | ~300 | Precise operations on specific formats/systems |

Skills must not mix patterns incoherently (e.g., Process header with Mindset content).

### D8: Practical Usability (target ≥12/15)

**Required:**

- Multi-path scenarios have decision trees (not just "use judgment")
- Code examples must compile and run (no pseudocode as real code)
- Error handling and fallbacks for every primary operation
- Edge cases explicitly named, not implied

---

## Enhancement Checklist

When enhancing a skill, apply in order:

1. **Fix description** — add WHAT/WHEN/KEYWORDS if missing; remove "when to use" from body
2. **Purge redundant content** — delete any section that Claude already knows
3. **Add/strengthen anti-patterns** — minimum 3 specific NEVER items with WHY
4. **Add thinking frameworks** — at least one "Before doing X, ask yourself…"
5. **Fix progressive disclosure** — move heavy content to references; add MANDATORY triggers
6. **Calibrate freedom** — verify constraint level matches task fragility
7. **Trim to line limits** — target ≤300 lines in SKILL.md after purging

---

## Report Format

Each evaluation report lives at:

```
.opencode/reports/skill-evaluations/[skill-name].md
```

Required sections:

```markdown
# Skill Evaluation: [name]

## Summary

- **Score**: X/120 (X%)
- **Grade**: [A/B/C/D/F]
- **Pattern**: [Mindset/Navigation/Philosophy/Process/Tool]
- **Lines**: X (SKILL.md)
- **Knowledge Ratio**: E:A:R = X:Y:Z
- **Verdict**: [one sentence]

## Dimension Scores

| Dimension                  | Score | Max | Notes |
| -------------------------- | ----- | --- | ----- |
| D1: Knowledge Delta        |       | 20  |       |
| D2: Mindset + Procedures   |       | 15  |       |
| D3: Anti-Pattern Quality   |       | 15  |       |
| D4: Description Quality    |       | 15  |       |
| D5: Progressive Disclosure |       | 15  |       |
| D6: Freedom Calibration    |       | 15  |       |
| D7: Pattern Recognition    |       | 10  |       |
| D8: Practical Usability    |       | 15  |       |

## Critical Issues

[Must-fix items ordered by impact]

## Enhancement Actions Taken

[What was changed and why]
```

---

## Master Scorecard Format

`.opencode/reports/skill-evaluations/SCORECARD.md` — final deliverable:

```markdown
# Skill Enhancement Scorecard

| Skill   | Before | After | Delta | Grade |
| ------- | ------ | ----- | ----- | ----- |
| banking | X/120  | Y/120 | +Z    | A     |

... | **Total** | X/2760 | Y/2760 | +Z | |
```
