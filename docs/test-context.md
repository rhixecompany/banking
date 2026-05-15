# Test Context

## Test Infrastructure

### Test Directories

```
src/tests/
├── e2e/                    # Playwright E2E tests
│   ├── specs/             # Test specs
│   ├── helpers/            # Test helpers
│   ├── integration/        # Integration tests
│   ├── utils/             # Test utilities
│   ├── global-setup.ts     # Global setup
│   └── global-teardown.ts  # Global teardown
├── fixtures/              # Test fixtures
│   ├── pages/             # Page object models
│   └── reports/           # Sample reports
└── unit/                  # Vitest unit tests (if any)
```

---

## E2E Tests (Playwright)

### Test Files

| Spec | Path | Purpose |
| --- | --- | --- |
| `auth.spec.ts` | `e2e/auth.spec.ts` | Sign in/sign up flows |
| `dashboard.spec.ts` | `e2e/dashboard.spec.ts` | Dashboard functionality |
| `my-wallets.spec.ts` | `e2e/my-wallets.spec.ts` | Wallet management |
| `payment-transfer.spec.ts` | `e2e/payment-transfer.spec.ts` | Payment transfers |
| `transaction-history.spec.ts` | `e2e/transaction-history.spec.ts` | Transaction history |
| `settings.spec.ts` | `e2e/settings.spec.ts` | Settings page |
| `admin.spec.ts` | `e2e/admin.spec.ts` | Admin functionality |
| `wallet-linking.spec.ts` | `e2e/wallet-linking.spec.ts` | Bank linking |
| `soft-delete.spec.ts` | `e2e/soft-delete.spec.ts` | Soft delete behavior |
| `transfer-idempotency.spec.ts` | `e2e/transfer-idempotency.spec.ts` | Idempotency |
| `link-and-transfer.spec.ts` | `e2e/integration/link-and-transfer.spec.ts` | End-to-end flow |
| `mock-tokens.spec.ts` | `e2e/mock-tokens.spec.ts` | Mock token handling |

### Test Helpers

| Helper          | Path                        | Purpose          |
| --------------- | --------------------------- | ---------------- |
| `auth.ts`       | `e2e/helpers/auth.ts`       | Auth helpers     |
| `db.ts`         | `e2e/helpers/db.ts`         | Database helpers |
| `dwolla.ts`     | `e2e/helpers/dwolla.ts`     | Dwolla mocks     |
| `plaid.ts`      | `e2e/helpers/plaid.ts`      | Plaid mocks      |
| `plaid.mock.ts` | `e2e/helpers/plaid.mock.ts` | Plaid mock data  |

### Playwright Configuration

**File:** `playwright.config.ts`

```typescript
{
  testDir: "./src/tests/e2e",
  globalSetup: "./src/tests/e2e/global-setup.ts",
  globalTeardown: "./src/tests/e2e/global-teardown.ts",
  projects: [{ name: "chromium", use: devices["Desktop Chrome"] }],
  timeout: 90_000,
  expect: { timeout: 10_000 },
  retries: CI ? 2 : 0,
  workers: 1,  // Sequential - shared state
  webServer: {
    command: "bun run dev",
    timeout: 180_000,
    reuseExistingServer: !CI,
  },
}
```

### Page Object Models (Fixtures)

| Page | Path | Purpose |
| --- | --- | --- |
| `BasePage` | `fixtures/pages/base.page.ts` | Base page class |
| `SignInPage` | `fixtures/pages/sign-in.page.ts` | Sign in page |
| `SignUpPage` | `fixtures/pages/sign-up.page.ts` | Sign up page |
| `DashboardPage` | `fixtures/pages/dashboard.page.ts` | Dashboard page |
| `MyWalletsPage` | `fixtures/pages/my-wallets.page.ts` | Wallets page |
| `PaymentTransferPage` | `fixtures/pages/payment-transfer.page.ts` | Transfer page |
| `TransactionHistoryPage` | `fixtures/pages/transaction-history.page.ts` | History page |

