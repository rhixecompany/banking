# Test Context — Patterns and Helpers

Purpose

- Provide a clear, reproducible test context for unit and E2E suites used by the Banking app.

Overview

- The repository runs Playwright E2E first (stateful) followed by Vitest unit tests. Tests must avoid nondeterministic external network calls by using seeded data and the projects mock helpers.

Global helpers and patterns

- Seed runner: scripts/seed/run.ts
  - Use this script to prepare DB state for Playwright. It must be invoked via `npm run db:seed` (it loads .env.local before importing app modules).
  - Always validate with `--dry-run` first to inspect planned operations.
  - For deterministic authenticated tests the seed runner will create a seeded test user with credentials stored in `tests/fixtures/seed-user.json`.
  - Default seeded user for test runs: `seed.user@example.com / P@ssw0rd`.

- Plaid & Dwolla short-circuits
  - tests/e2e/helpers/plaid.mock.ts provides helpers to inject a mock Plaid init script into the page. Use `addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN")` prior to navigation.
  - Dwolla helpers detect "mock" in IDs/URLs and avoid external calls.

- DB helpers for E2E
  - tests/e2e/helpers/db.ts is used by Playwright global-setup/teardown to prepare and clean DB state.

Unit Tests

- Keep unit tests deterministic and fast.
- Use msw or centralized mocks located under tests/mocks for network interactions. Add fixtures under `tests/fixtures/` and reference them from unit and E2E setups to ensure deterministic data.
- Prefer testing presentational components in isolation; extract large pieces into components/layouts so they can be tested without app wiring.

Playwright E2E

- Run order: Playwright E2E runs before unit tests in CI. Prepare DB state with `npm run db:seed` (or an appropiate CI helper) before running Playwright.
- Ensure `ENABLE_TEST_ENDPOINTS=true` is set when relying on test-only endpoints (for example: /**playwright**/set-cookie helpers).
- Use role/ARIA-based queries and avoid fragile class/tag selectors.

Flaky areas & mitigation

- Form select interactions (Payment Transfer) can be flaky in headless browsers. Use the `autoSubmit` + `initial*` pattern in client wrappers to make tests deterministic where appropriate.
- The TransferSchema is centralized under `lib/schemas/transfer.schema.ts` and client wrappers import it to avoid schema drift.
- Tests that rely on external API responses must be switched to mocks (msw) or the provided Plaid/Dwolla helpers.

Recommendations

1. Standardize fixtures under tests/fixtures and use them across unit and E2E suites.
2. Centralize network mocks under tests/mocks and load them from test setup files.
3. Use `--dry-run` for seed operations in CI gates before running Playwright.
4. When adding tests for extracted presentational components, keep them fast and avoid E2E coverage for pure UI pieces.

Evidence files read to prepare this document

- tests/e2e/helpers/plaid.mock.ts (Plaid mock helper)
- tests/e2e/helpers/db.ts (DB prepare/teardown helpers)
- tests/fixtures/\* (page & data fixtures used across tests)
- tests/mocks/\* (unit test mocks)

Notes

- This file is a living document. When tests or helpers change, update this doc with the failing patterns and their mitigations.
