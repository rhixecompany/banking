import type { Config } from "drizzle-kit";

import { defineConfig } from "drizzle-kit";

import { getDatabaseUrl } from "./app-config";
import { env } from "./lib/env";

// Resolve DB URL with multiple fallbacks and helpful error message
/**
 * Description placeholder
 *
 * @returns {string}
 */
const resolveDatabaseUrl = (): string => {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error(
      "DATABASE_URL or NEON_DATABASE_URL must be defined in app-config or environment.",
    );
  }
  return url;
};

// Drizzle config with connection pooling hints for production
/**
 * Description placeholder
 *
 * @type {Config}
 */
const cfg: Config = {
  dbCredentials: {
    // Optional: additional connection info supported by some drivers
    pool: { max: 20, min: 2 }, // Drizzle will use underlying driver's pooling
    url: resolveDatabaseUrl(),
  },
  dialect: "postgresql",
  out: "database/drizzle",
  schema: "database/schema.ts",
  strict: true,
  // Verbose migration output for CI and local runs
  verbose: env.VERBOSE_DRIZZLE === "true" || env.NODE_ENV !== "production",
} as Config;

export default defineConfig(cfg);
