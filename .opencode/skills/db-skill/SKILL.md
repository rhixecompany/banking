---
name: db-skill
description: Drizzle ORM patterns - schema, migrations, queries, and N+1 prevention for the Banking app.
lastReviewed: 2026-04-29
applyTo: "database/**"
platforms:
  - opencode
  - cursor
  - copilot
---

# DBSkill - Banking Database Patterns

## Agent Support

| Agent | Integration | Usage |
|-------|-------------|-------|
| **OpenCode** | Direct skill invocation | `skill("db-skill")` for schema and migrations |
| **Cursor** | `.cursorrules` reference | Add to project rules for Drizzle patterns |
| **Copilot** | `.github/copilot-instructions.md` | Reference for database operations |

### OpenCode Usage
```
# When working with database schema
Use db-skill for Drizzle ORM patterns.

# When running migrations
Load db-skill for migration commands.
```

### Cursor Integration
```json
// .cursorrules - Add database patterns
{
  "database": {
    "orm": "drizzle",
    "requireMigrations": true,
    "n1Prevention": true
  }
}
```

### Copilot Integration
```markdown
<!-- .github/copilot-instructions.md -->
## Database Patterns

Drizzle ORM for the Banking app:
- Schema: 10 tables + enums in database/schema.ts
- Migrations: bun run db:generate, db:push
- N+1 prevention: Use eager loading with JOINs
- Transactions: Use db.transaction() for atomic ops

See skills/db-skill for full patterns.
```

---

## Overview

This skill provides comprehensive guidance on Drizzle ORM patterns for the Banking project. It covers schema definitions, migrations, data access patterns, N+1 prevention, and transaction management.

## Multi-Agent Commands

### OpenCode
```bash
# Generate migration
bun run db:generate

# Push schema
bun run db:push

# Open Drizzle Studio
bun run db:studio

# Seed database
bun run db:seed

# Reset database
bun run db:reset
```

### Cursor
```
@db-skill
```

### Copilot
```
/db schema migration dal
```

## Database Schema

File: `database/schema.ts` — 10 tables + enums:

| Table | Purpose |
| --- | --- |
| `users` | Core auth (id, email, password, isAdmin, isActive, role enum) |
| `account` | NextAuth OAuth/credentials link records |
| `session` | NextAuth session storage (not used with JWT strategy) |
| `verificationToken` | NextAuth email verification tokens |
| `authenticator` | NextAuth WebAuthn/FIDO2 credentials |
| `user_profiles` | Extended user info (address, phone, SSN encrypted, DOB) |
| `wallets` | Linked Plaid bank accounts (NOT `banks` — table was renamed) |
| `transactions` | Financial transactions (Plaid + Dwolla, numeric(12,2)) |
| `recipients` | Saved transfer recipients |
| `errors` | Application error logging |

### Users Table (actual schema)

```typescript
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  password: varchar("password", { length: 255 }),
  image: varchar("image", { length: 255 }),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  isAdmin: boolean("is_admin").default(false),
  isActive: boolean("is_active").default(true),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at", { mode: "date" })
});
```

### Wallets Table (actual schema — renamed from `banks`)

```typescript
export const wallets = pgTable("wallets", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token").notNull(), // encrypted
  accountId: varchar("account_id", { length: 255 }),
  institutionId: varchar("institution_id", { length: 255 }),
  institutionName: varchar("institution_name", { length: 255 }),
  fundingSourceUrl: text("funding_source_url"),
  sharableId: varchar("sharable_id", { length: 255 })
    .notNull()
    .unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at", { mode: "date" })
});
```

### Transactions Table

```typescript
export const transactions = pgTable("transactions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  senderWalletId: text("sender_wallet_id")
    .notNull()
    .references(() => wallets.id, { onDelete: "cascade" }),
  recipientWalletId: text("recipient_wallet_id")
    .references(() => wallets.id, { onDelete: "set null" }),
  recipientEmail: varchar("recipient_email", { length: 255 }),
  amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
  type: transactionType("type").notNull(),
  status: transactionStatus("status").default("pending").notNull(),
  description: text("description"),
  plaidTransactionId: varchar("plaid_transaction_id", { length: 255 }),
  dwollaTransferId: varchar("dwolla_transfer_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
  deletedAt: timestamp("deleted_at", { mode: "date" })
});
```

## Data Access Layer (DAL)

All DB access goes through `dal/`. Never query from Server Actions or components directly.

```typescript
// dal/user.dal.ts
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users } from "@/database/schema";

export class UserDal {
  async findByEmail(email: string) {
    return db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }

  async findById(id: string) {
    return db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
  }

  async create(
    data: Omit<
      typeof users.$inferInsert,
      "id" | "createdAt" | "updatedAt"
    >
  ) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async update(id: string, data: Partial<typeof users.$inferInsert>) {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async delete(id: string) {
    await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, id));
  }
}

export const userDal = new UserDal();
```

## N+1 Prevention (CRITICAL)

**BAD** — Causes N+1 queries:

```typescript
// DON'T DO THIS
const wallets = await db.select().from(wallets);
for (const wallet of wallets) {
  const txns = await db
    .select()
    .from(transactions)
    .where(eq(transactions.senderWalletId, wallet.id));
}
```

**GOOD** — Single JOIN query:

