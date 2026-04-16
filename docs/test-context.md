# Test Context Inventory & Triage (Draft)

Purpose

- Centralize test helpers, fixtures, and E2E determinism guidance prior to modifications.
- Output will be used to harden Vitest & Playwright tests: remove skipped/non-deterministic tests, standardize assertions, and ensure seeded authenticated scenarios.

Test helpers & fixtures (found)

- tests/setup.ts
- tests/mocks/ui/select.tsx
- tests/mocks/msw/server.ts
- tests/fixtures/wallets.ts
- tests/fixtures/transactions.ts
- tests/fixtures/pages/\*.page.ts (fixtures for many pages: transaction-history, sign-up, sign-in, payment-transfer, my-wallets, dashboard)
- tests/e2e/helpers/plaid.mock.ts — inject Plaid Link stub via page.addInitScript (use in E2E)
- tests/e2e/helpers/dwolla.ts — Dwolla helpers / mocks
- tests/e2e/helpers/auth.ts — helper to set cookies/auth for E2E
- tests/e2e/global-setup.ts and global-teardown.ts — prepare DB and test environment
- tests/e2e/utils/auth-fixtures.ts — deterministic auth fixtures for E2E

Significant test suites (selected)

- Unit tests (Vitest)
  - tests/unit/\*.test.tsx (wallets-overview, TotalBalanceBox, AuthForm, many action tests)
  - dal tests: tests/unit/dal/\*.test.ts
  - actions tests: tests/unit/_actions_.test.ts and tests/unit/actions/\*.test.ts

- Integration / E2E (Playwright)
  - tests/e2e/specs/_.spec.ts and tests/e2e/_.spec.ts (wallet-linking.spec.ts, my-wallets.spec.ts, link-and-transfer.spec.ts, payment-transfer.spec.ts, dashboard.spec.ts, settings.spec.ts)
  - tests/e2e/specs/plaid-script.spec.ts

Seed & deterministic infra

- scripts/seed/run.ts — seed runner to create deterministic users & test data.
- tests/e2e/global-setup.ts uses seed runner in CI flows (verify config to run seeds locally).
- tests use Plaid and Dwolla mock short-circuits (AGENTS.md: mock tokens prefixed seed-/mock- etc.); preserve those.

Triage recommendations

1. Identify and list all tests with `test.skip` or `it.skip` and prioritize fixing the deterministic causes (network calls, timing, random data).
2. For Playwright E2E:
   - Always inject Plaid mock script before navigation: use tests/e2e/helpers/plaid.mock.ts helper.
   - Use seed runner to create deterministic accounts and users for authenticated flows.
   - Ensure `ENABLE_TEST_ENDPOINTS=true` when running dev server locally for test-only helpers (if using dev server).
3. For Vitest:
   - Ensure all unit tests use msw mocks or dependency injection for external APIs rather than live calls.
   - Replace flaky timing-based assertions with await-waits for visible UI changes or mocked timers where appropriate.

Suggested quick actions (per-page sprint)

- As part of each page enhancement:
  1. Identify tests referencing that page or its components.
  2. If tests are flaky/non-deterministic, add to triage list with root cause and fix plan.
  3. Convert integration tests that rely on network to use fixtures or msw stubs.

Reporting

- For each page, produce a test triage entry:
  - Test path
  - Failure type (flaky / network / timeout / assertion)
  - Proposed fix (seed data, add mocks, rewrite assertion)
  - Estimated effort (low/medium/high)
