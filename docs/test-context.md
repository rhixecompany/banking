# Test Context & Documentation

**Date:** 2026-05-03  
**Scope:** All tests in `tests/`  
**Status:** Complete — Task 0.3 verification  
**Inventory:** 72 Vitest unit tests + 10 Playwright E2E specs verified

---

## Overview

This document catalogs all tests in the Banking application, their configuration, helpers, and best practices. The test suite is organized into two main categories:

1. **Vitest Unit Tests (72 files)** — Fast, isolated tests for actions, DAL, components, utilities, stores, and scripts
2. **Playwright E2E Tests (10 specs)** — Stateful, integration tests for end-to-end user workflows

---

## Test Inventory

### Vitest Unit Tests (72 files)

#### Server Actions & Business Logic (8 files)

| File | Purpose | Test Count |
| --- | --- | --- |
| `tests/unit/actions/dwolla.actions.test.ts` | Dwolla transfer action tests | ~3 |
| `tests/unit/actions/recipient.actions.test.ts` | Recipient management actions | ~4 |
| `tests/unit/actions/transaction.actions.test.ts` | Transaction actions | ~8 |
| `tests/unit/actions/transaction.actions.db-error.test.ts` | Transaction DB error handling | ~2 |
| `tests/unit/admin.actions.test.ts` | Admin action tests | ~4 |
| `tests/unit/register.test.ts` | User registration validation | 4 |
| `tests/unit/updateProfile.test.ts` | Profile update actions | ~3 |
| `tests/unit/user.actions.test.ts` | User action tests | ~4 |

#### DAL (Data Access Layer) Tests (6 files)

| File | Purpose | Test Count |
| --- | --- | --- |
| `tests/unit/dal/admin.dal.test.ts` | Admin DAL operations | ~5 |
| `tests/unit/dal/errors.dal.test.ts` | Error handling DAL | ~3 |
| `tests/unit/dal/recipient.dal.test.ts` | Recipient CRUD operations | ~6 |
| `tests/unit/dal/transaction.dal.test.ts` | Transaction DAL with N+1 prevention | ~8 |
| `tests/unit/dal/wallet.dal.test.ts` | Wallet DAL operations | 13 |
| `tests/unit/dwolla.dal.test.ts` | Dwolla DAL integration | ~5 |

#### Integration & Utility Tests (5 files)

| File | Purpose | Test Count |
| --- | --- | --- |
| `tests/unit/dwolla.test.ts` | Dwolla utility functions | ~6 |
| `tests/unit/error-tracking.test.ts` | Error tracking utilities | ~3 |
| `tests/unit/markdown-catalog.test.ts` | Markdown catalog generation | ~4 |
| `tests/unit/plaid.test.ts` | Plaid utility functions | ~6 |
| `tests/unit/report-parser.test.ts` | Report parsing utilities | ~5 |

#### Scripts & Build Tools (6 files)

| File | Purpose | Test Count |
| --- | --- | --- |
| `tests/unit/generate-markdown-catalog-script.test.ts` | Catalog generation script | ~4 |
| `tests/unit/mcp-runner.parse.test.ts` | MCP runner parser | ~8 |
| `tests/unit/mcp-runner.verify.test.ts` | MCP runner verification | ~7 |
| `tests/unit/plan-ensure.match.test.ts` | Plan matching logic | ~6 |
| `tests/unit/plan-ensure.scoring.test.ts` | Plan scoring logic | ~5 |
| `tests/unit/transaction-mapping.test.ts` | Transaction mapping utilities | ~5 |

#### Zustand Stores (4 files)

| File | Purpose | Test Count |
| --- | --- | --- |
| `tests/unit/stores/filter-store.test.ts` | Filter state management | ~8 |
| `tests/unit/stores/toast-store.test.ts` | Toast notification store | ~6 |
| `tests/unit/stores/transfer-store.test.ts` | Transfer form state | ~8 |
| `tests/unit/stores/ui-store.test.ts` | UI state (modals, sidebar) | 13 |

