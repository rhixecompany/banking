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

import { NextResponse } from "next/server";

import { checkDatabase, checkRedis } from "@/dal";
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
/**
 * Check Redis connectivity if configured.
 * Returns null if Redis URL is not set (optional dependency).
 * @returns True if Redis is reachable, false if configured but unreachable, null if not configured.
 */
// Delegates to dal/health.ts which encapsulates DB and Redis checks.

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
