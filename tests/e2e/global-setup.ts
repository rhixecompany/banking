import { config as loadEnv } from "dotenv";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  cleanupTestData,
  getDatabaseUrl,
  isDatabaseReachable,
  isDatabaseSeeded,
} from "./helpers/db";

/**
 * Description placeholder
 *
 * @type {*}
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Seed user email used for authentication in E2E tests.
 */
const SEED_USER_EMAIL = "seed-user@example.com";

/**
 * Base URL for the dev server - will be resolved at runtime via lib/env with fallback
 */
let BASE_URL = "http://localhost:3000";

/**
 * Timeout configurations
 */
const TIMEOUTS = {
  DATABASE_CONNECTION: 10_000,
  SEED_CHECK_DELAY: 2000,
  SEED_CHECK_RETRIES: 3,
  WARMUP_REQUEST: 120_000,
} as const;

/**
 * Print a section header for better log readability
 *
 * @param {string} title
 * @returns {void}
 */
function printSection(title: string): void {
  console.info("");
  console.info("═══════════════════════════════════════════════════");
  console.info(`  ${title}`);
  console.info("═══════════════════════════════════════════════════");
}

/**
 * Print a step progress indicator
 *
 * @param {number} step
 * @param {number} total
 * @param {string} description
 * @returns {void}
 */
function printStep(step: number, total: number, description: string): void {
  console.info(`  [${step}/${total}] ${description}`);
}

/**
 * Measure and log execution time
 *
 * @param {() => Promise<void>} fn
 * @param {string} label
 * @returns {Promise<void>}
 */
async function measureTime<T>(fn: () => Promise<T>, label: string): Promise<T> {
  const start = Date.now();
  const result = await fn();
  const elapsed = Date.now() - start;
  console.info(`    ✓ ${label} (${elapsed}ms)`);
  return result;
}

/**
 * Retry a function multiple times with delay
 *
 * @param {() => Promise<T>} fn
 * @param {number} retries
 * @param {number} delay
 * @param {string} label
 * @returns {Promise<T>}
 */
async function retry<T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number,
  label: string,
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.info(`    Attempt ${attempt}/${retries} failed for ${label}`);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Warm up the dev server by making a request to trigger compilation
 * This avoids the 20+ second cold start on first request during tests
 *
 * @async
 * @returns {Promise<boolean>} True if warm-up succeeded, false otherwise
 */
async function warmUpDevServer(): Promise<boolean> {
  console.info("    Attempting to warm up dev server...");

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      TIMEOUTS.WARMUP_REQUEST,
    );

    const response = await fetch(BASE_URL, {
      method: "GET",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (
      response.ok ||
      response.status === 404 ||
      response.status === 301 ||
      response.status === 302
    ) {
      console.info("    ✓ Dev server warm-up complete");
      return true;
    }

    console.warn(`    ⚠ Dev server responded with status: ${response.status}`);
    return false;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("abort")) {
      console.warn(
        "    ⚠ Dev server warm-up timed out (this is OK - server may still be starting)",
      );
    } else {
      console.warn(`    ⚠ Dev server warm-up failed: ${message}`);
    }

    return false;
  }
}

/**
 * Load environment variables with error handling
 *
 * @param {string} root
 * @returns {void}
 */
function loadEnvironmentVariables(root: string): void {
  const envFiles = [
    { name: ".env", path: path.join(root, ".env") },
    { name: ".env.local", path: path.join(root, ".env.local") },
    { name: ".env.test", path: path.join(root, ".env.test") },
  ];

  for (const envFile of envFiles) {
    try {
      loadEnv({ path: envFile.path });
      console.info(`    ✓ ${envFile.name} loaded`);
    } catch {
      console.info(`    - ${envFile.name} not found (this is OK)`);
    }
  }
}

/**
 * Validate database URL is configured
 *
 * @returns {string}
 */
function validateDatabaseUrl(): string {
  const databaseUrl = getDatabaseUrl();

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. E2E tests require a database connection.\n" +
        "Please set DATABASE_URL in .env.local or as an environment variable.\n" +
        "See tests/e2e/README.md for setup instructions.",
    );
  }

  return databaseUrl;
}

/**
 * Check database connectivity with timeout and retries
 *
 * @param {string} databaseUrl
 * @returns {Promise<boolean>}
 */
async function checkDatabaseConnection(databaseUrl: string): Promise<boolean> {
  console.info("    Checking database connectivity (with timeout)...");

  return await retry(
    async () => {
      return await isDatabaseReachable(databaseUrl);
    },
    TIMEOUTS.SEED_CHECK_RETRIES,
    TIMEOUTS.SEED_CHECK_DELAY,
    "database connection",
  );
}

/**
 * Check if database is seeded, seed if not
 *
 * @param {string} databaseUrl
 * @returns {Promise<void>}
 */
