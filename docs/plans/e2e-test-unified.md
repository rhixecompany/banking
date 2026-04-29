---
plan name: e2e-test-unified
plan description: E2E test fixes with canonical ref cleanup
plan status: active
---

## Idea
Fix E2E tests and standardize canonical references for the Banking app - combine link-and-transfer test fixes with seed constants consolidation

## Implementation
- 1. Run Phase 1 root cause: execute link-and-transfer.spec.ts to capture first failure, stack trace, ECONNRESET messages, and Plaid console warnings
- 2. Run Phase 1 re-run to detect flake - execute link-and-transfer.spec.ts again and compare results
- 3. Run plaid-script.spec.ts to verify Plaid duplicate script detection and console warnings
- 4. Locate all Plaid script injection paths: grep for plaid.com/link, react-plaid-link, usePlaidLink, PlaidProvider, plaid-link-script
- 5. Create shared seed constants file: tests/fixtures/seed-constants.ts with SEED_USER_EMAIL, SEED_USER_PASSWORD, SEED_USER_ID, RECIPIENT_EMAIL, SEED_SHAREABLE_CHECKING
- 6. Update auth.ts to import from seed-constants.ts instead of hardcoding
- 7. Update link-and-transfer.spec.ts to use constants from seed-constants.ts
- 8. Update payment-transfer.spec.ts to use constants from seed-constants.ts
- 9. Add JSDoc to plaid.mock.ts explaining MOCK_PUBLIC_TOKEN intentionally doesn't follow isMockAccessToken() pattern
- 10. Fix Plaid duplicate script injection at source - ensure only one link-initialize.js script element exists
- 11. Fix any ECONNRESET/disconnects identified in root cause
- 12. Verify plaid-script.spec.ts passes with no Plaid-related console warnings
- 13. Verify link-and-transfer.spec.ts passes twice in a row with no Plaid console warnings
- 14. Run full E2E suite (bun run test:ui) to identify remaining failures and apply same root-cause-first approach

## Required Specs
<!-- SPECS_START -->
- enhance-pages-spec
- enhance-pages-v2
- root-tests
<!-- SPECS_END -->