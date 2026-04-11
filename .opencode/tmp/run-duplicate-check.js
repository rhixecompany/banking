#!/usr/bin/env node
const { Client } = require("pg");

(async () => {
  const url =
    "postgresql://neondb_owner:npg_f3MZAHjDJ0lz@ep-weathered-hall-amij2m6x-pooler.c-5.us-east-1.aws.neon.tech:5432/banking?sslmode=full&channel_binding=full";
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });
  try {
    await client.connect();
    const res = await client.query(
      `SELECT user_id, account_id, COUNT(*) AS cnt FROM wallets WHERE account_id IS NOT NULL GROUP BY user_id, account_id HAVING COUNT(*) > 1 ORDER BY cnt DESC;`,
    );
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (e) {
    console.error("QUERY_ERROR", e && e.message ? e.message : e);
    process.exitCode = 2;
  } finally {
    await client.end();
  }
})();
