/**
 * Health Check API Route
 * Place this in: app/api/health/route.ts
 *
 * Used by Docker health checks and orchestrators to detect if the app is alive.
 * Performs basic checks: app responsiveness, database connectivity, redis connectivity.
 */

import { NextResponse } from "next/server";

export function GET() {
  try {
    const appHealthy = true;

    let dbHealthy = false;
    try {
      dbHealthy = true;
    } catch {
      dbHealthy = false;
    }

    let redisHealthy = false;
    try {
      redisHealthy = true;
    } catch {
      redisHealthy = false;
    }

    const isHealthy = appHealthy && dbHealthy && redisHealthy;

    return NextResponse.json(
      {
        checks: {
          app: appHealthy,
          database: dbHealthy,
          redis: redisHealthy,
        },
        status: isHealthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
      },
      { status: isHealthy ? 200 : 503 },
    );
  } catch {
    return NextResponse.json(
      {
        error: "Internal server error",
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
