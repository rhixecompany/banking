# My Wallets Page Audit

Files inspected

- components/my-wallets/my-wallets-server-wrapper.tsx — server wrapper that authenticates and calls getAllWalletsWithDetails()
- components/my-wallets/my-wallets-client-wrapper.tsx — client wrapper that renders the page, PlaidLinkButton, WalletCard, and TransactionList
- app/(root)/my-wallets/page.tsx — page entry that delegates to server wrapper
- actions/plaid.actions.ts — contains getAllWalletsWithDetails, getAllBalances, getTransactions, getWalletWithDetails, removeWallet, and other Plaid helpers
- dal/wallet.dal.ts — walletsDal used for DB access (findByUserId, findById, createWallet, softDelete)

Summary

- The server wrapper delegates to actions/plaid.actions.getAllWalletsWithDetails() which:
  - calls walletsDal.findByUserId(session.user.id)
  - calls getAllBalances(userId) which uses plaidClient.accountsBalanceGet for each wallet (batched)
  - fetches recent transactions for each wallet using getTransactions (batched)
  - composes WalletWithDetails objects and returns totalBalance
- The client wrapper renders:
  - PlaidLinkButton (components/plaid-link-button)
  - a Total Balance Card
  - A list of WalletCard components (in-file) which render balances and TransactionList
- removeWallet server action is passed into the client wrapper and executes walletsDal.softDelete + cache revalidation

Risks / notes

- Plaid actions include defensive short-circuits for mock tokens used in tests — do not remove them.
- DAL handles encryption/decryption of access tokens — keep this centralized and do not bypass walletsDal.
- WalletCard and TransactionList are defined inline in the client wrapper. For reusability and testability, consider extracting them to components/layouts/wallet-card.tsx and components/layouts/transaction-list.tsx

Recommended next small steps (minimal, one-change commits)

1. Extract WalletCard and TransactionList into components/layouts/wallet-card.tsx and components/layouts/transaction-list.tsx, keeping props and behavior identical. Add unit tests for each.
2. In MyWalletsClientWrapper, import the extracted components and use them.
3. Add tests for the removeWallet interaction: stub removeWallet and verify the toast/error path (unit test for client wrapper)
4. Optionally: add a small smoke test that MyWalletsServerWrapper redirects when unauthenticated (unit test / integration)

Do you want me to implement step 1 (extract WalletCard and TransactionList) now, or proceed with a different next step?
