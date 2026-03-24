# Drizzle ORM Guide: Timestamp Default Value

## Overview

- Set current timestamp as default using `defaultNow()` or `sql` operator.
- Use `mode` option to control value type in app (Date/string/number).
- Unix timestamp: use `extract(epoch from now())` (PG), `unix_timestamp()` (MySQL), `unixepoch()` (SQLite).

## PostgreSQL

```ts
import { sql } from "drizzle-orm";
import { timestamp, pgTable, serial } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  timestamp1: timestamp("timestamp1").notNull().defaultNow(),
  timestamp2: timestamp("timestamp2", { mode: "string" })
    .notNull()
    .default(sql`now()`)
});
```

Unix timestamp:

```ts
import { sql } from "drizzle-orm";
import { integer, pgTable, serial } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  timestamp: integer("timestamp")
    .notNull()
    .default(sql`extract(epoch from now())`)
});
```

## MySQL

```ts
import { sql } from "drizzle-orm";
import {
  mysqlTable,
  serial,
  timestamp
} from "drizzle-orm/mysql-core";
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  timestamp1: timestamp("timestamp1").notNull().defaultNow(),
  timestamp2: timestamp("timestamp2", { mode: "string" })
    .notNull()
    .default(sql`now()`),
  timestamp3: timestamp("timestamp3", { fsp: 3 })
    .notNull()
    .default(sql`now(3)`)
});
```

Unix timestamp:

```ts
import { sql } from "drizzle-orm";
import { mysqlTable, serial, int } from "drizzle-orm/mysql-core";
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  timestamp: int("timestamp")
    .notNull()
    .default(sql`(unix_timestamp())`)
});
```

## SQLite

```ts
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`)
});
```

Unix timestamp:

```ts
import { sql } from "drizzle-orm";
import { integer, sqliteTable } from "drizzle-orm/sqlite-core";
export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  timestamp1: integer("timestamp1", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  timestamp2: integer("timestamp2", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`),
  timestamp3: integer("timestamp3", { mode: "number" })
    .notNull()
    .default(sql`(unixepoch())`)
});
```

## Notes

- `mode` option controls how values are returned in the app.
- Always check DB docs for type/format details.
