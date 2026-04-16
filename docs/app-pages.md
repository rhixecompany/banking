# App Pages Inventory (Draft)

Notes

- Definition used: Next.js pages are files named `page.tsx` or `page.ts` in `./app/**`.
- Layouts and route-groups are included since they affect page behavior and caching.
- Purpose: canonical list for sequential per-page audit & enhancement (Home first).

Pages (prioritized)

1. Home
   - Route: /
   - File: app/page.tsx
   - Layout: app/layout.tsx
   - Server/Client wrappers:
     - components/home/home-server-wrapper.tsx
     - components/home/home-client-wrapper.tsx
   - Key components referenced (surface-level):
     - components/site-header/site-header.tsx
     - components/sidebar/sidebar.tsx
     - components/shared/wallets-overview.tsx
     - components/total-balance-box/total-balance-box.tsx
   - Actions referenced / likely: (inspect wrappers for precise imports)
     - See components/home/\* server wrapper to confirm
   - Tests referencing:
     - tests/unit/wallets-overview.test.tsx
     - tests/unit/TotalBalanceBox.test.tsx
     - tests/fixtures/pages/base.page.ts
   - Notes / priorities:
     - Start here for the page-first workflow.
     - Audit server actions and any DAL access in server-wrapper files.

2. My Wallets (Wallets)
   - Route: /my-wallets
   - File: app/(root)/my-wallets/page.tsx
   - Layout: app/(root)/layout.tsx
   - Server wrapper:
     - components/my-wallets/my-wallets-server-wrapper.tsx
   - Key components:
     - components/shared/wallets-overview.tsx
     - components/plaid-link-button/plaid-link-button.tsx
   - Actions referenced:
     - actions/plaid.actions.ts (createLinkToken, exchangePublicToken, getWalletWithDetails)
   - Tests:
     - tests/e2e/my-wallets.spec.ts
     - tests/fixtures/pages/my-wallets.page.ts

3. Payment Transfer (Transfers)
   - Route: /payment-transfer
   - File: app/(root)/payment-transfer/page.tsx
   - Server/Client wrappers:
     - components/payment-transfer/payment-transfer-server-wrapper.tsx
     - components/payment-transfer/payment-transfer-client-wrapper.tsx
   - Actions referenced (server-wrapper imports):
     - createTransfer (actions/dwolla.actions.ts)
     - getRecipients (actions/recipient.actions.ts)
     - getUserWallets (actions/wallet.actions.ts)
   - Tests:
     - tests/e2e/payment-transfer.spec.ts
     - tests/unit/PaymentTransferClientWrapper.props.test.tsx

4. Dashboard
   - Route: /dashboard
   - File: app/(root)/dashboard/page.tsx
   - Server wrapper:
     - components/dashboard/dashboard-server-wrapper.tsx
     - components/dashboard/dashboard-client-wrapper.tsx
   - Actions referenced:
     - getAllAccounts (actions/plaid.actions.ts)
     - getRecentTransactions (actions/transaction.actions.ts)
     - getUserWallets (actions/wallet.actions.ts)
   - Tests:
     - tests/e2e/dashboard.spec.ts
     - tests/fixtures/pages/dashboard.page.ts

5. Transaction History
   - Route: /transaction-history
   - File: app/(root)/transaction-history/page.tsx
   - Server wrapper:
     - components/transaction-history/transaction-history-server-wrapper.tsx
     - components/transaction-history/transaction-history-client-wrapper.tsx
   - Actions referenced:
     - getTransactionHistory (actions/transaction.actions.ts)
   - Tests:
     - tests/e2e/transaction-history.spec.ts
     - tests/fixtures/pages/transaction-history.page.ts

6. Settings (Account)
   - Route: /settings
   - File: app/(root)/settings/page.tsx
   - Layout: app/(root)/layout.tsx
   - Actions referenced (layout/site-level):
     - getUserWithProfile, logoutAccount (actions/user.actions.ts)
   - Tests:
     - tests/e2e/settings.spec.ts
     - tests/unit/SettingsClientWrapper.props.test.tsx

7. Auth: Sign-up, Sign-in
   - Routes: /sign-up, /sign-in
   - Files:
     - app/(auth)/sign-up/page.tsx
     - app/(auth)/sign-in/page.tsx
   - Components:
     - components/sign-up/\* (server & client wrappers)
     - components/sign-in/\* (server & client wrappers)
   - Tests:
     - tests/e2e/auth.spec.ts
     - tests/fixtures/pages/sign-up.page.ts
     - tests/fixtures/pages/sign-in.page.ts

8. Admin
   - Route: /admin
   - File: app/(admin)/admin/page.tsx
   - Layout: app/(admin)/layout.tsx
   - Server wrapper:
     - components/admin/admin-dashboard-server-wrapper.tsx
   - Actions referenced:
     - actions/admin-stats.actions.ts
   - Tests:
     - tests/e2e/admin.spec.ts

Other notes

- app/layout.tsx imports (site-level actions) e.g., createLinkToken, exchangePublicToken (plaid), and user actions — review these for auth & short-circuit mocks during E2E.
- There are route-group folders (e.g., `(root)`, `(auth)`, `(admin)`) — include them in route planning because layouts & route groups affect caching and server-actions behavior.
