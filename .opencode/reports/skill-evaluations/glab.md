# Skill Evaluation Report: glab

## Summary

- **Total Score**: 90/120 (75%)
- **Grade**: C (Adequate)
- **Pattern**: Tool
- **Knowledge Ratio**: E:A:R = 70:20:10
- **Verdict**: Solid CLI reference skill with good command coverage but lacking expert decision frameworks, comprehensive anti-patterns, and explicit loading triggers for references.

---

## Dimension Scores

| Dimension | Score | Max | Notes |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 14 | 20 | Good expert knowledge with some obvious content mixed in |
| D2: Mindset vs Mechanics | 12 | 15 | Strong procedures, moderate thinking frameworks |
| D3: Anti-Pattern Quality | 8 | 15 | Some specific anti-patterns but lacks comprehensive NEVER list |
| D4: Specification Compliance | 13 | 15 | Solid description with keywords, could be more explicit about triggers |
| D5: Progressive Disclosure | 9 | 15 | References mentioned but missing loading triggers and decision trees |
| D6: Freedom Calibration | 13 | 15 | Appropriate calibration for CLI operations |
| D7: Pattern Recognition | 8 | 10 | Correct Tool pattern with manageable length (~450 lines) |
| D8: Practical Usability | 13 | 15 | Strong practical guidance with minor gaps in advanced scenarios |

---

## Critical Issues

### 1. Missing Comprehensive Anti-Pattern List (D3)

The skill lacks a consolidated NEVER list for glab workflows. Currently, anti-patterns are scattered:

- One specific anti-pattern in API pagination (`❌ WRONG: glab api --per-page=100` vs `✓ CORRECT: glab api "..."`)
- General error fixes in "Common Issues Quick Fixes"

**Problem**: Expert users stepping on landmines (e.g., "using wrong authentication for self-hosted GitLab", "forgetting to link MRs to issues", "pagination failures") are not explicitly called out.

### 2. No Loading Triggers for References (D5)

References are mentioned at the end but have no decision tree or mandatory loading triggers:

```markdown
## Progressive Disclosure

For detailed command documentation, refer to:

- **references/commands-detailed.md** — ...
- **references/quick-reference.md** — ...
- **references/troubleshooting.md** — ...

Load these references when:

- User needs specific flag or option details
- Troubleshooting authentication...
```

**Problem**: These are suggestions, not workflow-embedded MANDATORY directives. Agent won't know WHEN to load which reference.

### 3. Weak Thinking Frameworks (D2)

Best practices listed but lack deeper reasoning:

```markdown
## Best Practices

1. **Verify authentication** before executing commands: `glab auth status`
2. **Use `--help`** to explore command options: `glab <command> --help`
```

**Problem**: These are obvious to any CLI user. Missing expert thinking like:

- "When to use glab vs git vs GitLab web UI" (decision tree)
- "Authentication failure diagnosis flowchart"
- "Trade-offs: API direct access vs glab wrappers"

### 4. Vague Description Triggers (D4)

Description lacks explicit numbered scenarios:

Current: "Use this skill when the user needs to interact with GitLab resources or perform GitLab workflows."

**Problem**: "GitLab workflows" is broad. Agent may not trigger for specific scenarios like "fix a CI pipeline error" or "batch-update issues."

---

## Top 3 Improvements

### 1. [HIGHEST IMPACT] Add Consolidated NEVER List with Expert Warnings

**Location**: New section after "Prerequisites", before "Authentication Quick Start"

**Content** (example structure):

```markdown
## NEVER Do This

### Authentication Mistakes

- **NEVER** use the same GITLAB_TOKEN for both gitlab.com and self-hosted instances without hostname specification
  - Risk: Token leakage; commands may target wrong server
  - Fix: Always set GITLAB_HOST explicitly

- **NEVER** commit GITLAB_TOKEN to `.git/config` or scripts
  - Risk: Exposure in version control
  - Fix: Use `glab auth login` or environment variables only

### Workflow Pitfalls

- **NEVER** create MR without pushing branch first
  - Symptom: "not a git repository" or missing branch error
  - Fix: `git push -u origin branch-name` BEFORE `glab mr create`

- **NEVER** forget to link MRs to issues
  - Risk: Sprint tracking broken, PR context unclear
  - Fix: Use "Closes #123" in MR description

- **NEVER** use pagination flags in `glab api` like `--per-page=100`
  - Symptom: Unrecognized flag error
  - Fix: Use query parameters in URL: `glab api "endpoint?per_page=100"`

### CI/CD Mistakes

- **NEVER** retry a failed pipeline without checking logs first
  - Risk: Same failure repeats, wasting time
  - Fix: `glab ci trace` to diagnose BEFORE `glab ci retry`
```

**Impact**: Captures expert experience; prevents common failures; directly addresses D3.

---

