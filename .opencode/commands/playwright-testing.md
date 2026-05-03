---
category: testing
source: github-prompts
tags: [playwright, e2e, testing]
date: 2026-05-03
---

# Playwright E2E Testing Prompt

Generate and review Playwright tests for the Banking app.

## When to Use

- Creating new E2E tests
- Debugging failing tests
- Adding test coverage for new features

## Banking App Test Setup

### Seed User

- Email: `seed-user@example.com`
- Password: `password123`

### Mock Tokens

Use tokens starting with `seed-`, `mock-`, or `mock_` to skip Plaid/Dwolla API calls:

- `seed-access-token` - Mock bank connection
- No real API calls made

### Test Helpers

- `tests/e2e/helpers/plaid.mock.ts` - Mock Plaid Link
- `tests/e2e/helpers/auth.ts` - Auth helpers

## Test Pattern

```typescript
import { test, expect } from "@playwright/test";
import { addMockPlaidInitScript } from "@/tests/e2e/helpers/plaid.mock";

test("test name", async ({ page }) => {
  await addMockPlaidInitScript(page);
  await page.goto("/dashboard");
  // Test steps...
});
```

## Best Practices

- Use `page.goto()` with relative paths
- Wait for elements with `await expect()`
- Use test fixtures for common setup
- Clean up test data in `afterEach`

## Run Commands

```bash
bun run test:ui          # Run all E2E
bunx playwright test tests/e2e/wallet.spec.ts  # Single file
```

For detailed patterns, see `.github/prompts/playwright-generate-test.prompt.md`