#### Server Wrapper Components (9 files)

| File | Purpose | Test Count |
| --- | --- | --- |
| `tests/unit/admin-dashboard-server-wrapper.test.tsx` | Admin dashboard server wrapper | ~2 |
| `tests/unit/admin-dashboard.layout.test.tsx` | Admin dashboard layout | ~3 |
| `tests/unit/dashboard-client-wrapper.test.tsx` | Dashboard client wrapper | ~2 |
| `tests/unit/dashboard-client.layout.test.tsx` | Dashboard client layout | ~3 |
| `tests/unit/dashboard-server-wrapper.test.ts` | Dashboard server wrapper | ~3 |
| `tests/unit/my-wallets-client-wrapper.test.tsx` | My wallets client wrapper | ~2 |
| `tests/unit/my-wallets-client.layout.test.tsx` | My wallets client layout | ~3 |
| `tests/unit/my-wallets-server-wrapper.test.ts` | My wallets server wrapper | ~3 |
| `tests/unit/signin-wrapper.test.ts` | Sign-in server wrapper | ~2 |

#### UI Components (16 files)

| File | Purpose | Test Count |
| --- | --- | --- |
| `tests/unit/auth-form.layout.test.tsx` | Auth form layout | ~3 |
| `tests/unit/AuthForm.props.test.tsx` | Auth form props validation | ~3 |
| `tests/unit/AuthForm.test.tsx` | Auth form component | ~5 |
| `tests/unit/card.test.tsx` | Card component | ~3 |
| `tests/unit/cta-get-started.test.tsx` | CTA component | ~2 |
| `tests/unit/data-table.test.tsx` | Data table component | ~4 |
| `tests/unit/DashboardClientWrapper.props.test.tsx` | Dashboard wrapper props | ~2 |
| `tests/unit/features-grid.test.tsx` | Features grid component | ~2 |
| `tests/unit/form.test.tsx` | Form component | ~4 |
| `tests/unit/MobileNav.test.tsx` | Mobile navigation | ~3 |
| `tests/unit/payment-transfer-client.layout.test.tsx` | Payment transfer layout | ~3 |
| `tests/unit/payment-transfer-form.test.tsx` | Payment transfer form | ~6 |
| `tests/unit/PaymentTransferClientWrapper.props.test.tsx` | Payment transfer props | ~2 |
| `tests/unit/payment-transfer-server-wrapper.test.ts` | Payment transfer server wrapper | ~3 |
| `tests/unit/row.test.tsx` | Table row component | ~3 |
| `tests/unit/Sidebar.test.tsx` | Sidebar component | ~3 |

#### Additional UI & Layout (9 files)

| File | Purpose | Test Count |
| --- | --- | --- |
| `tests/unit/settings-client.layout.test.tsx` | Settings client layout | ~3 |
| `tests/unit/settings-profile-form.test.tsx` | Settings profile form | ~5 |
| `tests/unit/settings-server-wrapper.test.ts` | Settings server wrapper | ~3 |
| `tests/unit/SettingsClientWrapper.props.test.tsx` | Settings wrapper props | ~2 |
| `tests/unit/total-balance.test.tsx` | Total balance component | ~3 |
| `tests/unit/TotalBalanceBox.test.tsx` | Total balance box | ~3 |
| `tests/unit/transaction-history-client-wrapper.test.tsx` | Transaction history wrapper | ~2 |
| `tests/unit/transaction-history-client.layout.test.tsx` | Transaction history layout | ~3 |
| `tests/unit/transaction-history-server-wrapper.test.ts` | Transaction history server wrapper | ~3 |
| `tests/unit/transaction-list.test.tsx` | Transaction list component | ~4 |
| `tests/unit/transfer-summary.test.tsx` | Transfer summary component | ~3 |
| `tests/unit/wallet-card.test.tsx` | Wallet card component | ~4 |
| `tests/unit/wallets-overview.test.tsx` | Wallets overview component | ~3 |

