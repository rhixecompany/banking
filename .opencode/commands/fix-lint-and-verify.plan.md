# Fix Lint, Formatting, and Verify Rules

## Goals

- Reduce repo lint and verify-rules failures to zero critical issues and remove automated-fixable warnings.
- Ensure formatting/markdown fixes are applied and the verify-rules report has no critical violations.
- Make small, auditable commits, each scoped to a single fix category.

## Scope

- Automated fixes: npm run format, npm run format:markdown:fix, npm run lint:fix:all (already run once).
- Manual fixes: process.env usages in config files, regex patterns flagged as super-linear, console/no-console warnings in scripts, React hook deps, no-floating-promises, strict equality (== => ===) fixes in tests, null -> undefined adjustments where semantically safe, a11y label associations, and security-detected non-literal fs usage in tests.

## Target Files (initial high-signal list)

- drizzle.config.ts
- next-sitemap.config.ts
- playwright.config.ts
- scripts/mcp-runner-lib.ts
- scripts/mcp-runner.ts
- scripts/orchestrator.ts
- scripts/plan-ensure.ts
- scripts/verify-rules.ts
- components/plaid-context/plaid-context.tsx
- components/plaid-link/plaid-link.tsx
- components/payment-transfer/payment-transfer-client-wrapper.tsx
- components/ui/multi-select.tsx
- dal/transaction.dal.ts
- tests/\*_/_ (tests with eqeqeq, null, a11y issues)
- components/\*\* (jsdoc param warnings)

Note: the full list of files with issues is larger (176 problems across ~50 files). This plan covers the high-signal files; implementation will enumerate and touch only necessary files per fix category.

## Risks

- Changing many files risks incidental behavioral changes; we'll prefer minimal, mechanical edits and avoid logic changes.
- Modifying tests may require re-running unit tests; we'll run targeted tests after each commit.
- Replacing process.env usage requires adding app-config.ts / lib/env.ts access — ensure values are already exposed or add typed wrappers; missing env values may need user input.

## Planned Changes (phased)

1. Prep (no-code changes)
   - Create backups of targeted files under .opencode/backups/fix-lint-<timestamp>/ (tracked manifest).
   - Save current reports: .opencode/reports/rules-precommit.json (exists) and eslint output to .opencode/reports/lint-initial.txt.

2. Automated passes (already run once)
   - npm run format
   - npm run format:markdown:fix
   - npm run lint:fix:all
   - Capture outputs to .opencode/reports/

3. Fix category A — Configuration env access (critical)
   - Replace direct process.env reads in config files (drizzle.config.ts, playwright.config.ts, next-sitemap.config.ts, etc) with imports from app-config.ts or lib/env.ts.
   - If a canonical export does not exist for a variable, add it to app-config.ts (non-runtime) or lib/env.ts with zod validation as appropriate.
   - Validate with npx tsx scripts/verify-rules.ts and type-check.

4. Fix category B — Security/regex issues
   - Refactor vulnerable regexes in scripts/mcp-runner-lib.ts and any other flagged files to use safer, atomic patterns or explicit parsing logic.
   - Add unit tests for critical regex behavior where appropriate.

5. Fix category C — No-console and process.env in scripts
   - Replace console.log in scripts with console.warn/error or a lightweight logger utility used across scripts, or silence via ESLint override comments where intentional.
   - For scripts that must read process.env (scripts/\* CLI helpers), add explicit exception comments and/or wrapper import from lib/env.ts per repo rules.

6. Fix category D — React hooks and runtime issues
   - Add missing dependencies to useEffect or wrap functions in useCallback where appropriate (plaid-context, plaid-link).
   - For no-floating-promises, add await or void operator where the promise can be safely ignored.

7. Fix category E — Tests and minor code style
   - Replace `==` with `===` in tests and code where safe.
   - Replace `null` with `undefined` where warnings indicate preference (tests and code fixtures), but only when semantic meaning is preserved.
   - Address a11y label associations in tests/mocks.

8. Finalize
   - Run: npm run format, npm run lint:fix:all, npm run type-check, npx tsx scripts/verify-rules.ts --output .opencode/reports/rules-postfix.json
   - Ensure verify-rules shows zero critical issues and lint has no errors (warnings allowed if not fixable automatically).

## Validation

- Primary: npx tsx scripts/verify-rules.ts output must show 0 critical issues and total issues within acceptable threshold.
- Secondary: npm run type-check must pass with zero errors. npm run lint:strict (for CI) to be rechecked before commit.
- Run unit tests: npm run test:browser (selective) and optionally full test suite.

## Rollback / Mitigation

- Backups saved under .opencode/backups/fix-lint-<timestamp>/ with manifest and SHA256 checksums.
- All changes will be split into small commits (one commit per category). If an issue arises, revert that commit and restore from backups.

## Implementation Notes

- Per repository rule, because this touches >7 files, I created this plan under .opencode/commands/ before making edits.
- After you approve this plan, I will implement the changes in small commits and report after each phase, running the validation commands and saving reports to .opencode/reports/.

## Files read for triage

- Output of: npm run format, npm run format:markdown:fix, npm run lint:fix:all
- .opencode/reports/rules-precommit.json (verify-rules output)
- Files flagged in lint output (representative): scripts/mcp-runner-lib.ts, drizzle.config.ts, playwright.config.ts, next-sitemap.config.ts, components/plaid-context/plaid-context.tsx, components/plaid-link/plaid-link.tsx, components/payment-transfer/payment-transfer-client-wrapper.tsx, components/ui/multi-select.tsx, dal/transaction.dal.ts, tests/\*\*

---

If you approve, reply "approve" and I will begin Phase 1 (create tracked backups and implement category A fixes). If you prefer I start with a different category, tell me which.