### 2. [HIGH IMPACT] Embed Loading Triggers in Workflow Decision Trees

**Location**: Replace "Progressive Disclosure" section with scenario-based decision tree

**Content** (example):

```markdown
## When to Load References

### Scenario: "I need all glab commands and their flags"

**MANDATORY - READ ENTIRE FILE**: Load [`references/commands-detailed.md`](references/commands-detailed.md) **Do NOT load**: quick-reference.md (too condensed for learning)

### Scenario: "I have an authentication error"

**MANDATORY - READ ENTIRE FILE**: Load [`references/troubleshooting.md`](references/troubleshooting.md) **Do NOT load**: commands-detailed.md (not relevant)

### Scenario: "I need a quick command cheat sheet"

**RECOMMENDED**: Load [`references/quick-reference.md`](references/quick-reference.md) (~50 lines) **Do NOT load**: commands-detailed.md (overkill for quick lookup)
```

**Impact**: Clarifies when to load what; prevents over-loading context; fixes D5.

---

### 3. [MEDIUM IMPACT] Enhance Description with Numbered Trigger Scenarios

**Location**: Update frontmatter description field

**Current**:

```yaml
description: Expert guidance for using the GitLab CLI (glab) to manage GitLab issues, merge requests, CI/CD pipelines, repositories, and other GitLab operations from the command line. Use this skill when the user needs to interact with GitLab resources or perform GitLab workflows.
```

**Improved**:

```yaml
description: "Expert guidance for using the GitLab CLI (glab) to manage GitLab resources from the terminal.
Use when: (1) Creating, reviewing, or merging merge requests (glab mr),
(2) Managing issues and linking to MRs (glab issue),
(3) Monitoring or triggering CI/CD pipelines (glab ci, glab pipeline),
(4) Cloning or forking repositories (glab repo),
(5) Troubleshooting authentication or command failures.
Includes command syntax, API usage, self-hosted GitLab support, and error diagnosis."
```

**Impact**: Makes triggers explicit; improves discoverability; fixes D4.

---

## Detailed Analysis by Dimension

### D1: Knowledge Delta (14/20)

**Evidence**:

- ✅ Expert content: Specific glab commands, API pagination gotcha, self-hosted GitLab configuration
- ✅ Domain-specific procedures: MR creation workflow, CI/CD monitoring, API usage patterns
- ⚠️ Mixed: Some obvious content ("Use --help to explore options", "Verify authentication")
- ❌ Redundant: Explaining basic Git operations like "git push -u origin"

**Ratio Analysis**:

- Expert sections: "Using the API Command", core workflows (MR, Issues, CI/CD), self-hosted config
- Activation: "Prerequisites", "Best Practices", general guidance
- Redundant: Basic Git operations, generic error handling ("do this correctly")

**Verdict**: ~70% Expert, ~20% Activation, ~10% Redundant. Good knowledge delta with room to eliminate redundancy.

**Improvement**: Delete Git basics; focus expertise on glab-specific decision trees (when to use API vs CLI command, trade-offs).

---

### D2: Mindset + Appropriate Procedures (12/15)

**Strengths**:

- Clear procedural workflows: MR creation (3 steps), reviewing (4 steps), CI/CD monitoring (4 steps)
- Domain-specific procedure for API pagination (correct vs incorrect syntax)
- Self-hosted GitLab configuration pattern shown

**Weaknesses**:

- Missing thinking frameworks: "When to use glab vs GitLab web UI?" or "Why link MRs to issues?"
- Best Practices listed but not reasoned ("Use --help" is obvious; why is it important?)
- No trade-off guidance: "glab mr create vs glab mr update — when to use each?"

**Verdict**: Strong procedural content but weak on expert thinking patterns.

**Improvement**: Add "Decision Frameworks" section:

```markdown
### When to Use glab vs Web UI

| Task | glab | Web UI | Why |
| --- | --- | --- | --- |
| Create MR from branch | ✅ Faster | ❌ Multi-step | Automation, scripting |
| Review with inline comments | ❌ Limited | ✅ Better | Context, discussion |
| Bulk-update issues | ✅ glab api | ❌ Manual | Batch operations |
```

---

### D3: Anti-Pattern Quality (8/15)

**Current anti-patterns**:

- ✅ API pagination: `❌ WRONG` vs `✓ CORRECT` with explicit reasoning
- ✅ Common issues listed (authentication, 404, not-a-git-repo)
- ❌ No consolidated NEVER list
- ❌ Anti-patterns scattered across sections
- ❌ Missing expert-level warnings about workflow mistakes

**Verdict**: Has some good specific anti-patterns but lacks comprehensive organization and expert warnings.

