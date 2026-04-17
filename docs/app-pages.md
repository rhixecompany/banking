# App Pages — Detailed Per-Page Audits

This file contains detailed read-only audits for each Next.js page under app/. Each page entry includes:

- Files: page file + server/client wrappers
- Custom components used (excluding components/ui)
- Server Actions imported
- DAL methods called
- Zod schemas referenced
- Tests that touch the page
- Suggested minimal fixes and patches

The audits are ordered by priority and intended to drive small, focused implementation patches.

1. Home — app/page.tsx -> HomeServerWrapper

- Files:
  - app/page.tsx
  - components/home/home-server-wrapper.tsx
  - components/home/home-client-wrapper.tsx
  - components/shared/wallets-overview.tsx
  - components/total-balance-box/total-balance-box.tsx

- Components: TotalBalanceBox, WalletsOverview, CTA components.
- Actions: none expected (Home must remain static).
- DAL: none expected; any user-data fetching must be moved to Dashboard.
- Zod schemas: none expected.
- Tests: unit tests for presentational pieces (e.g., TotalBalanceBox.test.tsx).

- Suggested patches:
  - Ensure HomeServerWrapper contains no auth() or DAL calls. If present, move to DashboardServerWrapper.
  - Extract UI-only presentational components to components/layouts/ (e.g., components/layouts/total-balance) and add unit tests.
  - NOTE: `components/layouts/total-balance` and `components/layouts/wallet-card` were added and have unit tests under components/layouts/\*.

2. Dashboard — app/(root)/dashboard/page.tsx -> DashboardServerWrapper

- Files:
  - app/(root)/dashboard/page.tsx
  - components/dashboard/dashboard-server-wrapper.tsx
  - components/dashboard/dashboard-client-wrapper.tsx
  - components/total-balance-box/total-balance-box.tsx
  - components/shared/wallets-overview.tsx

- Components: Dashboard uses TotalBalanceBox, WalletsOverview, charts, and datatables.
- Actions: getRecentTransactions (actions/transaction.actions.ts) is used typically.
- DAL: transactionDal.findByUserId via actions -> DAL (ok). Check for N+1 patterns.
- Tests: tests/unit/dashboard-\* and tests/e2e/dashboard.spec.ts.

- Suggested patches:
  - Verify server actions validate inputs and call auth() early.
  - Extract presentational components where appropriate and add unit tests.
  - Add DAL helpers that batch related queries to avoid per-row queries.

3. My Wallets — app/(root)/my-wallets/page.tsx -> MyWalletsServerWrapper

- Files:
  - app/(root)/my-wallets/page.tsx
  - components/my-wallets/my-wallets-server-wrapper.tsx
  - components/my-wallets/my-wallets-client-wrapper.tsx
  - dal/wallet.dal.ts, actions/wallet.actions.ts

- Components: wallet client wrappers, wallet card, sidebar.
- Actions: getUserWallets / wallet.actions.
- DAL: walletsDal should handle decryption and provider parsing.
- Tests: tests/unit/wallets-overview.test.tsx, tests/e2e/my-wallets.spec.ts.

- Suggested patches:
  - Move decryption/provider parsing into DAL helpers.
  - Extract WalletCard into components/layouts/wallet-card and add unit tests.

4. Payment Transfer — app/(root)/payment-transfer/page.tsx -> PaymentTransferServerWrapper

- Files:
  - app/(root)/payment-transfer/page.tsx
  - components/payment-transfer/payment-transfer-server-wrapper.tsx
  - components/payment-transfer/payment-transfer-client-wrapper.tsx
  - actions/dwolla.actions.ts, actions/recipient.actions.ts, actions/wallet.actions.ts
  - dal/recipient.dal.ts, dal/wallet.dal.ts, dal/dwolla.dal.ts

- Observations:
  - Server wrapper correctly calls auth(), fetches wallets & recipients in parallel, and passes createTransfer server action into client wrapper (correct pattern).
  - Client wrapper defines TransferSchema locally; consider centralizing.

- Tests: tests/unit/payment-transfer-form.test.tsx, tests/e2e/payment-transfer.spec.ts.

