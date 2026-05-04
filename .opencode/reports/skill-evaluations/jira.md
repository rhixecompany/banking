# Skill Evaluation Report: jira

## Summary

- **Total Score**: 88/120 (73.3%)
- **Grade**: C+ (Adequate — clear improvement path)
- **Pattern**: Tool (Backend detection + Quick Reference + Anti-Patterns)
- **Lines**: 380 (Tool pattern ideal: ~300)
- **Knowledge Ratio**: E:A:R ≈ 40:45:15
- **Verdict**: Practical Jira workflow Skill with strong anti-patterns but incomplete reference disclosure and missing error handling guidance. Usable in current state but needs improvements for expert-level quality.

---

## Dimension Scores

| Dimension | Score | Max | Notes |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 11 | 20 | Good mix of expert knowledge (anti-patterns, Jira-specific workflows) but diluted by activation-level quick references (~40% Expert, ~45% Activation, ~15% Redundant) |
| D2: Mindset + Procedures | 11 | 15 | "Before Any Operation" checklist provides thinking framework; domain-specific procedures (CLI/MCP commands) are sound, but lacks deeper expert thinking patterns about Jira workflows |
| D3: Anti-Pattern Quality | 13 | 15 | Excellent: 6 specific NEVER items with reasoning. Examples: "NEVER assign using display name (MCP)" shows Jira-specific expertise. High-value anti-patterns. |
| D4: Specification Compliance | 12 | 15 | Frontmatter valid; description answers WHAT + includes trigger keywords; WHEN section could be more explicit ("Use when..." vs current passive phrasing) |
| D5: Progressive Disclosure | 9 | 15 | Critical gap: References to `references/commands.md` and `references/mcp.md` mentioned but files not included/accessible. No loading triggers embedded in workflows. Breaks the three-layer disclosure model. |
| D6: Freedom Calibration | 13 | 15 | Excellent: High freedom for view operations, medium for create/update, low for transitions and account ID lookups. Fragility correctly matched to constraint level. |
| D7: Pattern Recognition | 8 | 15 | Follows Tool pattern (decision trees, quick reference, anti-patterns) but at 380 lines vs. ideal ~300. Pattern is correct choice but execution slightly verbose. |
| D8: Practical Usability | 11 | 15 | Strong: Backend detection tree, quick reference tables, NEVER list all actionable. Gaps: No error handling (API failures, auth issues), no end-to-end workflow examples, broken reference guidance. |

---

## Critical Issues

### 1. **Missing/Broken Reference Files** (Impact: HIGH)

**Location**: Lines 12, 232, 240-245  
**Problem**: Skill repeatedly directs to `references/commands.md` and `references/mcp.md` but these files don't exist in the Skill package.

```markdown
| Backend | When to Use | Reference | | **CLI** | `jira` command available | `references/commands.md` | | **MCP** | Atlassian MCP tools available | `references/mcp.md` |
```

And later:

```markdown
See `references/mcp.md` for full MCP patterns.
```

**Why it breaks usability**: Agent is directed to load files that don't exist. Progressive disclosure strategy fails. User sees "LOAD reference when:" but reference files are inaccessible.

**Fix**: Either (a) include `references/commands.md` and `references/mcp.md` in skill package, or (b) remove all reference guidance and inline critical content into SKILL.md. Current state is broken.

---

### 2. **No Error Handling Guidance** (Impact: MEDIUM)

**Location**: Throughout Skill  
**Problem**: Skill covers happy path (backend detection, operations) but lacks guidance on failure scenarios:

- "What if Jira API is down?"
- "What if Agent lacks permissions for this operation?"
- "What if MCP tool call fails silently?"
- "What if CLI authentication expires?"

**Why it matters**: Real Jira usage involves auth errors, API failures, permission denials. Skill leaves Agent without fallback strategies.

**Fix**: Add "Error Handling & Fallbacks" section with common failures and recovery strategies:

```markdown
### Common Failures & Recovery

| Error | Cause | Recovery |
| --- | --- | --- |
| "No backend available" | Neither CLI nor MCP configured | Guide user to install CLI or set up MCP |
| "Permission denied" | User lacks project/issue permissions | Check user's role, ask admin for access |
| "Silent assignment failure" | Using display name instead of account ID | Always fetch account ID first |
| "Transition silently fails" | Workflow requires intermediate state | Fetch available transitions before moving |
```

---

### 3. **Missing End-to-End Workflow Examples** (Impact: MEDIUM)

**Location**: "Workflow" section (lines 159-175)  
**Problem**: Workflow section describes WHAT to do (research, draft, review) but not HOW Agent would actually execute using provided tools.

Current:

