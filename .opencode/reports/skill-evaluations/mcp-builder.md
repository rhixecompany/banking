# Skill Evaluation Report: mcp-builder

## Summary

- **Total Score**: 64/120 (53%)
- **Grade**: D (Below Average)
- **Pattern**: Process (4-phase workflow; correct pattern, oversized execution)
- **Knowledge Ratio**: E:A:R = 15:35:50
- **Verdict**: Skill provides useful MCP-specific guidance but is inflated by ~100 lines of generic software design principles that waste tokens and dilute core value.

---

## Dimension Scores

| Dimension | Score | Max | Notes |
| --- | --- | --- | --- |
| D1: Knowledge Delta | 8 | 20 | Over 50% redundant generic principles (lines 26-59, 84-95, 134-157) |
| D2: Mindset vs Mechanics | 9 | 15 | Good domain procedures (tool hints, stdio gotchas) but weak thinking patterns |
| D3: Anti-Pattern Quality | 5 | 15 | Only ONE expert anti-pattern (stdio hanging); missing 6+ common MCP mistakes |
| D4: Specification Compliance | 14 | 15 | Excellent description with WHAT/WHEN/KEYWORDS; valid frontmatter |
| D5: Progressive Disclosure | 11 | 15 | Good conditional loading (Python/TypeScript) but missing "Do NOT Load" guidance |
| D6: Freedom Calibration | 11 | 15 | Appropriate for phases but implementation section lacks concrete examples |
| D7: Pattern Recognition | 7 | 10 | Correct Process pattern but oversized (358 lines vs 200 ideal) |
| D8: Practical Usability | 9 | 15 | Decision trees for branching exist; missing working code examples and error handling patterns |

---

## Critical Issues

### Issue 1: Knowledge Delta Failure (D1: 8/20) — HIGHEST PRIORITY

**Problem:** Over 50% of the skill content is redundant generic knowledge Claude already possesses.

**Evidence:**

- Lines 26-59 (Phase 1.1-1.2): "Build for Workflows, Not APIs", "Optimize for Limited Context", "Design Actionable Error Messages", "Follow Natural Task Subdivisions" — All generic software design principles that apply to ANY API integration, not MCP-specific.
- Lines 84-95 (Phase 1.5): "Exhaustively Study API Documentation" — Obviously everyone must do this; wastes 12 lines.
- Lines 134-157 (Phase 2.2): Generic infrastructure planning ("API request helpers", "Error handling utilities") applies to any project.

**Token Waste:** ~100+ lines that could be condensed or deleted.

**Impact:** Agent loads skill expecting MCP expert knowledge, finds generic software design instead.

---

### Issue 2: Anti-Pattern Gap (D3: 5/15) — SECOND PRIORITY

**Problem:** Skill identifies only ONE expert anti-pattern but MCP server development has many landmines Claude hasn't stepped on.

**Evidence:**

