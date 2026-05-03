# DAL Patterns Reference

## Overview

Data Access Layer (DAL) in `dal/*.dal.ts` provides typed, reusable database queries with N+1 prevention built-in.

## DAL Files

### user.dal.ts

- `findByEmail(email)` — Find user by email, excludes soft-deleted
- `findById(id)` — Find user by ID, excludes soft-deleted
- `findByIdWithProfile(id)` — JOIN query, returns UserWithProfile
- `create(data)` — Insert new user
- `update(id, data)` — Partial update user
- `createWithProfile(data)` — Transactional user + profile creation
- `updateProfile(userId, data)` — Upsert profile
- `toggleAdmin(id)` — Flip isAdmin flag
- `toggleActive(id)` — Flip isActive flag
- `softDelete(id)` — Set deletedAt timestamp
- `hardDelete(id)` — Permanent delete

### wallet.dal.ts

- `findByUserId(userId)` — Get user's wallets
- `findById(id)` — Get wallet by ID
- `create(data)` — Create new wallet
- `update(id, data)` — Update wallet
- `delete(id)` — Soft delete wallet

### transaction.dal.ts

- `findByUserIdWithWallets(userId, limit, offset)` — N+1 prevention pattern
- `findById(id)` — Get transaction by ID
- `findByWalletId(walletId)` — Transactions for wallet
- `create(data)` — Create transaction
- `updateStatus(id, status)` — Update transaction status

### recipient.dal.ts

- `findByUserId(userId)` — User's transfer recipients
- `findById(id)` — Get recipient by ID
- `create(data)` — Add recipient
- `update(id, data)` — Update recipient
- `delete(id)` — Remove recipient

### dwolla.dal.ts

- `createFundingSource(data)` — Create Dwolla funding source
- `getFundingSource(id)` — Get funding source details
- `initiateTransfer(data)` — Start ACH transfer
- `getTransfer(id)` — Get transfer status

## Return Types

All DAL methods return typed objects, not raw DB results:

```typescript
// Returns { ok: boolean; user?: User; error?: string }
const result = await userDal.findById(id);
if (!result.ok) {
  return { error: result.error, ok: false };
}
```

## Transaction Support

Use `db.transaction()` for atomic operations:

```typescript
await db.transaction(async (tx) => {
  const [user] = await tx.insert(users).values({...}).returning();
  await tx.insert(user_profiles).values({ userId: user.id, ... });
});
```

## Soft Delete

All find methods automatically filter `deletedAt IS NULL`:

```typescript
// This automatically excludes soft-deleted records
async findById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user?.deletedAt === null ? user : undefined;
}
```

## N+1 Prevention in TransactionDal

```typescript
export async function findByUserIdWithWallets(
  userId,
  limit = 50,
  offset = 0
) {
  // Step 1: Fetch transactions
  const txns = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .limit(limit)
    .offset(offset);

  // Step 2: Collect unique IDs
  const walletIds = new Set<string>();
  for (const t of txns) {
    if (t.senderWalletId) walletIds.add(t.senderWalletId);
    if (t.receiverWalletId) walletIds.add(t.receiverWalletId);
  }

  // Step 3: Batch fetch in single query
  const walletsMap = new Map();
  if (walletIds.size > 0) {
    const rows = await db
      .select()
      .from(wallets)
      .where(inArray(wallets.id, Array.from(walletIds)));
    for (const row of rows) walletsMap.set(row.id, row);
  }

  // Step 4: Map back
  return txns.map(t => ({
    ...t,
    senderWallet: walletsMap.get(t.senderWalletId) ?? null,
    receiverWallet: walletsMap.get(t.receiverWalletId) ?? null
  }));
}
```
