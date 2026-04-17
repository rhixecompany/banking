# Dashboard Refactor

## Goals

- Audit and harden the Dashboard page and its wrappers to ensure they follow repo standards: data-fetching in server wrapper, presentation in client wrapper, DAL-only DB access, Server Actions for writes, Zod validation for inputs, and auth() usage where required.
- Prevent N+1 database queries by verifying DAL usage and batching where appropriate.
- Stabilize unit tests that reference dashboard-related components and actions.

## Scope

- Small, focused changes limited to the Dashboard route and closely related modules: server/client wrappers, referenced actions, DAL helpers they call, and presentational components used directly by the Dashboard. Do NOT touch global layout or Home page.
- Expected to touch fewer than 10 files initially; if work expands beyond 7 files, follow the plan-file rule and update this plan (or create a more detailed plan).

## Target Files

- app/(root)/dashboard/page.tsx (entry: should remain static and delegate to wrappers)
- components/dashboard/dashboard-server-wrapper.tsx (server-side fetching + auth)
- components/dashboard/dashboard-client-wrapper.tsx (presentational client wrapper)
- actions/plaid.actions.ts (getAllAccounts, getAllWalletsWithDetails) — verify batching and graceful mock behavior
- actions/transaction.actions.ts (getRecentTransactions) — verify error handling and shape
- actions/wallet.actions.ts (getUserWallets) — verify return shape
- dal/\* (walletsDal, adminDal) — inspect for N+1 patterns and joins
- components used by client wrapper: ChartAreaInteractive, DoughnutChart, HeaderBox, SectionCards, WalletsOverview — ensure presentational code only
- tests that reference these actions/components (tests/unit/_ and tests/e2e/_) — update mocks if needed

## Risks

- Accidental introduction of server-side auth or DAL calls into app/page.tsx or Home (must be avoided).
- Introducing changes that break Playwright E2E seeds or test deterministic mocks (Plaid/Dwolla short-circuits).
- Creating N+1 queries if actions are modified naively.
- Tests may require adjustments for chart/canvas mocks (Chart.js) — keep mocks scoped to unit tests.

## Planned Changes (initial)

1. Audit server wrapper (`components/dashboard/dashboard-server-wrapper.tsx`) for:
   - Proper use of `auth()` and redirect on missing session.
   - Parallel fetching of wallets, accounts, transactions (already Promise.all) and verify each action returns the stable `{ ok: boolean; ... }` shape.
   - Ensure the `userId` passed to client wrapper is derived from session and is a string.

2. Inspect actions called (plaid.actions, transaction.actions, wallet.actions):
   - Confirm they use DAL helpers for DB access and avoid per-wallet sequential fetching that causes N+1.
   - If a per-wallet loop exists, replace with batched processing (processInBatches helper exists in plaids actions — prefer reuse).
   - Ensure mock short-circuits exist for test tokens (isMockAccessToken) so E2E/tests remain deterministic.

3. Audit client wrapper and presentational components:
   - Ensure components are presentational (props-only) and free of DB or auth calls. If not, extract presentational component into `components/layouts/` and move fetching to server wrapper.
   - Confirm numeric aggregations handle empty arrays and types are strictly typed (no `any`).
   - Ensure charts are mocked or guarded in tests to avoid canvas/context errors.

4. Tests & Fixtures:
   - Run unit tests and adjust test setup mocks if needed (jest-dom, Chart mocks, sonner toasts).
   - Add or update unit tests for server wrapper behavior (redirect when unauthenticated, passes normalized props when authenticated). Use existing deterministic session mocks.

## Validation

- Local checks to run after changes:
  1. npm run format
  2. npm run type-check
  3. npm run lint:strict (or at least lint the changed files)
  4. npx vitest -c vitest.config.ts --run (unit tests)
  5. Optionally run `npm run test:ui` if E2E seeds are prepared (requires DB and seed runner)

- Specific assertions:
  - DashboardServerWrapper calls `auth()` and redirects when missing session.
  - DashboardServerWrapper obtains wallets, accounts, transactions via actions and passes typed props to client wrapper.
  - No ad-hoc DB queries appear in client components.
  - No new `any` introduced; TS strict passes.

## Rollback / Mitigation

- Keep changes small and in a single commit. If tests fail or runtime errors appear, revert the commit and open a follow-up patch that addresses the failure.
- If a change to an action causes test instability, revert that change and create an isolated change that adds safer logging and test guards first.

## Files Read / Provenance

The following files were inspected to create this plan (path + one-line rationale):

- app/(root)/dashboard/page.tsx — entry page for dashboard; confirms delegation to server wrapper.
- components/dashboard/dashboard-server-wrapper.tsx — server fetching/auth wrapper; primary audit target.
- components/dashboard/dashboard-client-wrapper.tsx — client-rendering wrapper; presentational responsibilities.
- actions/plaid.actions.ts — provides getAllAccounts and wallet-related helpers called by dashboard.
- actions/transaction.actions.ts — provides getRecentTransactions used by dashboard.
- actions/wallet.actions.ts — provides getUserWallets used by dashboard.
- dal/admin.dal.ts — contains getRecentTransactions implementation variants to verify N+1 avoidance.
- components/doughnut-chart/doughnut-chart.tsx — chart component that can cause canvas issues in unit tests.
- components/chart-area-interactive/chart-area-interactive.tsx — area chart used on dashboard.
- components/shared/wallets-overview.tsx — wallets overview UI used by dashboard.
- tests/unit/transaction.actions.test.ts — existing tests referencing transaction actions; informs required test mocks.
- tests/unit/wallet.actions.test.ts — tests for wallet actions; used to validate return shapes.
- tests/e2e/wallet-linking.spec.ts — notes for E2E interaction with Plaid flows and mocks.
- types/index.d.ts — central types (Account, Wallet, Transaction) referenced by dashboard wrappers.

## Next Steps (if you approve)

1. Confirm you want me to implement the initial small changes (audit fixes + test updates). I will limit the first commit to the safest edits: typings, test mocks (scoped), and small server-wrapper hardening.
2. If approved, I'll implement changes and run type-check + unit tests locally, then produce a focused commit and list of files changed for review.

If you want any constraints (for example: avoid touching actions/\*, or prefer module-scoped chart mocks instead of global test mocks), tell me now and I'll follow that restriction.
