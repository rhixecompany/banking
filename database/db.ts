import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Description placeholder
 *
 * @type {*}
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/**
 * Description placeholder
 *
 * @type {*}
 */
export const db = drizzle(pool);