#### Database & Rule Verification (5 files)

| File | Purpose | Test Count |
| --- | --- | --- |
| `tests/integration/dal/errors.dal.integration.test.ts` | Integration tests for DAL error handling | ~3 |
| `tests/verify/rules.test.ts` | Rule verification tests | ~5 |
| `tests/verify-rules/verify-rules.test.ts` | Verify rules verification | ~5 |
| `tests/unit/wallet.actions.test.ts` | Wallet action tests | ~5 |

**Total Vitest Files:** 72 unit test files (estimated ~380+ individual tests)

---

### Playwright E2E Tests (10 specs)

| File | Purpose | Test Count | Key Tests |
| --- | --- | --- | --- |
| `tests/e2e/auth.spec.ts` | Authentication flows | 15 | Landing page, sign-in, sign-up, navigation, validation, error handling |
| `tests/e2e/dashboard.spec.ts` | Dashboard functionality | 3 | Dashboard rendering, wallet display, balance updates |
| `tests/e2e/my-wallets.spec.ts` | Wallet management | 4 | Wallet list, wallet details, wallet operations |
| `tests/e2e/payment-transfer.spec.ts` | Payment transfers | ~6 | Transfer form, recipient selection, amount validation |
| `tests/e2e/transaction-history.spec.ts` | Transaction history | ~5 | Transaction list, filtering, details view |
| `tests/e2e/settings.spec.ts` | User settings | ~5 | Profile update, settings form, preferences |
| `tests/e2e/admin.spec.ts` | Admin functionality | ~4 | Admin dashboard, user management, analytics |
| `tests/e2e/wallet-linking.spec.ts` | Bank account linking | ~5 | Plaid flow (mocked), account selection, linking |
| `tests/e2e/integration/link-and-transfer.spec.ts` | End-to-end flow | ~4 | Full workflow: link account → transfer funds |
| `tests/e2e/specs/plaid-script.spec.ts` | Plaid integration | ~3 | Plaid initialization, mock token handling |

**Total Playwright Specs:** 10 E2E spec files (estimated ~50+ individual tests)

---

## Mocks & Test Helpers

### MSW (Mock Service Worker) Setup

**Files:** `tests/mocks/handlers.ts`, `tests/mocks/msw/server.ts`

MSW intercepts network requests and provides deterministic responses for unit tests. Configured globally in `tests/setup.ts`.

**Key Handlers:**

- Authentication (`/api/auth/*`)
- Plaid integration endpoints
- Dwolla transfer endpoints
- User & wallet endpoints

**Setup Pattern:**

```typescript
// tests/setup.ts
const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
```

### Unit Test Mocks

| Mock | Purpose | Location |
| --- | --- | --- |
| `@/components/ui/select` | Select component mock | `tests/mocks/ui/select.tsx` |
| `sonner` | Toast notifications | Global mock in `tests/setup.ts` |
| `@/components/doughnut-chart/doughnut-chart` | Chart component (avoid canvas/DOM issues) | Global mock in `tests/setup.ts` |
| `@/components/chart-area-interactive/chart-area-interactive` | Area chart (avoid Recharts layout) | Global mock in `tests/setup.ts` |
| `@/components/shadcn-studio/blocks/onboarding-feed-01` | Onboarding feed | Global mock in `tests/setup.ts` |
| `next/navigation` | Router utilities (useRouter, usePathname, etc.) | Global mock in `tests/setup.ts` |
| `@/lib/auth` | Auth helper (returns seeded session) | Global mock in `tests/setup.ts` |

**Default Auth Mock (all unit tests):**

```typescript
vi.mock("@/lib/auth", () => ({
  auth: () =>
    Promise.resolve({
      user: {
        id: "test-user",
        email: "test@example.com",
        name: "Test User",
        isAdmin: false,
        isActive: true
      }
    })
}));
```

### E2E Test Helpers

