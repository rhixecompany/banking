# Test Context

Last updated: 2026-04-12

Test Runners & Order

- End-to-end: Playwright — E2E lives under `tests/e2e/`.
  - Global files: `tests/e2e/global-setup.ts`, `tests/e2e/global-teardown.ts`
  - Helpers: `tests/e2e/helpers/auth.ts`, `tests/e2e/helpers/db.ts`, `tests/e2e/helpers/plaid.ts`, `tests/e2e/helpers/dwolla.ts`
  - Important: Playwright runs first via `npm run test:ui` (per AGENTS.md).
- Unit & integration: Vitest — tests under `tests/unit/` and some integration tests.
  - Setup: `tests/setup.ts`, MSW server at `tests/mocks/msw/server.ts`.

Seed & Deterministic Data

- Seed script: `scripts/seed/seed-data.ts` (you selected this path).
- Recommendation: Have Playwright `global-setup.ts` run the seed script (idempotent) to ensure seeded user(s) exist and tests are deterministic — you approved automatic run.
- Seed IDs are declared in `scripts/seed/seed-data.ts` as `SEED_IDS` and are used in fixtures.

Flaky / Non-deterministic Tests Found (examples)

- `tests/unit/plaid.test.ts` — unit tests that rely on external Plaid behaviour; ensure mocks are used.
- E2E tests using Plaid flow: `tests/e2e/wallet-linking.spec.ts` and helpers `tests/e2e/helpers/plaid.ts` — these rely on sandbox iframe interactions and can be brittle; they use `frameLocator` and multiple `click` sequences.
- Tests that use non-deterministic timeouts / UI wait: Several tests use fixed timeouts instead of robust playwright waits; convert to `page.waitForURL`, `locator.waitFor`, `toHaveText`, etc.

Current Helpers & Fixtures (selected)

- `tests/fixtures/*` — page objects & fixtures used by E2E tests (dashboard, sign-in, my-wallets).
- `tests/fixtures/auth.ts` — auth helper values.
- `tests/fixtures/wallets.ts`, `tests/fixtures/transactions.ts` — data fixtures.
- `tests/mocks/msw/server.ts` — MSW server for unit tests.

Hardening Recommendations (concrete)

- Playwright
  - Run `scripts/seed/seed-data.ts` in `global-setup.ts` to ensure seeded users and wallets exist; make seed idempotent.
  - Replace brittle waits with `page.getByTestId(...).waitFor()` / `page.waitForURL(...)` and `expect(locator).toBeVisible()` style assertions.
  - For Plaid sandbox flows: encapsulate iframe interactions in `tests/e2e/helpers/plaid.ts` (already present) and add retries and timeouts tuned to CI.
  - Make authenticated flows deterministic by setting auth cookies/session tokens directly when possible (seed produces a session token).
- Vitest
  - Ensure MSW handlers are reset between tests (`server.resetHandlers()`).
  - Avoid network calls in unit tests; mock Plaid/Dwolla clients.
  - Standardize assertions and fix any tests with `test.skip` that can be made deterministic.

Action items

- Add an idempotent wrapper (if missing) that Playwright's `global-setup.ts` will call: `node scripts/seed/run.ts` which uses `scripts/seed/seed-data.ts`.
- Add test checklist and flakiness fixes as part of the migration plan:
  - Replace fixed `wait` with locator-based waits.
  - Seed deterministic user and session for e2e auth flows.
  - Mock external providers (Plaid/Dwolla) in unit tests; keep a small set of integration E2E tests for core flows.
