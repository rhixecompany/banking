/**
 * Banking Application Configuration
 *
 * Centralized configuration management for all environment variables.
 * Provides typed access to environment configuration organized by category.
 *
 * @module app-config
 * @version 1.0.0
 */

import { z } from "zod";

// ============================================================
// SCHEMA DEFINITIONS
// ============================================================

/**
 * Database configuration schema
 */
const databaseSchema = z.object({
  DATABASE_URL: z
    .string()
    .trim()
    .url()
    .optional()
    .meta({ description: "PostgreSQL connection string" }),
});

/**
 * Authentication configuration schema
 */
const authSchema = z.object({
  AUTH_GITHUB_ID: z
    .string()
    .trim()
    .optional()
    .meta({ description: "GitHub OAuth client ID" }),
  AUTH_GITHUB_SECRET: z
    .string()
    .trim()
    .optional()
    .meta({ description: "GitHub OAuth client secret" }),
  AUTH_GOOGLE_ID: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Google OAuth client ID" }),
  AUTH_GOOGLE_SECRET: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Google OAuth client secret" }),
  NEXTAUTH_SECRET: z
    .string()
    .trim()
    .min(1)
    .optional()
    .meta({ description: "NextAuth session secret" }),
  NEXTAUTH_URL: z
    .string()
    .trim()
    .url()
    .optional()
    .meta({ description: "NextAuth URL" }),
});

/**
 * Encryption configuration schema
 */
const encryptionSchema = z.object({
  ENCRYPTION_KEY: z
    .string()
    .trim()
    .min(1)
    .optional()
    .meta({ description: "AES-256-GCM encryption key" }),
});

/**
 * Plaid integration configuration schema
 */
const plaidSchema = z.object({
  PLAID_BASE_URL: z
    .string()
    .trim()
    .url()
    .optional()
    .meta({ description: "Plaid API base URL" }),
  PLAID_CLIENT_ID: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Plaid client ID" }),
  PLAID_ENV: z
    .enum(["sandbox", "development", "production"])
    .default("sandbox")
    .meta({ description: "Plaid environment" }),
  PLAID_SECRET: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Plaid secret key" }),
});

/**
 * Dwolla integration configuration schema
 */
const dwollaSchema = z.object({
  DWOLLA_BASE_URL: z
    .string()
    .trim()
    .url()
    .optional()
    .meta({ description: "Dwolla API base URL" }),
  DWOLLA_ENV: z
    .enum(["sandbox", "production"])
    .default("sandbox")
    .meta({ description: "Dwolla environment" }),
  DWOLLA_KEY: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Dwolla API key" }),
  DWOLLA_SECRET: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Dwolla API secret" }),
});

/**
 * Redis integration configuration schema
 */
const redisSchema = z.object({
  REDIS_URL: z
    .string()
    .trim()
    .url()
    .optional()
    .meta({ description: "Upstash Redis connection URL" }),
});

/**
 * Email configuration schema
 */
const emailSchema = z.object({
  EMAIL_FROM: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Fallback email from address" }),
  SMTP_FROM: z
    .string()
    .trim()
    .optional()
    .meta({ description: "SMTP from address" }),
  SMTP_HOST: z
    .string()
    .trim()
    .optional()
    .meta({ description: "SMTP server host" }),
  SMTP_PASS: z
    .string()
    .trim()
    .optional()
    .meta({ description: "SMTP password" }),
  SMTP_PORT: z
    .string()
    .trim()
    .optional()
    .meta({ description: "SMTP server port" }),
  SMTP_USER: z
    .string()
    .trim()
    .optional()
    .meta({ description: "SMTP username" }),
});

// ============================================================
// TYPE EXPORTS
// ============================================================

/**
 * Database configuration type
 */
export type DatabaseConfig = z.infer<typeof databaseSchema>;

/**
 * Authentication configuration type
 */
export type AuthConfig = z.infer<typeof authSchema>;

/**
 * Encryption configuration type
 */
