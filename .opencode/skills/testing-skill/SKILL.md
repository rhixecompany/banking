---
name: testing-skill
description: Testing patterns for Vitest (unit) and Playwright (E2E) used by the Banking app.
lastReviewed: 2026-04-24
applyTo: "tests/**"
---

# TestingSkill — Test Patterns

Overview

Repo uses Vitest for unit/integration and Playwright for E2E. `bun run test` runs E2E first (Playwright) then Vitest.

Key Points

- Free port 3000 before Playwright on Windows (AGENTS.md includes a PowerShell snippet).
- Run E2E (Playwright) first because it starts the dev server.
- Use single worker for Playwright as tests are stateful.
- Use mock tokens starting with "seed-" or "mock-" to skip Plaid API calls (see `lib/plaid.ts`).

### Mock Token Pattern

The app uses `isMockAccessToken()` in `lib/plaid.ts` to detect test tokens:

```typescript
// Tokens starting with "seed-", "mock-", or "mock_" skip Plaid API calls
const mockToken = "seed-access-token-123";
if (isMockAccessToken(mockToken)) {
  // Skip actual Plaid API calls in tests
}
```

E2E tests use `tests/e2e/helpers/plaid.mock.ts` to inject mock Plaid Link.

Examples

Vitest (single test): `bun exec vitest run tests/unit/auth.test.ts` Playwright single spec: `npx playwright test tests/e2e/auth.spec.ts`

Validation

- `bun run test` (E2E then unit)
- `bun run test:browser` (Vitest unit tests)
- `bun run test:ui` (Playwright E2E)
