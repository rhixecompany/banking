---
plan name: playwright-test-enhancement
plan description: Playwright E2E test improvements
plan status: active
---

## Idea
Enhance Playwright tests and configs for speed, logging, error handling, debugging, and coverage - ensure all browsers console errors are parsed, handled, and fixed

## Implementation
- 1. Research current playwright config and test patterns
- 2. Create console error handling fixture for all browsers
- 3. Add session reuse via storageState for speed optimization
- 4. Implement test.step() for better debugging visibility
- 5. Configure trace viewer with on-first-retry for CI debugging
- 6. Add soft assertions for better error reporting
- 7. Implement JS/CSS coverage collection
- 8. Add performance monitoring and timing utilities
- 9. Create test utilities for common operations
- 10. Verify all implementations work correctly

## Required Specs
<!-- SPECS_START -->
- playwright-speed-optimization
- playwright-console-errors
- playwright-debugging
- playwright-coverage
<!-- SPECS_END -->