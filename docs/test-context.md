# Test Context Inventory

This document lists test files, helpers, and important fixtures used by unit and E2E tests.

- tests/setup.ts — Test environment setup
- tests/unit/\*\* — Vitest unit tests (many files)
- tests/unit/plaid.test.ts — Plaid-specific unit tests
- tests/unit/_dal_.test.ts — DAL tests (wallet.dal, dwolla.dal, transaction.dal)
- tests/unit/_actions_.test.ts — Action tests (transaction.actions, user.actions, dwolla.actions)
- tests/e2e/global-setup.ts — Playwright global setup
- tests/e2e/global-teardown.ts — Playwright global teardown
- tests/e2e/helpers/\* — Playwright helpers (auth, db, plaid, dwolla)
- tests/fixtures/\*\* — Test fixtures for pages and data

Notes:

- E2E tests rely on a running dev server and a dev DB; ensure port 3000 is free before running tests.
- Plaid & Dwolla helpers abstract external integrations for E2E; keep sandbox tokens out of repo.
