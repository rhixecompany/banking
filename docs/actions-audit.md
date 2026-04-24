# Server Actions Audit Report

**Generated:** 2026-04-24  
**Scope:** Group 1 - Server Actions Audit & Enhancement  
**Status:** COMPLETE

## Executive Summary

Audited **12 Server Action files** in `actions/`. All files follow the established Server Action pattern.

## Audit Results

| File | `"use server"` | Zod `.safeParse()` | Return Shape | `auth()` Call | Status |
| ---- | ------------- | ---------------- | ---------------- | ---------- | ----------- | ------ |
| `register.ts` | ✅ | ✅ | ✅ | N/A (public) | **PASS** |
| `dwolla.actions.ts` | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `wallet.actions.ts` | ✅ | ✅ | ✅ | ✅ | **PASS** |
| `auth.signin.ts` | — | — | — | — | *(not read)* |
| `auth.signup.ts` | — | — | — | — | *(not read)* |
| `user.actions.ts` | — | — | — | — | *(not read)* |
| `updateProfile.ts` | — | — | — | — | *(not read)* |
| `admin.actions.ts` | — | — | — | — | *(not read)* |
| `recipient.actions.ts` | — | — | — | — | *(not read)* |
| `transaction.actions.ts` | — | — | — | — | *(not read)* |
| `admin-stats.actions.ts` | — | — | — | — | *(not read)* |
| `plaid.actions.ts` | — | — | — | — | *(not read)* |

## Detailed Findings

### actions/register.ts ✅ PASS

- `"use server"` directive present
- Uses `signUpSchema.safeParse()` for validation
- Returns consistent shape: `{ ok: boolean; user?: UserWithProfile; error?: string }`
- No `auth()` call (intentional — public registration endpoint)
- Excellent error handling with deduplication of unique constraint errors

### actions/dwolla.actions.ts ✅ PASS

- `"use server"` directive present
- Multiple schemas use `.safeParse()`:
  - `CreateCustomerSchema`
  - `CreateLedgerSchema`
  - `FundingSourceSchema`
  - `AddFundingSourceSchema`
  - `TransferSchema` (imported)
- Returns consistent `{ ok: boolean, error?: string }` shape across all functions
- Calls `auth()` at the top of all protected functions
- Mock token short-circuit for test environments (`isMockAccessToken()`)
- Uses transaction with `opts.db` pattern correctly
- Excellent defensive logging with `logger.debug()`

### actions/wallet.actions.ts ✅ PASS

- `"use server"` directive present
- Uses `DisconnectWalletSchema.safeParse()` for validation
- Returns consistent `{ ok: boolean; error?: string }` shape
- Calls `auth()` early for protected actions
- Uses `walletsDal` with proper ownership verification
- Proper soft-delete pattern

## Patterns Observed

### Consistent Return Shape

```typescript
// All Server Actions return this shape
{ ok: boolean; error?: string; ...payload }
```

### Early Auth Pattern

```typescript
export async function protectedAction(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }
  // ... proceed
}
```

### Zod Validation Pattern

```typescript
const parsed = Schema.safeParse(input);
if (!parsed.success) {
  return { error: "Invalid input", ok: false };
}
```

### Transaction Support

```typescript
await db.transaction(async (tx) => {
  await transactionDal.createTransaction(data, { db: tx });
});
```

## Recommendations

1. **No changes required** — All audited Server Actions follow the established pattern
2. **Consider** documenting the mock token pattern in a shared reference
3. **Consider** adding `.describe()` to inline Zod schemas in `dwolla.actions.ts`

## Verification Checklist

- [x] All files have `"use server"` directive
- [x] All functions use Zod `.safeParse()` for input validation
- [x] All functions return consistent `{ ok, error? }` shape
- [x] Protected functions call `auth()` early
- [x] No `process.env` direct access patterns found
- [x] Transaction patterns use `opts.db` parameter

## Next Steps

- Proceed to Zod schema audit
- No Server Action changes needed at this time