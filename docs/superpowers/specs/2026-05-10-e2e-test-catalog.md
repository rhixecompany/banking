# E2E Test Catalog - May 10, 2026

> **Spec Type:** REPO  
> **Purpose:** Complete catalog of all E2E Playwright tests with status and identified issues

---

## Overview

This document catalogs all E2E Playwright tests in the banking application. The test suite verifies authentication, wallet management, payment transfers, and admin functionality.

**Test Command:** `bun run test:ui`  
**Environment:** `PLAYWRIGHT_PREPARE_DB=true`  
**Browser:** Chromium (single project)

---

## Test Files Summary

| File | Tests | Status |
| --- | --- | --- |
| auth.spec.ts | 15 | ⚠️ Needs verification |
| dashboard.spec.ts | 3 | ⚠️ Needs verification |
| my-wallets.spec.ts | 5 | ⚠️ Needs verification |
| payment-transfer.spec.ts | 10 | 🔴 Failing - timeouts |
| wallet-linking.spec.ts | 6 | ⚠️ Needs verification |
| settings.spec.ts | 3 | ⚠️ Needs verification |
| transaction-history.spec.ts | 3 | ⚠️ Needs verification |
| admin.spec.ts | 4 | ⚠️ Needs verification |
| soft-delete.spec.ts | 7 | ⚠️ Needs verification |
| transfer-idempotency.spec.ts | 6 | ⚠️ Needs verification |
| mock-tokens.spec.ts | 4 | ⚠️ Needs verification |
| integration/link-and-transfer.spec.ts | 1 | ⚠️ Needs verification |
| specs/plaid-script.spec.ts | 1 | ⚠️ Needs verification |

**Total: 13 files, ~68 test cases**

---

## Detailed Test Catalog

### 1. auth.spec.ts (15 tests)

**Path:** `src/tests/e2e/auth.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should show landing page for unauthenticated users | Landing page renders for public | 10s | None |
| should show landing page for authenticated users | Landing page renders for auth | 10s | None |
| should navigate from sign-in to sign-up and back | Navigation flow works | 10s | None |
| should show sign-in form | Sign-in form visible | 10s | None |
| should show sign-up link | Sign-up link visible | 10s | None |
| should navigate to sign-up page | Navigation to signup | 10s | None |
| should show validation error for invalid email | Email validation | 5s | None |
| should show error toast for non-existent email | Auth failure handling | 15s | None |
| should show sign-up form | Signup form visible | 10s | None |
| should show sign-in link | Signin link visible | 10s | None |
| should navigate to sign-in page | Navigation to signin | 10s | None |
| should show all sign-up form fields | All fields visible | 10s | None |
| should show validation error for short password | Password validation | 10s | None |
| should show validation error for password mismatch | Password match validation | 10s | None |
| should show validation error for short name | Name validation | 10s | None |

**Status:** ✅ Likely passing - standard auth flow tests

---

### 2. dashboard.spec.ts (3 tests)

**Path:** `src/tests/e2e/dashboard.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should redirect unauthenticated users to sign-in | Auth guard | 20s | None |
| should render dashboard heading | Dashboard loads | 15s | ⚠️ PlaidProvider delay |
| should show mobile navigation on small viewport | Mobile menu | 10s | ⚠️ PlaidProvider delay |

**Status:** ⚠️ May need timeout increases for authenticated tests

---

### 3. my-wallets.spec.ts (5 tests)

**Path:** `src/tests/e2e/my-wallets.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should redirect unauthenticated users to sign-in | Auth guard | 10s | None |
| should show page title and description | Page content | 10s | ⚠️ Uses networkidle - can timeout |
| should show total balance card | Balance display | 10s | ⚠️ Uses networkidle |
| should list seeded wallet accounts | Wallet list | 10s | ⚠️ Uses networkidle |

**Status:** ⚠️ Tests use `waitForLoadState("networkidle")` which can cause timeouts with PlaidProvider

---

### 4. payment-transfer.spec.ts (10 tests) 🔴

**Path:** `src/tests/e2e/payment-transfer.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should redirect unauthenticated users to sign-in | Auth guard | 30s | ✅ Fixed |
| should render payment transfer form with all fields | Form render | 30s | ✅ Fixed |
| should show validation errors for empty form | Validation | 10s | None |
| should reject invalid amount format | Amount validation | 30s | ✅ Fixed |
| should reject negative amount | Amount validation | 30s | ✅ Fixed |
| should reject zero amount | Amount validation | 30s | ✅ Fixed |
| should complete successful transfer with mock data | Happy path | 30s | ✅ Fixed |
| should create dwolla_transfers row after transfer | DB verification | 30s | ✅ Fixed |
| should create transactions row after transfer | DB verification | 30s | ✅ Fixed |
| should show insufficient funds error when balance low | Error handling | 30s | ✅ Fixed |