- Suggested patches:
  - Centralize TransferSchema in lib/schemas/transfer.schema.ts.
  - Ensure createTransfer server action validates input with Zod, performs DB transaction, and returns the stable { ok, error? } shape.
  - Extract PaymentTransferForm into components/layouts/ and write unit tests using autoSubmit initial\* patterns for deterministic behavior.

5. Settings — app/(root)/settings/page.tsx -> SettingsServerWrapper

- Files:
  - app/(root)/settings/page.tsx
  - components/settings/settings-server-wrapper.tsx
  - components/settings/settings-client-wrapper.tsx
  - actions/updateProfile.ts, actions/user.actions.ts

- Observations:
  - Server wrapper fetches getUserWithProfile and passes updateProfile to client wrapper (good).
  - Client wrapper duplicates ProfileSchema and PasswordSchema; centralize to avoid drift.

- Tests: tests/unit/settings-profile-form.test.tsx, tests/e2e/settings.spec.ts.

- Suggested patches:
  - Move ProfileSchema/PasswordSchema to lib/schemas/profile.schema.ts and use the same schema in updateProfile server action.
  - Ensure updateProfile action authenticates and returns { ok, error? }.

6. Transaction History — app/(root)/transaction-history/page.tsx

- Files:
  - app/(root)/transaction-history/page.tsx
  - components/transaction-history/transaction-history-server-wrapper.tsx
  - components/transaction-history/transaction-history-client-wrapper.tsx
  - actions/transaction.actions.ts
  - dal/transaction.dal.ts

- Observations:
  - Server wrapper calls getTransactionHistory and passes transactions to client wrapper.
  - DAL currently returns transactions without joining wallet metadata; if datatable requires metadata, add an eager-load helper.

- Tests: tests/e2e/transaction-history.spec.ts, tests/unit/transaction-history-client-wrapper.test.tsx.

- Suggested patches:
  - Add transactionDal.findByUserIdWithWallets to join wallets and return necessary metadata in one query.
  - Add unit tests for mapping functions (toItem) and ensure correct status mapping.

7. Sign-in & Sign-up — app/(auth)/sign-in/page.tsx, app/(auth)/sign-up/page.tsx

- Files:
  - components/sign-in/_, components/sign-up/_, actions/register.ts

- Observations:
  - Pages use Suspense boundaries for server async auth APIs (Next.js 16 pattern).
  - SignUpServerWrapper passes registerUser to AuthForm (acceptable pattern).

- Tests: tests/e2e/auth.spec.ts, tests/unit/register.test.ts.

- Suggested patches:
  - Ensure register server action validates with Zod, authenticates as needed, and returns stable shape.

8. Admin — app/(admin)/admin/page.tsx

- Files:
  - components/admin/admin-dashboard-server-wrapper.tsx
  - dal/admin.dal.ts, actions/admin.actions.ts

- Observations:
  - Admin pages are protected by (admin)/layout.tsx and should perform isAdmin guard checks.

- Tests: tests/e2e/admin.spec.ts, tests/unit/admin.actions.test.ts.

- Suggested patches:
  - Validate admin server wrappers enforce isAdmin and server actions verify auth + isAdmin.

Cross-cutting recommendations

- Centralize Zod schemas under lib/schemas/ for shared server/client validation.
- Extract presentational components into components/layouts/ as props-only units and add unit tests.
- Ensure Server Actions follow the contract: auth() first, Zod validation, DAL usage, transaction-scoped writes, and stable return shape.
- Avoid ad-hoc DB queries in components; add DAL helpers to prevent N+1 queries.

Acceptance criteria (page)

- Server Actions validate inputs via Zod, call auth() when required, and return { ok, error? }.
- DAL access occurs only through dal/\* with no ad-hoc queries in components.
- Presentational components extracted into components/layouts/.
- Unit tests added/updated for modified components and actions.
- E2E readiness: tests use seeded data or mocks.

Notes

- This document is intentionally detailed so implementation can be done in small focused commits. For cross-cutting changes that affect >7 files, create a plan file under .opencode/commands/ per AGENTS.md before implementing the change.
