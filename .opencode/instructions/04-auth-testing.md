---
name: "auth-testing"
description: "NextAuth v4 patterns and Testing patterns (Vitest, Playwright)"
applyTo: "**/*.{ts,tsx}"
priority: 4
---

# Auth & Testing Patterns - Banking Project

Agentic note: Use lib/auth() in Server Actions and mock it in Vitest with vi.mocked(auth). See tests/setup.ts for test environment loading.

## NextAuth v4 Authentication

### Auth Helper

```typescript
// lib/auth.ts — wraps getServerSession(authOptions)
import { auth } from "@/lib/auth";

export { auth };
```

Note: In Vitest unit tests, mock `auth` with `vi.mocked(auth).mockResolvedValue(...)` to simulate authenticated and unauthenticated states. See `tests/setup.ts` for test environment loading.

### Session Shape (from `types/next-auth.d.ts`)

```typescript
interface Session {
  user: {
    id: string;
    name?: null | string;
    email?: null | string;
    isAdmin: boolean; // NO `role` field
    isActive: boolean;
  };
}
```

### Auth Check in Server Actions

```typescript
"use server";

import { auth } from "@/lib/auth";
import { userDal } from "@/dal/user.dal";

export async function protectedAction(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
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
// IMPORTANT: session.user has NO `role` field.
// Use `isAdmin: boolean` for admin checks (see types/next-auth.d.ts).
export async function adminOnlyAction(
  input: unknown
): Promise<{ ok: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, error: "Unauthorized" };
  }

  if (!session.user.isAdmin) {
    return { ok: false, error: "Forbidden: Admin access required" };
  }

  // Continue with admin operation
  return { ok: true };
}
```

### Auth Configuration (`lib/auth-options.ts`)

- Strategy: `jwt` (not database)
- Adapter: `DrizzleAdapter` (for OAuth link records)
- Providers: Credentials + GitHub + Google (conditional on env vars)
- Password hashing: `bcrypt` at cost 12 (NOT `bcryptjs`)
- OAuth env vars: `AUTH_GITHUB_ID`/`AUTH_GITHUB_SECRET`, `AUTH_GOOGLE_ID`/`AUTH_GOOGLE_SECRET`
- Custom signIn callback: auto-creates user for OAuth emails

### Protected Routes (`proxy.ts`)

Middleware guards: `/sign-in`, `/sign-up`, `/dashboard/*`, `/settings/*`, `/my-wallets/*`, `/transaction-history/*`, `/payment-transfer/*`

- Authenticated users redirected away from `/sign-in` and `/sign-up`
- Unauthenticated users redirected to `/sign-in?callbackUrl=<path>`
- Inactive accounts (`isActive === false`) redirected to `/sign-in?error=AccountDeactivated`
- Rate limiting on auth pages: 5 requests per 60s via Upstash Redis (skipped if `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` absent)

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

### Test Run Order

`npm run test` runs **`test:ui` first, then `test:browser`** (reversed from typical convention). The E2E tests start the dev server, so they must run first.

### Test Structure

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

### Writing Unit Tests

```typescript
import { describe, it, expect, beforeEach, vi } from "vitest";
import { auth } from "@/lib/auth";
import { userDal } from "@/dal/user.dal";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn()
}));

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
      });

      const result = await userDal.findByEmail("test@example.com");
      expect(result).toEqual([mockUser]);
    });
  });
});
```

### Auth Mock Pattern (Vitest)

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
    await page.goto("/my-wallets");
    await expect(page).toHaveURL(/\/sign-in/);
  });
});
```

### Playwright Config Notes

- **1 worker only** — app is stateful (auth sessions, shared DB)
- **Chromium only** — other browsers commented out
- `forbidOnly: true` in CI
- `retries: 2` in CI only (0 locally)
- Web server auto-started via `npm run dev` (180s timeout)
- `reuseExistingServer: true` locally, `false` in CI
- `globalSetup` / `globalTeardown` in `tests/e2e/`

## Best Practices

1. Use meaningful test descriptions
2. Test edge cases and error paths
3. Use data-testid for reliable selectors
4. Clean up after tests
5. Use realistic test data
6. Never use `any` in tests — use proper typing

See: .opencode/skills/auth-skill/SKILL.md, .opencode/skills/testing-skill/SKILL.md
