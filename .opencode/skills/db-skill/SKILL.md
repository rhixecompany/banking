---
name: DBSkill
description: Drizzle ORM patterns for the Banking app - schema definition, migrations, queries, and N+1 prevention. Use when working with database, schema, or data access layer.
---

# DBSkill - Banking Database Patterns

## Overview

This skill provides guidance on Drizzle ORM patterns for the Banking project.

## Schema Definition

```typescript
// database/schema.ts
import {
  pgTable,
  serial,
  varchar,
  timestamp,
  boolean,
  decimal,
  uuid
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  emailVerified: timestamp("email_verified"),
  image: varchar("image", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", {
    length: 255
  }).notNull()
  // ... other OAuth fields
});
```

## Data Access Layer (DAL)

```typescript
// lib/dal/user.dal.ts
import { db } from "@/database/db";
import { users, accounts } from "@/database/schema";
import { eq } from "drizzle-orm";

export class UserDal {
  async findById(id: string) {
    return db.query.users.findFirst({
      where: eq(users.id, id)
    });
  }

  async findByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email)
    });
  }

  // GOOD: Join to get user with accounts in single query
  async findByIdWithAccounts(id: string) {
    return db
      .select({
        id: users.id,
        email: users.email,
        name: users.name,
        accountId: accounts.id,
        provider: accounts.provider
      })
      .from(users)
      .leftJoin(accounts, eq(users.id, accounts.userId))
      .where(eq(users.id, id));
  }
}

export const userDal = new UserDal();
```

## N+1 Prevention (CRITICAL)

**BAD** - Causes N+1 queries:

```typescript
// DON'T DO THIS
const users = await db.select().from(users);
for (const user of users) {
  const accounts = await db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, user.id));
  user.accounts = accounts;
}
```

**GOOD** - Single JOIN query:

```typescript
// DO THIS INSTEAD
const usersWithAccounts = await db
  .select({
    id: users.id,
    email: users.email,
    accountId: accounts.id,
    provider: accounts.provider
  })
  .from(users)
  .leftJoin(accounts, eq(users.id, accounts.userId));
```

## Migrations

```bash
# Generate migration
npm run db:generate

# Push to database
npm run db:push

# Full reset
npm run db:reset
```

## Validation

Run: `npm run type-check` and verify no N+1 patterns in DAL files.

## Common Issues

1. **Circular imports** - Use `@/database/db` and `@/database/schema` imports
2. **Type errors** - Run `npm run db:push` after schema changes
3. **Migration conflicts** - Ensure unique migration names
