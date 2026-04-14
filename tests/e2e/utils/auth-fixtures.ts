import { type APIRequestContext } from "@playwright/test";
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
    exp: now + maxAge,
    iat: now,
    ...payload,
  };

  return jwt.sign(token, secret);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @param {APIRequestContext} request
 * @param {string} baseUrl
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function setAuthCookie(
  request: APIRequestContext,
  baseUrl: string,
  token: string,
): Promise<boolean> {
  // Set the cookie on the test browser context via the Playwright API endpoint
  // that the app exposes. We use a lightweight call to the test server to set
  // the cookie on the domain the app runs on.
  const cookieName = "next-auth.session-token";

  try {
    const res = await request.post(`${baseUrl}/__playwright__/set-cookie`, {
      data: {
        name: cookieName,
        options: { path: "/" },
        value: token,
      },
    });

    // Return whether the server accepted setting the cookie. Tests will
    // optionally fall back to using Playwright's browser context to set the
    // cookie directly if the endpoint is unavailable or returns an error.
    return res.ok();
  } catch {
    return false;
  }
}
