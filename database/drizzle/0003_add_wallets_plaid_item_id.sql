-- Add plaid_item_id column to wallets table and index. Use ON DELETE SET NULL for referential safety.

BEGIN;

ALTER TABLE wallets
  ADD COLUMN IF NOT EXISTS plaid_item_id text;

-- Create FK constraint referencing plaid_items.id with SET NULL on delete
ALTER TABLE wallets
  DROP CONSTRAINT IF EXISTS wallets_plaid_item_id_fkey;

ALTER TABLE wallets
  ADD CONSTRAINT wallets_plaid_item_id_fkey FOREIGN KEY (plaid_item_id) REFERENCES plaid_items(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS wallets_plaid_item_id_idx ON wallets(plaid_item_id);

COMMIT;

-- Down migration hint:
-- To revert: DROP INDEX IF EXISTS wallets_plaid_item_id_idx; ALTER TABLE wallets DROP CONSTRAINT IF EXISTS wallets_plaid_item_id_fkey; ALTER TABLE wallets DROP COLUMN IF EXISTS plaid_item_id;
