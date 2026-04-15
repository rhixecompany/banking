-- Apply FK onDelete policies (preserve ledger defaults):
-- - transactions.sender_wallet_id and transactions.receiver_wallet_id: ON DELETE SET NULL
-- - dwolla_transfers.user_id: ON DELETE SET NULL
-- - wallets.user_id: ON DELETE CASCADE (already set in schema but ensure constraint exists)
-- - sessions and account: ON DELETE CASCADE

BEGIN;

-- transactions.sender_wallet_id
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_sender_wallet_id_fkey;
ALTER TABLE transactions
  ADD CONSTRAINT transactions_sender_wallet_id_fkey FOREIGN KEY (sender_wallet_id) REFERENCES wallets(id) ON DELETE SET NULL;

-- transactions.receiver_wallet_id
ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_receiver_wallet_id_fkey;
ALTER TABLE transactions
  ADD CONSTRAINT transactions_receiver_wallet_id_fkey FOREIGN KEY (receiver_wallet_id) REFERENCES wallets(id) ON DELETE SET NULL;

-- dwolla_transfers.user_id
ALTER TABLE dwolla_transfers
  DROP CONSTRAINT IF EXISTS dwolla_transfers_user_id_users_id_fk;
ALTER TABLE dwolla_transfers
  ADD CONSTRAINT dwolla_transfers_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- sessions.userId (ensure cascade)
ALTER TABLE session
  DROP CONSTRAINT IF EXISTS session_userId_users_id_fk;
ALTER TABLE session
  ADD CONSTRAINT session_userId_users_id_fk FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

-- account.userId (ensure cascade)
ALTER TABLE account
  DROP CONSTRAINT IF EXISTS account_userId_users_id_fk;
ALTER TABLE account
  ADD CONSTRAINT account_userId_users_id_fk FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE;

COMMIT;

-- Down migration hint: revert by dropping and recreating previous constraints (not fully reversible without prior constraint metadata capture).
