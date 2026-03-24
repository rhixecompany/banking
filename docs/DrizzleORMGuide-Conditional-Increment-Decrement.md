# Drizzle ORM Guide: Conditional Filters in Query

## Overview

- Use `.where()` with logical operators for conditional filters.
- Combine filters with `and()` or `or()`.
- Build dynamic filter arrays and spread into `.where()`.
- Custom filter operators can be created using SQL expressions.

## Examples

```ts
import { ilike } from 'drizzle-orm';
const db = drizzle(...);
const searchPosts = async (term?: string) => {
  await db
    .select()
    .from(posts)
    .where(term ? ilike(posts.title, term) : undefined);
};
await searchPosts();
await searchPosts('AI');
```

Combine filters:

```ts
import { and, gt, ilike, inArray } from "drizzle-orm";
const searchPosts = async (
  term?: string,
  categories: string[] = [],
  views = 0
) => {
  await db
    .select()
    .from(posts)
    .where(
      and(
        term ? ilike(posts.title, term) : undefined,
        categories.length > 0
          ? inArray(posts.category, categories)
          : undefined,
        views > 100 ? gt(posts.views, views) : undefined
      )
    );
};
await searchPosts();
await searchPosts("AI", ["Tech", "Art", "Science"], 200);
```

Dynamic filters:

```ts
import { SQL, ... } from 'drizzle-orm';
const searchPosts = async (filters: SQL[] = []) => {
  await db.select().from(posts).where(and(...filters));
};
const filters: SQL[] = [];
filters.push(ilike(posts.title, 'AI'));
filters.push(inArray(posts.category, ['Tech', 'Art', 'Science']));
filters.push(gt(posts.views, 200));
await searchPosts(filters);
```

Custom operator:

```ts
import { AnyColumn, sql } from "drizzle-orm";
const lenlt = (column: AnyColumn, value: number) => {
  return sql`length(${column}) < ${value}`;
};
const searchPosts = async (maxLen = 0, views = 0) => {
  await db
    .select()
    .from(posts)
    .where(
      and(
        maxLen ? lenlt(posts.title, maxLen) : undefined,
        views > 100 ? gt(posts.views, views) : undefined
      )
    );
};
await searchPosts(8);
await searchPosts(8, 200);
```

---

# Drizzle ORM Guide: Incrementing a Value

## Overview

- Use `update().set()` with `sql` to increment a column.
- Custom increment function possible.

## Example

```ts
import { eq, sql } from 'drizzle-orm';
const db = drizzle(...);
await db.update(table).set({ counter: sql`${table.counter} + 1` }).where(eq(table.id, 1));
```

Custom increment:

```ts
import { AnyColumn, sql } from "drizzle-orm";
const increment = (column: AnyColumn, value = 1) =>
  sql`${column} + ${value}`;
await db
  .update(table)
  .set({
    counter1: increment(table.counter1),
    counter2: increment(table.counter2, 10)
  })
  .where(eq(table.id, 1));
```

---

# Drizzle ORM Guide: Decrementing a Value

## Overview

- Use `update().set()` with `sql` to decrement a column.
- Custom decrement function possible.

## Example

```ts
import { eq, sql } from 'drizzle-orm';
const db = drizzle(...);
await db.update(table).set({ counter: sql`${table.counter} - 1` }).where(eq(table.id, 1));
```

Custom decrement:

```ts
import { AnyColumn, sql } from "drizzle-orm";
const decrement = (column: AnyColumn, value = 1) =>
  sql`${column} - ${value}`;
await db
  .update(table)
  .set({
    counter1: decrement(table.counter1),
    counter2: decrement(table.counter2, 10)
  })
  .where(eq(table.id, 1));
```
