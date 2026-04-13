import { type APIRequestContext, expect } from "@playwright/test";
import jwt from "jsonwebtoken";

/**
 * Create an authenticated session cookie for Playwright tests by generating
 * a NextAuth-compatible JWT (used by session strategy = 'jwt'). This avoids
 * performing the UI sign-in flow and makes authenticated fixtures deterministic.
 *
 * Note: Keep this helper small and opt-in. It is intended for tests only.
 */
export function makeNextAuthJwtToken(
  payload: Record<string, unknown>,
  secret: string,
  maxAge = 60 * 60 * 24 * 30,
): string {
  // Use jsonwebtoken to create a signed token. NextAuth uses jose and additional
  // envelope encryption in production, but in tests we only need a signed JWT
  // that the app will accept when using getToken(...) in proxy or middleware.
  // Keep the shape minimal: include id, name, email and exp.
  const now = Math.floor(Date.now() / 1000);
  const token = {
    iat: now,
    exp: now + maxAge,
    ...payload,
  };

  return jwt.sign(token, secret);
}

export async function setAuthCookie(
  request: APIRequestContext,
  baseUrl: string,
  token: string,
): Promise<void> {
  // Set the cookie on the test browser context via the Playwright API endpoint
  // that the app exposes. We use a lightweight call to the test server to set
  // the cookie on the domain the app runs on.
  const cookieName = "next-auth.session-token";

  const res = await request.post(`${baseUrl}/__playwright__/set-cookie`, {
    data: {
      name: cookieName,
      value: token,
      options: { path: "/" },
    },
  });

  expect(res.ok()).toBeTruthy();
}
