# Extract Layouts And Harden Tests

## Goals

- Extract presentational UI components referenced by pages into `components/layouts/` as kebab-cased folders with `index.tsx` default exports.
- Centralize shared Zod schemas into `lib/schemas/` (one file per domain).
- Ensure DAL-only database access and add eager-loading helpers to prevent N+1 queries.
- Ensure Server Actions follow the contract: auth() first, Zod validation, DAL usage, transaction-scoped writes, and return `{ ok: boolean; error?: string }`.
- Harden Vitest and Playwright tests by adding fixtures/mocks and making authenticated flows deterministic using a seeded user.

## Scope

- All pages under `app/` discovered in repo: Home, Dashboard, My Wallets, Payment Transfer, Settings, Transaction History, Sign-in, Sign-up, Admin.
- Related components, DAL helpers, server actions, and tests.

## Target Files (high-level)

- `components/layouts/*` (new/extracted presentational components)
- `lib/schemas/*.schema.ts` (new centralized schemas)
- `dal/*.dal.ts` (add eager-loading helpers)
- `actions/*.ts` (server actions validation/auth enforcement)
- `tests/fixtures/*`, `tests/mocks/*` (new fixtures and centralized mocks)
- `tests/unit/*` and `tests/e2e/*` (hardened and new tests)
- `scripts/seed/run.ts` (ensure seeded user creation)
- `docs/test-context.md` (update to reference new fixtures/mocks and seeded user)

## Risks

- Large change touches many files causing merge conflicts — mitigated by careful diffs and clear commit message.
- Playwright flakiness — mitigated by using seeded data, ENABLE_TEST_ENDPOINTS helpers, and role-based selectors.
- Seed script may be destructive — mitigated by using `--dry-run` and gating per repository conventions.

## Planned Changes

1.  Create `components/layouts/total-balance` test and ensure `TotalBalanceLayout` is props-only.
2.  Add fixtures under `tests/fixtures/` for seed user and sample accounts/transactions.
3.  Centralize Transfer/Profile schemas under `lib/schemas/` and update server/client imports.
4.  Implement `transactionDal.findByUserIdWithWallets` to eager-load wallets.
5.  Harden tests: mock DoughnutChart, AnimatedCounter, network calls via msw; update Playwright tests to use seeded user and test helpers.
6.  Update `docs/test-context.md` with new fixtures and guidelines.

## Validation

- Run unit tests for modified components locally and ensure they pass.
- Run `npm run db:seed -- --dry-run` to validate seed plan.
- Run Playwright E2E against seeded DB using `npm run test:ui` after seeding.
- Run `npm run format`, `npm run type-check`, `npm run lint:strict` and `npm run test`.

## Rollback / Mitigation

- Use git to revert the single commit if required. Since changes will be committed to the current branch per instructions, coordinate if upstream updates conflict.

## Notes

- Follow AGENTS.md rules for Server Actions and DAL patterns.
- Keep Home page static — do not add auth or DAL calls to `app/page.tsx` or Home wrappers.