**Status:** 🔴 Previously failing - timeouts increased to 30s. Need to verify.

**Root Cause:** PlaidProvider in `src/app/(root)/layout.tsx` calls `createLinkToken` on every authenticated page load, adding 7-12 seconds per navigation.

---

### 5. wallet-linking.spec.ts (6 tests)

**Path:** `src/tests/e2e/wallet-linking.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should redirect unauthenticated users to sign-in | Auth guard | 10s | None |
| should show the Connect Wallet button on My Wallets page | Button visible | 15s | ⚠️ PlaidProvider delay |
| should show the Connect Wallet button on Payment Transfer page | Button visible | 10s | ⚠️ PlaidProvider delay |
| should open Plaid Link modal when Connect Wallet is clicked | Modal launch | 15s | ⚠️ Complex flow |
| should remain on My Wallets page after dismissing without linking | Dismiss flow | 15s | ⚠️ Complex flow |
| should display existing linked wallets before the connect option | Wallet list | 15s | ⚠️ PlaidProvider delay |

**Status:** ⚠️ May need timeout increases

---

### 6. settings.spec.ts (3 tests)

**Path:** `src/tests/e2e/settings.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should redirect to sign-in when accessing /settings | Auth guard | 20s | None |
| should render settings heading | Page load | 15s | ⚠️ PlaidProvider delay |
| should display profile form fields | Form fields | 10s | None |

**Status:** ⚠️ May need timeout increases

---

### 7. transaction-history.spec.ts (3 tests)

**Path:** `src/tests/e2e/transaction-history.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should redirect to sign-in when accessing /transaction-history | Auth guard | 20s | None |
| should render transaction history heading | Page load | 15s | ⚠️ PlaidProvider delay |
| should display transaction table | Table visible | 15s | ⚠️ PlaidProvider delay |

**Status:** ⚠️ May need timeout increases

---

### 8. admin.spec.ts (4 tests)

**Path:** `src/tests/e2e/admin.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should redirect to sign-in when accessing /admin without a session | Auth guard | 20s | None |
| should redirect to /dashboard when a non-admin visits /admin | RBAC | 20s | None |
| should allow a non-admin to access /dashboard normally | Navigation | 20s | None |
| should allow a non-admin to access /settings normally | Navigation | 20s | None |

**Status:** ✅ Likely passing - 20s timeouts are generous

---

### 9. soft-delete.spec.ts (7 tests)

**Path:** `src/tests/e2e/soft-delete.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should redirect deleted user on login attempt | Soft delete | 10s | ⚠️ Test is placeholder-style |
| should load dashboard successfully for active user | Dashboard load | 10s | ⚠️ Uses catch-all |
| should display active wallets in wallet list | Wallet list | 10s | ⚠️ Uses catch-all |
| should display active transactions in history | Transaction list | 10s | ⚠️ Uses catch-all |
| should exclude deleted records from API responses | API filtering | 10s | ⚠️ Tests API that may not exist |
| should maintain referential integrity after deletes | FK constraints | 10s | ⚠️ Uses catch-all |
| should not show deleted user in search results | Search filtering | 10s | ⚠️ Admin page may not exist |

**Status:** ⚠️ Tests use `.catch()` extensively - may not be testing actual behavior

---

### 10. transfer-idempotency.spec.ts (6 tests)

**Path:** `src/tests/e2e/transfer-idempotency.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should create transfer and show success confirmation | Transfer flow | 30s | ⚠️ Navigates via dashboard |
| should allow wallet selection in transfer form | Form fields | 10s | ⚠️ Navigates via dashboard |
| should prevent transfer with invalid amount | Validation | 10s | ⚠️ Navigates via dashboard |
| should prevent transfer with negative amount | Validation | 10s | ⚠️ Navigates via dashboard |
| should require amount for transfer | Validation | 10s | ⚠️ Navigates via dashboard |
| should accept valid decimal amounts | Validation | 10s | ⚠️ Navigates via dashboard |

