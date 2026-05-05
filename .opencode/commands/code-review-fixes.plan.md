# Plan: Code Review Fixes - Financial Safety & Pattern Compliance

**Plan Name:** code-review-fixes **Description:** Implement critical and high-priority fixes from comprehensive code review **Status:** In Progress **Last Updated:** 2026-05-05

---

## Overview

This plan addresses **2 CRITICAL** issues identified during code review:

1. **Non-deterministic Idempotency Key Generation** (actions/dwolla.actions.ts:341)
   - Current: Uses `crypto.randomUUID()` → generates different key on each call
   - Risk: Enables duplicate Dwolla transfers on retries → financial data corruption
   - Fix: Generate deterministic key from request hash (sender + receiver + amount)

2. **Missing Currency Precision Validation** (lib/schemas/transfer.schema.ts)
   - Current: Accepts any positive number, including "25.123", "25.1", etc.
   - Risk: Floating-point math errors compound across millions of transactions → fund loss
   - Fix: Enforce exactly 2-decimal places with regex validation

Both issues are **security-critical** for financial applications and must be fixed before production use.

---

## Files Changed

1. `actions/dwolla.actions.ts` — Fix idempotency key generation
2. `lib/schemas/transfer.schema.ts` — Add decimal precision validation
3. `lib/validation-utils.ts` — Utility function for idempotency key generation (new)
4. `tests/unit/actions/dwolla.test.ts` — Add idempotency tests (pending)
5. `tests/unit/validations/transfer.test.ts` — Add precision tests (pending)

---

## Implementation Status

✅ **COMPLETED:**

- [x] Phase 1.1: Create Idempotency Key Utility Function (lib/validation-utils.ts)
- [x] Phase 1.2: Fix Idempotency Key Generation in createTransfer()
- [x] Phase 1.3: Add Currency Precision Validation
- [x] Phase 1.4: Update Imports in dwolla.actions.ts
- [x] Type-check passes
- [x] Plan document created

⏳ **IN PROGRESS:**

- [ ] Phase 2: Unit tests for idempotency and currency validation
- [ ] Phase 3: Verification and validation

---

## Key Changes Summary

### Change 1: Deterministic Idempotency Key (actions/dwolla.actions.ts:340-347)

**Before:**

```typescript
const idempotencyKey = crypto.randomUUID();
```

**After:**

```typescript
import { generateIdempotencyKey } from "@/lib/validation-utils";

const idempotencyKey = generateIdempotencyKey(
  parsed.data.sourceFundingSourceUrl,
  parsed.data.destinationFundingSourceUrl,
  parsed.data.amount
);
```

**Why:** Deterministic keys ensure retries use the same key, preventing duplicates.

### Change 2: Currency Precision Validation (lib/schemas/transfer.schema.ts:7-27)

**Before:**

```typescript
.refine(
  (val) =>
    !Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
  {
    error: "Amount must be a positive number",
  },
)
```

**After:**

```typescript
.refine(
  (val) => {
    if (!/^\d+\.\d{2}$/.test(val)) {
      return false;
    }
    const parsed = Number.parseFloat(val);
    return !Number.isNaN(parsed) && parsed > 0;
  },
  {
    error: "Amount must be a positive number with exactly 2 decimal places (e.g., '25.00')",
  },
)
```

**Why:** Enforces 2-decimal precision to prevent floating-point rounding errors in financial calculations.

### Change 3: New Utility Function (lib/validation-utils.ts)

```typescript
export function generateIdempotencyKey(
  senderUrl: string,
  receiverUrl: string,
  amount: string
): string {
  const combined = `${senderUrl}|${receiverUrl}|${amount}`;
  return createHash("sha256").update(combined).digest("hex");
}
```

**Why:** Centralizes deterministic key generation for easy testing and reuse.

---

## Success Criteria

- ✅ Type-check passes
- ⏳ Lint-strict passes (in progress - existing pre-existing violations)
- ⏳ verify:rules passes
- ⏳ Unit tests pass
- ⏳ E2E tests pass

---

## References

- Idempotency Pattern: `.opencode/skills/banking/reference/idempotency-key-pattern.md`
- Transfer Schema: `lib/schemas/transfer.schema.ts`
- Dwolla Actions: `actions/dwolla.actions.ts`
