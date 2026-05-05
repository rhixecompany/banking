# Testing Reference

## Choosing Your Testing Approach

**Before writing a test, answer these questions:**

| Question | Unit Test (Vitest) | E2E Test (Playwright) |
| --- | --- | --- |
| **Needs live database?** | No (MSW mocks) | Yes (seeded DB) |
| **Tests UI interaction?** | No (functions only) | Yes (forms, flows) |
| **Can run deterministically?** | Must be stateless | Stateful OK (1 worker) |
| **Needs Plaid/Dwolla?** | MSW HTTP mocking | Mock tokens + scripts |
| **Priority: Speed?** | Yes (< 100ms each) | No (slower, complete) |

**Decision matrix:**

- Form validation → Unit test
- User clicks "Link Bank" → E2E with mock tokens
- Transfer business logic → Unit test
- Full wallet flow → E2E test

---

## NEVER Do: Testing Anti-Patterns

**NEVER run Playwright with `workers > 1`**  
E2E tests are stateful (shared DB). Parallel execution corrupts data. Config specifies `workers: 1`. Changing this WILL break everything.

**NEVER skip port cleanup before E2E**  
Port 3000 must be freed. If you skip, Playwright waits forever with no error message — just silent hang. Always run port guard first.

**NEVER mock Plaid/Dwolla at HTTP layer**  
Use token detection instead. HTTP mocking breaks real integration testing. E2E's purpose: "does actual Plaid Link work?" Mocking HTTP invalidates that.

**NEVER mix live and mock tokens in same session**  
Pick one: all tests use `seed-*`/`mock-*` tokens OR all use live sandbox. Mixing confuses SDK state. Document which per test file.

**NEVER forget `ENCRYPTION_KEY` in `.env.local`**  
Not in `.env.example` for security reasons. Add it manually. Tests silently fail without it — no error message. Required for E2E setup.

**NEVER seed DB inside individual tests**  
Seed once in `global-setup.ts`, reset in `global-teardown.ts`. Per-test seeding is slow and pollutes state. Use soft deletes instead.

---

## Unit Tests (Vitest)

**Config:** `vitest.config.ts` includes `tests/unit/**/*.test.{ts,tsx}`

**Run one file:**

```bash
bun exec vitest run tests/unit/path/to/file.test.ts --config=vitest.config.ts
```

**Pattern (with MSW):**

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

**Mocking with MSW (HTTP layer):**

```typescript
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mocks/server";

server.use(
  http.post("https://api.plaid.com/institutions/search", () => {
    return HttpResponse.json({ institutions: [] });
  })
);
```

---

## E2E Tests (Playwright)

**Config:** `playwright.config.ts` is **stateful** (`workers: 1`, no parallel)

**Run all:**

```bash
bun run test:ui
```

**Run one spec:**

```bash
bunx playwright test tests/e2e/wallet.spec.ts --project=chromium
```

**Setup:** Global setup/teardown (`global-setup.ts`, `global-teardown.ts`) manages DB. If `PLAYWRIGHT_PREPARE_DB=true`, runs `bun run db:push && bun run db:seed -- --reset`.

---

## Mocking: Mock Tokens

Use `isMockAccessToken()` to detect test tokens (start with `seed-`, `mock-`, `mock_`):

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

**Skip network calls for mock tokens:**

```typescript
if (isMockAccessToken(accessToken)) {
  return { item_id: "mock-item-id", status: "success" };
}
```

**Examples of mock tokens (all bypass API calls):**

```typescript
// Valid mock tokens (detected and skip API)
"seed-plaid-access-token";
"seed-user-wallet-123";
"SEED-TEST-TOKEN";
"mock-dwolla-transfer";
"MOCK-TEST-ACCOUNT";
"mock_bank_account_token";
"MOCK_FUNDING_SOURCE";

// Invalid mock tokens (treated as real, hit API)
"access-prod-abc123";
"pk_live_abc123def";
"sk_test_abc123def";
"sometoken"; // no prefix
```

**Why mock tokens?**

- **Deterministic:** Same mock token always returns same data
- **No rate limits:** Plaid/Dwolla sandboxes have request limits; mocks don't
- **Offline capability:** Can run tests without network access
- **Cost-free:** No sandbox API calls (no rate limiting)
- **Faster:** Mock responses are instant

**When to use:**

- **Unit tests:** Always use mocks (MSW HTTP mocking)
- **E2E tests (happy path):** Use mock tokens to speed up testing
- **E2E tests (integration):** Use real sandbox tokens (but sparingly)
- **Production:** NEVER use mock tokens (verify in pre-release validation)

---

## E2E Plaid Mock

**Inject Plaid Link mock in browser (E2E only):**

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

---

## Port Guard (CRITICAL before E2E)

**Windows (PowerShell):**

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

**macOS/Linux:**

```bash
lsof -ti :3000 | xargs kill -9 2>/dev/null || true
```

---

## Troubleshooting Common Failures

**Tests hang indefinitely:** Port 3000 not freed. Re-run port guard above.

**Playwright can't connect:** Dev server not running. Start with `bun run dev` before E2E tests.

**ENCRYPTION_KEY missing:** Tests silently fail. Add `ENCRYPTION_KEY=<32-byte-hex>` to `.env.local` (not in `.env.example` for security).

**DB seed fails in global-setup.ts:** Ensure PostgreSQL is running via `docker-compose up -d postgres`. Check `DATABASE_URL` is set correctly.

**Flaky Plaid Link tests:** Ensure `addMockPlaidInitScript()` is called BEFORE `page.goto()`. Mock must inject before page loads.

---

## Reference: File Locations & Seed User

**Test locations:**

- Unit: `tests/unit/**/*.test.{ts,tsx}`
- E2E: `tests/e2e/**/*.spec.ts`
- Helpers: `tests/e2e/helpers/*.ts`
- Mocks: `tests/mocks/server.ts`

**Seed user (E2E):** Email `seed-user@example.com` / Password `password123`

**Required environment:** PostgreSQL (`DATABASE_URL`), `ENCRYPTION_KEY`, `NEXTAUTH_SECRET`