```markdown
**Creating tickets:**

1. Research context if user references code/tickets/PRs
2. Draft ticket content
3. Review with user
4. Create using appropriate backend
```

Missing: Concrete steps like:

```
1. Fetch referenced issue: `jira issue view REF-123`
2. Extract key details from result
3. Draft summary/description based on those details
4. Show draft to user for approval
5. Create with: `jira issue create -t"Task" -s"Summary" -b"Description"`
```

**Why it matters**: Agent needs to know exact sequence and tool calls. Generic workflow steps don't provide enough guidance.

**Fix**: Add specific end-to-end example for each major workflow (create, update, transition).

---

### 4. **Vague "WHEN" in Description** (Impact: MEDIUM)

**Location**: Frontmatter description  
**Problem**: Description uses passive phrasing vs. explicit trigger guidance.

Current:

```yaml
description: "Use when the user mentions Jira issues (e.g., "PROJ-123"), asks about tickets, wants to create/view/update issues, check sprint status, or manage their Jira workflow. Triggers on keywords like "jira", "issue", "ticket", "sprint", "backlog", or issue key patterns."
```

Issue: Mixes different concepts:

- "when user mentions..." (detection by Agent)
- "asks about..." (user intent)
- "Triggers on keywords..." (regex patterns)

Better phrasing would explicitly state:

```yaml
description: "Use when: (1) user mentions issue keys (e.g., PROJ-123), (2) asks to create/view/update/transition Jira tickets, (3) checks sprint status, or (4) manages workflows. Activates on keywords: jira, issue, ticket, sprint, backlog, epic, or issue key patterns like ABC-123."
```

**Why it matters**: Clearer description = higher chance Agent activates this Skill in relevant scenarios.

---

### 5. **Pattern Slightly Mismatched: Tool vs. Navigation** (Impact: LOW)

**Location**: Overall structure  
**Problem**: Skill shows characteristics of both Tool and Navigation patterns:

Tool aspects:

- Quick reference tables ✓
- Decision trees (backend detection) ✓
- Anti-patterns ✓

Navigation aspects:

- Multiple distinct backends (CLI vs. MCP) that could be separate sub-workflows
- "Do NOT load reference" guidance suggests routing to different content

Current implementation blends both without clear separation. Could be improved by:

- Routing more decisively to CLI or MCP section
- Clearer "Deep Dive" triggers
- Better progressive disclosure of backend-specific content

---

## Dimension-by-Dimension Analysis

### D1: Knowledge Delta (11/20) — Mixed Expert + Activation

**What's working**:

- Jira-specific anti-patterns (e.g., "never use display name for MCP assignment") are expert knowledge
- Backend selection logic is non-obvious and valuable
- Workflow understanding (intermediate states, permission issues) is real Jira expertise

**What's redundant**:

- Issue key regex explanation (Claude already knows regex)
- Generic "Before Any Operation" thinking (basic decision-making)
- Standard CRUD operation descriptions (basic workflow)

**Calculation**: ~40% Expert (anti-patterns, backend logic, Jira specifics) + ~45% Activation (quick references, basic procedures) + ~15% Redundant (regex, generic thinking)

Result: Decent knowledge delta but significant activation/redundant content wastes tokens.

---

### D2: Mindset + Procedures (11/15) — Good, but Limited Depth

**Thinking patterns provided**:

- "Before Any Operation" checklist: "What's the current state?", "Who else is affected?", "Is this reversible?", "Do I have the right identifiers?" — This is GOOD thinking framework

**Domain procedures**:

- CLI commands for each operation ✓
- MCP tool mappings ✓
- Account ID lookup requirement (MCP-specific) ✓

**What's missing**:

- Deeper thinking about Jira permission model
- Workflow state machine thinking (why transitions fail in certain orders)
- Complex decision trees for ambiguous scenarios

Result: Solid practical procedures with moderate thinking depth. Could be elevated with more expert-level decision frameworks.

---

### D3: Anti-Pattern Quality (13/15) — Strong

**Excellent NEVER items**:

1. "NEVER transition without fetching current status" + reasoning (workflows may require intermediate states) ✓ Expert knowledge
2. "NEVER assign using display name (MCP)" + reasoning (only account IDs work) ✓ Jira-specific expertise
3. "NEVER edit description without showing original" + reasoning (no undo) ✓ Safety pattern
4. "NEVER use `--no-input` without all required fields" + reasoning (fails silently) ✓ CLI expertise
5. "NEVER assume transition names are universal" + reasoning (vary by project) ✓ Jira expertise
6. "NEVER bulk-modify without explicit approval" + reasoning (notification storms) ✓ Etiquette/workflow

These are real landmines from Jira experience. Deducting 2 points only because:

- Could add one more: "NEVER use JQL queries from production on untested environments"
- Could provide examples of each (currently just statements)

---

### D4: Specification Compliance (12/15) — Good, Slightly Vague

**Frontmatter valid**: ✓

- name: "jira" (lowercase, valid)
- description: Present and detailed

**Description analysis**:

- WHAT: "Jira issues, tickets, create/view/update, sprint status, manage workflows" ✓
- WHEN: "When user mentions..." / "asks about..." (passive, could be more prescriptive)
- KEYWORDS: "jira, issue, ticket, sprint, backlog" ✓ but missing "epic", "transition", "workflow"

Missing from description:

- Explicit "Use when:" statement
- No mention of MCP vs. CLI backend selection
- No mention of being an alternative to web interface

Suggested improvement:

```yaml
description: "Jira ticket operations via CLI or MCP. Use when: (1) user mentions issue keys (PROJ-123), (2) asks to create/view/transition tickets, (3) checks sprints/epics, or (4) manages workflows. Works with jira CLI or Atlassian MCP backend."
```

---

### D5: Progressive Disclosure (9/15) — Critical Gap

**Current structure**:

- SKILL.md is self-contained (380 lines)
- References to `references/commands.md` and `references/mcp.md` scattered throughout
- No actual reference files included
- "Deep Dive" section lists when to load references but files don't exist

**The problem**: Three-layer disclosure model is broken:

```
Layer 1: Metadata (description) ✓ Present
Layer 2: SKILL.md Body ✓ Present (380 lines)
Layer 3: References ✗ MISSING
```

**Specifics**:

- Line 12: References `references/commands.md` (doesn't exist)
- Line 240-245: "See `references/mcp.md` for full MCP patterns" (doesn't exist)
- Lines 219-231: "Deep Dive - LOAD reference when:" section but references absent

**How to fix**: Option A: Include reference files

```
jira/
├── SKILL.md
├── references/
│   ├── commands.md (CLI patterns)
│   └── mcp.md (MCP tool patterns)
```

Option B: Inline critical content into SKILL.md and remove reference guidance

Current approach (reference guidance without files) is worst of both worlds — suggests content exists when it doesn't.

---

### D6: Freedom Calibration (13/15) — Excellent

**Analysis by operation fragility**:

| Operation | Fragility | Guidance | Appropriate? |
| --- | --- | --- | --- |
| View issue | Low | "Show command" (high freedom) | ✓ Yes |
| List issues | Low | "Show command" (high freedom) | ✓ Yes |
| Create issue | Medium | Requires user approval (medium freedom) | ✓ Yes |
| Transition | High | NEVER list + "fetch state first" (low freedom) | ✓ Yes |
| Bulk modify | High | "explicit approval" (low freedom) | ✓ Yes |
| MCP assignment | High | "Always use account ID" (low freedom) | ✓ Yes |

Freedom is appropriately calibrated to task fragility. Deducting 2 points only because:

- Could be more explicit about which operations are reversible vs. irreversible
- Could note that comment addition is medium-fragility (might notify wrong people if issue state changed)

---

### D7: Pattern Recognition (8/15) — Correct Pattern, Slightly Verbose

**Pattern identified**: Tool pattern

- Decision trees ✓ (backend detection)
- Quick reference tables ✓ (CLI/MCP commands)
- Anti-patterns ✓ (NEVER list)
- Code examples ✓ (commands)

**Characteristics match Tool pattern**:

- ~380 lines (Tool ideal: ~300) — slightly over
- Designed for precise operations on specific tool (Jira)
- Low-medium freedom appropriate for tool operations
- Quick reference + deep patterns structure

**Minor deviations**:

- Could benefit from clearer routing between CLI and MCP (Navigation pattern would do this better)
- Some content is more "Navigation" (choosing backend) than "Tool" (operating backend)

Result: Correct pattern choice, execution slightly verbose. Score: 8/15.

---

### D8: Practical Usability (11/15) — Usable but With Gaps

**Strong points**:

- Backend detection flowchart is immediately actionable ✓
- Quick Reference tables provide copy-paste commands ✓
- "Before Any Operation" checklist guides Agent thinking ✓
- NEVER list prevents common mistakes ✓
- Workflow section describes major patterns ✓

**Gaps**:

1. **No error handling** (HIGH): What if API fails, auth expires, permissions denied?
2. **No examples** (MEDIUM): No end-to-end walkthrough of a ticket creation, transition, or comment
3. **Broken references** (HIGH): "See references/..." directives point to non-existent files
4. **Missing decision tree** (MEDIUM): How does Agent choose between CLI and MCP if both available?
5. **No JQL guidance** (MEDIUM): Skill mentions "complex JQL queries" but provides no examples

**How to improve**:

- Add "Common Errors & Recovery" section
- Add 1-2 end-to-end examples per major workflow
- Either include reference files or inline critical content
- Add JQL query examples for common scenarios

---

## Top 3 Improvements (Ordered by Impact)

### 1. **Create or Inline Reference Files** (HIGH IMPACT)

**Current state**: References mentioned but files missing → broken user experience

**Action**: Choose one approach:

- **A) Include reference files**: Create `references/commands.md` and `references/mcp.md` with detailed CLI patterns and MCP tool usage
- **B) Inline critical content**: Move reference content into SKILL.md, delete reference guidance