- Only anti-pattern: Line 236-242 (stdio/stdin hanging). Excellent, but lonely.
- MISSING expert anti-patterns:
  - NEVER forgot async/await in tool implementations
  - NEVER returned massive unformatted data dumps (context budget is precious)
  - NEVER made tool names inconsistent (agents can't discover patterns)
  - NEVER ignored tool hints (agents make dangerous assumptions about readonly/destructive/idempotent)
  - NEVER skipped error messages for agents (silent failures prevent learning)
  - NEVER made tool descriptions too technical (agents can't understand intent)

**Impact:** Agent builds MCP server without understanding common failure modes.

---

### Issue 3: Missing Code Examples (D8: 9/15) — THIRD PRIORITY

**Problem:** Skill references `@mcp.tool` decoration patterns and Zod schemas but provides no working examples in main body.

**Evidence:**

- Lines 114-118: Generic "use Pydantic or Zod" with no schema examples
- Lines 165-176: Docstring requirements without examples
- Lines 188-193: Tool annotation hints WITHOUT showing how they're used in code
- NO examples of:
  - Tool registration with `@mcp.tool` (Python)
  - `server.registerTool` with Zod (TypeScript)
  - Error handling for rate limits with retry logic
  - Pagination implementation pattern
  - Markdown vs JSON response formatting

**Impact:** Agent must reference external files for every concrete pattern; main skill is guidance-only.

---

### Issue 4: Vague Infrastructure Guidance (D6: 11/15)

**Problem:** Phase 2.2 "Implement Core Infrastructure First" tells Agent WHAT to do but not HOW.

**Evidence:**

- "Create shared utilities before implementing tools" — WHERE? HOW structured?
- "API request helper functions" — No pattern examples
- "Response formatting functions" — No examples
- "Pagination helpers" — No concrete approach

**Impact:** Agent must reverse-engineer patterns from reference files or trial-and-error.

---

### Issue 5: Missing "Do NOT Load" Guidance (D5: 11/15)

**Problem:** Skill has conditional loading (Python vs TypeScript) but no "Do NOT Load" warnings.

**Evidence:**

- Lines 74-82 say "For Python, load X" and "For TypeScript, load Y"
- NO explicit "Do NOT load TypeScript guide if using Python" warning
- Agent might load all references, wasting context

**Impact:** Inefficient context usage when Agent loads both Python AND TypeScript references.

---

## Top 3 Improvements

### 1. DELETE Generic Design Principles (Lines 26-59) — Saves ~35 lines

**Current (lines 26-59):**

```markdown
**Build for Workflows, Not Just API Endpoints:**

- Don't simply wrap existing API endpoints...
- Consolidate related operations...
- Focus on tools that enable complete tasks...

**Optimize for Limited Context:**

- Agents have constrained context windows...
```

**Why delete:** These principles apply to ANY API service, not MCP-specific. Claude knows this.

**Replace with (ONE sentence):**

```markdown
Design MCP tools around complete workflows that agents need to accomplish, not individual API calls.
```

**Impact:** Recover ~35 tokens, improve knowledge delta from 15% → 25%.

---

### 2. ADD Comprehensive Anti-Pattern List — Adds ~20 lines, Major Value

**Insert after line 235 (after existing stdio warning):**

```markdown
### Common MCP Server Anti-Patterns

**NEVER forget async/await in tool implementations**

- MCP communication is asynchronous; blocking I/O stalls agents
- Exception: If wrapping a synchronous API, wrap in async wrapper function

**NEVER return unformatted data dumps**

- Agents have constrained context; return high-signal information only
- Truncate large responses; use "concise" vs "detailed" response modes
- Example: Return JSON IDs + names, not full API response payloads

**NEVER use inconsistent tool naming**

- Example: `search_users` and `find_posts` breaks pattern discovery
- Use consistent prefixes: `search_*`, `get_*`, `list_*` for discoverability

**NEVER ignore tool hints in registration**

- `readOnlyHint: true` — agents avoid this for destructive operations
- `destructiveHint: false` — agents trust this for safe operations
- Missing hints → agents make dangerous assumptions

**NEVER skip error messages for agents**

- Silent failures prevent agent learning
- Error must be: specific + actionable + human-readable
- Example: "Rate limited. Try again in 60s." (good) vs "429 error" (bad)

**NEVER make tool descriptions too technical**

- Agents need clear intent, not API documentation
- Bad: "Invokes GET /api/v2/users/{id} endpoint"
- Good: "Retrieve user details by ID (name, email, created_date)"
```

**Impact:** Adds expert-level knowledge; improves D3 from 5 → 12.

---

### 3. ADD Concrete Code Examples for Tool Registration — Adds ~15 lines, Critical

**Insert after line 159 (after "Implement Tools Systematically"):**

````markdown
**Tool Registration Examples:**

**Python (FastMCP):**

```python
@mcp.tool
async def search_users(query: str, limit: int = 10) -> str:
    """Search for users by name or email.

    Args:
        query: Search term
        limit: Maximum results (max 100)

    Returns:
        JSON array of matching users
    """
    results = await api.search(query, limit=min(limit, 100))
    return json.dumps(results[:limit])
```
````

**TypeScript:**

```typescript
server.registerTool(
  {
    name: "search_users",
    description: "Search for users by name or email",
    inputSchema: z.object({
      query: z.string().describe("Search term"),
      limit: z.number().int().min(1).max(100).default(10)
    })
  },
  async input => ({
    content: [
      {
        type: "text",
        text: JSON.stringify(
          await api.search(input.query, input.limit)
        )
      }
    ]
  })
);
```

**Key patterns:**

- Async/await required for all I/O
- Input validation with type hints / Zod
- Return simple JSON/string, not complex objects
- Always include tool hints in registration:
  ```
  { readOnlyHint: true, idempotentHint: true }
  ```

```

**Impact:** Eliminates need to load reference files for basic patterns; improves D8 from 9 → 12.

---

## Detailed Analysis

### D1: Knowledge Delta — 50% Redundant Content

**Breakdown:**
- Lines 1-25: Frontmatter + Overview [A] ✓
- Lines 26-59: Generic design principles [R] ✗✗ DELETE
- Lines 60-96: Research steps (mostly [A]) ✓
- Lines 98-157: Planning + infrastructure [R/A mix] — Generic language advice
- Lines 159-217: Implementation guidance [A/E mix] — Mixed quality
- Lines 219-265: Review phase [A] ✓
- Lines 267-310: Evaluation [E/A mix] ✓

**Good content (Expert):**
- Tool annotation hints (lines 188-193)
- Stdio/stdin hanging gotcha (lines 236-242)
- Evaluation structure (lines 267-310)

**Bad content (Redundant):**
- Generic design principles (lines 26-59)
- "Study API documentation" (lines 84-95)
- Generic infrastructure planning (lines 134-157)

**Fix:** Delete ~100 lines of generic content; improve E:A:R ratio from 15:35:50 → 30:50:20.

---

### D3: Anti-Pattern Quality — Only 1 of 7 Missing

The skill correctly identifies the stdio/stdin hanging anti-pattern (expert-level knowledge), but misses six more:

1. ✓ **Stdio/stdin hanging** (line 236) — Caught
2. ✗ **Forgot async/await** — Missing
3. ✗ **Unformatted data dumps** — Missing
4. ✗ **Inconsistent tool naming** — Missing
5. ✗ **Ignored tool hints** — Missing
6. ✗ **Silent error handling** — Missing
7. ✗ **Over-technical descriptions** — Missing

Each of these is a "landmine" that only experience teaches. Agent needs explicit NEVER list.

---

### D5: Progressive Disclosure — 89% Good, Missing Safety Rail

**What works:**
- Conditional loading by language (Python vs TypeScript) ✓
- Embedded triggers in workflow (lines 74-82, 199, 271) ✓
- References directory with 4 files ✓

**What's missing:**
- NO "Do NOT Load" guidance
- Agent might load python_mcp_server.md AND node_mcp_server.md (wastes context)
- Need explicit: "**For Node projects: Do NOT load** `python_mcp_server.md`"

---

### D8: Practical Usability — 60% Complete

**Decision trees:**
- Language branching (Python/TypeScript) ✓
- Phase progression (1→2→3→4) ✓

**Code examples:**
- Tool registration: MISSING ✗
- Error handling: MISSING ✗
- Pagination: MISSING ✗
- Response formatting: MISSING ✗

**Error handling fallbacks:**
- Main approach: "Load reference files"
- Fallback: MISSING (what if files aren't present?)

**Edge cases:**
- Mentioned: "Character limits and truncation" (line 119)
- Missing: Pagination edge cases, API schema evolution, nested responses

---

## Assessment Summary

**Strengths:**
1. Excellent description field (D4: 14/15) — Agent knows exactly when to activate
2. Correct process pattern with clear phases — Agent has workflow
3. Good domain-specific procedures (tool hints, stdio gotchas) — Some expert knowledge present
4. Conditional loading by language — Progressive disclosure working for main branches

**Weaknesses:**
1. **Knowledge delta failure** (D1: 8/20) — 100+ lines of generic principles dilute MCP-specific value
2. **Anti-pattern gap** (D3: 5/15) — Missing 6 critical anti-patterns
3. **Code example void** (D8: 9/15) — No concrete patterns in main body
4. **Oversized execution** (D7: 7/10) — 358 lines vs 200 ideal for Process pattern

**Overall:** Skill has good bones (workflow, description, some expert content) but is inflated by generic advice and missing critical anti-patterns. With focused editing (delete ~100 lines of generic content, add ~35 lines of anti-patterns, add ~15 lines of code examples), this could be a B-grade skill (90+ points).

---

## Required vs Optional Improvements

### MUST FIX (blocks skill from being useful):
1. Delete generic design principles (lines 26-59) — recover tokens, improve knowledge delta
2. Add comprehensive anti-pattern list — critical landmines every MCP developer needs

### SHOULD FIX (improves usability):
3. Add concrete code examples for tool registration — helps Agent implement without reference files
4. Add "Do NOT Load" guidance for conditional resources — prevent context waste

### NICE TO HAVE (polish):
5. Specify error handling patterns for rate limits, timeouts
6. Add edge case guidance for pagination, API schema evolution
7. Consolidate infrastructure planning into actionable patterns

---

## Evaluation Notes

- **Rubric applied:** Skill-Judge dimensions D1-D8 (120-point scale)
- **Pattern identified:** Process (correct for multi-phase projects; execution oversized)
- **Knowledge ratio:** 15% Expert, 35% Activation, 50% Redundant — **FAILING threshold of <40% Expert**
- **Critical finding:** Skill teaches "software design 101" instead of "MCP-specific expertise"

**Comparison to rubric's "Meta-Question":**
> "Would an expert in this domain, looking at this Skill, say: 'Yes, this captures knowledge that took me years to learn'?"

**Answer:** Partially. Experts would recognize tool hints and stdio gotchas, but would skip the generic design principles. The skill has islands of expertise surrounded by generic filler.

---

**Report Generated:** 2026-05-04
**Evaluation Framework:** Skill-Judge (skill-judge SKILL.md)
**Total Context Used:** ~179 lines (43 rubric + 358 skill = 401; report 187 lines)
```
