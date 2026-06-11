/**
 * Helper to resolve a database connection string for scripts.
 * Prefer validated config via lib/env, but fall back to process.env for
 * ad-hoc local runs. Centralizing this logic keeps eslint disables in one place.
 */
import type { Environment } from "@/lib/env";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @returns {Promise<string>}
 */
export async function getConnectionString(): Promise<string> {
  try {
    // Dynamic import avoids app-config validation side-effects at module load time
    const imported = (await import("@/lib/env")) as { env: Environment };
    const env = imported.env as Partial<Environment> & Record<string, unknown>;
    const conn =
      (env.DATABASE_URL as string | undefined) ??
      // Some environments expose NEON_DATABASE_URL as an alternate name
      (process.env.NEON_DATABASE_URL as string | undefined);
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