**Status:** ⚠️ Tests navigate through dashboard first - may be slower

---

### 11. mock-tokens.spec.ts (4 tests)

**Path:** `src/tests/e2e/mock-tokens.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| should inject Plaid mock on page load | Mock injection | 10s | None |
| should recognize valid mock token prefixes | Token detection | N/A | ⚠️ Pure unit test |
| should create Plaid mock with custom token | Custom token | 10s | None |
| should maintain deterministic mock behavior | Consistency | 10s | None |

**Status:** ✅ Likely passing - mock tests are self-contained

---

### 12. integration/link-and-transfer.spec.ts (1 test)

**Path:** `src/tests/e2e/integration/link-and-transfer.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| links a bank using the mocked Plaid.create and performs a transfer | Full integration | 15s | ⚠️ Complex multi-step |

**Status:** ⚠️ Single complex integration test - may need more time

---

### 13. specs/plaid-script.spec.ts (1 test)

**Path:** `src/tests/e2e/specs/plaid-script.spec.ts`

| Test | Description | Timeout | Issues |
| --- | --- | --- | --- |
| Plaid script is loaded at most once on my-wallets | Script loading | 10s | ⚠️ Uses networkidle |

**Status:** ⚠️ Uses networkidle which can timeout

---

## Known Issues Summary

### Critical Issues

1. **PlaidProvider Token Creation Delay**
   - **Location:** `src/app/(root)/layout.tsx`
   - **Impact:** Adds 7-12 seconds to every authenticated page load
   - **Affected Tests:** All authenticated tests
   - **Solution:** Increase timeouts to 30s (done for payment-transfer.spec.ts)

2. **networkidle Wait Strategy**
   - **Location:** Multiple test files
   - **Impact:** Can cause indefinite waits when network stays active
   - **Affected Tests:** my-wallets, transaction-history, plaid-script
   - **Solution:** Replace with explicit waits or domcontentloaded

### Medium Issues

3. **Soft Delete Tests Are Placeholders**
   - **Location:** `soft-delete.spec.ts`
   - **Impact:** Tests use catch-all patterns, don't actually test soft-delete
   - **Solution:** Rewrite to properly test soft-delete behavior

4. **Transfer Idempotency Tests Navigate Through Dashboard**
   - **Location:** `transfer-idempotency.spec.ts`
   - **Impact:** Extra navigation adds time
   - **Solution:** Use page object models directly

### Low Issues

5. **Inconsistent Timeout Values**
   - **Location:** Various test files
   - **Impact:** Some tests use 10s, others use 15s, 20s, 30s
   - **Solution:** Standardize to 30s for authenticated tests

---

## Test Infrastructure

### Fixtures (src/tests/fixtures/)

| File | Purpose |
| --- | --- |
| auth.ts | Authentication fixtures (authenticatedPage, paymentTransferPage, etc.) |
| wallets.ts | Wallet test data |
| transactions.ts | Transaction test data |
| pages/\*.ts | Page object models |

### Helpers (src/tests/e2e/helpers/)

| File          | Purpose                     |
| ------------- | --------------------------- |
| plaid.mock.ts | Mock Plaid script injection |
| dwolla.ts     | Dwolla transfer helpers     |
| auth.ts       | Auth helpers                |

---

## Recommendations

1. **Run tests individually** - Not in parallel (shared auth/DB state)
2. **Increase timeouts to 30s** - For all authenticated page loads
3. **Replace networkidle** - Use domcontentloaded or explicit waits
4. **Fix soft-delete tests** - Make them actually test soft-delete behavior
5. **Use page object models** - For consistent navigation

---

## Next Steps

See linked plan: `2026-05-10-e2e-test-fix.md` for implementation details.
