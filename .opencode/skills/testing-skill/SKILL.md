---
name: TestingSkill
description: Testing patterns for the Banking app using Vitest and Playwright. Use when writing tests, unit tests, integration tests, or E2E tests.
---

# TestingSkill - Banking Testing Patterns

## Overview

This skill provides guidance on testing patterns for the Banking project.

## Test Stack

- **Vitest 4.1.2** — Unit and integration tests (happy-dom, forks pool)
- **Playwright 1.59.1** — E2E browser tests (Chromium, 1 worker)

## Running Tests

```bash
npm run test             # All tests (test:ui THEN test:browser — reversed order!)
npm run test:browser     # Vitest unit/integration tests only
npm run test:ui          # Playwright E2E tests only
npx vitest run tests/unit/auth.test.ts          # Single Vitest test
npx playwright test tests/e2e/auth.spec.ts      # Single Playwright test
```

**Important:** `npm run test` runs **E2E first, then unit tests**. The E2E tests start the dev server, so they must run first.

## Vitest Configuration

- Config: `vitest.config.ts`
- Environment: `happy-dom`
- Pool: `forks`
- Setup file: `tests/setup.ts` (loads `.env.local`, runs `cleanup` after each test)
- Include: `tests/unit/**/*.test.{ts,tsx,js,jsx}`

## Playwright Configuration

- Config: `playwright.config.ts`
- **1 worker only** — app is stateful (auth sessions, shared DB)
- **Chromium only** — other browsers commented out
- `forbidOnly: true` in CI
- `retries: 2` in CI only (0 locally)
- Web server: `npm run dev` (180s timeout)
- `reuseExistingServer: true` locally, `false` in CI
- `globalSetup` / `globalTeardown` in `tests/e2e/`

## Unit Tests (Vitest)

### Server Action Tests

```typescript
// tests/unit/register.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { auth } from "@/lib/auth";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn()
}));

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register a new user", async () => {
    vi.mocked(auth).mockResolvedValue({
      expires: new Date(Date.now() + 86400000).toISOString(),
      user: {
        id: "user-123",
        email: "test@example.com",
        isAdmin: false,
        isActive: true
      }
    });

    // Test action...
  });
});
```

### Auth Mock Pattern

```typescript
// Unauthenticated
vi.mocked(auth).mockResolvedValue(undefined);

// Authenticated
vi.mocked(auth).mockResolvedValue({
  expires: new Date(Date.now() + 86400000).toISOString(),
  user: {
    id: "user-123",
    email: "test@example.com",
    isAdmin: false,
    isActive: true
  }
});
```

### DAL Tests

```typescript
// tests/unit/bank.dal.test.ts
import { describe, it, expect, beforeEach, vi } from "vitest";
import { walletDal } from "@/dal/wallet.dal";

describe("WalletDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should find wallets by user id", async () => {
    const wallets = await walletDal.findByUserId("user-123");
    expect(wallets).toBeDefined();
  });
});
```

## E2E Tests (Playwright)

### Auth Flow

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("should sign in with valid credentials", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('[name="email"]', "user@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/dashboard");
  });

  test("should redirect unauthenticated users from protected routes", async ({
    page
  }) => {
    await page.goto("/my-wallets");
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
```

### Bank Linking

```typescript
// tests/e2e/bank-linking.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Bank Linking", () => {
  test("should link a bank account", async ({ page }) => {
    // Sign in first, then navigate
    await page.goto("/dashboard");
    await page.click("text=Link Bank");
    // Plaid Link would open in iframe/modal
    await expect(page.locator("text=Bank Connected")).toBeVisible();
  });
});
```

## Test Structure

```
tests/
├── setup.ts                   # Vitest setup (loads .env.local)
├── unit/                      # Vitest tests
│   ├── register.test.ts
│   └── auth.test.ts
└── e2e/                       # Playwright tests
    ├── global-setup.ts
    ├── global-teardown.ts
    ├── auth.spec.ts
    └── bank-linking.spec.ts
```

## Validation

Run: `npm run test` before submitting PR

## Critical Rules

1. **No `any` in tests** — Use proper typing
2. **Mock external services** — Auth, Plaid, Dwolla
3. **Test happy and sad paths** — Success and error cases
4. **Use `data-testid`** — For stable element selection
5. **Clean up after tests** — Reset mocks, clear state
6. **Import paths** — Actions are in `actions/`, DAL in `dal/` (not `lib/actions/` or `lib/dal/`)
