# Skill Evaluation Report: work-on-ticket

## Summary

- **Total Score**: 88/120 (73.3%)
- **Grade**: C
- **Pattern**: Process (Phased Workflow)
- **Knowledge Ratio**: E:A:R = 40:35:25
- **Verdict**: Solid foundational skill with clear procedural guidance, but diluted by generic content and missing expert thinking frameworks. The embedded coding standards don't belong in a ticket workflow skill.

---

## Dimension Scores

| Dimension | Score | Max | Notes |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 12 | 20 | Has genuine expert knowledge (branch naming, git workflow safety) but heavily diluted by generic procedures Claude already knows |
| D2: Mindset vs Procedures | 8 | 15 | Strong domain procedures but weak thinking frameworks. Missing "before working on a ticket, consider..." guidance |
| D3: Anti-Pattern Quality | 10 | 15 | Good coding anti-patterns (nested conditionals, comments) but missing ticket-workflow-specific anti-patterns |
| D4: Specification Compliance | 14 | 15 | Excellent description with clear WHAT/WHEN/KEYWORDS. Could enhance trigger examples in description field |
| D5: Progressive Disclosure | 11 | 15 | Self-contained structure is good, but file approaches 500-line limit. Coding standards could move to references/ |
| D6: Freedom Calibration | 12 | 15 | Appropriate rigidity for procedural workflow. Branch naming could allow slight flexibility while staying clear |
| D7: Pattern Recognition | 8 | 10 | Clear Process pattern application, but diluted by non-core content (coding standards section) |
| D8: Practical Usability | 13 | 15 | Strong decision trees and error handling. Covers main edge cases; minor: could cover network/format failures |

---

## Critical Issues

### 1. **Knowledge Delta Dilution** (D1)

The skill spends approximately 40% of content on procedures Claude already knows:

- "Check current branch" (generic git operation)
- "Check for uncommitted changes" (standard git workflow)
- "Create and checkout new branch" (basic git)
- "Convert summary to kebab-case" (standard string transformation)

**Evidence**: Steps 1-5 and branch naming section are primarily instructional for operations in `git` and bash that Claude is already competent with.

**Impact**: Token waste. The genuine expert knowledge is thin:

- Understanding Jira ticket workflow (medium value)
- Branch naming conventions for ticket tracking (medium value)
- Git state safety checks before branching (medium value)

**Fix**: Compress generic procedures into brief decision trees. Expand expert knowledge on ticket scope analysis and workflow principles.

---

### 2. **Missing Thinking Framework** (D2)

The skill is 100% procedural ("Do this, then this, then this") with zero thinking guidance.

**Missing expert knowledge**:

- Why does this workflow matter? (tracking context, reproducibility, team communication)
- What should an Agent consider when reading a Jira ticket?
- How do you scope the work appropriately?
- When should you push back on a ticket (too vague, conflicting requirements)?

**Evidence**: No "Before working on a ticket, ask yourself:" sections. Compare to proper mindset Skills (e.g., frontend-design) which lead with thinking patterns.

**Current thinking content**: ~0 lines **Recommended**: ~50-100 lines of thinking framework

**Fix**: Add section: "Ticket Workflow Thinking" with decision framework:

```markdown
Before starting work on a ticket, consider:

- **Scope**: Is the ticket well-scoped? Does it have clear acceptance criteria?
- **Dependencies**: What other work must complete first?
- **Assumptions**: What implicit assumptions is the ticket making?
- **Clarity**: If description is vague, should you ask for clarification?
```

---

### 3. **Out-of-Scope Content** (D1, D7)

The "Coding Standards" section (lines ~270-420, ~120 lines) doesn't belong in a ticket workflow skill.

**Examples of out-of-scope rules**:

- "NEVER use nested conditionals" - applies to ALL coding, not ticket work
- "NEVER add simple inline comments" - general code quality rule, not ticket-specific
- "ALWAYS use Vitest TDD Expert skill" - testing standard, not ticket workflow

**Why this matters**:

1. These rules aren't triggered by "work on ticket" — they're universal coding standards
2. They dilute the ticket-workflow focus
3. They should live in a central coding standards reference, not embedded in multiple Skills
4. Each skill that embeds them creates maintenance burden (if standards change, update everywhere)

**Impact on dimensions**:

- D1 (Knowledge Delta): Reduces score — these aren't unique to ticket workflows
- D7 (Pattern Recognition): Dilutes the Process pattern clarity
- D5 (Progressive Disclosure): Makes SKILL.md bloated (~500 lines at limit)

**Fix**: Move to `references/banking-coding-standards.md` (shared reference) or delete if redundant with AGENTS.md §4.

---

### 4. **Limited Edge Case Coverage** (D8)

While main paths are covered, several realistic failure scenarios are missing:

**Missing edge cases**:

- What if Jira API is down/unreachable? (Network failure handling)
- What if ticket summary contains characters invalid for branch names (e.g., "API [Auth]" → invalid characters)? Should Agent sanitize or error?
- What if `/eng:chore` command doesn't exist or fails? (Fallback guidance)
- What if the ticket is a sub-task or linked issue? (Relationship handling)
- What if user has uncommitted changes on a tracked file they're about to modify? (Scope collision detection)

**Current coverage**: ✓ Uncommitted changes, ✓ Wrong branch, ✓ Branch exists, ✓ Ticket not found **Missing coverage**: Network failures, invalid characters, command failures, complex ticket relationships

**Fix**: Expand error handling section with 3-5 additional realistic failure scenarios.

---

## Top 3 Improvements

### 1. **Remove Embedded Coding Standards** (High Impact)

**Action**: Move lines 270-420 (Coding Standards section) to a separate reference file or delete if redundant.

**Rationale**:

- These rules apply to ALL ticket work, not just this workflow
- Should be centralized in one place (AGENTS.md or shared reference)
- Reduces SKILL.md bloat from ~500 lines to ~380 lines
- Improves focus on core ticket workflow knowledge

**Expected impact**: +2 D1 points, +2 D7 points (pattern clarity)

---

### 2. **Add Ticket Workflow Thinking Framework** (High Impact)

**Action**: Insert new section after "When to Use This Skill" (~50 lines):

```markdown
## Thinking Framework: Before You Branch

Expert ticket work isn't just mechanical (fetch → branch → plan). It requires thinking about:

**Ticket Clarity**: Does this ticket have enough information?

- Clear acceptance criteria? If not, unclear.
- Dependencies documented? If not, ask for clarification.
- Scope well-defined? If it could mean 2 different things, it's too vague.

**Your Scope**: Should YOU work on this?

- Can you complete it without blocking on external work?
- Do you have the necessary context/expertise?
- Is it actually one ticket or multiple tickets bundled together?

**Workflow Safety**: Is your workspace ready?

- Clean working directory (handled by Step 4 ✓)
- Right branch base (handled by Step 4 ✓)
- Sufficient context from ticket (your responsibility)

**When to Stop and Ask**:

- Ticket lacks acceptance criteria → STOP, ask for clarity
- Ticket seems to contain 2-3 different pieces of work → STOP, request split
- You don't understand why this work matters → STOP, ask for context
- Estimated work exceeds ticket scope → STOP, negotiate scope
```

**Expected impact**: +4 D2 points (adds thinking framework)

---

### 3. **Enhance Description with More Trigger Scenarios** (Medium Impact)

**Action**: Update description field to list more explicit trigger keywords:

**Current description**:

```yaml
description: "Fetches Jira ticket details, creates an appropriately named branch,
and initiates the task planning workflow. Use when the user says 'work on [TICKET_ID]'
or similar phrases."
```

**Enhanced description**:

```yaml
description: "Fetch Jira ticket details, create appropriately named git branch,
and initiate task planning workflow for ticket-based work. Use when starting work
on a specific Jira ticket: 'work on AGP-782', 'start PROJ-123', 'pick up AICC-456',
'begin [TICKET_ID]'. Handles git state verification, branch naming conventions,
and error scenarios (uncommitted changes, existing branches, missing tickets)."
```

