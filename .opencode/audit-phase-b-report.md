# Phase B Audit Report: Banking App Remediation

**Date:** 2026-05-05  
**Auditor:** fullstack-developer  
**Status:** COMPLETE

## Executive Summary

Phase B audits have been completed for the Banking app across four dimensions:

1. **Currency Precision** ✅ PASS - No floating-point operations on amounts
2. **Soft Delete Consistency** ⚠️ REQUIRES FIX - Mixed app-level and DB-level filtering
3. **Mock Token Coverage** ✅ PASS - All actions detect and short-circuit mock tokens
4. **Zod Validation** ✅ PASS - All schemas validate correctly

---

## B.1: Currency Precision Audit ✅ PASS

### Findings

**Amount Field Handling:**

- `lib/schemas/transfer.schema.ts:7-18` — Amount validated as string with `.refine()` ensuring positive number
- `actions/dwolla.actions.ts:377-379` — Amount passed to Dwolla API as string: `amount: { currency: "USD", value: parsed.data.amount }`
- No `parseFloat()`, `.toFixed()`, or floating-point arithmetic detected in amount handling

**Database Schema:**

- `database/schema.ts` — All amount columns use `numeric(12,2)` type (not stored as floats)

**Validation Pattern:**

- Schema validates amount as string, rejects non-numeric values via `.refine()`
- Server Actions preserve amount as string through to API calls
- No cent-based integer conversion needed (Dwolla accepts decimal strings like "25.00")

**Conclusion:** ✅ Currency precision is properly maintained. Amounts never undergo floating-point arithmetic.

---

## B.2: Soft Delete Edge Cases Audit ⚠️ REQUIRES FIX

### Tables with Soft Delete

Only three tables use `deletedAt` column:

1. `users` (line 65 in schema.ts)
2. `wallets` (line 507 in schema.ts)
3. `transactions` (line 605 in schema.ts)

The `recipients` table uses **hard delete** only (no `deletedAt` column).

### Soft Delete Filtering Inconsistency

**INCONSISTENT - Uses App-Level Checks:**

| File | Method | Pattern | Line |
| --- | --- | --- | --- |
| `dal/user.dal.ts` | `findByEmail` | `user?.deletedAt === null ? user : undefined` | 33 |
| `dal/user.dal.ts` | `findById` | `user?.deletedAt === null ? user : undefined` | 50 |
| `dal/user.dal.ts` | `findByIdWithProfile` | `if (result.deletedAt !== null) return undefined` | 97 |
| `dal/wallet.dal.ts` | `findById` | `if (wallet?.deletedAt !== null) return undefined` | 45 |
| `dal/wallet.dal.ts` | `findBySharableId` | `if (wallet?.deletedAt !== null) return undefined` | 86 |

**CONSISTENT - Uses DB-Level Filtering:**

| File | Method | Pattern | Line |
| --- | --- | --- | --- |
| `dal/wallet.dal.ts` | `findByUserId` | `.where(and(..., isNull(wallets.deletedAt)))` | 64 |
| `dal/transaction.dal.ts` | `findById` | `.where(and(..., isNull(transactions.deletedAt)))` | 27 |
| `dal/transaction.dal.ts` | `findByUserIdWithWallets` | `.where(and(..., isNull(transactions.deletedAt)))` | 50 |
| `dal/transaction.dal.ts` | `findByWalletId` | `.where(and(..., isNull(transactions.deletedAt)))` | 71 |
| `dal/transaction.dal.ts` | `findByUserIdStats` | `.where(and(..., isNull(transactions.deletedAt)))` | 136 |

### Issue Analysis

**App-Level Checks (Current):**

```typescript
const [user] = await db.select().from(users).where(eq(users.id, id));
return user?.deletedAt === null ? user : undefined;
```

- Fetches deleted records from DB, filters in application
- Less efficient (unnecessary row transfer)
- Harder to understand filtering intent
- Less consistent across codebase

**DB-Level Filtering (Recommended):**

```typescript
const [user] = await db
  .select()
  .from(users)
  .where(and(eq(users.id, id), isNull(users.deletedAt)));
return user;
```

- Filters at database layer (recommended practice)
- More efficient (no unnecessary rows transferred)
- Clearer intent in SQL
- Already used in transaction.dal.ts and wallet.dal.ts:findByUserId

### Fix Required

Standardize all DAL helpers to use **DB-level `isNull(table.deletedAt)` filtering** in WHERE clauses:

**Files to Update:**

