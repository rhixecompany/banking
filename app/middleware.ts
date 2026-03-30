import type { NextRequest } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/**
 * Lazy-initialized rate limiter with graceful fallback when Redis is unavailable.
 * Rate limiting is skipped if REDIS_URL is not configured.
 */
const ratelimit = (() => {
  try {
    return new Ratelimit({
      analytics: true,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      prefix: "banking-auth",
      redis: Redis.fromEnv(),
    });
  } catch {
    // Redis not configured - rate limiting will be skipped
    // Using undefined instead of null per project linting rules
    return undefined;
  }
})();

/**
 * Extracts client IP from request headers for rate limiting.
 *
 * @param {NextRequest} request - The incoming request
 * @returns {string} Client IP address or "unknown"
 */
function getRateLimitKey(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

/**
 * Next.js middleware for authentication and rate limiting.
 * - Redirects authenticated users away from auth pages
 * - Rate limits auth page requests when Redis is available
 * - Protects routes requiring authentication
 *
 * @export
 * @async
 * @param {NextRequest} request
 * @returns {Promise<NextResponse>}
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    const token = await getToken({ req: request });
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Apply rate limiting only if Redis is configured
    if (ratelimit) {
      const identifier = getRateLimitKey(request);
      try {
        const { remaining, reset, success } = await ratelimit.limit(identifier);
        const response = NextResponse.next();

        response.headers.set("X-RateLimit-Limit", "5");
        response.headers.set("X-RateLimit-Remaining", remaining.toString());
        response.headers.set("X-RateLimit-Reset", reset.toString());

        if (!success) {
          const retryAfter = Math.ceil((reset - Date.now()) / 1000);
          response.headers.set("Retry-After", retryAfter.toString());
          return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { headers: response.headers, status: 429 },
          );
        }

        return response;
      } catch {
        // Rate limit check failed - continue without rate limiting
        return NextResponse.next();
      }
    }

    return NextResponse.next();
  }

  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/banks") ||
    pathname.startsWith("/my-banks") ||
    pathname.startsWith("/transaction-history") ||
    pathname.startsWith("/payment-transfer")
  ) {
    const token = await getToken({ req: request });
    if (!token) {
      const loginUrl = new URL("/sign-in", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.isActive === false) {
      return NextResponse.redirect(
        new URL("/sign-in?error=AccountDeactivated", request.url),
      );
    }
  }

  return NextResponse.next();
}

/**
 * Route matcher configuration.
 * Only runs on auth and protected routes to minimize overhead.
 *
 * @type {{ matcher: string[] }}
 */
export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/sign-in/:path*",
    "/sign-up/:path*",
    "/dashboard",
    "/settings",
    "/dashboard/:path*",
    "/settings/:path*",
    "/banks",
    "/my-banks",
    "/transaction-history",
    "/payment-transfer",
    "/banks/:path*",
    "/my-banks/:path*",
    "/transaction-history/:path*",
    "/payment-transfer/:path*",
  ],
};
