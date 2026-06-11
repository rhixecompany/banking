# Spec: playwright-console-errors

Scope: feature

# Playwright Console Error Handling Spec

## Overview
Implement comprehensive console error detection and handling for all browsers to catch JavaScript errors, warnings, and page errors during test execution.

## Current State
- Basic test configuration exists
- No console error detection implemented
- Tests may pass even when browser console has errors

## Target State

### 1. Console Message Capture
- Listen to page.on('console') for all console types: log, info, warning, error
- Capture message text, type, location (URL, line, column)
- Store errors/warnings for post-test analysis
- Support multiple browsers (chromium, firefox, webkit)

### 2. Auto-Fail on Console Errors
- Create fixture that fails test if console errors detected
- Support allowed errors list for expected errors:
  - Failed to load resource (favicon, etc.)
  - ResizeObserver loop limit exceeded
  - Third-party script errors (analytics, etc.)
- Make this opt-in per-test or global

### 3. Page Error Detection
- Listen to page.on('pageerror') for uncaught exceptions
- Capture error message and stack trace
- Include in test failure output

### 4. Console Fixture Implementation
```typescript
// fixtures/console-handler.ts
type ConsoleFixtures = {
  consoleErrors: string[];
  consoleWarnings: string[];
  pageErrors: Error[];
};

export const test = base.extend<ConsoleFixtures>({
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await use(errors);
  },
  
  // Alternative: auto-fail fixture
  failOnConsoleError: [async ({ page }, use, testInfo) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    await use();
    if (errors.length > 0) {
      throw new Error(`Console errors: ${errors.join('\n')}`);
    }
  }, { auto: true }]
});
```

### 5. Test Integration
```typescript
test('should work without console errors', async ({ page, consoleErrors }) => {
  await page.goto('/');
  // Test actions...
  expect(consoleErrors).toHaveLength(0);
});
```

## Browser Support
- Chromium (default)
- Firefox (if enabled in projects)
- WebKit (if enabled in projects)

## Allowed Errors Configuration
```typescript
const ALLOWED_ERRORS = [
  /Failed to load resource.*favicon/,
  /ResizeObserver loop limit exceeded/,
  /net::ERR_NAME_NOT_RESOLVED/,
];
```

## Success Criteria
- All console errors captured and reported
- Tests fail on unexpected console errors
- Expected errors can be allowlisted
- Works across all configured browsers

## Files to Create/Modify
- `src/tests/e2e/fixtures/console-handler.ts` - New fixture
- `src/tests/e2e/fixtures/index.ts` - Export fixtures
- Individual test files - Add console error checks