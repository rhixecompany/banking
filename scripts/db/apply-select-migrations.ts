#!/usr/bin/env tsx
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

dotenv.config({ path: join(process.cwd(), ".env.local"), override: true });
dotenv.config();

const files = [
  "0002_add_plaid_items.sql",
  "0003_add_wallets_plaid_item_id.sql",
  "0004_fk_policy_adjustments.sql",
];

async function run() {
  const dir = join(process.cwd(), "database", "drizzle");
  const connectionString =
    process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    console.error("DATABASE_URL / NEON_DATABASE_URL is not set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    for (const file of files) {
      const path = join(dir, file);
      console.log(`\n=== Applying ${file} ===`);
      const sql = readFileSync(path, "utf8");
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("COMMIT");
        console.log(`Applied ${file}`);
      } catch (err) {
        await client.query("ROLLBACK");
        // err is unknown - stringify safely for diagnostics
        console.error(
          `Failed to apply ${file}:`,
          err instanceof Error ? err.message : String(err),
        );
        client.release();
        throw err;
      }
      client.release();
    }
    console.log("Selected migrations applied.");
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
