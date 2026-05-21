# Spec: playwright-debugging

Scope: feature

# Playwright Debugging & Logging Spec

## Overview
Enhance Playwright debugging capabilities with trace viewer, test steps, soft assertions, and comprehensive logging.

## Current State
- Trace configured: 'on-first-retry'
- Basic reporter configuration (html, list)
- Global setup/teardown with logging exists

## Target State

### 1. Trace Viewer Configuration
- Keep trace: 'on-first-retry' for CI (recommended)
- Add trace: 'retain-on-failure' option for local debugging
- Configure screenshot capture in traces
- Enable network capture in traces

### 2. Test Steps for Debugging
- Add test.step() for logical groupings
- Use for: login flow, navigation, form submission
- Improves trace viewer readability
- Helps identify slow steps

```typescript
test('transfer funds', async ({ page }) => {
  await test.step('Navigate to transfer', async () => {
    await page.goto('/transfer');
  });
  
  await test.step('Fill transfer form', async () => {
    await page.fill('#amount', '100');
    await page.click('#submit');
  });
  
  await test.step('Verify success', async () => {
    await expect(page.locator('.success')).toBeVisible();
  });
});
```

### 3. Soft Assertions
- Use expect.soft() for non-critical assertions
- Collect all failures before failing test
- Better for comprehensive error reporting

```typescript
test('validate form', async ({ page }) => {
  await expect.soft(page.locator('#name')).toHaveValue('John');
  await expect.soft(page.locator('#email')).toHaveValue('john@example.com');
  await expect(page.locator('#submit')).toBeEnabled();
});
```

### 4. Enhanced Logging
- Add detailed logging in global setup/teardown
- Log test start/end with timing
- Capture browser console in reports
- Use console.info for progress, console.error for failures

### 5. Debug Configuration
```typescript
// playwright.config.ts
use: {
  trace: 'on-first-retry', // CI recommended
  // For local debugging:
  // trace: 'retain-on-failure',
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
},
```

### 6. VS Code Integration
- Document VS Code extension usage
- Configure debug launch configurations
- Add .vscode/launch.json for debugging

## Reporter Enhancement
```typescript
reporter: env.CI 
  ? [
      ['github'], 
      ['html', { outputFolder: 'playwright-report' }],
      ['list'],
      ['./src/tests/e2e/reporter.ts'], // Custom reporter
    ]
  : [
      ['html', { open: 'on-failure' }],
      ['list'],
    ],
```

## Success Criteria
- Trace viewer shows clear step-by-step actions
- Failed tests include comprehensive error info
- Soft assertions collect multiple failures
- Debugging time reduced by 50%

## Files to Modify
- `playwright.config.ts` - Update trace and reporter config
- `src/tests/e2e/global-setup.ts` - Add timing/logging
- `src/tests/e2e/global-teardown.ts` - Enhanced reporting
- Test files - Add test.step() and soft assertions