1. `dal/user.dal.ts` — Update findByEmail, findById, findByIdWithProfile
2. `dal/wallet.dal.ts` — Update findById, findBySharableId, findByAccountId

---

## B.3: Mock Token Coverage Audit ✅ PASS

### Mock Token Detection Function

**Location:** `lib/plaid.ts`  
**Function:** `isMockAccessToken(token: string): boolean`  
**Implementation:** Lines ~118-127

```typescript
export function isMockAccessToken(token: string): boolean {
  if (!token) return false;
  const t = token.toLowerCase();
  return (
    t.startsWith("seed-") ||
    t.startsWith("mock-") ||
    t.startsWith("mock_") ||
    t.startsWith("mock")
  );
}
```

### Coverage in Actions

**Plaid Actions (`actions/plaid.actions.ts`):**

- ✅ Line 202: `exchangePublicToken` detects mock public tokens
- ✅ Line 357: `getAccounts` skips API call for mock tokens
- ✅ Line 428: `getTransactions` skips API call for mock tokens
- ✅ Line 496: `updateAccounts` skips API call for mock tokens

**Dwolla Actions (`actions/dwolla.actions.ts`):**

- ✅ Line 282: `createFundingSource` detects mock Plaid processor tokens
- ✅ Line 361-363: `createTransfer` detects mock funding source URLs

### E2E Test Infrastructure

**Plaid Mock Injection:** `tests/e2e/helpers/plaid.mock.ts`

- `addMockPlaidInitScript()` injects Plaid Link mock into browser
- Used in `tests/e2e/wallet-linking.spec.ts` and related specs

**Seed User:** `seed-user@example.com` / `password123`

### Conclusion

✅ All actions properly detect and short-circuit mock tokens. E2E infrastructure supports mock Plaid Link injection.

---

## B.4: Zod Validation Completeness Audit ✅ PASS

### Auth Schemas

**Location:** `lib/schemas/auth.schema.ts`

**signInSchema:**

- ✅ Email validated with `.email()`
- ✅ Password requires min 8 characters
- ✅ Clear error messages

**signUpSchema:**

- ✅ Email validated with `.email()`
- ✅ First/Last name require min 2 characters
- ✅ Password requires min 8 characters
- ✅ Optional address fields present
- ✅ Password confirmation refine check

### Transfer Schemas

**Location:** `lib/schemas/transfer.schema.ts`

**TransferSchema:**

- ✅ Amount validated as string, not float
- ✅ Amount requires `.refine()` to ensure positive number
- ✅ Funding source URLs validated with `.url()`
- ✅ Currency defaults to "USD"
- ✅ Optional ledger creation with nested validation

### Admin Schemas

**Location:** `lib/validations/admin.ts`

**GetUsersSchema:**

- ✅ Page number validated with min 1
- ✅ Page size validated with min 1, max 100
- ✅ Search term optional with trim

**GetRecentTransactionsSchema:**

- ✅ Limit validated with min 1, max 100

### Conclusion

✅ All Zod schemas properly validate required fields and types. No missing validations detected.

---

## Summary by Category

| Category | Status | Action Required |
| --- | --- | --- |
| Currency Precision | ✅ PASS | None |
| Soft Delete Consistency | ⚠️ PARTIALLY PASS | Standardize to DB-level filtering |
| Mock Token Coverage | ✅ PASS | None |
| Zod Validation | ✅ PASS | None |

---

## Recommended Phase B Fixes

### B.2 Fix: Soft Delete Standardization

**Files to Update:**

1. `dal/user.dal.ts` — Lines 33, 50, 97
2. `dal/wallet.dal.ts` — Lines 45, 86, 99

**Pattern to Apply:**

```typescript
// Before (app-level)
const [user] = await db.select().from(users).where(eq(users.id, id));
return user?.deletedAt === null ? user : undefined;

// After (DB-level)
const [user] = await db
  .select()
  .from(users)
  .where(and(eq(users.id, id), isNull(users.deletedAt)));
return user;
```

**Import Statement Required:**

```typescript
import { and, eq, isNull } from "drizzle-orm";
```

---

## Phase B Deliverables

✅ B.1 Currency Precision Audit — COMPLETE  
✅ B.2 Soft Delete Edge Cases Audit — COMPLETE (with fix list)  
✅ B.3 Mock Token Coverage Audit — COMPLETE  
✅ B.4 Zod Validation Completeness Audit — COMPLETE

**Next Steps:** Proceed to Phase C Testing after implementing B.2 soft delete fixes.
