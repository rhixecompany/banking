# Proposal: Add dwolla_transfers table to database/schema.ts

## Summary

Add a new `dwolla_transfers` table to record Dwolla transfer metadata. Currently the app creates Dwolla transfers via the Dwolla API and records a simplified transaction in `transactions`. Adding a dedicated table provides an authoritative audit trail for ACH transfers, allows retry/backoff/callback correlation, and stores provider-specific IDs/URLs.

This change is non-destructive: the new table will be additive and nullable where appropriate. Migration will be additive only (no destructive changes to existing columns).

## Rationale

- Keeps provider-specific transfer metadata separate from generic `transactions`.
- Allows storing Dwolla transfer IDs and URLs to query transfer status later.
- Facilitates correlating app transactions to Dwolla lifecycle events (webhooks).

## Drizzle Schema Snippet (to add to database/schema.ts)

```ts
export const dwollaTransfers = pgTable(
  "dwolla_transfers",
  {
    id: text("id")
      .primaryKey()
      .notNull()
      .$defaultFn(() => crypto.randomUUID()),
    dwollaTransferId: text("dwolla_transfer_id"),
    transferUrl: text("transfer_url"),
    amount: numeric("amount", { precision: 12, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).default("USD"),
    status: varchar("status", { length: 50 }),
    sourceFundingSourceUrl: text("source_funding_source_url"),
    destinationFundingSourceUrl: text(
      "destination_funding_source_url"
    ),
    senderWalletId: text("sender_wallet_id").references(
      () => wallets.id
    ),
    receiverWalletId: text("receiver_wallet_id").references(
      () => wallets.id
    ),
    userId: text("user_id").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date())
  },
  table => [
    index("dwolla_transfers_user_id_idx").on(table.userId),
    index("dwolla_transfers_status_idx").on(table.status),
    index("dwolla_transfers_created_at_idx").on(table.createdAt)
  ]
);
```

## Migration Steps

1. Add the schema snippet above to `database/schema.ts` (add only, no edits to existing tables).
2. Generate migration: `npm run db:generate` (Drizzle will produce a migration file).
3. Review migration SQL and run on staging: `npm run db:migrate` (or `npm run db:push` for direct push).
4. Update DAL: add `dwolla.dal.ts` helpers if needed to create/find transfers.
5. Optionally backfill: if you want historical transfers recorded, write a one-time script that queries Dwolla or uses transaction records to populate `dwolla_transfers` (not included here).

## Validation

- Run `npm run type-check` and `npm run lint:strict` after adding schema.
- Run `npm run db:check` (if available) or inspect generated migration SQL.
- Run unit tests that touch Dwolla/DAL code.

## Rollback

- The migration is additive; to rollback, revert the migration and run `npm run db:migrate:down` (Drizzle CLI steps depend on setup). Always backup DB before applying migrations in production.

## Notes

- This proposal intentionally avoids renaming or modifying existing columns to prevent breaking changes.
- If you prefer to store Dwolla metadata directly on `wallets` or `transactions`, we can instead add columns to those tables; I recommend a dedicated table for clarity and auditability.
