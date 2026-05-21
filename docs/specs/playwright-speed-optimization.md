# Spec: playwright-speed-optimization

Scope: feature

# Playwright Speed Optimization Spec

## Overview
Optimize Playwright E2E tests for faster execution through session reuse, parallel execution, and removing hard waits.

## Current State
- Tests run sequentially (workers: 1)
- No session reuse - each test logs in through UI
- Global setup with database seeding exists
- Dev server warm-up implemented

## Target State

### 1. Session Reuse via StorageState
- Create authenticated session fixture that reuses storageState
- Store auth state in file after first login
- Reuse across tests to save 5-10 seconds per test
- Implement in global-setup.ts or dedicated auth fixture

### 2. Parallel Execution
- Increase workers from 1 to match CPU cores (or 4-8 for CI)
- Enable fullyParallel: true for independent tests
- Use test.describe.configure({ mode: 'parallel' }) for parallel test groups
- Consider sharding for large test suites on CI

### 3. Remove Hard Waits
- Replace all page.waitForTimeout() calls
- Use web-first assertions (expect(locator).toBeVisible())
- Use waitForSelector with state options instead of fixed delays
- Use waitForResponse for API-dependent assertions

### 4. Navigation Optimization
- Use waitUntil: 'domcontentloaded' when full load not needed
- Block unnecessary resources (analytics, ads) via page.route()
- Consider lazy loading handling for below-fold content

## Implementation Details

### Session Reuse Fixture
```typescript
// fixtures/auth-session.ts
export const test = base.extend({
  authenticatedPage: async ({ browser }, use) => {
    const storageStatePath = path.join(__dirname, 'auth-state.json');
    // Load or create storage state
    const context = await browser.newContext({ storageState: storageStatePath });
    const page = await context.newPage();
    await use(page);
    await context.close();
  }
});
```

### Parallel Test Configuration
```typescript
// playwright.config.ts
fullyParallel: true,
workers: process.env.CI ? 4 : undefined, // Auto-detect cores
retries: process.env.CI ? 2 : 0,
```

## Success Criteria
- Test suite execution time reduced by 30-50%
- Each test saves 5-10 seconds from session reuse
- No flaky tests from parallel execution
- All tests pass with new configuration

## Files to Modify
- `playwright.config.ts` - Update parallel settings
- `src/tests/e2e/global-setup.ts` - Add session reuse
- Individual test files - Remove hard waits, add parallel mode