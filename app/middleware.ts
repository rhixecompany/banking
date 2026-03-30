import type { NextRequest } from "next/server";

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

/**
 * Description placeholder
 *
 * @type {*}
 */
const ratelimit = new Ratelimit({
  analytics: true,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  prefix: "banking-auth",
  redis: Redis.fromEnv(),
});

/**
 * Description placeholder
 *
 * @param {NextRequest} request
 * @returns {*}
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
 * Description placeholder
 *
 * @export
 * @async
 * @param {NextRequest} request
 * @returns {unknown}
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
      return NextResponse.next();
    }
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
 * Description placeholder
 *
 * @type {{ matcher: {}; }}
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
