# Test Context

This document lists test files, helpers, fixtures and configuration discovered in the repository. Use this to understand test coverage, test helpers, and environment expectations.

## Test frameworks

- Playwright for E2E tests (tests/e2e)
- Vitest for unit tests (tests/unit)

## Setup and global helpers

- tests/setup.ts — Vitest setup file
- tests/e2e/global-setup.ts — Playwright global setup
- tests/e2e/global-teardown.ts — Playwright global teardown
- tests/mocks/msw/server.ts — MSW mock server for unit tests

## Fixtures

- tests/fixtures/pages/\* — Page fixtures for Playwright tests
- tests/fixtures/wallets.ts — Wallet fixture data
- tests/fixtures/transactions.ts — Transaction fixture data
- tests/fixtures/auth.ts — Auth fixtures

## Notable test files

- tests/unit/TotalBalanceBox.test.tsx
- tests/unit/Sidebar.test.tsx
- tests/unit/MobileNav.test.tsx
- tests/unit/AuthForm.test.tsx
- tests/unit/plaid.test.ts
- tests/unit/wallet.actions.test.ts
- tests/e2e/auth.spec.ts
- tests/e2e/my-wallets.spec.ts
- tests/e2e/wallet-linking.spec.ts
- tests/e2e/payment-transfer.spec.ts
- tests/e2e/transaction-history.spec.ts

## Test-related scripts

- npm run test (runs Playwright E2E then Vitest)
- tests use port 3000 for the dev server (ensure free before running E2E)

## Recommended improvements

- Ensure MSW handlers cover all external API calls used by unit tests (Plaid, Dwolla)
- Add more unit tests around DAL methods to assert no N+1 patterns
- Add CI job to run E2E against a local ephemeral DB seeded via scripts/seed