export type EncryptionConfig = z.infer<typeof encryptionSchema>;

/**
 * Plaid integration configuration type
 */
export type PlaidConfig = z.infer<typeof plaidSchema>;

/**
 * Dwolla integration configuration type
 */
export type DwollaConfig = z.infer<typeof dwollaSchema>;

/**
 * Redis integration configuration type
 */
export type RedisConfig = z.infer<typeof redisSchema>;

/**
 * Email configuration type
 */
export type EmailConfig = z.infer<typeof emailSchema>;

/**
 * Complete application configuration type
 */
export interface AppConfig {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {AuthConfig}
   */
  auth: AuthConfig;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {DatabaseConfig}
   */
  database: DatabaseConfig;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {EmailConfig}
   */
  email: EmailConfig;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {EncryptionConfig}
   */
  encryption: EncryptionConfig;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {{
   *     dwolla: DwollaConfig;
   *     plaid: PlaidConfig;
   *     redis: RedisConfig;
   *   }}
   */
  integrations: {
    dwolla: DwollaConfig;
    plaid: PlaidConfig;
    redis: RedisConfig;
  };
}

// ============================================================
// PARSING FUNCTIONS
// ============================================================

/**
 * Parse and validate database configuration
 */
function parseDatabaseConfig(): DatabaseConfig {
  const result = databaseSchema.safeParse({
    DATABASE_URL: process.env.DATABASE_URL,
  });
  if (!result.success) {
    throw new Error(
      `Database config validation failed: ${result.error.message}`,
    );
  }
  return result.data;
}

/**
 * Parse and validate authentication configuration
 */
function parseAuthConfig(): AuthConfig {
  const result = authSchema.safeParse({
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  });
  if (!result.success) {
    throw new Error(`Auth config validation failed: ${result.error.message}`);
  }
  return result.data;
}

/**
 * Parse and validate encryption configuration
 */
function parseEncryptionConfig(): EncryptionConfig {
  const result = encryptionSchema.safeParse({
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  });
  if (!result.success) {
    throw new Error(
      `Encryption config validation failed: ${result.error.message}`,
    );
  }
  return result.data;
}

/**
 * Parse and validate Plaid configuration
 */
function parsePlaidConfig(): PlaidConfig {
  const result = plaidSchema.safeParse({
    PLAID_BASE_URL: process.env.PLAID_BASE_URL,
    PLAID_CLIENT_ID: process.env.PLAID_CLIENT_ID,
    PLAID_ENV: process.env.PLAID_ENV,
    PLAID_SECRET: process.env.PLAID_SECRET,
  });
  if (!result.success) {
    throw new Error(`Plaid config validation failed: ${result.error.message}`);
  }
  return result.data;
}

/**
 * Parse and validate Dwolla configuration
 */
function parseDwollaConfig(): DwollaConfig {
  const result = dwollaSchema.safeParse({
    DWOLLA_BASE_URL: process.env.DWOLLA_BASE_URL,
    DWOLLA_ENV: process.env.DWOLLA_ENV,
    DWOLLA_KEY: process.env.DWOLLA_KEY,
    DWOLLA_SECRET: process.env.DWOLLA_SECRET,
  });
  if (!result.success) {
    throw new Error(`Dwolla config validation failed: ${result.error.message}`);
  }
  return result.data;
}

/**
 * Parse and validate Redis configuration
 */
function parseRedisConfig(): RedisConfig {
  const result = redisSchema.safeParse({
    REDIS_URL: process.env.REDIS_URL,
  });
  if (!result.success) {
    throw new Error(`Redis config validation failed: ${result.error.message}`);
  }
  return result.data;
}

/**
 * Parse and validate email configuration
 */
function parseEmailConfig(): EmailConfig {
  const result = emailSchema.safeParse({
    EMAIL_FROM: process.env.EMAIL_FROM,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
  });
  if (!result.success) {
    throw new Error(`Email config validation failed: ${result.error.message}`);
  }
  return result.data;
}

