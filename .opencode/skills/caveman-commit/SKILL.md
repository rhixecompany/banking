---
name: caveman-commit
description: >
  Ultra-compressed commit message generator. Cuts noise from commit messages while preserving intent and reasoning. Conventional Commits format. Subject ≤50 chars, body only when "why" isn't obvious. Use when user says "write a commit", "commit message", "generate commit", "/commit", or invokes /caveman-commit. Auto-triggers when staging changes.
---

Write commit messages terse and exact. Conventional Commits format. No fluff. Why over what.

## Format Rules (Quick Reference)

**Subject**: `<type>(<scope>): <imperative>`

Type: `feat` `fix` `refactor` `perf` `docs` `test` `chore` `build` `ci` `style` `revert`

Imperative mood (add, fix, remove). ≤50 chars ideal, hard 72 max. No period. Scope optional.

**Body**: Use only when needed (see "Judgment" section below).

**What NEVER goes in:**

- "This commit does X", "I", "we", "now", "currently" — the diff says what
- "As requested by..." — use Co-authored-by trailer
- "Generated with Claude Code" or any AI attribution
- Emoji (unless project convention requires)
- Restating the file name when scope already says it
- Vague subjects ("fix stuff", "update code", "work in progress")
- Future tense ("will add", "going to") — describe what WAS done, not what WILL be
- Commit messages as task assignments ("fix this when you can")

## Judgment: When to Include Body

**Always include body for:**

- **Breaking Changes** — BREAKING CHANGE footer required
- **Security Fixes** — explain the vulnerability
- **Data Migrations** — document reversibility and validation
- **Reverts** — explain why the prior commit was wrong
- **Multi-system changes** — document architectural reason

**Optional body for:**

- Changes that touch multiple files but are logically simple → subject-only OK
- Single-system feature without reversibility concerns → subject-only OK
- Refactors that preserve behavior → subject-only OK

**Test**: If someone grep-ing history asks "why did we make this choice?", subject must answer it without digging through PR. If answer isn't in diff, add body.

## Scope Decision Tree

**Question 1**: Does this change touch code in multiple distinct systems?

- NO → Use the primary affected system (api, auth, db, ui, wallet, etc.)
- YES → Check if it's logically one change or should be split:
  - One feature spanning systems? Use primary owner, add body explaining why
  - Multiple independent changes? Split into separate commits per feature

**Question 2**: Is scope ambiguous between two systems?

- Example: "auth: add JWT" or "api: add JWT validation?"
  - Answer: Which system owns the contract/spec?
  - JWT spec is auth responsibility → `auth` scope
  - JWT integration in API handlers → `api` scope
  - Changed both? Consider: "feat(auth): add JWT, integrate in API handlers" OR split into two commits

**Question 3**: Using a scope not in standard types?

- OK if project convention requires (e.g., "feat(wallet): ..." in fintech app)
- Check prior commits for scope naming patterns
- Match the project's existing style, don't invent new scopes

## Examples: Real-World Patterns

**Simple feature (subject-only)**

```
feat(wallet): add USD balance display
```

**Feature with architectural context (body required)**

```
feat(api): add GET /users/:id/profile

Mobile client needs profile endpoint to reduce cold-launch
bandwidth without fetching full user payload (saves ~40KB on LTE).

Closes #128
```

**Breaking change (mandatory body with BREAKING CHANGE footer)**

```
feat(api)!: rename /v1/orders to /v1/checkout

BREAKING CHANGE: Clients migrating from /v1/orders must update to /v1/checkout
before 2026-06-01. Old route returns 410 Gone status after that date.

Migration guide: https://docs.example.com/api-migration

Closes #256
```

**Security fix (mandatory body explaining vulnerability)**

```
fix(auth): validate JWT exp claim strictly

Previously, expired tokens were accepted if other claims were valid.
Attackers could extend token lifetime indefinitely. Fix now rejects
any token with expiration time in the past, regardless of other claims.

CVE-2026-1234: Expired JWT Acceptance

Closes #789
```

**Data migration (mandatory body documenting reversibility)**

```
chore(db): migrate user_roles from enum to junction table

This migration is IRREVERSIBLE — rollback requires manual data recovery.
Deployed 2026-05-15. Validation: 100% of 47,329 records successfully
migrated. All legacy enum values mapped to junction table entries.

Affected: Upgrade scripts, role-based access control layer

Closes #512
```

**Revert with explanation (mandatory body stating why)**

```
revert: "feat(payment): add Stripe PaymentIntent optimization"

The optimization reduced webhook reliability when Stripe rate-limits
our account. Reverting to direct charge API reduces latency but
guarantees delivery. Stripe optimization requires retry strategy first.

This reverts commit abc123def456.

Closes #890
```

**Pure refactor (subject-only OK, no new behavior)**

```
refactor(wallet): consolidate balance calculation to single method
```

**Performance optimization (body recommended if non-obvious why)**

```
perf(auth): cache JWKS keys for 24 hours instead of per-request

Reduces JWT validation latency from ~50ms to <1ms for cached keys.
Jwks keys rotate infrequently; 24-hour TTL is safe.

Closes #345
```

## Auto-Clarity Checklist

Before committing, ask yourself:

- **Is this a breaking change?** → MUST include BREAKING CHANGE footer
- **Does this fix a security issue?** → MUST explain the vulnerability
- **Does this migrate data irreversibly?** → MUST document rollback impact
- **Are you reverting a prior commit?** → MUST explain why it was wrong
- **Would a senior engineer wonder "why did we do this?"** → Include body
- **Does scope match project convention?** → Verify against recent commits
- **Is this touching multiple systems for a single logical reason?** → Add body explaining why

## Scope & Boundaries

**What this skill does:**

- Generates terse commit messages matching Conventional Commits
- Applies judgment rules for body inclusion
- Catches NEVER anti-patterns
- Suggests scope based on change context

**What this skill does NOT do:**

- Execute `git commit` or stage files
- Amend prior commits
- Run git commands
- Validate against actual project conventions (verify scope yourself first)

**Revert to verbose mode:** Type "stop caveman-commit", "normal mode", or "verbose commits" to disable compression.
