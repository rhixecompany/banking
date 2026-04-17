/**
 * Environment Variable Validation
 *
 * Validates and provides typed access to environment variables.
 * Now powered by app-config.ts for centralized configuration management.
 *
 * @module lib/env
 */

import {
  auth,
  database,
  dwolla,
  email,
  encryption,
  plaid,
  redis,
  validateRequiredConfig,
} from "@/app-config";

/**
 * Re-export all configuration from app-config.ts
 * Maintains backward compatibility for existing imports
 *
 * @deprecated Use specific config imports from app-config.ts instead
 * @example
 * // Old way (still works)
 * import { env } from "@/lib/env";
 * env.PLAID_CLIENT_ID
 *
 * // New way (preferred)
 * import { plaid } from "@/app-config";
 * plaid.PLAID_CLIENT_ID
 */
export const env = {
  AUTH_GITHUB_ID: auth.AUTH_GITHUB_ID,
  AUTH_GITHUB_SECRET: auth.AUTH_GITHUB_SECRET,
  AUTH_GOOGLE_ID: auth.AUTH_GOOGLE_ID,
  AUTH_GOOGLE_SECRET: auth.AUTH_GOOGLE_SECRET,
  // CI flag from environment (common in CI providers)
  CI: process.env.CI ?? undefined,
  DATABASE_URL: database.DATABASE_URL,
  DWOLLA_BASE_URL: dwolla.DWOLLA_BASE_URL,
  DWOLLA_ENV: dwolla.DWOLLA_ENV,
  DWOLLA_KEY: dwolla.DWOLLA_KEY,
  DWOLLA_SECRET: dwolla.DWOLLA_SECRET,
  EMAIL_FROM: email.EMAIL_FROM,
  // Test / local runner variables used by scripts and tests
  ENABLE_TEST_ENDPOINTS: process.env.ENABLE_TEST_ENDPOINTS ?? undefined,
  ENCRYPTION_KEY: encryption.ENCRYPTION_KEY,
  // Public-facing URL for sitemaps and robots generation
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? undefined,
  NEXTAUTH_SECRET: auth.NEXTAUTH_SECRET,
  NEXTAUTH_URL: auth.NEXTAUTH_URL,
  NODE_ENV: process.env.NODE_ENV ?? undefined,
  NPM_PACKAGE_VERSION: process.env.npm_package_version ?? "0.0.0",
  PLAID_BASE_URL: plaid.PLAID_BASE_URL,
  PLAID_CLIENT_ID: plaid.PLAID_CLIENT_ID,
  PLAID_ENV: plaid.PLAID_ENV,
  PLAID_SECRET: plaid.PLAID_SECRET,
  PLAYWRIGHT_BASE_URL: process.env.PLAYWRIGHT_BASE_URL ?? undefined,
  PLAYWRIGHT_PREPARE_DB: process.env.PLAYWRIGHT_PREPARE_DB ?? undefined,
  REDIS_URL: redis.REDIS_URL,
  SMTP_FROM: email.SMTP_FROM,
  SMTP_HOST: email.SMTP_HOST,
  SMTP_PASS: email.SMTP_PASS,
  SMTP_PORT: email.SMTP_PORT,
  SMTP_USER: email.SMTP_USER,
  // Optional verbose flag used by some tooling
  VERBOSE_DRIZZLE: process.env.VERBOSE_DRIZZLE ?? undefined,
} as const;

/**
 * Environment type - derived from app-config
 */
export type Environment = typeof env;

/**
 * Validate and return typed environment variables
 * Throws at startup if validation fails
 *
 * @deprecated Use validateRequiredConfig() from app-config instead
 */
export function getEnv(): Environment {
  return env;
}

// Validate on module load in production
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {boolean}
 */
const isNextProductionBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build";

if (process.env.NODE_ENV === "production" && !isNextProductionBuildPhase) {
  try {
    validateRequiredConfig();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Environment validation failed:", error);
    throw error;
  }
}
