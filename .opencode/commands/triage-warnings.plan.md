## Plan: Triage verify-rules warnings (short)

Goal

- Reduce noise from intentional/acceptable patterns flagged by `scripts/verify-rules.ts` and address high-priority issues (critical and security-sensitive warnings).

Scope

- Small, focused changes to verify-rules configuration and targeted fixes for critical issues. This plan will be executed on the current branch.

Phases

1. Allowlist intentional exceptions
   - Add entries to `.opencode/verify-rules.config.json` for files that legitimately read process.env or are intentionally unauthenticated (e.g., registration action).
   - Rationale: these files are build/test/infra or public endpoints and should not be forced to call auth() or be required to import app-config.

2. Triage server actions
   - Identify `actions/*` flagged with `server-action-auth` or `server-action-zod` and determine whether they must authenticate or instead require explicit allowlisting.
   - For actions that must authenticate, modify the action to call `auth()` early. For public actions (register, login, etc.), add an allowlist entry with a short justification in the plan.

3. Type/any cleanup (medium priority)
   - Files flagged with `no-any` will be added to a backlog if extensive; otherwise replace `any` with proper types where trivial.

4. Re-run checks and tests
   - Run `npm run verify:rules` and `npm run test` (unit); escalate to E2E if green.

Acceptance criteria

- `npm run verify:rules` should report no critical issues and fewer noise warnings for intentionally-exempt files.
- No test regressions when running unit tests.

Provenance: read .opencode/verify-rules.config.json and actions/register.ts to author this plan.