// ============================================================
// CONFIGURATION EXPORTS
// ============================================================

/**
 * Database configuration singleton
 */
export const database = parseDatabaseConfig();

/**
 * Authentication configuration singleton
 */
export const auth = parseAuthConfig();

/**
 * Encryption configuration singleton
 */
export const encryption = parseEncryptionConfig();

/**
 * Plaid integration configuration singleton
 */
export const plaid = parsePlaidConfig();

/**
 * Dwolla integration configuration singleton
 */
export const dwolla = parseDwollaConfig();

/**
 * Redis integration configuration singleton
 */
export const redis = parseRedisConfig();

/**
 * Email configuration singleton
 */
export const email = parseEmailConfig();

/**
 * Integrations configuration (grouped)
 */
export const integrations = {
  dwolla,
  plaid,
  redis,
} as const;

/**
 * Complete application configuration
 *
 * Provides a single access point for all environment configuration
 * organized by category for better developer experience.
 */
export const appConfig: AppConfig = {
  auth,
  database,
  email,
  encryption,
  integrations,
} as const;

// ============================================================
// CONVENIENCE EXPORTS
// ============================================================

/**
 * Check if a feature is configured
 */
export function isFeatureEnabled(feature: keyof AppConfig): boolean {
  const config = appConfig[feature];
  if (!config || typeof config !== "object") return false;
  return Object.values(config).some(
    (value) => value !== undefined && value !== null,
  );
}

/**
 * Get database URL with fallback
 */
export function getDatabaseUrl(): string | undefined {
  return database.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
}

/**
 * Check if Plaid is configured
 */
export function isPlaidConfigured(): boolean {
  return !!(plaid.PLAID_CLIENT_ID && plaid.PLAID_SECRET);
}

/**
 * Check if Dwolla is configured
 */
export function isDwollaConfigured(): boolean {
  return !!(dwolla.DWOLLA_KEY && dwolla.DWOLLA_SECRET);
}

/**
 * Check if Redis is configured
 */
export function isRedisConfigured(): boolean {
  return !!redis.REDIS_URL;
}

/**
 * Check if email is configured
 */
export function isEmailConfigured(): boolean {
  return !!(email.SMTP_HOST && email.SMTP_USER && email.SMTP_PASS);
}

// ============================================================
// VALIDATION HELPERS
// ============================================================

/**
 * Validate all required configuration at startup
 * Throws if any critical configuration is missing
 */
export function validateRequiredConfig(): void {
  const errors: string[] = [];

  if (!encryption.ENCRYPTION_KEY) {
    errors.push("ENCRYPTION_KEY is required for security");
  }

  if (!auth.NEXTAUTH_SECRET) {
    errors.push("NEXTAUTH_SECRET is required for authentication");
  }

  if (errors.length > 0) {
    throw new Error(
      `Configuration validation failed:\n${errors.join("\n")}\n\nPlease set the required environment variables.`,
    );
  }
}

/**
 * Get configuration summary for debugging
 * Note: Only logs non-sensitive information
 */
export function getConfigSummary(): Record<string, unknown> {
  return {
    auth: {
      hasGithubOAuth: !!(auth.AUTH_GITHUB_ID && auth.AUTH_GITHUB_SECRET),
      hasGoogleOAuth: !!(auth.AUTH_GOOGLE_ID && auth.AUTH_GOOGLE_SECRET),
    },
    database: {
      hasUrl: !!database.DATABASE_URL,
    },
    email: {
      isConfigured: isEmailConfigured(),
    },
    encryption: {
      isConfigured: !!encryption.ENCRYPTION_KEY,
    },
    integrations: {
      dwolla: {
        env: dwolla.DWOLLA_ENV,
        isConfigured: isDwollaConfigured(),
      },
      plaid: {
        env: plaid.PLAID_ENV,
        isConfigured: isPlaidConfigured(),
      },
      redis: {
        isConfigured: isRedisConfigured(),
      },
    },
  };
}
