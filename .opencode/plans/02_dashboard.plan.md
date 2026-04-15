# 02_dashboard.plan.md

## Goal

Ensure the Dashboard page follows repository patterns and add a minimal unit test asserting the Dashboard client wrapper renders metrics provided by the server wrapper.

## Scope

- Add plan file (this file)
- Add a unit test: `tests/unit/DashboardClientWrapper.props.test.tsx`

## Files Reviewed (no edits planned)

- app/(root)/dashboard/page.tsx — route entry delegating to DashboardServerWrapper
- components/dashboard/dashboard-server-wrapper.tsx — server-only: auth + server actions
- components/dashboard/dashboard-client-wrapper.tsx — client-only rendering of metrics and charts
- actions/plaid.actions.ts — provides getAllAccounts/getAllBalances/getAllWalletsWithDetails
- actions/transaction.actions.ts — provides getRecentTransactions
- actions/wallet.actions.ts — provides getUserWallets
- components/section-cards/section-cards.tsx — KPI cards (used by DashboardClientWrapper)

## Planned Changes (minimal)

1. Add a unit test that renders DashboardClientWrapper with deterministic props and asserts KPI text and numeric formatting are present.
2. No other code changes are required for this page at this time. If the test discovers gaps, we will create an expanded plan and follow the ≤3-file patch rule.

## Test checklist (developer)

1. Run the single test locally:
   - `npm run test -- tests/unit/DashboardClientWrapper.props.test.tsx`
2. If running DAL/unit tests that need DB:
   - `npm run db:push && npm run db:seed`
   - `npm run test`

## Risk & Mitigation

- If the Dashboard client wrapper imports child components that fail under jsdom, mock them in the test using `vi.mock()` or replace with shallow mocks.
- If the test requires next/navigation behavior, add a per-test mock for `next/navigation`.

## Notes

- Per repo policy, we keep the change set small and create an expanded plan if >3 files are needed.
