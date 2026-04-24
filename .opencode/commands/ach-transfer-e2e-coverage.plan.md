# Implementation Plan: Playwright E2E Coverage for ACH Transfer Flow

## Overview

This plan outlines comprehensive E2E Playwright test coverage for the ACH transfer/payment flow. The current codebase has basic coverage but lacks thorough end-to-end verification of transfer scenarios, error handling, and edge cases.

**Current State:**

- Basic `payment-transfer.spec.ts` only checks unauthenticated redirects and page rendering
- Integration test `link-and-transfer.spec.ts` covers a single happy path with mocked Plaid/Dwolla

**Target State:** Full E2E test suite with 8-12 focused test cases.

---

## Goals & Success Criteria

1. **Primary Goal:** Add 8-12 focused Playwright E2E tests covering ACH transfer flows
2. **Success Criteria:**
   - Tests cover happy path, validation errors, insufficient funds, error conditions
   - All tests run against seeded DB (`PLAYWRIGHT_PREPARE_DB=true`)
   - Tests use deterministic mock data
   - CI gate: `npm run test:ui` passes with 0 failures

---

## Requirements

### Functional

| ID  | Requirement                            | Priority |
| --- | -------------------------------------- | -------- |
| F1  | Unauthenticated → redirect to /sign-in | Must     |
| F2  | Authenticated sees transfer form       | Must     |
| F3  | Form validates required fields         | Must     |
| F4  | Form validates amount format           | Must     |
| F5  | Form validates email format            | Must     |
| F6  | Success transfer → success message     | Must     |
| F7  | Transfer creates dwolla_transfers row  | Should   |
| F8  | Transfer creates transactions row      | Should   |
| F9  | Insufficient funds → error             | Should   |

### Non-Functional

| ID  | Requirement                   | Target |
| --- | ----------------------------- | ------ |
| NF1 | Test execution time per spec  | <60s   |
| NF2 | Deterministic (no flaky)      | 100%   |
| NF3 | Use existing fixtures/helpers | -      |

---

## Implementation Steps

### Phase 1: Expand Basic Tests (2 tests)

- [ ] 1.1 Keep existing unauthenticated redirect test
- [ ] 1.2 Keep existing authenticated render test
- [ ] 1.3 Add test: form renders with all fields (source wallet, recipient, amount)
- [ ] 1.4 Add test: empty form submission shows validation errors

### Phase 2: Validation Tests (4 tests)

- [ ] 2.1 Required field validation (source wallet)
- [ ] 2.2 Required field validation (recipient)
- [ ] 2.3 Required field validation (amount)
- [ ] 2.4 Invalid amount format (non-numeric)
- [ ] 2.5 Invalid amount (negative/zero)

### Phase 3: Happy Path & DB Verification (3 tests)

- [ ] 3.1 Successful transfer with mock data → success message
- [ ] 3.2 Verify dwolla_transfers row created in DB
- [ ] 3.3 Verify transactions row created in DB

### Phase 4: Error Handling (2 tests)

- [ ] 4.1 Insufficient funds error handling
- [ ] 4.2 API error handling (mock error response)

---

## Risk Register

| ID | Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- | --- |
| R1 | Tests depend on seeded DB state | Medium | High | Use deterministic seed data |
| R2 | Flaky tests due to timing | Medium | Medium | Use explicit waits + expect retries |
| R3 | Mock transfer URL not working | Low | High | Verify mock short-circuit in actions |
| R4 | Page structure changes break selectors | Medium | Medium | Use role-based + label selectors |

---

## Testing Strategy

| Test Case | File | Fixture | DB Check |
| --- | --- | --- | --- |
| Unauthenticated redirect | payment-transfer.spec.ts | unauthenticatedPage | No |
| Authenticated render | payment-transfer.spec.ts | paymentTransferPage | No |
| Form validation errors | payment-transfer.spec.ts | paymentTransferPage | No |
| Happy path transfer | payment-transfer.spec.ts | paymentTransferPage | Yes |
| DB metadata verification | payment-transfer.spec.ts | paymentTransferPage | Yes |
| Insufficient funds | payment-transfer.spec.ts | paymentTransferPage | No |
| Error handling | payment-transfer.spec.ts | paymentTransferPage | No |

---

## Acceptance Criteria

- [ ] `npm run test:ui` passes with 0 failures
- [ ] All 10-12 test cases implemented
- [ ] Tests use `paymentTransferPage` fixture
- [ ] DB verification uses `dwollaDal` and `transactionDal`
- [ ] Deterministic mock data for transfers
- [ ] No hardcoded waits - use Playwright auto-waiting

---

## Estimates

- **Phase 1**: 15 min
- **Phase 2**: 20 min
- **Phase 3**: 25 min
- **Phase 4**: 15 min
- **Total**: ~75 min

---

## Provenance

- Files read: tests/e2e/payment-transfer.spec.ts, tests/e2e/integration/link-and-transfer.spec.ts, tests/fixtures/auth.ts, tests/fixtures/pages/payment-transfer.page.ts, actions/dwolla.actions.ts (lines 322-426)
- Reason: Understanding existing test patterns and server action mock behavior
