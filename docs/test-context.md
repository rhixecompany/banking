---
title: Test Context & Inventory
---

# Test Context

This document lists test suites, helpers, and configuration used by the project.

## Test Runners & Config

- Vitest (unit/integration): `vitest.config.ts` — setupFiles: `tests/setup.ts`, environment: `happy-dom`.
- Playwright (E2E): Playwright config (project setup in `tests/e2e/`) — Chromium only, 1 worker recommended.

## Key Test Files & Helpers

- tests/setup.ts — Vitest global setup (loads .env.local and mocks)
- tests/fixtures/ — Test fixtures for pages and data (wallets, transactions)
- tests/fixtures/pages/\*.page.ts — Page object helpers for Playwright tests
- tests/mocks/msw/server.ts — MSW server for network request mocking in unit tests

## E2E Helpers

- tests/e2e/helpers/auth.ts — E2E auth helpers
- tests/e2e/helpers/db.ts — DB helpers for E2E (migrations/seeds)
- tests/e2e/helpers/plaid.ts — Plaid sandbox helpers
- tests/e2e/global-setup.ts — Starts server and prepares test state
- tests/e2e/global-teardown.ts — Cleans up after tests

## Test Suites (examples)

- tests/e2e/auth.spec.ts — Authentication E2E flows
- tests/e2e/dashboard.spec.ts — Dashboard smoke tests
- tests/e2e/my-wallets.spec.ts — Wallet linking & display flows
- tests/unit/\* — Multiple unit tests for DAL, actions, components

## Notes & Recommendations

- Before running Playwright E2E, ensure port 3000 is free (Windows PowerShell snippet in AGENTS.md).
- Unit tests use `happy-dom` and run quickly; run `npm run test:browser` for faster feedback.
- Maintain page object patterns in `tests/fixtures/pages` for E2E readability.
