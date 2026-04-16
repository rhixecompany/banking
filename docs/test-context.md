# Test Context

Guidance for running tests during the Pages Enhancement effort.

- Unit tests: run targeted unit tests for modified units before committing PRs (recommended). Use `npm run test:browser` for local unit runs.
- E2E tests: run Playwright with seeded DB using `PLAYWRIGHT_PREPARE_DB=true npm run test:ui` or `npm run test:ui` which already sets the env.
- Seed runner: `scripts/seed/run.ts` is used by Playwright helpers to create deterministic test data.
- Plaid/Dwolla: E2E helpers inject mock Plaid and short-circuit Dwolla when mock URLs are used. Do not change action mock-detection logic.
