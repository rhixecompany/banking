---
name: db-skill
description: Drizzle ORM patterns - schema, migrations, queries, and N+1 prevention for the Banking app.
lastReviewed: 2026-04-13
applyTo: "database/**"
---

# DBSkill - Banking Database Patterns

## Overview

This skill provides guidance on Drizzle ORM patterns for the Banking project.

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

  async create(
    data: Omit<
      typeof users.$inferInsert,
      "id" | "createdAt" | "updatedAt"
    >
  ) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
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

## Transactions

```typescript
import { db } from "@/database/db";

await db.transaction(async tx => {
  await tx.insert(wallets).values({ ...data });
  await tx.insert(transactions).values({ ...txData });
});
```

## Migrations

```bash
npm run db:generate   # Generate migration
npm run db:push       # Push schema to database
npm run db:studio     # Drizzle Studio (localhost:8000)
npm run db:seed       # Seed database (PLAID_TOKEN_MODE=sandbox)
npm run db:reset      # Full reset: db:drop + db:generate + db:push
```

Drizzle migrations read `.env.local` first, then `.env` via `dotenv` in `drizzle.config.ts`.

## Validation

Run: `npm run type-check` and verify no N+1 patterns in DAL files.

## Common Issues

1. **Circular imports** — Use `@/database/db` and `@/database/schema` imports
2. **Type errors** — Run `npm run db:push` after schema changes
3. **Migration conflicts** — Ensure unique migration names
4. **Table name confusion** — The table is `wallets`, not `banks` (was renamed)
5. **Drizzle rules** — `drizzle/enforce-delete-with-where` and `drizzle/enforce-update-with-where` are `error` only in `database/**/*.ts` and `dal/**/*.ts` files
