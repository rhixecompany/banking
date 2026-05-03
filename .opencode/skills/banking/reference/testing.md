# Testing Reference

## Unit Tests (Vitest)

**Config:** `vitest.config.ts` includes `tests/unit/**/*.test.{ts,tsx}`

**Run one file:**

```bash
bun exec vitest run tests/unit/path/to/file.test.ts --config=vitest.config.ts
```

**Setup:** `tests/setup.ts` runs before all tests. MSW configured for network mocking.

**Pattern:**

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { server } from "@/tests/mocks/server";

beforeAll(() => server.listen());
afterAll(() => server.close());

describe("registerUser", () => {
  it("should create user with valid input", async () => {
    const result = await registerUser({
      email: "test@example.com",
      password: "SecurePassword123!"
    });
    expect(result.ok).toBe(true);
    expect(result.user?.email).toBe("test@example.com");
  });
});
```

## E2E Tests (Playwright)

**Config:** `playwright.config.ts` is **stateful** (1 worker, no parallel)

**Run all:**

```bash
bun run test:ui
```

**Run one spec:**

```bash
bunx playwright test tests/e2e/wallet.spec.ts --project=chromium
```

**Setup:** `tests/e2e/global-setup.ts` and `tests/e2e/global-teardown.ts` manage DB state. If `PLAYWRIGHT_PREPARE_DB=true`, runs `bun run db:push && bun run db:seed -- --reset`.

## Mock Token Testing

### Plaid Mock

Use `isMockAccessToken()` to detect test tokens:

```typescript
// lib/plaid.ts
export function isMockAccessToken(token: string): boolean {
  if (!token) return false;
  const t = token.toLowerCase();
  return (
    t.startsWith("seed-") ||
    t.startsWith("mock-") ||
    t.startsWith("mock_")
  );
}
```

Skip network calls for mock tokens:

```typescript
if (isMockAccessToken(accessToken)) {
  return { item_id: "mock-item-id", status: "success" };
}
```

### E2E Plaid Mock

```typescript
// tests/e2e/helpers/plaid.mock.ts
import { Page } from "@playwright/test";

export async function addMockPlaidInitScript(
  page: Page,
  publicToken = "MOCK_PUBLIC_TOKEN"
): Promise<void> {
  const script = `(() => {
    window.Plaid = {
      create: function(opts) {
        setTimeout(() => {
          if (opts?.onSuccess) {
            opts.onSuccess(${JSON.stringify(publicToken)}, { metadata: {} });
          }
        }, 0);
        return { open: function() {} };
      }
    };
  })();`;
  await page.addInitScript(script);
}

// Usage in test
test("should link bank", async ({ page }) => {
  await addMockPlaidInitScript(page);
  await page.goto("/dashboard");
  // ... test flow
});
```

## Network Mocking

### Unit Tests (MSW)

```typescript
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mocks/server";

server.use(
  http.post("https://api.plaid.com/institutions/search", () => {
    return HttpResponse.json({ institutions: [] });
  })
);
```

### E2E Tests

Use helper functions in `tests/e2e/helpers/`:

- `plaid.mock.ts` — Plaid Link mock
- `auth.ts` — Auth helpers

## Seed User

**Email:** `seed-user@example.com` **Password:** `password123`

## Port Guard

Before running tests, free port 3000:

**Windows (PowerShell):**

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

**macOS/Linux:**

```bash
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
```

## Test Files Location

- **Unit:** `tests/unit/**/*.test.{ts,tsx}`
- **E2E:** `tests/e2e/**/*.spec.ts`
- **Mocks:** `tests/mocks/server.ts`
- **Helpers:** `tests/e2e/helpers/*.ts`

## Required Environment

- PostgreSQL via `DATABASE_URL`
- `ENCRYPTION_KEY` set
- `NEXTAUTH_SECRET` set
