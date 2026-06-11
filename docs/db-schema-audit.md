# Database Schema Audit

Generated: 2026-04-13

Scope

- Cross-referenced `database/schema.ts` with the current working tree (DALs, actions, seed scripts, and tests).
- Goal: identify missing tables/fields, naming inconsistencies, FK and index gaps, security concerns, and provide a safe migration strategy.

Executive Summary

- The schema is comprehensive for the Banking app but contains a mixture of camelCase and snake_case column names which complicates migrations and querying.
- Code references Plaid `item_id` in scripts and actions but there is no canonical `plaid_items` table or `item_id` column on `wallets`. We recommend adding a normalized `plaid_items` table.
- Recommend normalizing DB column names to snake_case via a safe dual-write / backfill / cleanup migration approach.
- FK delete policies are inconsistent; adopt the following defaults (preserve ledger):
  - transactions.sender_wallet_id and transactions.receiver_wallet_id: ON DELETE SET NULL
  - dwolla_transfers.user_id: ON DELETE SET NULL
  - wallets.user_id: ON DELETE CASCADE
  - sessions, account records: ON DELETE CASCADE

Key Findings

1. Naming inconsistencies (high risk)

- The schema mixes camelCase and snake_case column names (e.g., `created_at` vs `emailVerified`). This makes raw SQL, migrations, and snapshots harder to reason about.
- Recommendation: normalize column names to snake_case across all tables (created_at, email_verified, is_active, is_admin, updated_at, etc.). Use a staged migration strategy (dual-write -> backfill -> read switch -> drop old columns).

1. Missing Plaid Item tracking (medium risk)

- The codebase (e.g., `actions/plaid.actions.ts`, `scripts/seed/create-plaid-tokens.ts`, `types/plaid.ts`) expects a Plaid `item_id` and `access_token` lifecycle. The schema currently stores `access_token` on `wallets` but no `plaid_items` table and no `item_id` column for reliable reconciliation.
- Recommendation: create a normalized `plaid_items` table with columns: `id`, `item_id`, `access_token_encrypted`, `user_id`, `created_at`, `updated_at`. Link `wallets` to `plaid_items` via `plaid_item_id`. This supports multiple wallets per Plaid item.

1. CamelCase DB column names present (medium risk)

- Examples: `emailVerified`, `credentialBackedUp`, `credentialDeviceType`, `credentialID`, `credentialPublicKey`.
- Recommendation: rename to `email_verified`, `credential_backed_up`, `credential_device_type`, `credential_id`, `credential_public_key`.

1. FK onDelete inconsistencies (medium risk)

- Some FKs use `onDelete: 'cascade'` (good for session cleanup), others lack explicit `onDelete` (e.g., `dwolla_transfers.userId`, `transactions.senderWalletId`/`receiverWalletId`).
- Recommendation: standardize policies:
  - User-owned lookup tables: `ON DELETE CASCADE` for immediate cleanup of sessions/accounts.
  - Ledger entries (transactions): `ON DELETE SET NULL` to preserve historical data.
  - Dwolla transfers: `ON DELETE SET NULL` (preserve transfer records for audits).

1. Nullable vs notNull mismatches (low/medium)

- Ensure fields that code requires are `NOT NULL` and optional fields remain nullable. E.g., `wallets.access_token` is notNull and encrypted correctly in code.

1. Encryption & secrets (security)

- Sensitive fields (`ssn_encrypted`, `account_number_encrypted`, `access_token`) are expected to be encrypted. Ensure `ENCRYPTION_KEY` is enforced and that the `lib/encryption` module is used consistently.

1. Index coverage and uniqueness (performance)

- Existing helpful indices: `users_email_idx`, `wallets_sharable_id_idx`, `transactions_*`.
- Recommendation: add index on `plaid_items.item_id` and `wallets.plaid_item_id`. Consider compound indexes `(user_id, account_id)` if used frequently.

Concrete Recommendations and Migration Strategy

Principles

- Non-blocking migrations: prefer additive changes first (add columns/tables/indexes) → dual-write (app writes to both legacy and new columns) → backfill new columns from legacy columns → cut write/read to new columns → drop legacy columns.
- Avoid data loss: make decisions explicit and reversible via Down migrations when possible.

Primary schema changes (recommended)

