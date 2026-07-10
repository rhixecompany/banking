/**
 * Helper to resolve a database connection string for scripts.
 * Prefer validated config via lib/env, but fall back to process.env for
 * ad-hoc local runs. Centralizing this logic keeps eslint disables in one place.
 *
 * EDUCATIONAL NOTE: This module is a "resolver" - a small function whose only
 * job is to figure out WHERE the database lives. Keeping that logic in one
 * place means every script asks the same question the same way, instead of each
 * script re-inventing how to read configuration. That single source of truth is
 * a common pattern called "centralized configuration access".
 */
import type { Environment } from "@/lib/env";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @returns {Promise<string>}
 *
 * EDUCATIONAL NOTE: The JSDoc block above is metadata for documentation and
 * IDE tooling. The `@returns {Promise<string>}` tells the type checker this
 * function returns a Promise that resolves to a string - which is why we can
 * `await getConnectionString()` at the call site.
 */
export async function getConnectionString(): Promise<string> {
  // EDUCATIONAL NOTE: A `try/catch` boundary lets us attempt the "best"
  // strategy first and recover gracefully if it fails. We prefer reading the
  // validated config object over raw environment variables because validation
  // catches typos and missing values early - during config load, not later
  // when a query mysteriously fails.
  try {
    // Dynamic import avoids app-config validation side-effects at module load time
    // EDUCATIONAL NOTE: `await import(...)` (dynamic import) loads the module
    // at runtime, here and now, rather than at the top of the file (static
    // import). We do this on purpose so that merely importing THIS file does
    // not trigger lib/env's validation. That matters for one-off scripts that
    // don't want the full app bootstrap cost.
    const imported = (await import("@/lib/env")) as { env: Environment };
    // EDUCATIONAL NOTE: The `as { env: Environment }` is a TYPE ASSERTION. We
    // are telling TypeScript "trust me, the imported module has an `env`
    // property of this shape." Type assertions bypass some checks, so use them
    // only when you are certain about the runtime shape.
    const env = imported.env as Partial<Environment> & Record<string, unknown>;
    // EDUCATIONAL NOTE: We widen `env` to `Partial<Environment>` (every field
    // optional) plus an index signature `Record<string, unknown>`. The index
    // signature is what allows the bracket/dot access below for fields that may
    // or may not be present, while still narrowing them to `unknown`.
    const conn =
      (env.DATABASE_URL as string | undefined) ??
      // Some environments expose NEON_DATABASE_URL as an alternate name
      // EDUCATIONAL NOTE: `??` is the NULLISH COALESCING operator. It returns
      // the right side ONLY when the left side is `null` or `undefined` - not
      // when it is an empty string `""`. That distinction is important: an
      // empty connection string is still "a value" and would NOT be replaced.
      (process.env.NEON_DATABASE_URL as string | undefined);
    // EDUCATIONAL NOTE: If either source produced a truthy (non-empty) string,
    // we return it immediately. Returning inside `try` skips the rest of the
    // function, which is exactly what we want - we found our answer.
    if (conn) return conn as string;
  } catch {
    // lib/env may intentionally throw in some ad-hoc environments; fall back.
    // EDUCATIONAL NOTE: An empty `catch {}` (no binding) is valid modern JS/TS.
    // We swallow the error deliberately: if config loading throws, we simply
    // move on to the fallback path below. Catching WITHOUT rethrowing is a
    // deliberate "degrade gracefully" choice, not an accident.
  }

  // Local fallback to process.env for one-off script runs.
  // EDUCATIONAL NOTE: The `eslint-disable-next-line n/no-process-env` line just
  // below is an ESLINT DIRECTIVE, not a normal comment. It tells the linter
  // "ignore the rule that forbids reading process.env on the very next line."
  // We need it because our project's `n` (Node) ruleset discourages direct
  // process.env access in app code - but this utility exists precisely to be
  // the ONE allowed exception. The directive MUST stay directly above the code
  // it suppresses; inserting another comment between them would break the
  // suppression and the lint rule would fail the build. Never delete it.
  // eslint-disable-next-line n/no-process-env
  const fallback = process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL;
  // EDUCATIONAL NOTE: Same `??` logic as above, now against raw process.env.
  // Order matters: we try the canonical DATABASE_URL first, then the
  // Neon-specific alias. Both are checked so the same script works locally
  // (plain Postgres) and on Neon's hosted Postgres.
  if (fallback) return fallback;

  // EDUCATIONAL NOTE: If we reach here, neither validated config NOR raw
  // environment variables supplied a connection string. Throwing (rather than
  // returning an empty string) makes the failure LOUD and immediate. A script
  // that can't find its database should fail fast with a clear message instead
  // of silently connecting to "nothing" and producing confusing errors.
  throw new Error("DATABASE_URL / NEON_DATABASE_URL is not set");
}
