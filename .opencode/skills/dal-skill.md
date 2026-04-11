---
name: DalSkill
description: Drizzle ORM and Data Access Layer (DAL) patterns for efficient, type-safe DB access.
---

# DalSkill — DAL Patterns

Overview

All DB access must go through `dal/` classes or helpers. Avoid N+1 queries; use eager joins or aggregate queries.

When to use

- Any read or write to the database from actions or pages.

Example — One query with JOIN (no N+1)

```ts
import { db } from "@/database/db";
import { users, accounts } from "@/database/schema";
import { eq } from "drizzle-orm";

const usersWithAccounts = await db
  .select({ user: users, account: accounts })
  .from(users)
  .leftJoin(accounts, eq(users.id, accounts.userId));
```

Rules

- Do not run DB calls inside loops.
- Use `db.transaction(...)` for multi-step operations.
- Export a small DAL surface: `findById`, `create`, `update`, `delete`.

Validation

- `npm run type-check`
