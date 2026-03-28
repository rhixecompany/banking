import { z } from "zod";

/**
 * Environment variable schema validation
 * Runs at app startup to catch missing/invalid config early
 */
const envSchema = z.object({
  // Required in all environments
  ENCRYPTION_KEY: z.string().min(1, "ENCRYPTION_KEY is required"),
  NEXTAUTH_SECRET: z.string().min(1, "NEXTAUTH_SECRET is required"),
  DATABASE_URL: z.string().optional(),

  // Optional with defaults
  NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
  PORT: z.coerce.number().default(3000),
  HOSTNAME: z.string().default("0.0.0.0"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  REDIS_URL: z.string().url().optional(),

  // OAuth providers (optional)
  AUTH_GITHUB_ID: z.string().optional(),
  AUTH_GITHUB_SECRET: z.string().optional(),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),

  // Plaid (optional)
  PLAID_CLIENT_ID: z.string().optional(),
  PLAID_SECRET: z.string().optional(),
  PLAID_ENV: z.string().optional(),

  // Dwolla (optional)
  DWOLLA_KEY: z.string().optional(),
  DWOLLA_SECRET: z.string().optional(),
  DWOLLA_ENV: z.string().optional(),

  // Email/SMTP (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
});

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
      );
    }
    throw error;
  }
}

// Create a singleton instance for easy importing
export const env = getEnv();

// Validate on module load in production
if (process.env.NODE_ENV === "production") {
  getEnv();
}
