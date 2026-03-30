import { z } from "zod";

/**
 * Environment variable schema validation
 * Runs at app startup to catch missing/invalid config early
 */
const envSchema = z.object({
  // OAuth providers (optional)
  AUTH_GITHUB_ID: z.string().trim().optional(),
  AUTH_GITHUB_SECRET: z.string().trim().optional(),
  AUTH_GOOGLE_ID: z.string().trim().optional(),

  AUTH_GOOGLE_SECRET: z.string().trim().optional(),
  DATABASE_URL: z.string().trim().optional(),
  DWOLLA_BASE_URL: z.string().trim().url().optional(),
  DWOLLA_ENV: z.string().trim().optional(),
  // Dwolla (optional)
  DWOLLA_KEY: z.string().trim().optional(),
  DWOLLA_SECRET: z.string().trim().optional(),

  EMAIL_FROM: z.string().trim().optional(),
  // Required in all environments
  ENCRYPTION_KEY: z.string().trim().min(1, "ENCRYPTION_KEY is required"),
  HOSTNAME: z.string().trim().default("0.0.0.0"),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .trim()
    .url()
    .default("http://localhost:3000"),

  NEXTAUTH_SECRET: z.string().trim().min(1, "NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: z.string().trim().url().optional(),
  // Optional with defaults
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  // Plaid (optional)
  PLAID_BASE_URL: z.string().trim().url().optional(),
  PLAID_CLIENT_ID: z.string().trim().optional(),

  PLAID_ENV: z.string().trim().optional(),
  PLAID_SECRET: z.string().trim().optional(),
  PORT: z.coerce.number().default(3000),

  REDIS_URL: z.string().trim().url().optional(),
  SMTP_FROM: z.string().trim().optional(),
  // Email/SMTP (optional)
  SMTP_HOST: z.string().trim().optional(),
  SMTP_PASS: z.string().trim().optional(),
  SMTP_PORT: z.string().trim().optional(),
  SMTP_USER: z.string().trim().optional(),
});

/**
 * Description placeholder
 *
 * @export
 * @typedef {Environment}
 */
export type Environment = z.infer<typeof envSchema>;

/**
 * Validate and return typed environment variables
 * Throws at startup if validation fails
 */
export function getEnv(): Environment {
  try {
    const result = envSchema.parse(process.env);
    return result;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues;
      const missing = issues
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");
      throw new Error(
        `Environment validation failed:\n${missing}\n\nCheck your .env file or environment variables.`,
        { cause: error },
      );
    }
    throw error;
  }
}

// Create a singleton instance for easy importing
/**
 * Description placeholder
 *
 * @type {z.infer<any>}
 */
export const env = getEnv();

// Validate on module load in production
if (process.env.NODE_ENV === "production") {
  getEnv();
}