| File | Purpose | Key Functions |
| --- | --- | --- |
| `tests/e2e/helpers/auth.ts` | Authentication | `signInWithSeedUser()`, `SEED_USER`, `adminFixtureEmail` |
| `tests/e2e/helpers/db.ts` | Database utilities | `isDatabaseReachable()`, `isDatabaseSeeded()`, `getDatabaseUrl()`, `cleanupTestData()` |
| `tests/e2e/helpers/plaid.mock.ts` | Plaid SDK mocking | `addMockPlaidInitScript()` — injects mock window.Plaid object |
| `tests/e2e/helpers/plaid.ts` | Plaid utilities | Plaid API helpers and token detection |
| `tests/e2e/helpers/dwolla.ts` | Dwolla utilities | Dwolla API helpers and integration utilities |
| `tests/e2e/utils/auth-fixtures.ts` | Auth fixtures | Pre-configured auth fixtures for E2E |

### Global Setup & Teardown

| File | Purpose |
| --- | --- |
| `tests/e2e/global-setup.ts` | Runs once before all E2E tests. Loads env, validates DB URL, checks connectivity, ensures seeded data, warms up dev server. |
| `tests/e2e/global-teardown.ts` | Runs once after all E2E tests. Parses test results, cleans up artifacts (videos, screenshots), stops dev server. |

---

## Seed Data & Test Fixtures

### Seed User Credentials

**Used for E2E authentication:**

| Field | Value | Location |
| --- | --- | --- |
| **Email** | `seed-user@example.com` | `tests/e2e/helpers/auth.ts` line 8 |
| **Password** | `password123` | `tests/e2e/helpers/auth.ts` line 9 |

**Sourced from:** `scripts/seed/seed-data.ts` (matches `SEED_PASSWORD_PLAIN` and seed user email)

**Seed Command:**

```bash
# Push schema and seed data
bun run db:push
bun run db:seed

# Reset and reseed (truncate tables)
bun run db:seed -- --reset

# Preview without applying
bun run db:seed -- --dry-run
```

### Admin Fixture

| Field | Value | Location |
| --- | --- | --- |
| **Email** | `seed-admin@example.com` (default) | `tests/e2e/helpers/auth.ts` line 20 |
| **Password** | `Password1!` (default) | `tests/e2e/helpers/auth.ts` line 28 |
| **Override (via env)** | `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD` | Environment variables |

### Mock Tokens (for Plaid & Dwolla)

**Pattern:** Tokens starting with `seed-`, `mock-`, or `mock_` skip real API calls.

**Detection:** `lib/plaid.ts::isMockAccessToken()`

