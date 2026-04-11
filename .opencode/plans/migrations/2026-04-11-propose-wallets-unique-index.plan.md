# Proposed Migration: Add unique index on wallets (user_id, account_id)

## Summary

- Add a uniqueness constraint to prevent a single user from linking the same Plaid account multiple times.
- Implement by creating a unique index on (user_id, account_id) in the `wallets` table.

## Motivation / Rationale

- Currently `wallets` has `sharable_id` unique, but there is no constraint preventing duplicate `account_id` entries for the same `user_id`.
- The `exchangePublicToken` flow currently creates a new wallets row for each link without checking for an existing `accountId` for the same user. This can allow duplicate linked wallets for the same Plaid account.

## Proposed Change (Up)

1. Verify no existing duplicate rows where the same (user_id, account_id) pair appears more than once.
   - SQL: SELECT user_id, account_id, COUNT(_) FROM wallets WHERE account_id IS NOT NULL GROUP BY user_id, account_id HAVING COUNT(_) > 1;
2. If duplicates exist, choose one of:
   - Option A (recommended): Keep the most recently created row and soft-delete the others (set deleted_at) after notifying owners via logs; backfill `sharable_id` if necessary.
   - Option B: Create a merge script to consolidate funding_source_url, customer_url, and other non-null fields into the chosen canonical row.
3. Create the unique index: `CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS wallets_user_account_unique_idx ON wallets (user_id, account_id) WHERE account_id IS NOT NULL AND deleted_at IS NULL;`

Notes: Using `CONCURRENTLY` reduces locking on large tables. The WHERE clause avoids enforcing uniqueness on soft-deleted rows.

## Rollback (Down)

- DROP INDEX IF EXISTS wallets_user_account_unique_idx;

## Validation Steps

1. Run the duplicate-check SQL above and report zero duplicates before applying.
2. Run `npm run db:generate` to produce a drizzle migration file (dry-run review).
3. Apply migration to disposable dev DB (not production): `npm run db:migrate` or `npm run db:push` depending on repo setup.
4. Run relevant tests: `npx vitest --run` and `npm run test:ui` (Playwright) for Plaid linking flows.
5. Confirm `exchangePublicToken` still inserts new wallet rows for unique (user_id, account_id) and is prevented for duplicates (returns error or reuses existing row depending on code change).

## Code Changes Required (optional)

- To avoid migration friction, consider updating `exchangePublicToken` to check for existing wallet by `accountId` and `userId` and return the existing row instead of inserting a duplicate. Suggested code snippet in `actions/plaid.actions.ts` before createWallet call:

```ts
const existing = await walletsDal.findByAccountId(account.account_id);
if (existing && existing.userId === session.user.id) {
  // Optionally update fundingSourceUrl/customerUrl if missing
  return { ok: true, wallet: existing };
}
```

This avoids unique constraint violations and produces a better UX.

## Risks & Mitigations

- Risk: Existing duplicates will cause the unique-index creation to fail. Mitigation: run duplicate detection and deduplication script first.
- Risk: Concurrent inserts during migration could hit the temporary window where duplicates are allowed. Mitigation: run migration during low-traffic window and use CONCURRENTLY.

## Files to Produce

- drizzle migration file under `database/migrations/` (generated via `npm run db:generate`).
- Deduplication script `scripts/db/dedup-wallets-user-account.ts` (optional) to assist in cleaning duplicates prior to applying migration.

---

Prepared by OpenCode assistant — request confirmation to generate migration files and/or run the dedup check on the local dev DB.
