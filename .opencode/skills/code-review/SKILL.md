---
name: code-review
description: Comprehensive code review methodology with severity classification and confidence thresholds
lastReviewed: 2026-04-29
applyTo: "**/*.{ts,tsx,js,jsx}"
---

## Agent Support

| Agent | Integration | Usage |
| --- | --- | --- |
| **OpenCode** | Direct skill invocation | `skill("code-review")` when conducting code reviews |
| **Cursor** | `.cursorrules` reference | Add to project rules for review standards |
| **Copilot** | `.github/copilot-instructions.md` | Reference for review methodology |

### OpenCode Usage

```
# When reviewing code changes
Use code-review skill to apply severity classification.

# When requesting a review
Load code-review for reviewer guidance.
```

### Cursor Integration

```json
// .cursorrules - Add code review standards
{
  "codeReview": {
    "requireReview": true,
    "minReviewers": 1,
    "severityLevels": ["critical", "major", "minor", "nitpick"]
  }
}
```

### Copilot Integration

```markdown
<!-- .github/copilot-instructions.md -->

## Code Review Standards

Severity classification:

- Critical: Security, data loss, complete breakage
- Major: Significant bug, performance issue, major confusion
- Minor: Code clarity, small improvements
- Nitpick: Style, formatting, preferences

Confidence thresholds:

- 100%: Absolutely certain, can fix without asking
- 80-99%: Confident, suggest with rationale
- 60-79%: Question, ask instead of assume
- Below 60%: Ask for clarification

See skills/code-review for full methodology.
```

---

# Code Review Philosophy

## TL;DR

Systematic code review across 4 layers with severity classification. Only report findings with ≥80% confidence. Include file:line references for all issues.

## When to Use This Skill

- Before reporting implementation completion
- When explicitly asked to review code
- When using the `/review` command
- As an independent audit after code changes
- When reviewing PRs or merge requests
- When doing pair programming or mob programming

## The 4 Review Layers

### Layer 1: Correctness

- Logic errors and edge cases
- Error handling completeness
- Type safety and null checks
- Algorithm correctness
- Off-by-one errors
- Boundary conditions
- Race conditions in async code
- Error propagation correctness

**What to look for:**

- Does the code do what it's supposed to do?
- Are there edge cases not handled?
- What happens with empty arrays, null values, negative numbers?
- Are errors caught and handled appropriately?

### Layer 2: Security

- No hardcoded secrets or API keys
- Input validation and sanitization
- Injection vulnerability prevention (SQL, XSS, command)
- Authentication and authorization checks
- Sensitive data not logged
- OWASP Top 10 awareness
- Proper encryption of sensitive data
- CSRF protection
- Rate limiting considerations

**What to look for:**

- Any hardcoded passwords, API keys, tokens?
- Are user inputs validated before use?
- Could this code be exploited for injection attacks?
- Is sensitive data properly protected?

### Layer 3: Performance

- No N+1 query patterns
- Appropriate caching strategies
- No unnecessary re-renders (React/frontend)
- Lazy loading where appropriate
- Memory leak prevention
- Algorithmic complexity concerns
- Database indexing considerations
- Bundle size concerns (frontend)

**What to look for:**

- Are there repeated database calls in loops?
- Is there unnecessary re-rendering in React?
- Could caching improve performance?
- Is the algorithm appropriate for the data size?

### Layer 4: Style & Maintainability

- Adherence to project conventions (check AGENTS.md)
- Code duplication (DRY violations)
- Complexity management (cyclomatic complexity)
- Documentation completeness
- Test coverage gaps
- Naming consistency
- File and folder organization
- Import organization

**What to look for:**

- Does the code follow project conventions?
- Is there repeated code that could be extracted?
- Are functions too complex (too many responsibilities)?
- Is the code readable and self-documenting?

## Severity Classification

| Severity | Icon | Criteria | Action Required |
| --- | --- | --- | --- |
| Critical | 🔴 | Security vulnerabilities, crashes, data loss, corruption | Must fix before merge |
| Major | 🟠 | Bugs, performance issues, missing error handling | Should fix |
| Minor | 🟡 | Code smells, maintainability issues, test gaps | Nice to fix |
| Nitpick | 🟢 | Style preferences, naming suggestions, documentation | Optional |

### Examples of Each Severity

**Critical (🔴):**

```typescript
// SQL Injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`;

// Hardcoded API key
const apiKey = "sk-1234567890abcdef";

// No authentication check
async function deleteUser(req: Request) {
  await db.users.delete(req.params.id); // Anyone can delete!
}
```

**Major (🟠):**

```typescript
// N+1 query pattern
for (const order of orders) {
  const customer = await db.customers.get(order.customerId); // Query per order!
}

// Memory leak in React
useEffect(() => {
  const subscription = api.subscribe(data => setData(data));
  // Missing cleanup: return () => subscription.unsubscribe();
}, []);
```

**Minor (🟡):**

```typescript
// Magic numbers without constants
if (user.age > 18) { ... }  // What is 18?

// Duplicated validation logic
function validateEmail(email: string) { ... }  // Exists in another file too
```

**Nitpick (🟢):**

```typescript
// Prefer const over let when value doesn't change
let count = 0;  // Could be const