**Why**:

- Current description says "similar phrases" but doesn't show examples
- More explicit trigger patterns help Agent recognize when to activate
- More complete KEYWORDS improve searchability

**Expected impact**: +1 D4 point (description clarity)

---

## Detailed Analysis

### D1: Knowledge Delta (12/20) — BELOW TARGET

**Problem**: Skill mixes genuine expert knowledge with generic procedures at roughly 40:60 ratio.

**Expert content** (valuable):

- Ticket ID parsing patterns and format (medium value)
- Branch naming convention: `[TICKET_ID]-[kebab-case-summary]` (medium value)
- Understanding why git state must be checked before branching (medium value)
- Integration with `/eng:chore` task planning workflow (medium value)

**Generic content** (should reduce):

- "Check current branch" - Claude knows `git branch --show-current`
- "Check for uncommitted changes" - Claude knows `git status --porcelain`
- "Ensure latest staging" - Claude knows `git checkout` and `git pull`
- "Convert summary to kebab-case" - Claude knows string transformation
- Step-by-step instructions for standard git operations
- Explaining what Jira is and how to fetch issues (basic concept)

**Embedded coding standards** (out of scope):

- Nested conditionals warning
- Comment guidelines
- Vitest requirement
- These are universal coding rules, not ticket-workflow knowledge

**Calculation**:

- Expert: ~40% (branch naming, git workflow safety, integration knowledge)
- Activation: ~35% (procedures Claude knows but good reminder)
- Redundant: ~25% (basic git ops, step-by-step tutorials, universal coding rules)

**Target**: >70% Expert. Current: 40%. **Need: -10 points from current score.**

---

### D2: Mindset vs Procedures (8/15) — BELOW TARGET

**Problem**: Zero thinking framework, 100% procedural steps.

**Current procedures** (adequate):

- ✓ Parse ticket ID
- ✓ Fetch ticket details
- ✓ Generate branch name
- ✓ Check git state
- ✓ Create branch
- ✓ Build planning prompt

**Missing thinking framework** (should have):

- ✗ "When is this ticket well-scoped?" - expert judgment
- ✗ "What questions should you ask about unclear tickets?" - decision framework
- ✗ "When should you stop and request clarification?" - boundary setting
- ✗ "How do you know if you should accept this ticket?" - scope analysis

**Expert example** (from frontend-design skill):

```markdown
Before designing, ask yourself:

- **Purpose**: What problem does this solve? Who uses it?
- **Constraints**: What are the hidden requirements?
- **Differentiation**: What makes this solution memorable?
```

**Comparison**:

- Procedures present: Yes (8/10)
- Thinking framework present: No (0/10)
- **Current score**: 8 points for procedures alone
- **Should be**: 12-15 with thinking framework included

---

### D3: Anti-Pattern Quality (10/15) — ADEQUATE

**Strengths**:

- ✓ "NEVER EVER EVER USE NESTED CONDITIONALS" - specific, emphatic, with clear reasoning
- ✓ "NEVER add simple, obvious inline comments" - specific with examples (good/bad)
- ✓ "ALWAYS use Vitest TDD Expert skill" - reference to another skill

**Weaknesses**:

- ✗ Missing: "NEVER expand ticket scope without updating Jira" (scope creep)
- ✗ Missing: "NEVER create a branch for trivial changes" (50-line rule?)
- ✗ Missing: "NEVER work without acceptance criteria" (scope clarity)
- ✗ Missing: "NEVER skip asking for clarification on vague tickets" (workflow safety)

**Issue**: Coding anti-patterns (nested conditionals, comments) are strong, but ticket-workflow anti-patterns are completely absent.

This is a case where good anti-patterns exist but they're not about the _core skill_ (ticket workflow). They're about downstream coding.

**Recommendation**: Add ticket-workflow-specific anti-patterns:

