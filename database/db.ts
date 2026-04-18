import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/lib/env";

import * as schema from "./schema";

/**
 * Parse connection string into individual parameters for Node.js 24+ compatibility.
 * The pg library has issues parsing URLs with Node.js 24's stricter URL parsing.
 */
const getDbConfig = (): string => {
  // Prefer the centralized app-config/database helper; fall back to legacy NEON env var.
  const envUrl = env.DATABASE_URL ?? process.env["NEON_DATABASE_URL"];

  if (!envUrl) {
    throw new Error(
      "DATABASE_URL or NEON_DATABASE_URL must be defined in environment variables (set in .env or environment).",
    );
  }

  return envUrl;
};

/**
 * Database connection pool configured for Next.js and Neon PostgreSQL.
 */

const pool = new Pool({
  connectionString: getDbConfig(),
});

/**
 * Drizzle ORM instance with the configured pool.
 */
export const db = drizzle(pool, {
  schema,
});
