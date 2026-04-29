# Spec: e2e-fix-feature

Scope: feature

# E2E Test Fix with Canonical Ref Cleanup - Feature Spec

## Overview

Fix E2E test failures in the Banking app by addressing link-and-transfer test issues while standardizing canonical references (seed constants) across test files.

## Problem Statement

1. **E2E Test Failures**: `tests/e2e/integration/link-and-transfer.spec.ts` is failing with Plaid-related console warnings and potential flakiness
2. **Canonical Reference Inconsistency**: Hardcoded seed credentials and IDs duplicated across multiple test files
3. **Plaid Script Duplication**: Multiple Plaid script injections causing console warnings

## Goals

| Goal | Success Criteria |
|------|------------------|
| Link-and-transfer test passes | Runs twice in a row with no failures |
| No Plaid console warnings | Zero warnings containing "plaid", "Plaid", or "link-initialize" |
| Canonical references consolidated | Single source of truth for seed constants |
| Full E2E suite stable | All tests pass or have documented issues |

## Technical Specifications

### 1. Seed Constants File

```typescript
// tests/fixtures/seed-constants.ts
export const SEED_USER_EMAIL = "seed-user@example.com" as const;
export const SEED_USER_PASSWORD = "password123" as const;
export const SEED_USER_ID = "00000000-0000-4000-8000-000000000003" as const;
export const RECIPIENT_EMAIL = "recipient.seed@example.com" as const;
export const SEED_SHAREABLE_CHECKING = "seed-share-checking-001" as const;
export const SEED_SHAREABLE_SAVINGS = "seed-share-savings-002" as const;
```

### 2. Files to Update

| File | Change |
|------|--------|
| `tests/e2e/helpers/auth.ts` | Import from seed-constants.ts |
| `tests/e2e/integration/link-and-transfer.spec.ts` | Use constants |
| `tests/e2e/payment-transfer.spec.ts` | Use constants |
| `tests/e2e/helpers/plaid.mock.ts` | Add JSDoc for MOCK_PUBLIC_TOKEN |

### 3. Plaid Script Fix

- Ensure only one `https://cdn.plaid.com/link/v2/stable/link-initialize.js` script element
- Remove duplicate injection paths
- Verify no console warnings on test run

### 4. Test Verification Commands

```bash
# Phase 1 verification
PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/integration/link-and-transfer.spec.ts --project=chromium --trace=on --retries=0

# Phase 2 verification
PLAYWRIGHT_PREPARE_DB=true bunx playwright test tests/e2e/specs/plaid-script.spec.ts --project=chromium --retries=0

# Full suite
bun run test:ui
```

## Acceptance Criteria

- [ ] link-and-transfer.spec.ts passes twice consecutively
- [ ] plaid-script.spec.ts passes with no Plaid console warnings
- [ ] No ECONNRESET errors in test output
- [ ] All hardcoded seed values imported from seed-constants.ts
- [ ] JSDoc added to plaid.mock.ts explaining mock token pattern
- [ ] Full E2E suite runs without blocking failures

## Dependencies

- Node.js 18+
- Bun package manager
- PostgreSQL database accessible
- Playwright browsers installed

## Risks

| Risk | Mitigation |
|------|------------|
| Test still flaky after fixes | Add more detailed logs, increase timeouts |
| Plaid script still duplicated | Trace all injection paths, remove at source |
| Seed data not matching DB | Verify seed-data.ts matches seed-constants.ts |