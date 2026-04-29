---
name: dal-skill
description: Drizzle ORM and Data Access Layer patterns for efficient, type-safe database access.
lastReviewed: 2026-04-29
applyTo: "dal/**"
---

# DAL Skill — Data Access Layer Patterns

## Overview

The DAL (Data Access Layer) is the mandatory pattern for all database operations in the Banking app. All DB access must flow through `dal/` classes or helpers to ensure type safety, N+1 prevention, and consistent error handling.

**This skill applies to:** Any read or write to the database from Server Actions, pages, or components.

## Multi-Agent Support

### OpenCode
```bash
# Query patterns
dal/user.dal.ts findByEmail findById create update delete
dal/transaction.dal.ts findByUserIdWithWallets findById create

# N+1 prevention - use eager loading
dal/wallet.dal.ts findByUserIdWithTransactions
```

### Cursor
```typescript
// Import pattern
import { userDal } from "@/dal";
import { transactionDal } from "@/dal";

// Use class methods
const user = await userDal.findByEmail("user@example.com");
const transactions = await transactionDal.findByUserIdWithWallets(userId);
```

### GitHub Copilot
```typescript
// Tab completion for DAL methods
userDal.findById(id)    // autocomplete shows available methods
transactionDal.create(data)  // type-safe inserts
```

## Core Principles

### 1. Never Query Directly from Actions/Pages

**INCORRECT:**
```typescript
// actions/transfer.ts - DON'T DO THIS
import { db } from "@/database/db";
import { wallets } from "@/database/schema";

const wallet = await db.select().from(wallets).where(eq(wallets.id, id));
```

**CORRECT:**
```typescript
// actions/transfer.ts - DO THIS
import { walletDal } from "@/dal";

const wallet = await walletDal.findById(id);
```

### 2. Prevent N+1 Queries (CRITICAL)

**INCORRECT — N+1 Pattern:**
```typescript
// BAD: Causes N+1 queries
const wallets = await walletDal.findByUserId(userId);
for (const wallet of wallets) {
  const txns = await db.select()
    .from(transactions)
    .where(eq(transactions.senderWalletId, wallet.id));
}
```

**CORRECT — Eager Loading:**
```typescript
// GOOD: Single query with JOIN
const wallets = await walletDal.findByUserIdWithTransactions(userId);
// Result: wallets[].transactions[] already loaded
```

### 3. Use Transactions for Multi-Step Operations

```typescript
import { db } from "@/database/db";
import { walletDal } from "@/dal";
import { transactionDal } from "@/dal";

await db.transaction(async (tx) => {
  await walletDal.updateBalance(walletId, amount, tx);
  await transactionDal.create({
    senderWalletId: walletId,
    amount,
    type: "transfer"
  }, tx);
});
```

### 4. Type-Safe Returns

```typescript
// Always use inferred types from schema
type User = typeof users.$inferSelect;
type NewUser = typeof users.$inferInsert;

// DAL returns fully typed objects
const user = await userDal.findById(id);
// user: User | undefined
```

## DAL File Structure

### Class-Based Pattern (Recommended)

```typescript
// dal/user.dal.ts
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users, type User } from "@/database/schema";

export class UserDal {
  async findById(id: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user;
  }

  async create(data: Omit<typeof users.$inferInsert, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(data)
      .returning();
    return user;
  }

  async update(id: string, data: Partial<typeof users.$inferInsert>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const result = await db
      .delete(users)
      .where(eq(users.id, id));
    return result.rowCount > 0;
  }
}

export const userDal = new UserDal();
```

### Functional Pattern (Alternative)

```typescript
// dal/transaction.dal.ts
import { db } from "@/database/db";
import { transactions, wallets } from "@/database/schema";
import { eq, desc } from "drizzle-orm";

export const transactionDal = {
  async findById(id: string) {
    return db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
  },

  async findByUserIdWithWallets(userId: string) {
    // Eager load wallets to prevent N+1
    const userWallets = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));

    if (userWallets.length === 0) return [];

    const walletIds = userWallets.map(w => w.id);
    const txns = await db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.senderWalletId, walletIds[0]),
          eq(transactions.recipientWalletId, walletIds[0])
        )
      )
      .orderBy(desc(transactions.createdAt));

    // Map wallets back to transactions
    return userWallets.map(wallet => ({
      wallet,
      transactions: txns.filter(t =>
        t.senderWalletId === wallet.id || t.recipientWalletId === wallet.id
      )
    }));
  }
};
```

## N+1 Prevention Techniques

### 1. Batch Queries with IN Clause

