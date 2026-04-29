---
name: testing-skill
description: >-
  Testing patterns for Vitest (unit) and Playwright (E2E) used by the Banking app. Use when writing tests, running tests, debugging test failures, or setting up test infrastructure. Triggers include requests to "write a test", "run tests", "fix test failure", "add unit tests", "add E2E tests", or any task involving test creation or execution.
lastReviewed: 2026-04-24
applyTo: "tests/**"
---

# Testing Skill — Test Patterns for Banking App

This skill provides comprehensive testing patterns using Vitest for unit/integration tests and Playwright for E2E tests.

## When to Use This Skill

- Writing new unit or integration tests with Vitest
- Writing E2E tests with Playwright
- Debugging test failures
- Setting up test infrastructure
- Running tests locally or in CI

## Multi-Agent Commands

### OpenCode / Cursor / Copilot
```bash
# Run all tests (E2E first, then unit)
bun run test

# Run only unit tests (Vitest)
bun run test:browser

# Run only E2E tests (Playwright)
bun run test:ui

# Run single Vitest file
bun exec vitest run tests/unit/auth.test.ts --config=vitest.config.ts

# Run single Playwright spec
bunx playwright test tests/e2e/auth.spec.ts --project=chromium
```

## Test Infrastructure Overview

### Test Runners

| Runner | Purpose | Command |
|--------|---------|---------|
| Vitest | Unit & integration tests | `bun run test:browser` |
| Playwright | E2E tests | `bun run test:ui` |
| Both | Full test suite | `bun run test` |

### Test File Patterns

```
tests/
├── unit/                    # Vitest unit tests
│   ├── auth.test.ts
│   ├── validation.test.ts
│   └── utils.test.ts
├── e2e/                     # Playwright E2E tests
│   ├── auth.spec.ts
│   ├── dashboard.spec.ts
│   └── helpers/
│       ├── auth.ts
│       └── plaid.mock.ts
└── fixtures/               # Test data
    └── users.json
```

## Vitest Patterns

### Basic Test Structure

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Auth Module', () => {
  beforeEach(() => {
    // Reset state between tests
  });

  it('should validate email format', () => {
    const result = validateEmail('invalid-email');
    expect(result.valid).toBe(false);
  });

  it('should accept valid email', () => {
    const result = validateEmail('user@example.com');
    expect(result.valid).toBe(true);
  });
});
```

### Testing Server Actions

```typescript
import { describe, it, expect, vi } from 'vitest';
import { registerAction } from '@/actions/register';

vi.mock('@/lib/auth', () => ({
  auth: vi.fn()
}));

describe('registerAction', () => {
  it('should return error for unauthenticated user', async () => {
    const result = await registerAction({ email: 'test@test.com' });
    expect(result.ok).toBe(false);
    expect(result.error).toBe('Unauthorized');
  });
});
```

### Mocking Dependencies

```typescript
import { vi, describe, it, expect } from 'vitest';

// Mock a module
vi.mock('@/lib/plaid', () => ({
  plaidClient: {
    itemPublicTokenExchange: vi.fn().mockResolvedValue({
      data: { access_token: 'mock-access-token' }
    })
  }
}));

// Mock a function
vi.spyOn(console, 'error').mockImplementation(() => {});
```

### Testing with Database

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '@/database';
import { userDal } from '@/dal/user.dal';

describe('User DAL', () => {
  beforeAll(async () => {
    // Setup test database
  });

  afterAll(async () => {
    // Cleanup
  });

  it('should create a user', async () => {
    const user = await userDal.create({
      email: 'test@example.com',
      name: 'Test User'
    });
    expect(user.email).toBe('test@example.com');
  });
});
```

## Playwright E2E Patterns

### Basic E2E Test

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'seed-user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'wrong@test.com');
    await page.fill('[name="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    await expect(page.locator('.error')).toContainText('Invalid');
  });
});
```

### Testing Protected Routes

```typescript
import { test, expect } from '@playwright/test';

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated users', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login');
  });

  test('should allow authenticated users', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('[name="email"]', 'seed-user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Should access dashboard
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
});
```

### Page Object Pattern

```typescript
// tests/e2e/pages/Dashboard.ts
import { Page, Locator } from '@playwright/test';

export class DashboardPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly balance: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.locator('h1');
    this.balance = page.locator('[data-testid="balance"]');
  }

  async goto() {
    await this.page.goto('/dashboard');
  }

  async getBalance() {
    return this.balance.textContent();
  }
}

// Usage in tests
import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/Dashboard';

