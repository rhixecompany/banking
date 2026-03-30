import type { Config } from "drizzle-kit";

import * as dotenv from "dotenv";
import { defineConfig } from "drizzle-kit";
import path from "node:path";

// Load .env files for local dev/migration runs. Non-destructive.
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config();

// Resolve DB URL with multiple fallbacks and helpful error message
const resolveDatabaseUrl = (): string => {
  const envUrl =
    process.env["DATABASE_URL"] ?? process.env["NEON_DATABASE_URL"];

  if (!envUrl) {
    throw new Error(
      "DATABASE_URL or NEON_DATABASE_URL must be defined in environment variables (set in .env or environment).",
    );
  }

  return envUrl;
};

// Drizzle config with connection pooling hints for production
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
  verbose:
    process.env["VERBOSE_DRIZZLE"] === "true" ||
    process.env.NODE_ENV !== "production",
} as Config;

export default defineConfig(cfg);