**Improvement**: Add "NEVER Do This" section (see Top 3 Improvements #1).

---

### D4: Specification Compliance (13/15)

**Frontmatter**:

- ✅ Valid YAML: `name: glab`, `description: ...`
- ✅ Name: lowercase, appropriate length
- ✅ Description includes WHAT: "manage GitLab issues, merge requests, CI/CD pipelines"
- ✅ Description includes WHEN: "when the user needs to interact with GitLab resources"
- ✅ Keywords present: GitLab, issues, merge requests, CI/CD, command line

**Weaknesses**:

- Description is wordy; lacks numbered trigger scenarios
- "GitLab workflows" too broad — should specify exact scenarios Agent will recognize

**Verdict**: Solid specification with minor clarity improvements.

**Improvement**: Restructure description with explicit triggers (see Top 3 Improvements #3).

---

### D5: Progressive Disclosure (9/15)

**Current state**:

- ✅ References exist: commands-detailed.md, quick-reference.md, troubleshooting.md
- ✅ SKILL.md is ~450 lines (manageable, close to ideal <500)
- ✅ Main content self-contained
- ❌ No "MANDATORY - READ ENTIRE FILE" directives
- ❌ No "Do NOT Load" guidance
- ❌ No decision tree for loading triggers
- ❌ References mentioned as "for detailed documentation" (passive, not embedded in workflow)

**Verdict**: References exist but loading strategy is vague and unguided.

**Improvement**: Embed decision tree in workflow (see Top 3 Improvements #2).

---

### D6: Freedom Calibration (13/15)

**Assessment**:

- Task type: CLI operations (medium fragility — wrong command fails but can be retried)
- Current calibration: Specific commands with optional flags
- ✅ Allows flexibility: `--web`, `--output=json`, `-R owner/repo`
- ✅ Respects fragility: exact command syntax shown
- ❌ Could be slightly more flexible in explaining WHY different flags exist

**Verdict**: Appropriate calibration for fragility level.

---

### D7: Pattern Recognition (8/10)

**Pattern Match**:

- Tool pattern (specific operations on specific format): ✅
- ~300-line ideal: SKILL.md is ~450 lines (slightly over but acceptable)
- Decision trees present: ✅ (MR, Issues, CI/CD workflows)
- Code examples: ✅ (command syntax throughout)
- Low freedom appropriate: ✅

**Verdict**: Clear Tool pattern with appropriate structure.

---

### D8: Practical Usability (13/15)

**Strengths**:

- ✅ Clear decision trees for main workflows
- ✅ Working command examples with realistic flags
- ✅ Error handling: "Common Issues Quick Fixes" covers failures
- ✅ Fallback patterns: `-R owner/repo` for out-of-repo context
- ✅ Edge cases: self-hosted GitLab, API pagination

**Weaknesses**:

- ⚠️ "401 Unauthorized" fix is generic ("Run `glab auth login`") — could diagnose deeper
- ⚠️ Missing advanced workflows: release management, webhook management, CI variables
- ⚠️ Some error messages lack root-cause analysis

**Verdict**: Strong practical guidance with minor gaps in troubleshooting depth and advanced scenarios.

**Improvement**: Expand "Common Issues Quick Fixes" with diagnostic trees:

```markdown
### "401 Unauthorized"

**First, verify authentication:**

1. `glab auth status` — which account is active?
2. `glab auth list` — view all authenticated accounts

**If multiple accounts:**

- Are you in a repo with multiple remotes (e.g., gitlab.com AND self-hosted)?
- Check: `git remote -v`
- Solution: Set GITLAB_HOST before running command

**If single account:**

- Token expired? `glab auth refresh`
- Wrong scope? Regenerate token with CI/CD, API scopes
```

---

## Overall Assessment

**Strengths**:

- Comprehensive glab command coverage
- Real-world workflow examples (MR creation, issue linking, CI/CD monitoring)
- Specific syntax gotchas (API pagination)
- Good practical usability for common scenarios

**Weaknesses**:

- Lacks expert decision frameworks ("when to use X vs Y")
- No consolidated anti-pattern list
- References mentioned but not triggered in workflow
- Some obvious content dilutes knowledge delta
- Description could be more explicit about trigger scenarios

**Grade Justification** (C = 75%):

- Falls in "Adequate" range (70-79%)
- Has clear path to improvement (Top 3 recommendations)
- Not production-blocking but would benefit from refinement
- Useful skill as-is, better with enhancements

---

## Recommended Next Steps

1. **Add NEVER list** (1 hour) — addresses D3, increases score to ~100 (+10 points)
2. **Embed loading triggers** (30 min) — addresses D5, increases score to ~103 (+3 points)
3. **Enhance description** (15 min) — addresses D4, increases score to ~104 (+1 point)
4. **Add decision frameworks** (45 min) — addresses D2, increases score to ~109 (+5 points)

**Estimated post-improvement score**: ~110/120 (92%) = Grade B (Good, production-ready)
