import { NextResponse } from "next/server";

/**
 * Test-only endpoint for Playwright to set cookies on the app domain. This
 * endpoint exists only to make it easy for tests to set auth cookies without
 * performing the UI sign-in flow. It is intentionally minimal and should only
 * be enabled in non-production environments.
 */
export async function POST(request: Request) {
  // Guard: only allow this test-only endpoint when running in non-production
  // and when an explicit test flag is set. This prevents accidental exposure
  // of a cookie-setting endpoint in production environments.
  // Use validated env via lib/env.ts per project standards.
  // Importing inside handler to avoid top-level env reads during edge/production bundling.
  const { env } = await import("@/lib/env");

  const enabled =
    env.NODE_ENV !== "production" &&
    (env.ENABLE_TEST_ENDPOINTS === "true" ||
      env.PLAYWRIGHT_PREPARE_DB === "true");

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
      options?: { path?: string };
      value: string;
    };

    const res = NextResponse.json({ error: undefined, ok: true });
    // Minimal cookie string for tests. Not secure; this endpoint is test-only.
    res.headers.append(
      "Set-Cookie",
      `${name}=${value}; Path=${options?.path ?? "/"}; HttpOnly; SameSite=Lax; Secure=false`,
    );

    return res;
  } catch (e) {
    return NextResponse.json({ error: String(e), ok: false }, { status: 400 });
  }
}
