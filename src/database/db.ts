import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/lib/env";

import * as schema from "./schema";

/**
 * Parse connection string into individual parameters for Node.js 24+ compatibility.
 * The pg library has issues parsing URLs with Node.js 24's stricter URL parsing.
 */
const getDbConfig = (): string | undefined => {
  // Prefer the centralized app-config/database helper; fall back to legacy NEON env var.
  const envUrl = env.DATABASE_URL ?? process.env["NEON_DATABASE_URL"];

  if (!envUrl) {
    // During build-time (Next.js static generation) a DATABASE_URL may not be present.
    // Avoid throwing here so the build can continue. Any runtime DB usage will fail
    // later if the URL is truly missing. Log a warning to aid diagnostics.
    // eslint-disable-next-line no-console
    console.warn(
      "DATABASE_URL or NEON_DATABASE_URL not set. Database will not be connected. This is OK for build-time in many environments.",
    );
    return undefined;
  }

  return envUrl;
};

/**
 * Database connection pool configured for Next.js and Neon PostgreSQL.
 */
const dbUrl = getDbConfig();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const pool = dbUrl ? new Pool({ connectionString: dbUrl }) : new Pool();

/**
 * Drizzle ORM instance with the configured pool.
 */
export const db = drizzle(pool, {
  schema,
});
