import { NextResponse } from "next/server";

/**
 * Helper to create a Set-Cookie response for Playwright tests.
 * Keeps the logic in one place so both API and app routes can delegate.
 */
export async function handlePlaywrightSetCookie(request: Request) {
  try {
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

    const cookieParts: string[] = [];
    cookieParts.push(`${name}=${value}`);
    cookieParts.push(`Path=${options?.path ?? "/"}`);
    if (options?.domain) cookieParts.push(`Domain=${options.domain}`);
    cookieParts.push("HttpOnly");
    cookieParts.push(`SameSite=${options?.sameSite ?? "Lax"}`);
    if (options?.secure) cookieParts.push("Secure");

    const res = NextResponse.json({ error: undefined, ok: true });
    res.headers.append("Set-Cookie", cookieParts.join("; "));
    return res;
  } catch (e) {
    return NextResponse.json({ error: String(e), ok: false }, { status: 400 });
  }
}
