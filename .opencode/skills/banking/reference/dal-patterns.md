# DAL Patterns Reference

## Overview

Data Access Layer (DAL) in `dal/*.dal.ts` provides typed, reusable database queries with N+1 prevention built-in.

## When to Use Each Pattern

| Scenario | Pattern | Example | N+1 Risk |
| --- | --- | --- | --- |
| Single record lookup | Direct query | `findById(id)` | No |
| Multiple records with relations | Batch-fetch | `findByUserIdWithWallets(userId)` | High (prevent with batching) |
| Count/statistics | Aggregation | `countByUserId(userId)` | No |
| Search with JOINs | JOIN query | `findByRecipientName(pattern)` | Depends on implementation |

## Before You Write a DAL Function, Ask Yourself

1. **Will I fetch related data?**
   - If yes → Use batch-fetching pattern to prevent N+1
   - If no → Direct single-query is fine

2. **How many database round-trips will this create?**
   - 1 = optimal
   - 2+ = candidate for optimization
   - If looping and querying for each result = **STOP, this is N+1**

3. **Could this data have been soft-deleted?**
   - If yes → Include `deletedAt IS NULL` filtering in WHERE clause
   - Check existing findByX functions to follow soft-delete pattern

4. **Which DAL pattern applies to this query?**
   - Single record → `findById()` or `findByEmail()`
   - Multiple records with relations → `findByXWithY()` using batch-fetch pattern
   - Aggregation/counts → `countByX()`

## Anti-Patterns: NEVER Do These

**NEVER #1: Loop-and-query (the N+1 problem)**

❌ WRONG:

```typescript
const userIds = [user1, user2, user3];
for (const userId of userIds) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId));
  // This creates 3 queries instead of 1
}
```

✅ RIGHT:

```typescript
const userIds = [user1, user2, user3];
const users = await db
  .select()
  .from(users)
  .where(inArray(users.id, userIds));
// One query, all data
```

**WHY**: Each loop iteration triggers a database round-trip. With 100 users, you get 100+ queries instead of 1.

---

**NEVER #2: Use raw `db` import directly in components or Server Actions**

❌ WRONG:

```typescript
// app/dashboard/page.tsx
import { db } from "@/database/db";

export default async function Dashboard() {
  const transactions = await db.select().from(transactionsTable);
  return <TransactionList txns={transactions} />;
}
```

✅ RIGHT:

```typescript
// app/dashboard/page.tsx
import { transactionDal } from "@/dal";

export default async function Dashboard() {
  const transactions = await transactionDal.findByUserId(userId);
  return <TransactionList txns={transactions} />;
}
```

**WHY**: Direct DB imports break the abstraction layer. N+1 prevention rules live in DAL, not components. When developers skip DAL, they skip these protections.

---

**NEVER #3: Over-fetch all relations upfront**

❌ WRONG:

```typescript
// This loads all wallets, accounts, transactions for every user
async function findByIdWithEverything(id: string) {
  return db
    .select()
    .from(users)
    .leftJoin(wallets, eq(wallets.userId, users.id))
    .leftJoin(accounts, eq(accounts.userId, users.id))
    .leftJoin(transactions, eq(transactions.userId, users.id));
}
```

✅ RIGHT:

```typescript
// Load only what the caller needs
async function findById(id: string) {
  return db.select().from(users).where(eq(users.id, id));
}

async function findByIdWithWallets(id: string) {
  // Separate function if wallets are needed
  return findById(id); // + batch-fetch wallets separately
}
```

**WHY**: Over-fetching causes cartesian products, duplicate rows, and massive result sets. Load only what you need, when you need it.

---

**NEVER #4: Assume relationships always exist**

❌ WRONG:

```typescript
// If a wallet was deleted, senderWallet becomes undefined
const txn = {
  ...t,
  senderWallet: walletsMap.get(t.senderWalletId) // Could be undefined!
};
```

✅ RIGHT:

```typescript
// Use null-coalescing to safely handle missing data
const txn = {
  ...t,
  senderWallet: walletsMap.get(t.senderWalletId) ?? null
};
```

**WHY**: Soft-deleted records leave orphaned references. Without null-coalescing, your code crashes or returns undefined, breaking frontend expectations.

---

**NEVER #5: Forget to check if your batch is empty**

❌ WRONG:

```typescript
const walletIds = new Set<string>();
// ... collect IDs ...
const walletsMap = new Map();
const rows = await db
  .select()
  .from(wallets)
  .where(inArray(wallets.id, Array.from(walletIds)));
// If walletIds is empty, inArray() might error
```

✅ RIGHT:

```typescript
const walletIds = new Set<string>();
// ... collect IDs ...
const walletsMap = new Map();
if (walletIds.size > 0) {
  const rows = await db
    .select()
    .from(wallets)
    .where(inArray(wallets.id, Array.from(walletIds)));
  for (const row of rows) walletsMap.set(row.id, row);
}
```

**WHY**: Empty `inArray()` clauses can cause SQL errors. Guard with a size check first.

---

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

## Soft Delete Pattern

All find methods automatically filter `deletedAt IS NULL`:

```typescript
async findById(id: string) {
  const [user] = await db.select().from(users)
    .where(and(eq(users.id, id), isNull(users.deletedAt)));
  return user;
}
```

## N+1 Prevention Pattern: Batch Fetch Example

This is the canonical pattern. Follow these 4 steps exactly:

```typescript
export async function findByUserIdWithWallets(
  userId: string,
  limit = 50,
  offset = 0
) {
  // Step 1: Fetch base records
  const txns = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .limit(limit)
    .offset(offset);

  // Step 2: Collect unique IDs (Set prevents duplicates)
  const walletIds = new Set<string>();
  for (const t of txns) {
    if (t.senderWalletId) walletIds.add(t.senderWalletId);
    if (t.receiverWalletId) walletIds.add(t.receiverWalletId);
  }

  // Step 3: Batch fetch in single query (guard empty set)
  const walletsMap = new Map<string, Wallet>();
  if (walletIds.size > 0) {
    const rows = await db
      .select()
      .from(wallets)
      .where(inArray(wallets.id, Array.from(walletIds)));
    for (const row of rows) {
      walletsMap.set(row.id, row);
    }
  }

  // Step 4: Map wallets back onto transactions
  return txns.map(txn => ({
    ...txn,
    senderWallet: walletsMap.get(txn.senderWalletId) ?? null,
    receiverWallet: walletsMap.get(txn.receiverWalletId) ?? null
  }));
}
```

### Handling Edge Cases

**Empty result set** — walletIds is empty, so batch-fetch is skipped:

```typescript
if (walletIds.size > 0) {
  // Only query if we have IDs to fetch
  const rows = await db.select().from(wallets)...
}
// walletsMap remains empty Map, all wallet refs become null
```

**Orphaned references** — wallet was soft-deleted after transaction created:

```typescript
// walletsMap.get() returns undefined for deleted wallets
senderWallet: walletsMap.get(txn.senderWalletId) ?? null;
// Safe coalescing to null instead of crashing
```

**Null/missing relationships** — transaction has no sender wallet initially:

```typescript
// The guard `if (t.senderWalletId)` prevents adding null/undefined to Set
if (t.senderWalletId) walletIds.add(t.senderWalletId);
// Skipped for null values, no wasted queries
```

---

## Quick Decision Flow

```
Do I need related data? →
  YES → Can I batch-fetch all related records in one query?
    YES → Use N+1 prevention pattern (4 steps above)
    NO  → Use LEFT JOIN or separate queries with grouping
  NO → Use direct single-query (findById, findByEmail, etc.)
```
