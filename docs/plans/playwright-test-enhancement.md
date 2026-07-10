---
plan name: playwright-test-enhancement
plan description: Playwright E2E test improvements
plan status: active
---

## Idea

Enhance Playwright tests and configs for speed, logging, error handling, debugging, and coverage - ensure all browsers console errors are parsed, handled, and fixed

## Implementation

- 1. Research current playwright config and test patterns
- 1. Create console error handling fixture for all browsers
- 1. Add session reuse via storageState for speed optimization
- 1. Implement test.step() for better debugging visibility
- 1. Configure trace viewer with on-first-retry for CI debugging
- 1. Add soft assertions for better error reporting
- 1. Implement JS/CSS coverage collection
- 1. Add performance monitoring and timing utilities
- 1. Create test utilities for common operations
- 1. Verify all implementations work correctly

## Required Specs
<!-- SPECS_START -->
- playwright-speed-optimization
- playwright-console-errors
- playwright-debugging
- playwright-coverage
<!-- SPECS_END -->