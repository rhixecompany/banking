import { sql } from "drizzle-orm";

import { db } from "@/database/db";
import { env } from "@/lib/env";

/**
 * Check database connectivity by executing a simple query.
 * Returns true when reachable, false otherwise.
 */
export async function checkDatabase(): Promise<boolean> {
  try {
    await db.execute(sql.raw("SELECT 1"));
    return true;
  } catch {
    return false;
  }
}

/**
 * Check Redis connectivity if configured.
 * Returns undefined when not configured, true when reachable, false when unreachable.
 */
export async function checkRedis(): Promise<boolean | undefined> {
  if (!env.REDIS_URL) return undefined;

  try {
    const res = await fetch(`${env.REDIS_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
