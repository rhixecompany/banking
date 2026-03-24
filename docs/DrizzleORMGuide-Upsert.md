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
    target: users.id,
    set: { lastLogin: sql.raw(`excluded.${users.lastLogin.name}`) }
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
  .values({ warehouseId: 1, productId: 1, quantity: 100 })
  .onConflictDoUpdate({
    target: [inventory.warehouseId, inventory.productId],
    set: { quantity: sql`${inventory.quantity} + 100` }
  });
```

### Upsert with where clause

```ts
import { or, sql } from "drizzle-orm";
import { products } from "./schema";
const data = {
  id: 1,
  title: "Phone",
  price: "999.99",
  stock: 10,
  lastUpdated: new Date()
};
const excludedPrice = sql.raw(`excluded.${products.price.name}`);
const excludedStock = sql.raw(`excluded.${products.stock.name}`);
await db
  .insert(products)
  .values(data)
  .onConflictDoUpdate({
    target: products.id,
    set: {
      price: excludedPrice,
      stock: excludedStock,
      lastUpdated: sql.raw(`excluded.${products.lastUpdated.name}`)
    },
    setWhere: or(
      sql`${products.stock} != ${excludedStock}`,
      sql`${products.price} != ${excludedPrice}`
    )
  });
```

### Leave column unchanged

```ts
import { sql } from "drizzle-orm";
import { users } from "./schema";
const data = {
  id: 1,
  name: "John",
  email: "john@email.com",
  age: 29
};
await db
  .insert(users)
  .values(data)
  .onConflictDoUpdate({
    target: users.id,
    set: { ...data, email: sql`${users.email}` } // leave email as it was
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
  id: 1,
  name: "John",
  email: "john@email.com",
  age: 29
};
await db
  .insert(users)
  .values(data)
  .onDuplicateKeyUpdate({
    set: { ...data, email: sql`${users.email}` }
  });
```
