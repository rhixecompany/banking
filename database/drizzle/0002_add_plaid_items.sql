-- Add plaid_items table for normalized Plaid Item storage
-- Non-destructive additive migration. Backfill and dual-write handled by application code.

BEGIN;

CREATE TABLE IF NOT EXISTS plaid_items (
  id text PRIMARY KEY,
  item_id varchar(255) NOT NULL,
  access_token_encrypted text NOT NULL,
  user_id text REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS plaid_items_item_id_idx ON plaid_items(item_id);

COMMIT;

-- Down migration hint:
-- To revert: DROP INDEX IF EXISTS plaid_items_item_id_idx; DROP TABLE IF EXISTS plaid_items;
