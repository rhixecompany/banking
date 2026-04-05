# Drizzle ORM Guide: Limit/Offset Pagination

## Overview

- Use `.limit()` and `.offset()` for pagination.
- Always use `.orderBy()` with a unique column for consistency.
- Can combine with relational queries and dynamic query building.
- Deferred join technique can improve performance for large tables.

## Examples

### Basic limit/offset

```ts
import { asc } from 'drizzle-orm';
import { users } from './schema';
const db = drizzle(...);
await db.select().from(users).orderBy(asc(users.id)).limit(4).offset(4);
```

### Pagination with two columns

```ts
const getUsers = async (page = 1, pageSize = 3) => {
  await db
    .select()
    .from(users)
    .orderBy(asc(users.firstName), asc(users.id))
    .limit(pageSize)
    .offset((page - 1) * pageSize);
};
await getUsers();
```

### Relational queries

```ts
import * as schema from "./db/schema";
const db = drizzle({ schema });
const getUsers = async (page = 1, pageSize = 3) => {
  await db.query.users.findMany({
    limit: pageSize,
    offset: (page - 1) * pageSize,
    orderBy: (users, { asc }) => asc(users.id)
  });
};
await getUsers();
```

### Custom pagination function

```ts
import { SQL, asc } from "drizzle-orm";
import { PgColumn, PgSelect } from "drizzle-orm/pg-core";
function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page = 1,
  pageSize = 3
) {
  return qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset((page - 1) * pageSize);
}
const query = db.select().from(users);
await withPagination(query.$dynamic(), asc(users.id));
```

### Deferred join technique

```ts
const getUsers = async (page = 1, pageSize = 10) => {
  const sq = db
    .select({ id: users.id })
    .from(users)
    .orderBy(users.id)
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .as("subquery");
  await db
    .select()
    .from(users)
    .innerJoin(sq, eq(users.id, sq.id))
    .orderBy(users.id);
};
```

## Notes

- Limit/offset is simple but can be inconsistent if rows are inserted/deleted during pagination.
- For high performance or real-time data, consider cursor-based pagination.
- See [Planetscale Pagination Guide](https://planetscale.com/blog/mysql-pagination) and [Efficient Pagination Guide by Aaron Francis](https://aaronfrancis.com/2022/efficient-pagination-using-deferred-joins).