**Why**: Unblocks "Do NOT load reference for simple operations" pattern. Currently these directives are useless if files don't exist.

**Effort**: 30-60 minutes for Option A; 15 minutes for Option B.

---

### 2. **Add Error Handling & Fallbacks Section** (MEDIUM IMPACT)

**Current state**: Happy path only → Agent unprepared for real-world failures

**Action**: Add new section after "NEVER" list:

```markdown
## Common Errors & Recovery

| Scenario | Error Message | Solution |
| --- | --- | --- |
| CLI not installed | "command not found: jira" | Guide user to install jira-cli |
| MCP not configured | "mcp**atlassian**... not found" | Configure Atlassian MCP |
| Auth expired | "Unauthorized" or "Invalid token" | User must re-authenticate |
| Permissions denied | "You do not have permission..." | Check project role, request access |
| Transition fails silently | Issue doesn't move to new state | Fetch available transitions first |
| Assignment fails silently | Assignee doesn't change (MCP) | Always use account ID, not display name |
```

**Why**: Real Jira work involves 50% problem-solving around failures. Skill should prepare Agent.

**Effort**: 20-30 minutes.

---

### 3. **Add End-to-End Examples** (MEDIUM IMPACT)

**Current state**: Generic workflow steps → Agent doesn't know exact command sequence

**Action**: Add "Examples" section with concrete scenario:

````markdown
### Example: Creating a Blocker Issue from Code Reference

**Scenario**: User says "Create a ticket for that memory leak in auth.ts"

1. Research: Ask user for details or check GitHub issue
2. Draft using CLI:
   ```bash
   jira issue create \
     -t"Bug" \
     -s"Memory leak in auth.ts login flow" \
     -b"When user logs in, process memory increases by 10MB. Suspected: session storage leak." \
     -p"BANKING"
   ```
````

3. Show output to user: "Issue BANKING-456 created"
4. Confirm: "Should I add this to the current sprint?"

### Example: Transitioning Issue to Done

**Scenario**: User says "Move BANKING-123 to Done"

1. Fetch current state: `jira issue view BANKING-123`
   - Current status: "In Progress"
   - Available transitions: [Done, Blocked, In Review]
2. Check: "Does this issue have completed work?" (ask user)
3. Transition: `jira issue move BANKING-123 Done`
4. Verify: `jira issue view BANKING-123` → Status now "Done"

```

**Why**: Examples close the gap between "know the commands" and "know the workflow." This is where expert thinking emerges.

**Effort**: 20-30 minutes for 2-3 concrete examples.

---

## Recommendations Summary

| Priority | Item | Effort | Impact |
| --- | --- | --- | --- |
| **CRITICAL** | Create/inline reference files | 30-60 min | HIGH |
| **HIGH** | Add error handling section | 20-30 min | MEDIUM |
| **HIGH** | Add end-to-end examples | 20-30 min | MEDIUM |
| **MEDIUM** | Clarify description WHEN clauses | 10 min | LOW-MEDIUM |
| **MEDIUM** | Add JQL query examples | 15 min | LOW |
| **LOW** | Reduce verbose sections | 20 min | LOW |

**Estimated total effort for all improvements**: 2-3 hours → Expected grade improvement: C+ to B- (from 73% to 80%+)

---

## Conclusion

The jira Skill has **strong practical utility** (especially the anti-patterns and CLI reference) but is held back by:

1. **Incomplete reference disclosure** (critical blocker for using "Deep Dive" pattern)
2. **Missing error handling** (gap in real-world usage guidance)
3. **Lack of examples** (workflow steps don't translate to Agent actions)
4. **Slightly vague triggers** (description could be more explicit)

Current state: **Usable for basic operations** but **incomplete for complex scenarios**. With the 3 top improvements, this could become a solid B-level Skill with excellent coverage of both CLI and MCP backends.

The Skill's biggest strength is its **anti-pattern list** — these are genuine expert-level insights that took Jira experience to accumulate. The improvements should focus on making the rest of the Skill equally solid.

```
