---
plan name: cleanup-dead-code
plan description: Cleanup dead code and duplicate tests
plan status: active
---

## Idea

Systematically audit all components and tests, remove dead/duplicate code, integrate reusable components, and ensure tests are properly deduplicated and up-to-date

## Implementation

- 1.1 Delete 17 unused component files (site-header, plaid-link, animated-counter, charts, nav components, etc.)
- 1.2 Delete unused wrapper files (home-client-wrapper, not-found wrappers, global-error-client-wrapper)
- 1.3 Run lint:strict and type-check to verify no breakage
- 2.1 Delete duplicate test file tests/unit/dal/dwolla-dal.test.ts (less coverage)
- 2.2 Delete duplicate test file tests/e2e/payment-transfer-flow.spec.ts (redundant)
- 2.3 Verify all tests pass after deduplication
- 3.1 Identify usable but unused components (charts, data-table) for potential integration
- 3.2 Create plan for component integration if requested by user
- 3.3 Run full test suite (npm run test) to verify all changes
- 4.1 Verify with npm run verify:rules
- 4.2 Document cleanup results and file counts

## Required Specs

<!-- SPECS_START -->
<!-- SPECS_END -->
