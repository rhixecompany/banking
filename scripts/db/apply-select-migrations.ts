#!/usr/bin/env tsx
import dotenv from "dotenv";
import { readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const localEnv = join(process.cwd(), ".env.local");
dotenv.config({ override: true, path: localEnv });
dotenv.config();

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{}}
 */
const files = [
  "0002_add_plaid_items.sql",
  "0003_add_wallets_plaid_item_id.sql",
  "0004_fk_policy_adjustments.sql",
];

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function run() {
  const dir = join(process.cwd(), "database", "drizzle");
  const { getConnectionString } =
    await import("../utils/get-connection-string");
  const connectionString = await getConnectionString();
  const pool = new Pool({ connectionString });

  try {
    for (const file of files) {
      const path = join(dir, file);
      console.warn(`\n=== Applying ${file} ===`);
      const sql = readFileSync(path, "utf8");
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("COMMIT");
        console.warn(`Applied ${file}`);
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
    console.warn("Selected migrations applied.");
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
