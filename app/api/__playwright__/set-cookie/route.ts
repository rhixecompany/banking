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
  const enabled =
    process.env.NODE_ENV !== "production" &&
    (process.env.ENABLE_TEST_ENDPOINTS === "true" ||
      process.env.PLAYWRIGHT_PREPARE_DB === "true");

  if (!enabled) {
    return NextResponse.json(
      { ok: false, error: "Not found" },
      { status: 404 },
    );
  }

  try {
    const body = await request.json();
    const { name, value, options } = body as {
      name: string;
      value: string;
      options?: { path?: string };
    };

    const res = NextResponse.json({ ok: true });
    // Minimal cookie string for tests. Not secure; this endpoint is test-only.
    res.headers.append(
      "Set-Cookie",
      `${name}=${value}; Path=${options?.path ?? "/"}; HttpOnly; SameSite=Lax; Secure=false`,
    );

    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 400 });
  }
}
