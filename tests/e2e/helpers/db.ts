/**
 * Database helper utilities for E2E tests.
 * Provides functions to check database connectivity and readiness.
 */

/**
 * Checks if a database URL is reachable by attempting a connection.
 *
 * @async
 * @param {string} databaseUrl - The PostgreSQL connection URL
 * @returns {Promise<boolean>} True if database is reachable, false otherwise
 */
export async function isDatabaseReachable(
  databaseUrl: string,
): Promise<boolean> {
  if (!databaseUrl?.trim()) {
    return false;
  }

  try {
    // Attempt a simple connection check using the pg client
    const { default: pg } = await import("pg");
    const { Client } = pg;

    const client = new Client({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      await client.query("SELECT 1");
      return true;
    } finally {
      await client.end().catch(() => {
        // Ignore errors during cleanup
      });
    }
  } catch {
    return false;
  }
}

/**
 * Checks if the database has been seeded with test data.
 *
 * @async
 * @param {string} databaseUrl - The PostgreSQL connection URL
 * @param {string} testUserEmail - The expected seed user email
 * @returns {Promise<boolean>} True if seed data exists, false otherwise
 */
export async function isDatabaseSeeded(
  databaseUrl: string,
  testUserEmail: string,
): Promise<boolean> {
  if (!databaseUrl?.trim() || !testUserEmail?.trim()) {
    return false;
  }

  try {
    const { default: pg } = await import("pg");
    const { Client } = pg;

    const client = new Client({
      connectionString: databaseUrl,
      connectionTimeoutMillis: 5000,
    });

    try {
      await client.connect();
      const result = await client.query(
        "SELECT 1 FROM users WHERE email = $1 LIMIT 1",
        [testUserEmail],
      );
      return (result.rowCount ?? 0) > 0;
    } finally {
      await client.end().catch(() => {
        // Ignore errors during cleanup
      });
    }
  } catch {
    return false;
  }
}

/**
 * Gets the database URL from environment variables.
 * Prefers DATABASE_URL, falls back to LOCAL_DATABASE_URL.
 *
 * @returns {string | undefined} The database URL or undefined if not set
 */
export function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL?.trim() ??
    process.env.LOCAL_DATABASE_URL?.trim() ??
    undefined
  );
}
