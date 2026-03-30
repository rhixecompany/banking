/**
 * Seed runner that loads environment variables before importing app modules.
 * Must be run with tsx to support ESM imports.
 */
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load environment variables BEFORE importing app modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(__dirname, "../../.env.local") });

// Now import app modules after env is loaded
const { sql } = await import("drizzle-orm");
const { db } = await import("@/database/db");
const { seedAll } = await import("./seed-data");

/**
 * Development database seeder. Requires DATABASE_URL and the same env as the app
 * (e.g. ENCRYPTION_KEY, NEXTAUTH_SECRET). In production, set ALLOW_DB_SEED=true to run.
 *
 * Usage:
 *   npm run db:seed
 *   npm run db:seed -- --reset
 */

function assertSeedAllowed(): void {
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_DB_SEED !== "true"
  ) {
    throw new Error(
      "Refusing to seed: set ALLOW_DB_SEED=true to run against production NODE_ENV.",
    );
  }
}

/**
 * Description placeholder
 *
 * @returns {boolean}
 */
function hasResetFlag(): boolean {
  return process.argv.includes("--reset");
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function truncateAllTables(): Promise<void> {
  await db.execute(
    sql.raw(`
      TRUNCATE TABLE
        errors,
        recipients,
        transactions,
        banks,
        user_profiles,
        authenticator,
        "session",
        account,
        "verificationToken",
        users
      RESTART IDENTITY CASCADE;
    `),
  );
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  assertSeedAllowed();

  if (hasResetFlag()) {
    console.info("Truncating all application tables...");
    await truncateAllTables();
  }

  console.info("Seeding database...");
  await seedAll();
  console.info("Seed completed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
