#!/usr/bin/env tsx
import dotenv from "dotenv";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

// Load .env.local if present, then fallback to .env
const localEnv = join(process.cwd(), ".env.local");
dotenv.config({ override: true, path: localEnv });
dotenv.config();

async function run() {
  const dir = join(process.cwd(), "database", "drizzle");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  // Resolve connection string via helper to centralize fallback logic.
  const { getConnectionString } =
    await import("../utils/get-connection-string");
  const connectionString = await getConnectionString();

  const pool = new Pool({ connectionString });

  try {
    for (const file of files) {
      const path = join(dir, file);
      console.warn(`\n=== Applying ${file} ===`);
      const sql = readFileSync(path, "utf8");
      // Execute in a transaction
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("COMMIT");
        // write progress to stderr via warn so CI captures it as non-standard output
        console.warn(`Applied ${file}`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`Failed to apply ${file}:`, err);
        client.release();
        throw err;
      }
      client.release();
    }
    // Keep stdout minimal; use warn for progress messages. Mirror prior behavior
    // by writing a final message to stderr via warn to avoid console.log lint rules.
    console.warn("All migrations applied.");
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