test('dashboard shows balance', async ({ page }) => {
  const dashboard = new DashboardPage(page);
  await dashboard.goto();
  await expect(dashboard.heading).toContainText('Dashboard');
});
```

### API Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  test('should fetch transactions', async ({ request }) => {
    const response = await request.get('/api/transactions', {
      headers: {
        Authorization: 'Bearer seed-token-123'
      }
    });

    expect(response.ok()).toBe(true);
    const data = await response.json();
    expect(Array.isArray(data.transactions)).toBe(true);
  });
});
```

## Mock Token Pattern

The app uses `isMockAccessToken()` in `lib/plaid.ts` to detect test tokens:

```typescript
// lib/plaid.ts
export function isMockAccessToken(token: string): boolean {
  const t = token.toLowerCase();
  return (
    t.startsWith('seed-') ||
    t.startsWith('mock-') ||
    t.startsWith('mock_')
  );
}
```

### Using Mock Tokens in Tests

```typescript
// Vitest unit test
const mockToken = 'seed-access-token-123';
if (isMockAccessToken(mockToken)) {
  // Skip actual Plaid API calls in tests
}

// E2E test with mock Plaid
import { test, expect } from '@playwright/test';
import { setupPlaidMock } from '../helpers/plaid.mock';

test('should link bank account with mock', async ({ page }) => {
  await setupPlaidMock(page);
  await page.goto('/settings/bank-accounts');
  await page.click('button:has-text("Add Bank")');
  // Mock Plaid Link handles the flow
});
```

### Mock Plaid Helper

```typescript
// tests/e2e/helpers/plaid.mock.ts
import { Page } from '@playwright/test';

export async function setupPlaidMock(page: Page) {
  await page.addInitScript(() => {
    window.__PLAID_MOCK__ = true;
  });
}

export function createMockPublicToken(): string {
  return 'MOCK_PUBLIC_TOKEN_' + Date.now();
}
```

## Port Management

### Windows Port 3000

Before running Playwright or Vitest, kill port 3000:

```powershell
$pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
```

### Test Runner Guard

The project includes a test runner guard that always clears port 3000 before test runs.

## Test Configuration

### Vitest Config

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.{ts,tsx,js,jsx}'],
    environment: 'node',
    globals: true,
    setupFiles: ['tests/unit/setup.ts'],
  },
});
```

### Playwright Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,  // Tests are stateful
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
```

## Running Tests

### Commands

| Command | Description |
|---------|-------------|
| `bun run test` | Run E2E then unit tests |
| `bun run test:browser` | Run Vitest unit tests |
| `bun run test:ui` | Run Playwright E2E tests |
| `bun exec vitest run` | Run all Vitest tests |
| `bun exec vitest run --watch` | Watch mode |
| `bunx playwright test` | Run all Playwright tests |
| `bunx playwright test --ui` | Playwright UI mode |

### Running Specific Tests

```bash
# Single Vitest file
bun exec vitest run tests/unit/auth.test.ts --config=vitest.config.ts

# Single Playwright spec
bunx playwright test tests/e2e/auth.spec.ts --project=chromium

# Filter by test name
bun exec vitest run -t "should validate"

# Filter by file pattern
bunx playwright test tests/e2e --grep "auth"
```

## Debugging Tests

### Vitest Debug

```bash
# Run with verbose output
bun exec vitest run --reporter=verbose

# Debug with Node inspector
bun exec vitest run --inspect-brk
```

### Playwright Debug

```bash
# UI mode
bunx playwright test --ui

# Show trace on failure
bunx playwright test --trace on

# Open last trace
bunx playwright show-trace
```

## Best Practices

1. **Test naming** - Use descriptive names: `should return error for invalid email`
2. **Arrange-Act-Assert** - Clear test structure
3. **One assertion per test** - Better failure diagnosis
4. **Mock external services** - Plaid, APIs, etc.
5. **Use fixtures** - Reusable test data
6. **Clean up state** - Reset between tests
7. **Port management** - Always clear port 3000 on Windows

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 3000 in use | Run port cleanup script |
| E2E tests fail on first run | Run dev server first: `bun run dev` |
| Flaky tests | Check for race conditions, add waits |
| Mock not working | Verify mock token pattern (`seed-`, `mock-`) |
| Auth tests fail | Check session helper mock |

## Cross-References

- **auth-skill**: For authentication patterns in tests
- **validation-skill**: For input validation testing
- **dal-skill**: For database testing patterns

## Validation Commands

```bash
# Full test suite
bun run test

# Unit tests only
bun run test:browser

# E2E tests only
bun run test:ui

# Type check
bun run type-check
```