### Auth Fixtures

**File:** `e2e/utils/auth-fixtures.ts`

- Seeded test user creation
- Cookie-based auth for tests

### Test Utilities

| Utility            | Path                         | Purpose       |
| ------------------ | ---------------------------- | ------------- |
| `auth-fixtures.ts` | `e2e/utils/auth-fixtures.ts` | Auth fixtures |

---

## Unit Tests (Vitest)

### Configuration

**File:** `vitest.config.ts`

```typescript
{
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["src/tests/unit/**/*.test.{ts,tsx,js,jsx}"],
    setupFiles: ["src/tests/setup.ts"],
    testTimeout: 30_000,
    hookTimeout: 15_000,
  },
}
```

### Setup Files

**File:** `setup-tests.ts`

- Global test setup
- Mock providers

---

## Database Schema (for Tests)

### Key Tables

- `users` - User accounts with soft-delete
- `user_profiles` - Extended profile data
- `wallets` - Bank connections (encrypted tokens)
- `transactions` - Transaction records
- `recipients` - Saved transfer recipients

### Enums

- `user_role` - USER, ADMIN
- `transaction_status` - PENDING, COMPLETED, FAILED, CANCELLED
- `transaction_type` - DEBIT, CREDIT
- `transaction_channel` - ACH, INTERNAL, CARD

---

## Test Dependencies

### External Integrations (Mocked)

- **Plaid** - Bank linking (mock mode available)
- **Dwolla** - ACH transfers (mock mode available)
- **NextAuth** - Session management

### Mock Strategies

1. **Plaid**: `isMockAccessToken()` check in actions
2. **Dwolla**: Environment-based mock responses
3. **Auth**: Database-seeded users with bcrypt passwords

---

## Running Tests

### Commands

```bash
bun run test          # All tests (slow)
bun run test:browser # Vitest unit/integration tests
bun run test:ui      # Playwright E2E tests
bun run test:ui:report  # Show HTML report
```

### CI Configuration

- GitHub Actions for CI
- 2 retries on failure
- Sequential workers (shared state)
- Screenshot on failure
- Trace on first retry

---

## Test Data Management

### Seed Data

- `scripts/seed/run.ts` - Database seeder
- `scripts/seed/seed-data.ts` - Seed definitions
- `scripts/seed/seed-config.ts` - Seed configuration

### Test Users

- Created via `scripts/seed/` or `auth-fixtures.ts`
- bcrypt hashed passwords
- Seeded with wallets and transactions

---

## Best Practices

### Page Object Pattern

```typescript
class DashboardPage {
  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/dashboard");
  }

  async getBalance() {
    return this.page.locator('[data-testid="balance"]');
  }
}
```

### Auth in Tests

```typescript
// Use seeded user from fixtures
test("dashboard loads", async ({ page }) => {
  await setupAuthenticatedPage(page, testUser);
  await page.goto("/dashboard");
  await expect(page.locator("h1")).toContainText("Dashboard");
});
```

### Error Handling

```typescript
test("handles error state", async ({ page }) => {
  await page.goto("/dashboard");
  // Verify error boundary works
  await expect(page.getByText("Something went wrong")).toBeVisible();
});
```

---

## Known Test Issues

### TODO Items

- [ ] Add more integration tests for Plaid flow
- [ ] Add wallet disconnect tests
- [ ] Add recipient CRUD tests
- [ ] Harden skipped tests
- [ ] Add seeded user for deterministic tests

### Skipped Tests

- Check each spec for `.skip()` or `.only()` patterns

---

## Coverage Areas

### Covered

- Sign in/up flows
- Dashboard display
- Wallet management
- Payment transfers
- Transaction history
- Settings updates
- Admin functionality

### Not Covered

- Email notifications
- Webhook handlers (partial)
- Rate limiting
- Concurrent transfers