// Minor naming preference
const getU = () => { ... };  // Could be getUser()
```

## Confidence Threshold

**Only report findings with ≥80% confidence.**

If uncertain about an issue:

- State the uncertainty explicitly: "Potential issue (70% confidence): ..."
- Suggest investigation rather than assert a problem
- Prefer false negatives over false positives (reduce noise)

### When to State Uncertainty

```typescript
// Instead of: "This is a bug"
const result = items.filter(i => i.active).map(i => i.id);

// Say: "Potential issue (80% confidence)"
// The filter+map could be combined into single reduce,
// but this may be intentional for readability.
```

## Review Process

1. **Initial Scan** - Identify all files in scope, understand the change
2. **Deep Analysis** - Apply all 4 layers systematically to each file
3. **Context Evaluation** - Consider surrounding code, project patterns, existing conventions
4. **Philosophy Check** - Verify against code-philosophy (5 Laws) if applicable
5. **Synthesize Findings** - Group by severity, deduplicate, prioritize

### Step 1: Initial Scan

- Get the list of changed files
- Understand the scope of changes
- Identify the main purpose of the change
- Note any related files that might be affected

### Step 2: Deep Analysis

For each file, apply all 4 layers:

- Read the entire file, not just the diff
- Check how the changes interact with existing code
- Look for patterns that violate the 4 layers

### Step 3: Context Evaluation

- Consider the project's coding standards (AGENTS.md)
- Look at similar code in the codebase for consistency
- Understand the domain logic being implemented
- Consider the team's conventions

### Step 4: Philosophy Check

Apply the 5 Laws from code-philosophy:

- Law 1: Early exits for edge cases
- Law 2: Parse at boundaries, trust internally
- Law 3: Pure, predictable functions
- Law 4: Fail fast with clear errors
- Law 5: Self-documenting names

### Step 5: Synthesize

- Group findings by severity
- Remove duplicates
- Prioritize the most important issues
- Prepare the output

## Output Format

Structure your review as:

1. **Files Reviewed** - List all files analyzed
2. **Overall Assessment** - APPROVE | REQUEST_CHANGES | NEEDS_DISCUSSION
3. **Summary** - 2-3 sentence overview
4. **Critical Issues** (🔴) - With file:line references
5. **Major Issues** (🟠) - With file:line references
6. **Minor Issues** (🟡) - With file:line references
7. **Positive Observations** (🟢) - What's done well (always include at least one)
8. **Philosophy Compliance** - Checklist results if applicable

### Example Output

````
## Files Reviewed
- src/services/user.service.ts
- src/api/users.ts
- tests/user.service.test.ts

## Overall Assessment: REQUEST_CHANGES

## Summary
The implementation has a security vulnerability and a performance issue that must be addressed. The overall structure follows project conventions, but error handling needs improvement.

## Critical Issues (🔴)
1. **SQL Injection** - `src/services/user.service.ts:42`
   User input directly interpolated into SQL query without parameterization.
   ```typescript
   const query = `SELECT * FROM users WHERE name = '${name}'`;
````

Use parameterized queries or an ORM's query builder instead.

2. **Missing Authentication** - `src/api/users.ts:15` Delete endpoint has no authentication check - anyone can delete any user.

## Major Issues (🟠)

1. **N+1 Query** - `src/services/user.service.ts:67` Looping through orders causes a database query per order.

   ```typescript
   for (const order of orders) {
     const customer = await db.customers.get(order.customerId);
   }
   ```

   Use eager loading or batch query instead.

2. **Missing Error Handling** - `src/api/users.ts:23` Promise rejection not caught - will result in unhandled rejection.

## Minor Issues (🟡)

1. **Magic Number** - `src/services/user.service.ts:89` `if (user.age > 18)` - extract to named constant MAX_AGE

## Positive Observations (🟢)

- Good use of TypeScript types throughout
- Consistent naming conventions match project style
- Error messages are descriptive and helpful
- Tests cover main functionality

## Philosophy Compliance

- [x] Guard clauses used in user.service.ts
- [ ] Input parsing - needs validation at API boundary
- [x] Pure functions in test helpers
- [x] Fail-fast error handling in service layer
- [x] Clear function names throughout

```

## What NOT to Do

- Do NOT report low-confidence findings as definite issues
- Do NOT provide vague feedback without file:line references
- Do NOT skip any of the 4 layers
- Do NOT forget to note positive observations
- Do NOT modify any files during review
- Do NOT approve without completing the full review process
- Do NOT focus only on syntax - consider semantics
- Do NOT ignore the diff context - review the whole file

## Adherence Checklist

Before completing a review, verify:

- [ ] All 4 layers analyzed (Correctness, Security, Performance, Style)
- [ ] Severity assigned to each finding
- [ ] Confidence ≥80% for all reported issues (or uncertainty stated)
- [ ] File names and line numbers included for all findings
- [ ] Positive observations noted
- [ ] Output follows the standard format
- [ ] Philosophy (5 Laws) considered where applicable

## Related Skills

- [code-philosophy](./code-philosophy) - The 5 Laws to verify compliance
- [refactor](./refactor) - Apply fixes to issues found
- [testing-skill](./testing-skill) - Verify tests are adequate
```