1. Add `plaid_items` table (normalized storage for Plaid Items)

- Columns: `id TEXT PRIMARY KEY`, `item_id VARCHAR(255) NOT NULL`, `access_token_encrypted TEXT NOT NULL`, `user_id TEXT REFERENCES users(id) ON DELETE CASCADE`, `created_at TIMESTAMP NOT NULL DEFAULT now()`, `updated_at TIMESTAMP NOT NULL DEFAULT now()`
- Add index on `item_id`.

1. Add `plaid_item_id` to `wallets` to reference `plaid_items(id)`.

- Make `plaid_item_id` nullable initially, backfill from existing data.

1. Normalize column names to snake_case with dual-write strategy

- Example: add `email_verified` while keeping `emailVerified` written temporarily.
- Backfill values and switch reads to `email_verified`.

1. Apply FK policies (preserve ledger)

- `transactions.sender_wallet_id` and `transactions.receiver_wallet_id`: `ON DELETE SET NULL`
- `dwolla_transfers.user_id`: `ON DELETE SET NULL`
- `wallets.user_id`: `ON DELETE CASCADE`
- `sessions`, `account`: `ON DELETE CASCADE`

1. Add indices

- `plaid_items_item_id_idx` on `plaid_items(item_id)`
- `wallets_plaid_item_id_idx` on `wallets(plaid_item_id)`

Migration examples (Drizzle / SQL snippets)

- Add `plaid_items` (SQL example)

```sql
CREATE TABLE plaid_items (
  id text PRIMARY KEY,
  item_id varchar(255) NOT NULL,
  access_token_encrypted text NOT NULL,
  user_id text REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS plaid_items_item_id_idx ON plaid_items(item_id);
```

- Add `plaid_item_id` on `wallets` (SQL example)

```sql
ALTER TABLE wallets ADD COLUMN plaid_item_id text REFERENCES plaid_items(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS wallets_plaid_item_id_idx ON wallets(plaid_item_id);
```

Dual-write pattern (DAL example)

```ts
// dal/wallet.dal.ts
async function createWallet(data: {
  accountId: string;
  itemId?: string;
  userId: string;
}) {
  const row = {
    account_id: data.accountId,
    plaid_item_id: data.itemId ?? null,
    user_id: data.userId,
    // Legacy camelCase fields (temporary dual-write for safe migration)
    accountId: data.accountId,
    itemId: data.itemId ?? null
  } as any;

  const [created] = await db.insert(wallets).values(row).returning();
  return created;
}
```

Backfill example

```sql
UPDATE wallets SET plaid_item_id = pi.id
FROM plaid_items pi
WHERE wallets.account_id = pi.item_id_or_other_matching_logic AND wallets.plaid_item_id IS NULL;
```

FK policy SQL example (set null)

```sql
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_sender_wallet_id_fkey,
  ADD CONSTRAINT transactions_sender_wallet_id_fkey FOREIGN KEY (sender_wallet_id) REFERENCES wallets(id) ON DELETE SET NULL;
```

Cross-reference notes (where code expects fields)

- `actions/plaid.actions.ts`: exchanges public token → `exchangeResponse.data.item_id`.
- `scripts/seed/create-plaid-tokens.ts`: creates sandbox items and logs `itemId` for seeding.
- `scripts/seed/seed-data.ts`: current wallet seeds do not set `item_id` — will be updated in seed script during migration.
- `dal/*`: many DALs use fields like `userId` and `emailVerified` in code — dual-write and backfill required.

Testing & Validation

- Run migrations and backfill on a local copy of the seeded DB and run full test suite:
  - npm run type-check
  - npm run lint:strict
  - PLAYWRIGHT_PREPARE_DB=true npm run test:ui
  - npm run test:browser (vitest)

Rollback Plan

- All migrations include down scripts when possible. For changes that require column removal, postpone until verified and include backups.

Open Decisions

- None remain for Plaid storage (user selected `plaid_items`).

Next Step (asks)

- Shall I now generate the Drizzle migration files for `plaid_items` and the `plaid_item_id` column (additive migrations only) and the SQL to add the FK policies (ON DELETE SET NULL/CASCADE) — these will be created as migration files under `database/drizzle/` and added to the working tree? Reply with `yes` to create migration files (working tree only, not committed), or `no` to postpone.

---