```markdown
## Ticket Workflow Anti-Patterns (NEVER do these)

- **NEVER create a branch before reading the entire ticket** — You might miss critical context, acceptance criteria, or linked issues
- **NEVER branch on a vague ticket** — If you don't understand it, ask. Branching doesn't clarify; it just commits you to uncertainty
- **NEVER combine multiple tickets into one branch** — One ticket = one branch. Multi-ticket work should be split or tracked separately
- **NEVER start work without knowing the acceptance criteria** — "Done" is undefined without explicit criteria
```

---

### D4: Specification Compliance (14/15) — STRONG

**Frontmatter**:

```yaml
---
name: work-on-ticket
description: Fetches Jira ticket details, creates an appropriately named branch,
and initiates the task planning workflow. Use when the user says "work on [TICKET_ID]"
or similar phrases.
---
```

**Analysis**:

✓ Name is valid (lowercase, hyphens, 14 characters) ✓ Description answers WHAT: "Fetches ticket details, creates branch, initiates planning" ✓ Description answers WHEN: "Use when the user says 'work on [TICKET_ID]' or similar" ✓ Description has KEYWORDS: "Jira", "TICKET_ID", "branch", "planning"

**Minor weakness**:

- Description says "similar phrases" but doesn't enumerate them
- Would be stronger to list: "work on AGP-782", "start PROJ-123", "pick up...", "begin..."

**Rating**: 14/15 because description is good but could be more explicit on trigger patterns.

---

### D5: Progressive Disclosure (11/15) — ADEQUATE

**Current structure**:

- Single SKILL.md file (~500 lines)
- No references/ directory
- No external loading triggers
- Self-contained

**Assessment**:

✓ No orphaned references (no unused files) ✓ Clear section structure within SKILL.md ✓ Examples included inline ✓ Error handling documented

⚠ File length is at boundary (500 lines ideal limit) ⚠ "Coding Standards" section (~120 lines) could be external reference ⚠ No progressive disclosure design (all content loaded at once)

**For a self-contained Skill**: This is adequate. The skill doesn't need external references for its core mission.

**However**, if this Skill existed as a suite with references/, loading triggers should be explicit:

```markdown
### Coding Standards Framework

MANDATORY - READ: `references/coding-standards.md` (~150 lines) before working on this ticket. This file covers critical rules for:

- Nested conditional prevention
- Comment quality standards
- Testing requirements
```

**Current state**: Self-contained but bloated. If split would be cleaner.

---

### D6: Freedom Calibration (12/15) — ADEQUATE

**Fragility assessment**:

- Wrong branch name: Low fragility (can delete and recreate)
- Wrong git operations: Medium-to-high fragility (can corrupt local state, affect push)
- Prompt construction: Low fragility (if bad, user can adjust)

**Current calibration**:

| Element | Rigidity | Appropriate? |
| --- | --- | --- |
| Git operations | Very high (exact Bash commands) | ✓ Yes (high fragility task) |
| Branch naming format | Very high (exact format) | ⚠ Slightly too rigid |
| Prompt construction | Medium (structured but flexible) | ✓ Yes |
| Error handling | High (specific responses) | ✓ Yes |

**Branch naming format concern**:

- Current: `[TICKET_ID]-[kebab-case-summary]`
- This is specific but reasonable
- Could allow variations like `[TICKET_ID]_[kebab-case]` or `ticket/[TICKET_ID]/[summary]`
- Current format is good, just could be slightly more flexible

**Recommendation**: Branch naming could allow Agent to choose between 2-3 standard formats while enforcing kebab-case for consistency.

---

### D7: Pattern Recognition (8/10) — ADEQUATE

**Pattern identification**: This skill follows the **Process** pattern

- Phased workflow: ✓ 6 distinct phases (parse → fetch → name → verify → create → plan)
- Checkpoints: ✓ Decision points at git state check and error handling
- Medium-to-low freedom: ✓ Procedural with some flexibility in prompts

**Pattern match quality**:

- ✓ Clear phases
- ✓ Checkpoints with decision logic
- ✓ ~500 lines (slightly large for ideal ~200, but acceptable)

