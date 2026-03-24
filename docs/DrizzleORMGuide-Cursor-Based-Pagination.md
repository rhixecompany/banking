# Drizzle ORM Guide: Cursor-Based Pagination

## Overview

- Use a unique, sequential column as cursor (e.g., `id`).
- Use `.where()` with `gt()` or `lt()` for cursor comparison.
- Always use `.orderBy()` for consistent results.
- Can use multiple columns for cursor if needed.
- Add indices for cursor columns for performance.

## Examples

### Basic cursor-based pagination

```ts
import { asc, gt } from 'drizzle-orm';
import { users } from './schema';
const db = drizzle(...);
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.select().from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};
await nextUserPage(3);
```

### Dynamic order

```ts
const nextUserPage = async (
  order: "asc" | "desc" = "asc",
  cursor?: number,
  pageSize = 3
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? order === "asc"
          ? gt(users.id, cursor)
          : lt(users.id, cursor)
        : undefined
    )
    .limit(pageSize)
    .orderBy(order === "asc" ? asc(users.id) : desc(users.id));
};
await nextUserPage();
await nextUserPage("asc", 3);
await nextUserPage("desc");
await nextUserPage("desc", 7);
```

### Multi-column cursor

```ts
import { and, asc, eq, gt, or } from "drizzle-orm";
const nextUserPage = async (
  cursor?: { id: number; firstName: string },
  pageSize = 3
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? or(
            gt(users.firstName, cursor.firstName),
            and(
              eq(users.firstName, cursor.firstName),
              gt(users.id, cursor.id)
            )
          )
        : undefined
    )
    .limit(pageSize)
    .orderBy(asc(users.firstName), asc(users.id));
};
await nextUserPage({ id: 2, firstName: "Alex" });
```

### With UUID or non-sequential PK

```ts
const nextUserPage = async (
  cursor?: { id: string; createdAt: Date },
  pageSize = 3
) => {
  await db
    .select()
    .from(users)
    .where(
      cursor
        ? or(
            gt(users.createdAt, cursor.createdAt),
            and(
              eq(users.createdAt, cursor.createdAt),
              gt(users.id, cursor.id)
            )
          )
        : undefined
    )
    .limit(pageSize)
    .orderBy(asc(users.createdAt), asc(users.id));
};
await nextUserPage({
  id: "uuid",
  createdAt: new Date("2024-03-09T17:59:36.406Z")
});
```

### Relational queries

```ts
import * as schema from './db/schema';
const db = drizzle(..., { schema });
const nextUserPage = async (cursor?: number, pageSize = 3) => {
  await db.query.users.findMany({
    where: (users, { gt }) => (cursor ? gt(users.id, cursor) : undefined),
    orderBy: (users, { asc }) => asc(users.id),
    limit: pageSize,
  });
};
await nextUserPage(3);
```

## Notes

- Cursor-based pagination is more consistent and efficient for large or real-time datasets.
- Cannot directly jump to a specific page.
- Add indices for all cursor columns.
- For simple navigation, use limit/offset pagination.
