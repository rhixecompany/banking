# Test Context — Patterns and Helpers

Purpose

- Document test setup, patterns, and helpers to ensure deterministic unit and E2E tests.

Unit Tests

- Use msw or local mocks for network interactions in unit tests.
- Keep unit tests fast and focused on single components or utility functions.

E2E Tests

- Use scripts/seed/run.ts to prepare deterministic DB state for E2E tests. The seed runner supports --dry-run to validate planned operations.
- For flows that interact with Plaid/Dwolla, use existing test helpers (tests/e2e/helpers/plaid.mock.ts) to stub the Plaid initialization and any network calls.

Playwright

- Before running Playwright E2E tests, ensure seeded data is present and any required mock scripts are injected.

Notes

- Do not let tests rely on undocumented external state. Prefer seeds + mocks.
