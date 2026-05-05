# Idempotency Key Pattern

## Overview

Idempotency ensures that Dwolla transfer requests can be safely retried without creating duplicate transfers. This is critical for handling network failures and timeouts in financial transactions.

## Implementation

### Database Schema

The `dwolla_transfers` table includes a unique idempotency key column:

```typescript
// database/schema.ts (lines 696-698)
idempotencyKey: varchar("idempotency_key", { length: 255 })
  .notNull()
  .unique(),
```

The `unique()` constraint at the database level prevents duplicate transfers even if the application layer fails.

### Server Action Pattern

All Dwolla transfer actions must:

1. **Generate a unique idempotency key** (UUID) for each transfer request
2. **Pass the key to Dwolla** in the API call
3. **Store the key in the database** before making the API call
4. **Catch unique constraint violations** and return the existing transfer instead of failing

**Example:**

```typescript
// actions/dwolla.actions.ts
"use server";

import { v4 as uuidv4 } from "uuid";
import { dwollaTransferDal } from "@/dal";

export async function initiateTransfer(input: unknown) {
  const parsed = TransferSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message };
  }

  // 1. Generate unique idempotency key
  const idempotencyKey = uuidv4();

  // 2. Insert transfer record with idempotency key
  const transferred = await dwollaTransferDal.create({
    ...parsed.data,
    idempotencyKey
  });

  if (!transferred.ok) {
    return { ok: false, error: transferred.error };
  }

  // 3. Call Dwolla API with idempotency key
  const dwollaResult = await dwolla.transfers.create({
    _links: {
      source: { href: parsed.data.sourceFundingSourceUrl },
      destination: { href: parsed.data.destinationFundingSourceUrl }
    },
    amount: {
      currency: parsed.data.currency || "USD",
      value: parsed.data.amount
    },
    idempotencyKey // <-- Pass to Dwolla
  });

  if (!dwollaResult.ok) {
    return { ok: false, error: dwollaResult.error };
  }

  return { ok: true, transfer: transferred.transfer };
}
```

## Retry Scenarios

### Scenario 1: Network Timeout (No Response)

**Step-by-step:**

1. Client calls `initiateTransfer()`
2. Server creates `dwolla_transfers` record with idempotencyKey = "abc123"
3. Server calls Dwolla API with idempotencyKey = "abc123"
4. Network timeout; server never receives Dwolla response
5. Client sees error; user retries the same transfer

**Result with Idempotency:**

- Second request generates new idempotencyKey = "def456" (different)
- Two separate transfer records created (correct behavior: user initiated twice)

**Result without Idempotency:**

- Second request has no idempotencyKey
- Dwolla processes as new transfer
- Duplicate transfer created (bad)

### Scenario 2: Duplicate Request (Same Button Click)

**Step-by-step:**

1. Client calls `initiateTransfer()` with idempotencyKey = "abc123"
2. Server creates `dwolla_transfers` record
3. Dwolla API call succeeds
4. Response is lost; client retries with same idempotencyKey = "abc123"

**Result:**

- Database unique constraint on `idempotencyKey` blocks insertion
- Application catches error, returns existing transfer
- No duplicate created

## Testing

See `tests/e2e/transfer-idempotency.spec.ts` for comprehensive E2E tests:

- **Test 1:** Duplicate transfer with same idempotency key is rejected
- **Test 2:** Different idempotency keys allow separate transfers
- **Test 3:** Transaction ledger remains consistent after idempotent retry

## References

- **Database schema:** `database/schema.ts` (lines 682–722)
- **DAL pattern:** `dal/dwolla-transfer.dal.ts` (if exists)
- **Server action:** `actions/dwolla.actions.ts`
- **E2E tests:** `tests/e2e/transfer-idempotency.spec.ts`

## Key Rules

1. **Never reuse idempotency keys** across different transfer requests
2. **Always generate a new UUID** for each new transfer
3. **Store the key before calling Dwolla** (to catch retries)
4. **Let the database unique constraint handle duplicates** (don't check in app logic)
5. **Return the existing transfer if unique constraint fails** (idempotent behavior)

---

**Last Updated:** May 5, 2026  
**Phase:** Phase C (Testing)