**Pattern dilution**:

- ⚠ Embedded "Coding Standards" section (~120 lines) doesn't belong in this pattern
- ⚠ These are orthogonal to the ticket workflow pattern
- ⚠ Would be cleaner if removed

**If coding standards were removed**: Pattern clarity would be 9-10/10. **Current state with standards included**: 8/10 (good pattern marred by non-core content).

---

### D8: Practical Usability (13/15) — STRONG

**Decision trees**:

- ✓ Step 4 (Git State Check) has conditional logic
  - If uncommitted: STOP and ask
  - If wrong branch: STOP and ask
  - If clean: Proceed
- ✓ Error Handling section has 3 error paths (ticket not found, branch exists, git fails)

**Code examples**:

- ✓ Git commands are correct syntax
- ✓ Bash patterns are valid
- ✓ No pseudocode issues
- ✓ Examples are copy-paste ready

**Edge cases covered**:

- ✓ Uncommitted changes
- ✓ Existing branch
- ✓ Ticket not found
- ✓ Git operation failure
- ✓ Wrong starting branch

**Edge cases not covered**:

- ✗ Network failure (Jira unreachable)
- ✗ Invalid characters in branch name (ticket summary has special chars)
- ✗ `/eng:chore` command doesn't exist
- ✗ Sub-task vs regular issue handling
- ✗ Large/complex tickets needing scope negotiation

**Examples**:

- ✓ Example 1: Simple case with clean state (good, common path)
- ✓ Example 2: With uncommitted changes (good, common friction point)
- ✓ Example 3: Ticket not found (good, error path)

**Improvement**: Add edge case for invalid characters:

```markdown
## Example 4: Invalid Branch Name Characters

**User:** "work on API-123" **Ticket summary:** "Add [Auth] Bearer Token Support"

**Claude:**

1. Fetches API-123
2. Summary has brackets: "[Auth] Bearer Token Support"
3. Converts to kebab-case: "add-auth-bearer-token-support"
4. Branch: API-123-add-auth-bearer-token-support ✓
```

---

## Missing Opportunities

### 1. Jira Query Integration

The skill hardcodes "fetch ticket details" but doesn't explain:

- What if user wants to work on next ticket from backlog?
- What if user wants to work on assigned tickets?
- Could this skill handle "work on my next ticket" request?

### 2. Dependent Tickets

No guidance on:

- What if ticket says "Depends on AGP-781"?
- Should you checkout that ticket first?
- How to handle ticket relationships?

### 3. Timeboxing

No mention of:

- Should Agent check estimated effort on ticket?
- Should Agent warn if work seems too large?
- Time tracking for ticket work?

These are lower priority but worth noting.

---

## Summary Assessment

**work-on-ticket is a solid foundational skill** that effectively guides Agent through the mechanical process of starting work on a Jira ticket. The description is clear, trigger patterns are well-identified, and error handling is comprehensive.

**But it's constrained by**:

1. Knowledge delta dilution (generic procedures, embedded coding standards)
2. Missing thinking frameworks (no guidance on scope, clarity, relationships)
3. File bloat from out-of-scope content (Coding Standards section)
4. Limited edge case coverage (network failures, invalid characters)

**Grade C (73%) is appropriate** — the skill works and would be useful, but has clear improvement path to B-grade status.

**To reach B (80%+)**: Remove ~150 lines of embedded standards, add ~50 lines of thinking framework, and expand edge case coverage (+3-4 examples).

---

## Implementation Priority

If making improvements, focus in this order:

| Priority | Improvement | Impact Points | Effort |
| --- | --- | --- | --- |
| 1 | Remove Coding Standards section | +4 (D1, D7) | Low |
| 2 | Add Thinking Framework | +4 (D2) | Medium |
| 3 | Enhance Description with Trigger Examples | +1 (D4) | Low |
| 4 | Add Edge Case Examples | +2 (D8) | Medium |

**Target after improvements**: 88 + 11 = **99/120 (82.5%) → Grade B**