```typescript
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

**Common Mock Tokens:**

- `seed-plaid-public-token` → Mocked Plaid public token
- `mock-dwolla-customer-url` → Mocked Dwolla customer URL
- `mock_access_token` → Generic mock access token

### Test Fixtures (JSON)

| File | Purpose | Used In |
| --- | --- | --- |
| `tests/fixtures/seed-user.json` | Seeded user profile | E2E tests, global setup |
| `tests/fixtures/seed-admin.json` | Seeded admin profile | Admin E2E tests |
| `tests/fixtures/transactions.ts` | Mock transactions | Unit & E2E tests |
| `tests/fixtures/wallets.ts` | Mock wallets | Unit & E2E tests |
| `tests/fixtures/auth.ts` | Auth fixtures | E2E helper setup |

### Test Reports (Sample Data)

| File | Purpose |
| --- | --- |
| `tests/fixtures/reports/vitest.sample.json` | Sample Vitest JSON report |
| `tests/fixtures/reports/playwright.sample.json` | Sample Playwright JSON report |
| `tests/fixtures/reports/junit.sample.xml` | Sample JUnit XML report |

---

## Configuration Reference

### Vitest Configuration

**File:** `vitest.config.ts`

```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
    globals: true,
    hookTimeout: 15_000,
    include: ["tests/unit/**/*.test.{ts,tsx,js,jsx}"],
    pool: "forks",
    setupFiles: ["tests/setup.ts"],
    testTimeout: 30_000
  }
});
```

**Key Settings:**

- **Environment:** `happy-dom` (lightweight JSDOM alternative)
- **Globals:** `true` (no `describe`/`it` imports needed)
- **Include Pattern:** `tests/unit/**/*.test.{ts,tsx,js,jsx}`
- **Setup Files:** `tests/setup.ts` (runs before all tests — MSW, mocks, env)
- **Test Timeout:** 30 seconds per test

### Playwright Configuration

**File:** `playwright.config.ts`

```typescript
export default defineConfig({
  expect: { timeout: 10_000 },
  forbidOnly: !!env.CI,
  fullyParallel: false,
  globalSetup: "./tests/e2e/global-setup.ts",
  globalTeardown: "./tests/e2e/global-teardown.ts",
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } }
  ],
  testDir: "./tests/e2e",
  timeout: 90_000,
  use: {
    actionTimeout: 30_000,
    baseURL: "http://localhost:3000",
    navigationTimeout: 90_000,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "retain-on-failure"
  },
  webServer: {
    command: "bun run dev",
    reuseExistingServer: !env.CI,
    timeout: 180_000,
    url: "http://localhost:3000"
  },
  workers: 1
});
```

**Key Settings:**

- **Parallel:** `false` (stateful — app state is shared)
- **Workers:** 1 (sequential execution only)
- **Test Timeout:** 90 seconds per test
- **Action Timeout:** 30 seconds per action
- **Web Server:** Auto-starts `bun run dev` if not running
- **Global Setup/Teardown:** Handles DB prep and dev server management

### Setup Files

**File:** `tests/setup.ts`

Runs before all Vitest unit tests. Initializes:

- **MSW Server:** Intercepts network requests
- **Global Mocks:** Sonner, charts, auth, navigation, UI components
- **Environment Variables:** Loads `.env.local`
- **Cleanup:** Runs `cleanup()` after each test

---

## Running Tests

### Unit Tests (Fast)

```bash
# Run all unit tests
bun run test:browser

# Run one test file
bunx vitest run tests/unit/register.test.ts

# Run tests matching a pattern
bunx vitest run tests/unit/actions/ --pattern "register"

# Watch mode (during development)
bunx vitest tests/unit/register.test.ts
```

**Typical Duration:** 30–60 seconds (all 72 files)

### E2E Tests (Slow — requires DB + dev server)

```bash
# Run all E2E tests
# Port 3000 must be free; Playwright auto-starts dev server
bun run test:ui

# Run one spec file
bunx playwright test tests/e2e/auth.spec.ts

# Run tests matching a pattern
bunx playwright test --grep "sign-in"

# With database seeding
PLAYWRIGHT_PREPARE_DB=true bun run test:ui

# View HTML report after run
bun run test:ui:report
```

**Requirements:**

- Port 3000 free (or kill existing: `lsof -ti :3000 | xargs kill -9`)
- PostgreSQL running (via Docker or local)
- `.env.local` configured with `DATABASE_URL`

**Typical Duration:** 2–5 minutes (all 10 specs)

### All Tests (CI Pipeline)

```bash
# Matches CI enforcement
bun run validate

# Or individually:
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules
bun run test:browser   # Unit tests
bun run test:ui        # E2E tests (if DB available)
```

---

## Test Patterns & Best Practices

### Pattern 1: Server Wrapper Testing

Mock auth, server actions, and next/navigation:

```typescript
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(async () => ({
    user: { id: "user-1", name: "Test User" }
  }))
}));

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error("REDIRECT:" + url);
  }
}));

vi.mock("@/actions/transaction.actions", () => ({
  getTransactionHistory: vi.fn(async () => ({
    ok: true,
    transactions: []
  }))
}));

