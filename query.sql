SELECT user_id, account_id, COUNT(*) AS cnt FROM wallets WHERE account_id IS NOT NULL GROUP BY user_id, account_id HAVING COUNT(*) > 1 ORDER BY cnt DESC;
