---
name: caveman-review
description: "Ultra-compressed code review comments. Each comment one line: location, problem, fix. Use when user says 'review this PR', 'code review', '/review', or invokes /caveman-review. Keywords: code review, PR feedback, terse, compress, one-line."
---

Write code review comments terse and actionable. One line per finding. Location, problem, fix. No throat-clearing.

## Rules

**Format:** `L<line>: <problem>. <fix>.` — or `<file>:L<line>: ...` when reviewing multi-file diffs.

**Severity Decision Tree**

Assign severity by working through this tree:

1. **Does the code cause customer incident if deployed today?** → YES → `🔴 bug:`
2. **Does it break existing tests or accepted contracts?** → YES → `🔴 bug:`
3. **Does it work now but risk a future incident?** (race condition, null dereference, error swallowed, timing assumption) → YES → `🟡 risk:`
4. **Is the improvement purely optional?** (naming clarity, micro-optimization, style) → YES → `🔵 nit:`
5. **Are you genuinely unsure if this is an issue?** → YES → `❓ q:`

**Severity prefix (optional, when mixed):**

- `🔴 bug:` — broken behavior, will cause incident
- `🟡 risk:` — works but fragile (race, missing null check, swallowed error)
- `🔵 nit:` — style, naming, micro-optim. Author can ignore
- `❓ q:` — genuine question, not a suggestion

**Drop:**

- "I noticed that...", "It seems like...", "You might want to consider..."
- "This is just a suggestion but..." — use `nit:` instead
- "Great work!", "Looks good overall but..." — say it once at the top, not per comment
- Restating what the line does — the reviewer can read the diff
- Hedging ("perhaps", "maybe", "I think") — if unsure use `q:`

**Keep:**

- Exact line numbers
- Exact symbol/function/variable names in backticks
- Concrete fix, not "consider refactoring this"
- The _why_ if the fix isn't obvious from the problem statement

## Examples

❌ "I noticed that on line 42 you're not checking if the user object is null before accessing the email property. This could potentially cause a crash if the user is not found in the database. You might want to add a null check here."

✅ `L42: 🔴 bug: user can be null after .find(). Add guard before .email.`

❌ "It looks like this function is doing a lot of things and might benefit from being broken up into smaller functions for readability."

✅ `L88-140: 🔵 nit: 50-line fn does 4 things. Extract validate/normalize/persist.`

❌ "Have you considered what happens if the API returns a 429? I think we should probably handle that case."

✅ `L23: 🟡 risk: no retry on 429. Wrap in withBackoff(3).`

## Domain Anti-Patterns (Banking/Fintech)

NEVER in terse code review mode:

- **NEVER bike-shed on naming without offering the fix** — "unclear variable name" wastes author time; instead: `L42: 🔵 nit: rename 'amt' → 'withdrawalAmount' for clarity.`
- **NEVER suggest refactoring without concrete scope** — "extract this function" is vague; instead: `L88-140: extract validate() + normalize() into separate functions.`
- **NEVER comment on performance without measurement** — "this is slow" is hostile; instead: `L23: 🟡 risk: loop is O(N²), use batch API at L22.` or `L45: requires profiling before optimization.`
- **NEVER comment on passing code in terse mode** — terse should have high signal-to-noise only; don't nitpick working code.
- **NEVER let terseness become tone-deaf** — brevity ≠ rudeness; "wrong" vs "🔴 race condition here; add mutex" are both terse but one reads hostile.

**Banking-specific anti-patterns**:

- **NEVER flag decimal arithmetic without context** — many fintech rounding patterns are intentional; instead: `L92: 🟡 risk: rounding loses cents. Confirm intentional or use fixed-point.`
- **NEVER nitpick auth checks without understanding flow** — auth might be enforced upstream; instead: `L45: 🟡 risk: no user check. If called from unauthenticated context, needs auth guard.`
- **NEVER comment on financial field mutations without tracing to schema** — fields may be read-only at ORM level; instead: `L67: confirm field is writable in Drizzle schema before allowing mutation.`

## Auto-Clarity

Drop terse mode for: security findings (CVE-class bugs need full explanation + reference), architectural disagreements (need rationale, not just a one-liner), and onboarding contexts where the author is new and needs the "why". In those cases write a normal paragraph, then resume terse for the rest.

## Skill Activation & Boundary Clarity

**DO activate caveman-review when**:

- Author explicitly requests: "use caveman-review", "/review", "keep it terse", "compress feedback"
- Review context is iterative (known author, clear domain, working relationship established)
- Finding set is large (>5 items) — terse format saves token budget and speeds author comprehension
- Change is in mature/stable code — reviewers can safely assume sufficient context
- PR is intra-team (both reviewer and author work in same domain daily)

**Do NOT activate or **revert to verbose mode when\*\*:

- Author new to codebase (they need narrative context to learn patterns)
- Cross-team review (different domains require explanation even if terse possible)
- Design-level decisions dominate (architectural reviews need full rationale, not detail-level critique)
- Author explicitly requests verbose mode or feedback with explanation
- Security/architecture findings are majority of review (see "Auto-Clarity" above)
- First PR from contributor (use verbose mode to mentor)

**Test**: "If reviewer is a stranger to this author, do they actually need terse mode?" → No? Use verbose. Yes and author agrees? Terse is fine.

## Boundaries

Reviews only — does not write the code fix, does not approve/request-changes, does not run linters. Output the comment(s) ready to paste into the PR. "stop caveman-review" or "normal mode": revert to verbose review style.