```typescript
async getUsersWithProfiles(userIds: string[]) {
  const users = await db.select().from(users).where(inArray(users.id, userIds));
  const profiles = await db.select().from(userProfiles).where(inArray(userProfiles.userId, userIds));

  const profileMap = new Map(profiles.map(p => [p.userId, p]));
  return users.map(user => ({
    ...user,
    profile: profileMap.get(user.id)
  }));
}
```

### 2. Eager Loading with JOINs

```typescript
async findWalletsWithBalances(userId: string) {
  return db
    .select({
      wallet: wallets,
      balance: sql<number>`coalesce(${transactions.amount}, 0)`
    })
    .from(wallets)
    .leftJoin(transactions, eq(wallets.id, transactions.senderWalletId))
    .where(eq(wallets.userId, userId))
    .groupBy(wallets.id);
}
```

### 3. Aggregation Queries

```typescript
async getUserTransactionStats(userId: string) {
  const wallets = await db.select().from(wallets).where(eq(wallets.userId, userId));
  const walletIds = wallets.map(w => w.id);

  const stats = await db
    .select({
      totalSent: sql<number>`sum(${transactions.amount})`,
      totalReceived: sql<number>`sum(${transactions.amount})`,
      count: sql<number>`count(*)`
    })
    .from(transactions)
    .where(
      or(
        inArray(transactions.senderWalletId, walletIds),
        inArray(transactions.recipientWalletId, walletIds)
      )
    );

  return stats[0];
}
```

## Transaction Support

### Optional Transaction Parameter Pattern

```typescript
// Allow callers to pass optional transaction
export class WalletDal {
  async findById(id: string, tx?: typeof db) {
    const dbToUse = tx || db;
    const [wallet] = await dbToUse
      .select()
      .from(wallets)
      .where(eq(wallets.id, id))
      .limit(1);
    return wallet;
  }

  async updateBalance(id: string, amount: number, tx?: typeof db) {
    const dbToUse = tx || db;
    const [wallet] = await dbToUse
      .update(wallets)
      .set({ balance: amount })
      .where(eq(wallets.id, id))
      .returning();
    return wallet;
  }
}

// Usage without transaction
await walletDal.updateBalance(walletId, 100);

// Usage with transaction
await db.transaction(async (tx) => {
  await walletDal.updateBalance(walletId, 100, tx);
  await transactionDal.create({ ... }, tx);
});
```

## DAL Surface Guidelines

Export a minimal, focused API:

| Method | Purpose |
| --- | --- |
| `findById(id)` | Get single record by ID |
| `findByEmail(email)` | Get by unique email/identifier |
| `findByUserId(userId)` | Get all records for a user |
| `findByUserIdWithRelations(userId)` | Eager load related data |
| `create(data)` | Insert new record |
| `update(id, data)` | Update existing record |
| `delete(id)` | Soft or hard delete |

## Validation

```bash
# Type checking
bun run type-check

# Lint strict
bun run lint:strict

# Verify no N+1 patterns
grep -r "for.*of.*await" dal/ || echo "No N+1 patterns found"
```

## Common Issues

### 1. Circular Imports
```typescript
// Use @/database/db and @/database/schema imports
import { db } from "@/database/db";  // CORRECT
import { db } from "../../database/db";  // AVOID
```

### 2. Missing Transaction Parameter
```typescript
// Always add optional tx parameter for composable DAL
async updateBalance(id: string, amount: number, tx?: typeof db) {
  const dbToUse = tx || db;
  // ... implementation
}
```

### 3. Forgetting to Return
```typescript
// Always return the result
async create(data) {
  const [user] = await db.insert(users).values(data).returning();  // CORRECT
  await db.insert(users).values(data);  // WRONG - no return
}
```

### 4. Type Inference Issues
```typescript
// Use $inferSelect for return types
type User = typeof users.$inferSelect;
// NOT: type User = { id: string; email: string; ... }
```

## Cross-References

- **db-skill** — Schema and migration patterns
- **server-action-skill** — Using DAL in Server Actions
- **testing-skill** — Mocking DAL in tests

## Multi-Agent Examples

### OpenCode: Query Execution
```bash
# Run DAL method
bunx tsx -e "import { userDal } from './dal/user.dal'; console.log(await userDal.findByEmail('test@example.com'))"
```

### Cursor: Inline Help
```typescript
// Type comment for suggestions
// TODO: Implement findByIdWithProfile method
const user = await userDal. // autocomplete suggests methods
```

### Copilot: Code Generation
```typescript
// Write comment, Copilot suggests implementation
// Create a DAL method to find user with wallet and transactions
```