---
name: "dal-patterns"
description: "Drizzle ORM patterns, DAL pattern, and N+1 prevention"
applyTo: "**/*.{ts,tsx}"
priority: 3
---

# DAL Patterns - Banking Project

## Data Access Layer (DAL)

All database access must go through `dal/`.

### File Structure

```typescript
// dal/user.dal.ts
import { eq } from "drizzle-orm";
import { db } from "@/database/db";
import { users } from "@/database/schema";
import { BaseDal } from "./base.dal";

export class UserDal extends BaseDal<typeof users> {
  constructor() {
    super(users);
  }

  async findByEmail(email: string) {
    return db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  }
}

export const userDal = new UserDal();
```

## N+1 Prevention - CRITICAL

**NEVER query inside loops.** Use JOINs or structured selects to eagerly load relations.

```typescript
// BAD - N+1 query pattern
const users = await userDal.findAll();
for (const user of users) {
  const accounts = await accountDal.findByUserId(user.id);
  user.accounts = accounts;
}

// GOOD - Single query with JOIN
const usersWithAccounts = await db
  .select({
    user: users,
    account: accounts
  })
  .from(users)
  .leftJoin(accounts, eq(users.id, accounts.userId));
```

## JOINs and Relationships

```typescript
// One-to-Many with leftJoin
const usersWithAccounts = await db
  .select({
    id: users.id,
    email: users.email,
    accounts: accounts
  })
  .from(users)
  .leftJoin(accounts, eq(users.id, accounts.userId));

// Many-to-Many through junction table
const usersWithRoles = await db
  .select({
    user: users,
    role: roles
  })
  .from(users)
  .leftJoin(userRoles, eq(users.id, userRoles.userId))
  .leftJoin(roles, eq(userRoles.roleId, roles.id));
```

## Transactions

```typescript
import { db } from "@/database/db";

await db.transaction(async (tx) => {
  await tx.insert(users).values({ ... });
  await tx.insert(accounts).values({ ... });
});
```

## Zod Validation with Drizzle

```typescript
import { z } from "zod";
import { eq } from "drizzle-orm";

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100)
});

export async function createUser(input: unknown) {
  const parsed = UserSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  await userDal.create(parsed.data);
  return { ok: true };
}
```

## Database Schema

Schema is defined in `database/schema.ts`.

See: .opencode/skills/db-skill/SKILL.md
