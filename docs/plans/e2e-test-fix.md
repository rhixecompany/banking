---
plan name: e2e-test-fix
plan description: E2E test stabilization
plan status: active
---

## Idea

Fix all failing E2E Playwright tests in the banking application by increasing timeouts, fixing networkidle issues, and stabilizing the test suite

## Implementation

- Batch 1: Verify payment-transfer.spec.ts fixes work
- Batch 2: Fix networkidle timeouts in my-wallets, transaction-history, plaid-script
- Batch 3: Rewrite soft-delete.spec.ts to test actual behavior
- Batch 4: Optimize transfer-idempotency.spec.ts with page objects
- Batch 5: Increase timeouts in wallet-linking.spec.ts
- Batch 6: Verify auth, admin, dashboard, settings tests pass
- Batch 7: Run mock-tokens and integration tests
- Batch 8: Final full test suite verification

## Required Specs

<!-- SPECS_START -->

- e2e-test-catalog
<!-- SPECS_END -->
