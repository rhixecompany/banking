import { config as loadEnv } from "dotenv";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  getDatabaseUrl,
  isDatabaseReachable,
  isDatabaseSeeded,
} from "./helpers/db";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Seed user email used for authentication in E2E tests.
 */
const SEED_USER_EMAIL = "seed-user@example.com";

/**
 * Ensures schema + seed data exist before E2E tests run.
 * Enable with PLAYWRIGHT_PREPARE_DB=true (set by npm script test:ui).
 *
 * Loads `.env` / `.env.local` from the project root. CI may set DATABASE_URL via the environment instead.
 *
 * @export
 * @async
 * @returns {Promise<void>}
 */
export default async function globalSetup(): Promise<void> {
  if (process.env.PLAYWRIGHT_PREPARE_DB !== "true") {
    return;
  }

  const root = path.resolve(__dirname, "../..");
  loadEnv({ path: path.join(root, ".env") });
  loadEnv({ path: path.join(root, ".env.local") });

  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    console.error(
      "[playwright] DATABASE_URL is not set. E2E tests require a database connection.\n" +
        "Please set DATABASE_URL in .env.local or as an environment variable.\n" +
        "See tests/e2e/README.md for setup instructions.",
    );
    throw new Error(
      "DATABASE_URL environment variable is required for E2E tests",
    );
  }

  console.info("[playwright] Checking database connectivity...");

  // Check if database is reachable
  const reachable = await isDatabaseReachable(databaseUrl);
  if (!reachable) {
    console.error(
      `[playwright] Cannot connect to database at ${databaseUrl}.\n` +
        "Please ensure:\n" +
        "  1. PostgreSQL server is running\n" +
        "  2. The connection URL is correct\n" +
        "  3. Network/firewall allows connection\n" +
        "See tests/e2e/README.md for setup instructions.",
    );
    throw new Error(
      `Database connection failed: ${databaseUrl}. E2E tests require a reachable database.`,
    );
  }

  console.info("[playwright] Database is reachable. Checking seed data...");

  // Check if already seeded
  const seeded = await isDatabaseSeeded(databaseUrl, SEED_USER_EMAIL);
  if (seeded) {
    console.info("[playwright] Database already seeded with test data.");
    return;
  }

  console.info("[playwright] Running db:push && db:seed --reset ...");

  try {
    execSync("npm run db:push", { env: process.env, stdio: "inherit" });
    execSync("npm run db:seed -- --reset", {
      env: process.env,
      stdio: "inherit",
    });
    console.info(
      "[playwright] Database schema pushed and seeded successfully.",
    );
  } catch (error) {
    console.error(
      "[playwright] Database setup failed (db:push / db:seed).\n" +
        "Authenticated tests will fail until the database is properly seeded.\n" +
        "See tests/e2e/README.md for troubleshooting.",
      error,
    );
    throw error;
  }
}
