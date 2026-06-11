# Spec: playwright-coverage

Scope: feature

# Playwright Code Coverage Spec

## Overview
Implement JavaScript and CSS code coverage measurement for Playwright E2E tests to identify untested code paths.

## Current State
- No coverage measurement implemented
- Tests run against production build

## Target State

### 1. Coverage API Integration
- Use page.coverage.startJSCoverage() / stopJSCoverage()
- Use page.coverage.startCSSCoverage() / stopCSSCoverage()
- Collect coverage per test or per suite

### 2. Coverage Fixture
```typescript
// fixtures/coverage.ts
type CoverageFixtures = {
  coverage: CoverageData;
};

async function collectCoverage(page: Page): Promise<CoverageData> {
  await page.coverage.startJSCoverage({ resetOnNavigation: false });
  await page.coverage.startCSSCoverage({ resetOnNavigation: false });
  
  // ... test actions ...
  
  const [jsCoverage, cssCoverage] = await Promise.all([
    page.coverage.stopJSCoverage(),
    page.coverage.stopCSSCoverage(),
  ]);
  
  return { js: jsCoverage, css: cssCoverage };
}
```

### 3. Coverage Report Generation
- Convert V8 coverage to Istanbul format using v8-to-istanbul
- Generate HTML coverage reports
- Support LCOV format for CI integration

### 4. Coverage Configuration
```typescript
// playwright.config.ts
use: {
  // Coverage requires special setup
},
```

### 5. Implementation Options

#### Option A: Built-in Coverage (No Instrumentation)
- Use page.coverage APIs directly
- No code instrumentation needed
- Limited to executed JS/CSS, not line-by-line

#### Option B: Instrumented Coverage (Istanbul)
- Add babel-plugin-istanbul to build
- Use nyc to run tests
- Full line/branch coverage

### 6. Coverage Reporting
```bash
# Generate HTML report
npx playwright-coverage --html

# Generate LCOV for CI
npx playwright-coverage --lcov > coverage.lcov
```

### 7. Coverage Metrics
- Line coverage: percentage of lines executed
- Function coverage: functions called
- Branch coverage: conditional paths tested

## Success Criteria
- Coverage data collected for each test run
- HTML report generated showing uncovered code
- Coverage percentage tracked over time

## Files to Create/Modify
- `src/tests/e2e/fixtures/coverage.ts` - Coverage fixture
- `src/tests/e2e/scripts/generate-coverage.ts` - Report generation
- `package.json` - Add coverage scripts
- `next.config.js` - Add istanbul instrumentation (if using Option B)

## Notes
- Coverage only works in Chromium (browser limitation)
- Instrumented coverage requires build changes
- Consider coverage goals: 70-80% is reasonable for E2E