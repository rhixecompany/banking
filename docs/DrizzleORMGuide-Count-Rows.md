# Drizzle ORM Guide: Count Rows

## Overview

- Use `count()` or `sql` operator to count rows.
- Cast result to number for PostgreSQL/MySQL.
- Count non-null values by passing a column.
- Use with joins, aggregations, and conditions.

## Examples

### Count all rows

```ts
import { count, sql } from 'drizzle-orm';
import { products } from './schema';
const db = drizzle(...);
await db.select({ count: count() }).from(products);
await db.select({ count: sql<number>`count(*)`.mapWith(Number) }).from(products);
```

### Count non-null column values

```ts
await db.select({ count: count(products.discount) }).from(products);
```

### Custom count (cast to integer)

```ts
import { AnyColumn, sql } from "drizzle-orm";
const customCount = (column?: AnyColumn) => {
  if (column) {
    return sql<number>`cast(count(${column}) as integer)`;
  } else {
    return sql<number>`cast(count(*) as integer)`;
  }
};
await db.select({ count: customCount() }).from(products);
await db
  .select({ count: customCount(products.discount) })
  .from(products);
```

### Count with condition

```ts
import { count, gt } from "drizzle-orm";
await db
  .select({ count: count() })
  .from(products)
  .where(gt(products.price, 100));
```

### Count with joins/aggregations

```ts
import { count, eq } from "drizzle-orm";

import { countries, cities } from "./schema";
await db
  .select({ citiesCount: count(cities.id), country: countries.name })
  .from(countries)
  .leftJoin(cities, eq(countries.id, cities.countryId))
  .groupBy(countries.id)
  .orderBy(countries.name);
```

### Notes

- Use `sql<number>` to specify expected type.
- Use `.mapWith()` for runtime transformations.
