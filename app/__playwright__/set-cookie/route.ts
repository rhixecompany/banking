import { NextResponse } from "next/server";

/**
 * Test-only endpoint at the root path for Playwright to set cookies on the
 * app domain. Tests call `${baseUrl}/__playwright__/set-cookie` (no `/api`).
 *
 * This route is intentionally minimal and only enabled in non-production or
 * when explicit test flags are present.
 */
export async function POST(request: Request) {
  // Import env lazily to avoid top-level env reads during production bundling
  const { env } = await import("@/lib/env");

  const enabled =
    env.NODE_ENV !== "production" ||
    env.ENABLE_TEST_ENDPOINTS === "true" ||
    env.PLAYWRIGHT_PREPARE_DB === "true";

  if (!enabled) {
    return NextResponse.json(
      { error: "Not found", ok: false },
      { status: 404 },
    );
  }

  try {
    const body = await request.json();
    const { name, options, value } = body as {
      name: string;
      options?: {
        path?: string;
        domain?: string;
        secure?: boolean;
        sameSite?: string;
      };
      value: string;
    };

    // Build a conservative cookie string suitable for local dev (no Secure flag)
    const cookieParts: string[] = [];
    cookieParts.push(`${name}=${value}`);
    cookieParts.push(`Path=${options?.path ?? "/"}`);
    if (options?.domain) cookieParts.push(`Domain=${options.domain}`);
    // HttpOnly is desirable for auth cookies
    cookieParts.push("HttpOnly");
    // SameSite default to Lax to allow top-level navigations
    cookieParts.push(`SameSite=${options?.sameSite ?? "Lax"}`);
    // Only set Secure if explicitly requested (avoid Secure on http localhost)
    if (options?.secure) cookieParts.push("Secure");

    const res = NextResponse.json({ error: undefined, ok: true });
    res.headers.append("Set-Cookie", cookieParts.join("; "));

    return res;
  } catch (e) {
    return NextResponse.json({ error: String(e), ok: false }, { status: 400 });
  }
}
