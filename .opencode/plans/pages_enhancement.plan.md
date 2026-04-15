# pages_enhancement.plan.md

## Goal

Bring every Next.js page under ./app into full compliance with repo patterns and ensure each page is fully functional and tested (unit + E2E).

## Scope

- Pages: dashboard, my-wallets, transaction-history, settings, payment-transfer, sign-in, sign-up, admin, home
- Server wrappers and client wrappers under components/\*
- Actions under actions/\*
- DAL under dal/\*
- Tests: tests/unit/_ and tests/e2e/_

## Files Discovered (to be referenced in patches)

- app/page.tsx
- app/(root)/dashboard/page.tsx
- app/(root)/my-wallets/page.tsx
- app/(root)/transaction-history/page.tsx
- app/(root)/settings/page.tsx
- app/(root)/payment-transfer/page.tsx
- app/(auth)/sign-in/page.tsx
- app/(auth)/sign-up/page.tsx
- app/(admin)/admin/page.tsx

- components/\* (many, key files listed below)
  - components/plaid-context/plaid-context.tsx
  - components/plaid-link-button/plaid-link-button.tsx
  - components/payment-transfer/payment-transfer-server-wrapper.tsx
  - components/payment-transfer/payment-transfer-client-wrapper.tsx
  - components/my-wallets/my-wallets-server-wrapper.tsx
  - components/my-wallets/my-wallets-client-wrapper.tsx
  - components/transaction-history/transaction-history-server-wrapper.tsx
  - components/transaction-history/transaction-history-client-wrapper.tsx
  - components/settings/settings-server-wrapper.tsx
  - components/settings/settings-client-wrapper.tsx
  - components/sign-in/sign-in-server-wrapper.tsx
  - components/sign-up/sign-up-server-wrapper.tsx
  - components/dashboard/dashboard-server-wrapper.tsx
  - components/dashboard/dashboard-client-wrapper.tsx

- actions/\*
  - actions/plaid.actions.ts
  - actions/dwolla.actions.ts
  - actions/wallet.actions.ts
  - actions/transaction.actions.ts
  - actions/recipient.actions.ts
  - actions/user.actions.ts
  - actions/admin-stats.actions.ts
  - actions/register.ts
  - actions/updateProfile.ts

- dal/\*
  - dal/wallet.dal.ts
  - dal/transaction.dal.ts
  - dal/dwolla.dal.ts
  - dal/recipient.dal.ts
  - dal/user.dal.ts
  - dal/admin.dal.ts

- database/\*
  - database/schema.ts
  - scripts/seed/seed-data.ts

- tests/\*
  - tests/e2e/helpers/plaid.mock.ts
  - tests/e2e/global-setup.ts
  - tests/e2e/\*.spec.ts
  - tests/unit/\*

## Planned Work (high level)

Work will be executed per-page in small patch sets. Each page patch will aim to touch <= 3 files where feasible. If a page change requires >3 files, this plan file will be updated and the larger patch will be created only after your approval.

Per-Page Checklist (applied to each page)

- Enumerate server/client components + Server Actions + DAL methods used by the page
- Ensure server wrappers use server-only imports and pass Server Actions to client wrappers (do not import server actions from client components)
- Add Zod validation to any actions lacking descriptive schemas
- Ensure actions call auth() and perform isAdmin checks if needed
- Ensure DAL is used for all DB queries and multi-step DB operations are wrapped in db.transaction
- Add/adjust unit tests for modified actions/DALs (Vitest)
- Add/adjust Playwright E2E specs where UI behavior changed. Use plaids.mock.ts helper and seed runner

Execution Order (recommended)

1. Dashboard
2. My Wallets
3. Payment Transfer
4. Settings
5. Transaction History
6. Auth: sign-in / sign-up
7. Admin
8. Home (landing)

## Verification

After all pages enhanced:

- npm run format
- npm run type-check
- npm run lint:strict
- npm run test (unit)
- Run Playwright E2E with PLAYWRIGHT_PREPARE_DB=true

## Notes and Rationale

- Changes will follow patterns described in AGENTS.md and repository coding standards.
- Any patch that modifies >3 files will be accompanied by a new plan file in .opencode/plans/ and will wait for your approval before applying.
- No commits will be created without explicit instruction.

## Next Step

I will start with step 1 (Dashboard). I will enumerate the exact files the Dashboard page imports and produce a small patch set proposal (<=3 files). Please approve to continue, or tell me to stop or change order.

## Files scanned to build this plan (exact paths)

- app/page.tsx
- app/(root)/dashboard/page.tsx
- app/(root)/my-wallets/page.tsx
- app/(root)/transaction-history/page.tsx
- app/(root)/settings/page.tsx
- app/(root)/payment-transfer/page.tsx
- app/(auth)/sign-in/page.tsx
- app/(auth)/sign-up/page.tsx
- app/(admin)/admin/page.tsx
- components/plaid-context/plaid-context.tsx
- components/plaid-link-button/plaid-link-button.tsx
- components/payment-transfer/payment-transfer-server-wrapper.tsx
- components/payment-transfer/payment-transfer-client-wrapper.tsx
- components/my-wallets/my-wallets-server-wrapper.tsx
- components/my-wallets/my-wallets-client-wrapper.tsx
- components/transaction-history/transaction-history-server-wrapper.tsx
- components/transaction-history/transaction-history-client-wrapper.tsx
- components/settings/settings-server-wrapper.tsx
- components/settings/settings-client-wrapper.tsx
- components/sign-in/sign-in-server-wrapper.tsx
- components/sign-up/sign-up-server-wrapper.tsx
- components/dashboard/dashboard-server-wrapper.tsx
- components/dashboard/dashboard-client-wrapper.tsx
- actions/plaid.actions.ts
- actions/dwolla.actions.ts
- actions/wallet.actions.ts
- actions/transaction.actions.ts
- actions/recipient.actions.ts
- actions/user.actions.ts
- actions/admin-stats.actions.ts
- actions/register.ts
- actions/updateProfile.ts
- dal/wallet.dal.ts
- dal/transaction.dal.ts
- dal/dwolla.dal.ts
- dal/recipient.dal.ts
- dal/user.dal.ts
- dal/admin.dal.ts
- database/schema.ts
- scripts/seed/seed-data.ts
- tests/e2e/helpers/plaid.mock.ts
- tests/e2e/global-setup.ts
- tests/e2e/\*.spec.ts
- tests/unit/\*
