import "dotenv/config";
import { sql } from "drizzle-orm";

import { db } from "@/database/db";

import { seedAll } from "./seed-data";

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

function hasResetFlag(): boolean {
  return process.argv.includes("--reset");
}

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
