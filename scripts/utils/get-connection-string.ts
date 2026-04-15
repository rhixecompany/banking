/**
 * Helper to resolve a database connection string for scripts.
 * Prefer validated config via lib/env, but fall back to process.env for
 * ad-hoc local runs. Centralizing this logic keeps eslint disables in one place.
 */
export async function getConnectionString(): Promise<string> {
  try {
    const { env } = await import("@/lib/env");
    const conn = (env as any).DATABASE_URL ?? (env as any).NEON_DATABASE_URL;
    if (conn) return conn as string;
  } catch {
    // lib/env may intentionally throw in some ad-hoc environments; fall back.
  }

  // Local fallback to process.env for one-off script runs.
  // eslint-disable-next-line n/no-process-env
  const fallback = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
  if (fallback) return fallback;

  throw new Error("DATABASE_URL / NEON_DATABASE_URL is not set");
}