async function ensureSeededData(databaseUrl: string): Promise<void> {
  console.info("    Checking if database is seeded...");

  const isSeeded = await retry(
    async () => {
      return await isDatabaseSeeded(databaseUrl, SEED_USER_EMAIL);
    },
    TIMEOUTS.SEED_CHECK_RETRIES,
    TIMEOUTS.SEED_CHECK_DELAY,
    "seed data check",
  );

  if (isSeeded) {
    console.info("    ✓ Database already seeded with test data");
    return;
  }

  console.info("    ⚠ Database not seeded, cleaning up old data...");

  // Clean up any leftover test data before reseeding
  await cleanupTestData(databaseUrl, SEED_USER_EMAIL);

  console.info("    Running db:push && db:seed or seed runner script...");

  try {
    // Prefer the seed runner script which is idempotent and faster in local dev
    // It internally calls drizzle seed or performs inserts directly.
    const seedRunner = path.join(
      __dirname,
      "..",
      "..",
      "scripts",
      "seed",
      "run.ts",
    );

    // Attempt to import and run the TypeScript seed runner for better local
    // diagnostics. If import fails (CI), fall back to running the npm scripts.
    try {
      const imported = await import(seedRunner);
      const runner = imported?.run ?? imported?.default ?? imported;
      if (typeof runner === "function") {
        await runner();
      } else {
        execSync("npm run db:push", { env: process.env, stdio: "inherit" });
        execSync("npm run db:seed -- --reset", {
          env: process.env,
          stdio: "inherit",
        });
      }
    } catch {
      // Import failed - fallback to npm scripts which are CI-friendly
      execSync("npm run db:push", { env: process.env, stdio: "inherit" });
      execSync("npm run db:seed -- --reset", {
        env: process.env,
        stdio: "inherit",
      });
    }

    console.info("    ✓ Database schema pushed and seeded successfully");
  } catch (error) {
    throw new Error(
      "Database setup failed (db:push / db:seed / seed runner).\n" +
        "Authenticated tests will fail until the database is properly seeded.\n" +
        "See tests/e2e/README.md for troubleshooting.",
      { cause: error },
    );
  }
}

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
  printSection("PLAYWRIGHT E2E GLOBAL SETUP");

  // Resolve runtime environment flags via lib/env when available, fall back to process.env
  try {
    // Dynamic import avoids module load-order and validation side-effects
    // that may run before app-config validation.

    const { env } = (await import("@/lib/env")) as any;
    if (env.PLAYWRIGHT_BASE_URL) BASE_URL = env.PLAYWRIGHT_BASE_URL as string;
    const prepare = env.PLAYWRIGHT_PREPARE_DB as string | undefined;
    if (prepare !== "true") {
      console.info("  SKIP: PLAYWRIGHT_PREPARE_DB is not set to 'true'");
      console.info(
        "  Run tests with: PLAYWRIGHT_PREPARE_DB=true npx playwright test",
      );
      printSection("SETUP COMPLETE (SKIPPED)");
      return;
    }
  } catch {
    // Fallback to direct process.env for CI or simple local runs

    if (process.env.PLAYWRIGHT_PREPARE_DB !== "true") {
      console.info("  SKIP: PLAYWRIGHT_PREPARE_DB is not set to 'true'");
      console.info(
        "  Run tests with: PLAYWRIGHT_PREPARE_DB=true npx playwright test",
      );
      printSection("SETUP COMPLETE (SKIPPED)");
      return;
    }

    BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? BASE_URL;
  }

  // Step 1: Load environment variables
  printStep(1, 5, "Loading environment variables");
  const root = path.resolve(__dirname, "../..");
  await measureTime(async () => {
    loadEnvironmentVariables(root);
  }, "Environment variables loaded");

  // Step 2: Validate database URL
  printStep(2, 5, "Validating database configuration");
  const databaseUrl = await measureTime(async () => {
    return validateDatabaseUrl();
  }, "Database URL validated");

  // Step 3: Check database connectivity
  printStep(3, 5, "Checking database connectivity");
  const isConnected = await measureTime(async () => {
    return await checkDatabaseConnection(databaseUrl);
  }, "Database connection verified");

  if (!isConnected) {
    throw new Error(
      `Cannot connect to database at ${databaseUrl}.\n` +
        "Please ensure:\n" +
        "  1. PostgreSQL server is running\n" +
        "  2. The connection URL is correct\n" +
        "  3. Network/firewall allows connection\n" +
        "See tests/e2e/README.md for setup instructions.",
    );
  }

  // Step 4: Ensure seeded data
  printStep(4, 5, "Ensuring seed data");
  await measureTime(async () => {
    await ensureSeededData(databaseUrl);
  }, "Seed data ready");

  // Step 5: Warm up dev server
  printStep(5, 5, "Warming up dev server");
  await measureTime(async () => {
    await warmUpDevServer();
  }, "Dev server warm-up attempted");

  printSection("SETUP COMPLETE - READY TO RUN TESTS");
}