```typescript
// DO THIS INSTEAD
const walletsWithTxns = await db
  .select({
    wallet: wallets,
    transaction: transactions
  })
  .from(wallets)
  .leftJoin(
    transactions,
    eq(wallets.id, transactions.senderWalletId)
  );
```

### Eager Loading Pattern

```typescript
// dal/transaction.dal.ts - Reference implementation
async findByUserIdWithWallets(userId: string) {
  // Step 1: Fetch base transactions
  const txns = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, userId))
    .orderBy(desc(transactions.createdAt));

  if (txns.length === 0) return txns;

  // Step 2: Collect unique wallet IDs
  const walletIds = [
    ...new Set(txns.flatMap(t => [t.senderWalletId, t.recipientWalletId].filter(Boolean)))
  ];

  // Step 3: Batch fetch wallets
  const wallets = await db
    .select()
    .from(wallets)
    .where(inArray(wallets.id, walletIds));

  // Step 4: Map wallets back to transactions
  const walletMap = new Map(wallets.map(w => [w.id, w]));
  return txns.map(txn => ({
    ...txn,
    senderWallet: walletMap.get(txn.senderWalletId),
    recipientWallet: txn.recipientWalletId ? walletMap.get(txn.recipientWalletId) : null,
  }));
}
```

## Transactions

```typescript
import { db } from "@/database/db";
import { wallets, transactions } from "@/database/schema";

await db.transaction(async tx => {
  // Create wallet
  const [wallet] = await tx
    .insert(wallets)
    .values({
      userId: userId,
      accessToken: encryptedToken,
      accountId: accountId,
      institutionId: institutionId,
      institutionName: institutionName,
      sharableId: generateSharableId(),
    })
    .returning();

  // Create initial balance transaction
  await tx
    .insert(transactions)
    .values({
      userId: userId,
      senderWalletId: wallet.id,
      amount: "0.00",
      type: "deposit",
      status: "completed",
      description: "Account linked",
    });

  return wallet;
});
```

## Migrations

```bash
bun run db:generate   # Generate migration
bun run db:push       # Push schema to database
bun run db:studio     # Drizzle Studio (localhost:8000)
bun run db:seed       # Seed database (PLAID_TOKEN_MODE=sandbox)
bun run db:reset      # Full reset: db:drop + db:generate + db:push
```

Drizzle migrations read `.env.local` first, then `.env` via `dotenv` in `drizzle.config.ts`.

## Advanced Patterns

### Soft Deletes

```typescript
// Always filter out deleted records
import { isNull } from "drizzle-orm";

async function findActiveWallets(userId: string) {
  return db
    .select()
    .from(wallets)
    .where(and(
      eq(wallets.userId, userId),
      isNull(wallets.deletedAt)
    ));
}
```

### Pagination

```typescript
async function paginateTransactions(
  userId: string,
  page: number = 1,
  limit: number = 20
) {
  const offset = (page - 1) * limit;

  const [data, total] = await Promise.all([
    db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(transactions.createdAt)),
    db
      .select({ count: count() })
      .from(transactions)
      .where(eq(transactions.userId, userId)),
  ]);

  return {
    data,
    total: total[0].count,
    page,
    totalPages: Math.ceil(total[0].count / limit),
  };
}
```

### Conditional Updates

```typescript
async function updateTransactionStatus(
  id: string,
  status: "pending" | "completed" | "failed"
) {
  return db
    .update(transactions)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(and(
      eq(transactions.id, id),
      eq(transactions.status, "pending") // Only update pending transactions
    ));
}
```

## Common Issues and Solutions

### 1. Circular Imports

**Problem**: Import errors between modules
**Solution**: Use `@/database/db` and `@/database/schema` imports consistently

### 2. Type Errors After Schema Changes

**Problem**: TypeScript errors after modifying schema
**Solution**: Run `bun run db:push` after schema changes to sync types

### 3. Migration Conflicts

**Problem**: Multiple migrations with same name
**Solution**: Ensure unique migration names with timestamps or descriptive prefixes

### 4. Table Name Confusion

**Problem**: Can't find the banks table
**Solution**: The table is `wallets`, not `banks` (was renamed in a previous migration)

### 5. Drizzle Rules

**Problem**: Lint errors in DAL files
**Solution**: Drizzle rules `drizzle/enforce-delete-with-where` and `drizzle/enforce-update-with-where` are `error` only in `database/**/*.ts` and `dal/**/*.ts` files

### 6. Transaction Rollback

**Problem**: Need to handle partial failures
**Solution**: Use try/catch with transaction rollback

```typescript
try {
  await db.transaction(async (tx) => {
    await tx.insert(...);
    await tx.update(...);
  });
} catch (error) {
  console.error("Transaction failed:", error);
  // Automatic rollback happens here
}
```

## Cross-References

- **dal-skill**: For detailed DAL patterns and best practices
- **security-skill**: For encryption patterns (access tokens)
- **plaid-skill**: For Plaid integration patterns
- **dwolla-skill**: For Dwolla transfer patterns

## Validation Commands

```bash
# Type check
bun run type-check

# Verify rules
bun run verify:rules
```

## Performance Tips

1. Always use eager loading to prevent N+1 queries
2. Use indexed columns for WHERE clauses (userId, status, createdAt)
3. Implement pagination for large result sets
4. Use batch operations for bulk inserts/updates
5. Leverage database transactions for atomic operations