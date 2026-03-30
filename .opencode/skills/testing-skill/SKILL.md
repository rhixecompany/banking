---
name: TestingSkill
description: Testing patterns for the Banking app using Vitest and Playwright. Use when writing tests, unit tests, integration tests, or E2E tests.
---

# TestingSkill - Banking Testing Patterns

## Overview

This skill provides guidance on testing patterns for the Banking project.

## Test Stack

- **Vitest** - Unit and integration tests
- **Playwright** - E2E browser tests
- **Testing Library** - React component tests

## Unit Tests (Vitest)

### Server Action Tests

```typescript
// tests/unit/register.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { registerUser } from "@/lib/actions/register";

// Mock dependencies
vi.mock("@/lib/auth", () => ({
  auth: vi.fn()
}));

describe("registerUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register a new user", async () => {
    // Setup mock session
    const mockSession = { user: { id: "123" } };
    (await import("@/lib/auth")).auth.mockResolvedValue(mockSession);

    const formData = new FormData();
    formData.set("name", "John Doe");
    formData.set("email", "john@example.com");
    formData.set("password", "password123");

    const result = await registerUser(
      { error: "", fieldErrors: {} },
      formData
    );

    expect(result.ok).toBe(true);
  });

  it("should validate email format", async () => {
    const formData = new FormData();
    formData.set("name", "John");
    formData.set("email", "invalid-email");
    formData.set("password", "password123");

    const result = await registerUser(
      { error: "", fieldErrors: {} },
      formData
    );

    expect(result.error).toContain("email");
  });
});
```

### DAL Tests

```typescript
// tests/unit/bank.dal.test.ts
import { describe, it, expect, beforeAll } from "vitest";
import { bankDal } from "@/lib/dal";

describe("BankDal", () => {
  // Use test database or mocks

  it("should find bank by user id", async () => {
    const banks = await bankDal.findByUserId("user-123");
    expect(banks).toBeDefined();
  });
});
```

## Integration Tests (Vitest + Testing Library)

```typescript
// tests/unit/components/login-form.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "@/components/login-form";

describe("LoginForm", () => {
  it("should submit form with valid credentials", async () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await userEvent.type(emailInput, "user@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText(/invalid/i)).not.toBeInTheDocument();
    });
  });
});
```

## E2E Tests (Playwright)

### Auth Flow

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should sign in with valid credentials", async ({ page }) => {
    await page.goto("/sign-in");

    await page.fill('[name="email"]', "user@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL("/dashboard");
    await expect(page.locator("text=Welcome")).toBeVisible();
  });

  test("should show error with invalid credentials", async ({
    page
  }) => {
    await page.goto("/sign-in");

    await page.fill('[name="email"]', "user@example.com");
    await page.fill('[name="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    await expect(page.locator("[role=alert]")).toContainText(
      "Invalid"
    );
  });
});
```

### Bank Linking

```typescript
// tests/e2e/bank-linking.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Bank Linking", () => {
  test("should link a bank account", async ({ page }) => {
    await page.goto("/dashboard");
    await page.click("text=Link Bank");

    // Plaid Link would open in iframe/modal
    await page.fill('[name="routingNumber"]', "123456789");
    await page.fill('[name="accountNumber"]', "12345678");
    await page.click("text=Connect");

    await expect(page.locator("text=Bank Connected")).toBeVisible();
  });
});
```

## Running Tests

```bash
# All tests
npm run test

# Unit tests only
npm run test:browser

# E2E tests only
npm run test:ui

# Single test
npm run vitest run tests/unit/register.test.ts

# E2E with UI
npm run test:ui:codegen
```

## Validation

Run: `npm run test` before submitting PR

## Critical Rules

1. **No `any` in tests** - Use proper typing
2. **Mock external services** - Auth, Plaid, Dwolla
3. **Test happy and sad paths** - Success and error cases
4. **Use `data-testid`** - For stable element selection
5. **Clean up after tests** - Reset mocks, clear state
