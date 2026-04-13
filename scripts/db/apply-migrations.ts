#!/usr/bin/env tsx
import dotenv from "dotenv";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

// Load .env.local if present, then fallback to .env
const localEnv = join(process.cwd(), ".env.local");
dotenv.config({ path: localEnv, override: true });
dotenv.config();

async function run() {
  const dir = join(process.cwd(), "database", "drizzle");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

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
      // Execute in a transaction
      const client = await pool.connect();
      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("COMMIT");
        console.log(`Applied ${file}`);
      } catch (err) {
        await client.query("ROLLBACK");
        console.error(`Failed to apply ${file}:`, err);
        client.release();
        throw err;
      }
      client.release();
    }
    console.log("All migrations applied.");
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