// Test the component
describe("DashboardServerWrapper", () => {
  it("should redirect unauthenticated users", async () => {
    vi.mocked(auth).mockImplementationOnce(() =>
      Promise.resolve(null)
    );
    // Test logic...
  });
});
```

### Pattern 2: MSW Handler Registration

Add or override handlers in specific tests:

```typescript
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mocks/server";

it("should handle Plaid linking error", () => {
  server.use(
    http.post("https://sandbox.plaid.com/link/token/create", () => {
      return HttpResponse.json(
        { error: "INVALID_REQUEST" },
        { status: 400 }
      );
    })
  );
  // Test logic...
});
```

### Pattern 3: E2E Authentication

Use the seeded user helper:

```typescript
import { signInWithSeedUser } from "./helpers/auth";

test("should show dashboard after sign-in", async ({ page }) => {
  await signInWithSeedUser(page);
  await expect(page).toHaveURL(/\/dashboard/);
});
```

### Pattern 4: Plaid Mock in E2E

Inject mock SDK before page loads:

```typescript
import { addMockPlaidInitScript } from "./helpers/plaid.mock";

test("should complete Plaid linking with mock token", async ({
  page
}) => {
  await addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN");
  await page.goto("/my-wallets/link");
  // Plaid flow proceeds without hitting real Plaid API
});
```

### Pattern 5: Database Helpers (E2E)

Check DB state in tests:

```typescript
import { isDatabaseSeeded, getDatabaseUrl } from "./helpers/db";

test("should seed test data before running", async () => {
  const url = getDatabaseUrl();
  const isSeeded = await isDatabaseSeeded(
    url,
    "seed-user@example.com"
  );
  expect(isSeeded).toBe(true);
});
```

### Best Practices

**DO:**

- Use web-first assertions: `expect(page).toHaveText()`, `expect(page).toBeVisible()`
- Group interactions with `test.step()`
- Mock external APIs (Plaid, Dwolla) in unit tests
- Use seeded users for E2E authentication
- Batch N+1 queries in DAL tests

**DON'T:**

- Use hard-coded waits: `page.waitForTimeout(1000)` ❌
- Use `.skip()` or `it.skip()` — fix or remove the test
- Access DB directly in E2E — use helpers
- Skip test isolation
- Commit `it.only()` or `test.only()`

---

## Verification Checklist

- [x] All 72 Vitest unit test files enumerated
- [x] All 10 Playwright E2E spec files enumerated
- [x] Mocks & helpers documented (MSW, Plaid, Dwolla, auth, DB)
- [x] Seed credentials verified (email, password, admin fixtures)
- [x] Configuration reference included (vitest + playwright)
- [x] Test patterns documented (server wrappers, MSW, E2E auth, Plaid mock)
- [x] Running tests documented (unit, E2E, all, CI)
- [x] Best practices outlined (DO/DON'T)

---

## References

- **AGENTS.md** — Section 5: Testing Guide (Vitest, Playwright, E2E patterns)
- **vitest.config.ts** — Unit test configuration (include pattern, setup files)
- **playwright.config.ts** — E2E configuration (stateful, 1 worker, global setup/teardown)
- **tests/setup.ts** — Global Vitest setup (MSW, mocks, env)
- **tests/e2e/global-setup.ts** — Playwright global setup (DB, seed data, dev server)
- **tests/e2e/global-teardown.ts** — Playwright global teardown (cleanup, results)
- **tests/e2e/helpers/plaid.mock.ts** — Mock pattern exemplar
- **tests/mocks/handlers.ts** — MSW handler definitions
- **tests/mocks/msw/server.ts** — MSW server setup
- **package.json** — Test scripts: `test:browser`, `test:ui`, `test:ui:report`

---

**Last Updated:** 2026-05-03  
**Task:** 0.3 — Test Suite Inventory (Phase 0 Documentation Refresh)  
**Status:** ✅ Complete  
**Verification:** 72 Vitest + 10 Playwright specs documented with mocks, helpers, seed data, and configuration reference
