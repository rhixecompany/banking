/**
 * Health Check API Route
 *
 * Performs real connectivity checks for:
 * - Application responsiveness
 * - Database connectivity (PostgreSQL via Drizzle)
 * - Redis connectivity (Upstash Redis, if configured)
 *
 * Used by Docker health checks, Kubernetes probes, and orchestrators
 * to verify the application is functioning correctly.
 */

import { sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/database/db";
import { env } from "@/lib/env";

/**
 * Health status response structure.
 */
interface HealthStatus {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {{
   *     app: boolean;
   *     database: boolean;
   *     redis: boolean   | undefined;
   *   }}
   */
  checks: {
    app: boolean;
    database: boolean;
    redis: boolean | undefined;
  };
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {("healthy" | "degraded" | "unhealthy")}
   */
  status: "degraded" | "healthy" | "unhealthy";
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  timestamp: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  version?: string;
}

/**
 * Check database connectivity by executing a simple query.
 * @returns True if database is reachable and responsive.
 */
async function checkDatabase(): Promise<boolean> {
  try {
    await db.execute(sql.raw("SELECT 1"));
    return true;
  } catch {
    return false;
  }
}

/**
 * Check Redis connectivity if configured.
 * Returns null if Redis URL is not set (optional dependency).
 * @returns True if Redis is reachable, false if configured but unreachable, null if not configured.
 */
async function checkRedis(): Promise<boolean | undefined> {
  if (!env.REDIS_URL) {
    return undefined;
  }

  try {
    const response = await fetch(`${env.REDIS_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(3000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * GET handler for health check endpoint.
 * Performs all health checks and returns aggregated status.
 */
export async function GET(): Promise<NextResponse<HealthStatus>> {
  try {
    const [dbHealthy, redisHealth] = await Promise.all([
      checkDatabase(),
      checkRedis(),
    ]);

    const appHealthy = true;
    const redisHealthy = redisHealth;
    const isRedisConfigured = redisHealth !== undefined;
    const isRedisOk = !isRedisConfigured || redisHealthy;

    const isHealthy = appHealthy && dbHealthy && isRedisOk;

    const status: HealthStatus = {
      checks: {
        app: appHealthy,
        database: dbHealthy,
        redis: redisHealthy,
      },
      status: isHealthy ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      version: env.NPM_PACKAGE_VERSION,
    };

    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "no-store",
        "X-Health-Check": "true",
      },
      status: isHealthy ? 200 : 503,
    });
  } catch {
    const status: HealthStatus = {
      checks: {
        app: false,
        database: false,
        redis: undefined,
      },
      status: "unhealthy",
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(status, {
      headers: {
        "Cache-Control": "no-store",
      },
      status: 503,
    });
  }
}
