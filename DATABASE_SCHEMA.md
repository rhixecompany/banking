# Banking — Database Schema

## Overview

Banking uses **PostgreSQL** with **Drizzle ORM** for type-safe database operations. The schema consists of 5 core tables with relations.

## Tables

### `users`

Core user account data with soft-delete support.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | `PRIMARY KEY` | Unique identifier |
| `email` | `varchar(255)` | `UNIQUE NOT NULL` | User email address |
| `name` | `varchar(255)` | `NOT NULL` | Full name |
| `password` | `varchar(255)` | `NOT NULL` | bcrypt-hashed password |
| `created_at` | `timestamptz` | `DEFAULT NOW()` | Account creation |
| `updated_at` | `timestamptz` | `DEFAULT NOW()` | Last update |
| `deleted_at` | `timestamptz` | `NULLABLE` | Soft-delete timestamp |

### `user_profiles`

Extended user information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | `PRIMARY KEY` | Unique identifier |
| `user_id` | `integer` | `FK → users.id` | Reference to user |
| `address` | `text` | `NULLABLE` | User address |
| `phone` | `varchar(20)` | `NULLABLE` | Phone number |
| `avatar_url` | `text` | `NULLABLE` | Profile image |
| `timezone` | `varchar(50)` | `DEFAULT 'UTC'` | User timezone |
| `created_at` | `timestamptz` | `DEFAULT NOW()` | |

### `banks`

Linked bank accounts via Plaid.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | `PRIMARY KEY` | Unique identifier |
| `user_id` | `integer` | `FK → users.id` | Owner |
| `plaid_access_token` | `text` | `NOT NULL` | Encrypted Plaid token |
| `plaid_item_id` | `text` | `NOT NULL` | Plaid item identifier |
| `institution_name` | `varchar(255)` | `NULLABLE` | Bank name |
| `institution_id` | `varchar(255)` | `NULLABLE` | Bank ID |
| `account_mask` | `varchar(10)` | `NULLABLE` | Last 4 digits |
| `is_active` | `boolean` | `DEFAULT true` | Active status |
| `created_at` | `timestamptz` | `DEFAULT NOW()` | |

### `transactions`

All financial transactions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | `PRIMARY KEY` | Unique identifier |
| `user_id` | `integer` | `FK → users.id` | Sender |
| `recipient_id` | `integer` | `FK → recipients.id` | Recipient |
| `bank_id` | `integer` | `FK → banks.id` | Source bank |
| `amount` | `decimal(12,2)` | `NOT NULL` | Transaction amount |
| `type` | `enum('credit','debit')` | `NOT NULL` | Transaction type |
| `status` | `enum('pending','completed','failed')` | `DEFAULT 'pending'` | Processing status |
| `idempotency_key` | `varchar(255)` | `UNIQUE` | Idempotency token |
| `dwolla_transfer_id` | `varchar(255)` | `NULLABLE` | Dwolla reference |
| `description` | `text` | `NULLABLE` | User note |
| `created_at` | `timestamptz` | `DEFAULT NOW()` | |
| `completed_at` | `timestamptz` | `NULLABLE` | Completion time |

### `recipients`

Saved transfer recipients.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `serial` | `PRIMARY KEY` | Unique identifier |
| `user_id` | `integer` | `FK → users.id` | Owner |
| `name` | `varchar(255)` | `NOT NULL` | Recipient name |
| `email` | `varchar(255)` | `NOT NULL` | Recipient email |
| `dwolla_customer_id` | `text` | `NOT NULL` | Dwolla reference |
| `bank_account_mask` | `varchar(10)` | `NULLABLE` | Bank account mask |
| `created_at` | `timestamptz` | `DEFAULT NOW()` | |

## Relations

```
users 1──* user_profiles
users 1──* banks
users 1──* transactions
users 1──* recipients
recipients 1──* transactions
banks 1──* transactions
```

## Indexes

| Table | Index | Column(s) | Purpose |
|-------|-------|-----------|---------|
| `users` | `idx_users_email` | `email` | Fast login lookup |
| `users` | `idx_users_deleted_at` | `deleted_at` | Soft-delete filtering |
| `transactions` | `idx_transactions_user` | `user_id` | User transaction queries |
| `transactions` | `idx_transactions_idempotency` | `idempotency_key` | Idempotency enforcement |
| `banks` | `idx_banks_user` | `user_id` | User bank queries |

## Drizzle ORM Usage

```typescript
// database/schema.ts
import { pgTable, serial, text, varchar, decimal, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  idempotencyKey: varchar("idempotency_key", { length: 255 }).unique(),
  // ...
});
```

## Commands

```bash
bun run db:push      # Push schema to database
bun run db:generate  # Generate SQL migration
bun run db:migrate   # Run pending migrations
bun run db:studio    # Open Drizzle Studio GUI
bun run db:drop      # Drop database
bun run db:seed      # Seed sample data
bun run db:reset     # Drop → Generate → Push
```
