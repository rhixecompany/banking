---
name: "auth-testing"
description: "NextAuth v4 patterns and Testing patterns (Vitest, Playwright)"
applyTo: "**/*.{ts,tsx}"
priority: 4
---

# Auth & Testing Patterns - Banking Project

## NextAuth v4 Authentication

### Auth Helper

```typescript
// lib/auth.ts
import { auth } from "@/lib/auth-options";

export { auth };
```

### Auth Check in Server Actions

```typescript
"use server";

import { auth } from "@/lib/auth";
import { userDal } from "@/lib/dal";

export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  // Continue with action
  return { ok: true };
}
```

### Authorization Check

```typescript
export async function adminOnlyAction(input: unknown) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  if (session.user.role !== "admin") {
    return { ok: false, error: "Forbidden: Admin access required" };
  }

  // Continue with admin operation
}
```

## Testing Patterns

### Vitest (Unit/Integration)

```bash
npm run test:browser    # Run Vitest tests
npx vitest run tests/unit/auth.test.ts
```

### Playwright (E2E)

```bash
npm run test:ui         # Run Playwright tests
npx playwright test tests/e2e/auth.spec.ts
```

### Test Structure

```
tests/
├── unit/              # Vitest tests
│   ├── register.test.ts
│   └── auth.test.ts
├── e2e/               # Playwright tests
│   ├── auth.spec.ts
│   └── bank-linking.spec.ts
└── fixtures/          # Test fixtures
    └── auth.ts
```

### Writing Unit Tests

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { userDal } from "@/lib/dal";

describe("UserDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findByEmail", () => {
    it("should return user when email exists", async () => {
      const mockUser = {
        id: "123",
        email: "test@example.com",
        name: "Test User"
      };

      vi.mocked(db.select).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockUser])
          })
        })
      } as any);

      const result = await userDal.findByEmail("test@example.com");
      expect(result).toEqual([mockUser]);
    });
  });
});
```

### Writing E2E Tests

```typescript
import { test, expect } from "@playwright/test";

test.describe("Bank Linking", () => {
  test.beforeEach(async ({ page }) => {
    await page.context().clearCookies();
  });

  test("should redirect unauthenticated users to sign-in", async ({
    page
  }) => {
    await page.goto("/my-banks");
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
```

### Test Fixtures

```typescript
// tests/fixtures/auth.ts
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await signInWithSeedUser(page);
    await use(page);
  },
  unauthenticatedPage: async ({ page }, use) => {
    await page.context().clearCookies();
    await use(page);
  }
});
```

## Best Practices

1. Use meaningful test descriptions
2. Test edge cases and error paths
3. Use data-testid for reliable selectors
4. Clean up after tests
5. Use realistic test data

See: .opencode/skills/auth-skill/SKILL.md, .opencode/skills/testing-skill/SKILL.md
