# Drizzle ORM Guide: Upsert

## Overview

- Upsert = insert or update on conflict.
- PostgreSQL/SQLite: `.onConflictDoUpdate()`
- MySQL: `.onDuplicateKeyUpdate()`
- Use `excluded` (PG/SQLite) or `values()` (MySQL) for new row values.
- Can upsert multiple rows, composite keys, or partial columns.

## PostgreSQL/SQLite Example

```ts
import { users } from './schema';
const db = drizzle(...);
await db.insert(users).values({ id: 1, name: 'John' })
  .onConflictDoUpdate({ target: users.id, set: { name: 'Super John' } });
```

### Upsert multiple rows

```ts
import { sql } from "drizzle-orm";

import { users } from "./schema";
const values = [
  { id: 1, lastLogin: new Date() },
  { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  { id: 3, lastLogin: new Date(Date.now() + 1000 * 60 * 120) }
];
await db
  .insert(users)
  .values(values)
  .onConflictDoUpdate({
    set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) },
    target: users.id
  });
```

### Custom upsert columns

```ts
import { SQL, getColumns, sql } from "drizzle-orm";
import { PgTable } from "drizzle-orm/pg-core";
const buildConflictUpdateColumns = <
  T extends PgTable,
  Q extends keyof T["_"]["columns"]
>(
  table: T,
  columns: Q[]
) => {
  const cls = getColumns(table);
  return columns.reduce(
    (acc, column) => {
      const colName = cls[column].name;
      acc[column] = sql.raw(`excluded.${colName}`);
      return acc;
    },
    {} as Record<Q, SQL>
  );
};
```

### Composite key upsert

```ts
import { sql } from "drizzle-orm";

import { inventory } from "./schema";
await db
  .insert(inventory)
  .values({ productId: 1, quantity: 100, warehouseId: 1 })
  .onConflictDoUpdate({
    set: { quantity: sql`${inventory.quantity} + 100` },
    target: [inventory.warehouseId, inventory.productId]
  });
```

### Upsert with where clause

```ts
import { or, sql } from "drizzle-orm";

import { products } from "./schema";
const data = {
  id: 1,
  lastUpdated: new Date(),
  price: "999.99",
  stock: 10,
  title: "Phone"
};
const excludedPrice = sql.raw(`excluded.${products.price.name}`);
const excludedStock = sql.raw(`excluded.${products.stock.name}`);
await db
  .insert(products)
  .values(data)
  .onConflictDoUpdate({
    set: {
      lastUpdated: sql.raw(`excluded.${products.lastUpdated.name}`),
      price: excludedPrice,
      stock: excludedStock
    },
    setWhere: or(
      sql`${products.stock} != ${excludedStock}`,
      sql`${products.price} != ${excludedPrice}`
    ),
    target: products.id
  });
```

### Leave column unchanged

```ts
import { sql } from "drizzle-orm";

import { users } from "./schema";
const data = {
  age: 29,
  email: "john@email.com",
  id: 1,
  name: "John"
};
await db
  .insert(users)
  .values(data)
  .onConflictDoUpdate({
    set: { ...data, email: sql`${users.email}` }, // leave email as it was
    target: users.id
  });
```

## MySQL Example

```ts
await db
  .insert(users)
  .values({ id: 1, name: "John" })
  .onDuplicateKeyUpdate({ set: { name: "Super John" } });
```

### Upsert multiple rows (MySQL)

```ts
import { sql } from "drizzle-orm";

import { users } from "./schema";
const values = [
  { id: 1, lastLogin: new Date() },
  { id: 2, lastLogin: new Date(Date.now() + 1000 * 60 * 60) },
  { id: 3, lastLogin: new Date(Date.now() + 1000 * 60 * 120) }
];
await db
  .insert(users)
  .values(values)
  .onDuplicateKeyUpdate({
    set: { lastLogin: sql`values(${users.lastLogin})` }
  });
```

### Custom upsert columns (MySQL)

```ts
import { SQL, getColumns, sql } from "drizzle-orm";
import { MySqlTable } from "drizzle-orm/mysql-core";
const buildConflictUpdateColumns = <
  T extends MySqlTable,
  Q extends keyof T["_"]["columns"]
>(
  table: T,
  columns: Q[]
) => {
  const cls = getColumns(table);
  return columns.reduce(
    (acc, column) => {
      acc[column] = sql`values(${cls[column]})`;
      return acc;
    },
    {} as Record<Q, SQL>
  );
};
```

### Leave column unchanged (MySQL)

```ts
import { sql } from "drizzle-orm";

import { users } from "./schema";
const data = {
  age: 29,
  email: "john@email.com",
  id: 1,
  name: "John"
};
await db
  .insert(users)
  .values(data)
  .onDuplicateKeyUpdate({
    set: { ...data, email: sql`${users.email}` }
  });
```
