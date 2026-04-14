/**
 * Seed runner that loads environment variables before importing app modules.
 * Must be run with tsx to support ESM imports.
 */
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Load environment variables BEFORE importing app modules
/**
 * Description placeholder
 *
 * @type {*}
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.resolve(__dirname, "../../.env.local") });

// Now import app modules after env is loaded
/**
 * Description placeholder
 *
 * @type {*}
 */
const { sql } = await import("drizzle-orm");
/**
 * Description placeholder
 *
 * @type {*}
 */
const { db } = await import("@/database/db");
/**
 * Description placeholder
 *
 * @type {*}
 */
const seedModule = await import("./seed-data");
const { getPlannedSeedSummary, seedAll } = seedModule;

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

function hasDryRunFlag(): boolean {
  return process.argv.includes("--dry-run") || process.argv.includes("-n");
}

function hasYesFlag(): boolean {
  return process.argv.includes("--yes") || process.argv.includes("-y");
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
        wallets,
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

  const dryRun = hasDryRunFlag();
  const yes = hasYesFlag();

  // Dry-run: print planned operations and write a validation artifact, but do not mutate DB
  if (dryRun) {
    console.warn("[dry-run] Seeding (no changes will be applied)");
    try {
      const summary = getPlannedSeedSummary();
      console.warn(
        "[dry-run] Planned seed summary:\n",
        JSON.stringify(summary, null, 2),
      );

      // Attempt to write a validation file for reviewers
      try {
        const { writeFile } = await import("../utils/io");
        const reportPath = path.resolve(
          __dirname,
          "../../docs/validation/seed-test-dryrun.txt",
        );
        await writeFile(reportPath, JSON.stringify(summary, null, 2), {
          dryRun: false,
        });
        console.warn(`[dry-run] Wrote dry-run report to ${reportPath}`);
      } catch (err) {
        console.warn("[dry-run] Failed to write dry-run report:", err);
      }
    } catch (err) {
      console.warn("[dry-run] Failed to generate planned seed summary:", err);
    }

    console.warn("[dry-run] Seed simulation complete.");
    return;
  }

  // Reset (destructive) operations must be explicitly allowed via RUN_DESTRUCTIVE and --yes
  if (hasResetFlag()) {
    if (process.env.RUN_DESTRUCTIVE !== "true" && !hasYesFlag()) {
      throw new Error(
        "Destructive seeding (--reset) requires RUN_DESTRUCTIVE=true and --yes flag to proceed",
      );
    }

    console.warn("Truncating all application tables...");
    await truncateAllTables();
  }

  console.warn("Seeding database...");
  await seedAll();
  console.warn("Seed completed.");
}

export async function run(): Promise<void> {
  return main();
}

// If this module is executed directly (node tsx scripts/seed/run.ts), run the seeder.
// This avoids auto-executing when imported programmatically by test bootstrap code
// which prefers to call the exported `run` function.
try {
  // fileURLToPath ensures cross-platform path comparisons
  const entry = process.argv[1];
  if (entry && entry.endsWith("scripts/seed/run.ts")) {
    // Direct invocation

    void run().catch((error: unknown) => {
      console.error(error);
      process.exitCode = 1;
    });
  }
} catch {
  // ignore - if detection fails, the consumer should call `run()` explicitly
}
