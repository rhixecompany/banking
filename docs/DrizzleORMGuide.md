# Drizzle ORM Comprehensive Guide

## Quick Reference

- **PostgreSQL**: `drizzle-kit push`, `drizzle-orm/postgres-core`
- **Queries**: Use `.select()`, `.insert()`, `.update()`, `.delete()`
- **Operators**: `eq()`, `gt()`, `lt()`, `and()`, `or()`, `sql`

---

## Count Rows

```ts
import { count, sql } from "drizzle-orm";
import { products } from "./schema";

// Basic count
await db.select({ count: count() }).from(products);

// Count non-null values
await db.select({ count: count(products.discount) }).from(products);

// Count with condition
import { gt } from "drizzle-orm";
await db
  .select({ count: count() })
  .from(products)
  .where(gt(products.price, 100));

// Count with joins/aggregations
import { eq } from "drizzle-orm";
await db
  .select({ citiesCount: count(cities.id), country: countries.name })
  .from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .groupBy(countries.id);
```

---

## Upsert (Insert or Update)

### PostgreSQL/SQLite

```ts
// Basic upsert
await db
  .insert(users)
  .values({ id: 1, name: "John" })
  .onConflictDoUpdate({
    target: users.id,
    set: { name: "Super John" }
  });

// Upsert multiple rows
await db
  .insert(users)
  .values(values)
  .onConflictDoUpdate({
    set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) },
    target: users.id
  });

// Composite key upsert
await db
  .insert(inventory)
  .values({ productId: 1, quantity: 100, warehouseId: 1 })
  .onConflictDoUpdate({
    set: { quantity: sql`${inventory.quantity} + 100` },
    target: [inventory.warehouseId, inventory.productId]
  });
```

### MySQL

```ts
await db
  .insert(users)
  .values({ id: 1, name: "John" })
  .onDuplicateKeyUpdate({ set: { name: "Super John" } });
```

---

## Pagination

### Limit/Offset

```ts
await db.select().from(users).limit(10).offset(20);
```

### Cursor-Based

```ts
import { asc, gt } from "drizzle-orm";

// Basic cursor pagination
const nextPage = async (cursor?: number, pageSize = 3) => {
  return db
    .select()
    .from(users)
    .where(cursor ? gt(users.id, cursor) : undefined)
    .limit(pageSize)
    .orderBy(asc(users.id));
};

// Multi-column cursor
const nextPage = async (
  cursor?: { id: number; firstName: string },
  pageSize = 3
) => {
  return db
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
```

---

## Conditional Filters

```ts
// Build query conditionally
const buildQuery = (minPrice?: number, category?: string) => {
  const conditions = [];
  if (minPrice) conditions.push(gt(products.price, minPrice));
  if (category) conditions.push(eq(products.category, category));
  return conditions.length ? and(...conditions) : undefined;
};
```

---

## Include/Exclude Columns

```ts
import { hide, sql } from "drizzle-orm";

// Exclude columns
await db.select({ id: users.id, name: users.name }).from(users);

// Use .$dynamic() for runtime column selection
const selectPartial = (columns: string[]) => {
  return db.select().from(users).$dynamic();
};
```

---

## Toggle Boolean

```ts
import { not } from "drizzle-orm";
await db
  .update(users)
  .set({ active: not(users.active) })
  .where(eq(users.id, 1));
```

---

## Timestamp Default Value

```ts
import { timestamp } from "drizzle-orm/pg-core";
createdAt: timestamp("created_at").defaultNow(),
updatedAt: timestamp("updated_at").onUpdateNow(),
```

---

## Increment/Decrement

```ts
import { sql } from "drizzle-orm";
await db
  .update(products)
  .set({ stock: sql`${products.stock} - 1` })
  .where(eq(products.id, 1));
```

---

## Related Resources

- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle Kit](https://orm.drizzle.team/docs/kit-overview)
- [PostgreSQL Setup](https://orm.drizzle.team/docs/get-started-postgresql)
