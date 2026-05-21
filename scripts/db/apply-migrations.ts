#!/usr/bin/env tsx
import dotenv from "dotenv";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { Pool } from "pg";

const localEnv = join(process.cwd(), ".env.local");
dotenv.config({ override: true, path: localEnv });
dotenv.config();

function hasDryRunFlag(): boolean {
  return (
    process.argv.includes("--dry-run") ||
    process.argv.includes("-n") ||
    process.env.DRY_RUN === "true"
  );
}

async function run() {
  const dir = join(process.cwd(), "database", "drizzle");
  const dryRun = hasDryRunFlag();
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (dryRun) {
    console.warn("[dry-run] Migration run (no changes will be applied)");
    for (const file of files) {
      console.warn(`[dry-run] Would apply: ${file}`);
    }
    console.warn("[dry-run] Done.");
    return;
  }

  const { getConnectionString } =
    await import("../../bin/utils/get-connection-string");
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
        console.error(`Failed to apply ${file}:`, err);
        client.release();
        throw err;
      }
      client.release();
    }
    console.warn("All migrations applied.");
  } finally {
    await pool.end();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
