# Spec: e2e-test-catalog

Scope: repo

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

## Known Issues

### Critical

1. **PlaidProvider Token Creation Delay** - Adds 7-12s to every authenticated page load
2. **networkidle Wait Strategy** - Causes indefinite waits in multiple tests

### Medium

3. **Soft Delete Tests Are Placeholders** - Don't actually test soft-delete behavior
4. **Transfer Idempotency Tests Navigate Through Dashboard** - Extra overhead

### Low

5. **Inconsistent Timeout Values** - Varies from 10s to 30s across tests

---

## Recommendations

1. Run tests individually (not in parallel) due to shared auth/DB state
2. Increase timeouts to 30s for all authenticated tests
3. Replace networkidle with domcontentloaded or explicit waits
4. Fix soft-delete tests to actually test soft-delete behavior
5. Use page object models for consistent navigation
