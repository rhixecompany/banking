import { type APIRequestContext } from "@playwright/test";
import jwt from "jsonwebtoken";
// jose is used to produce Compact JWE tokens compatible with NextAuth when
// session.strategy = "jwt" and NEXTAUTH_SECRET is used for encryption.
// We add it as a devDependency and use it only in test helpers.
import * as jose from "jose";

/**
 * Create an authenticated session cookie for Playwright tests by generating
 * a NextAuth-compatible JWT (used by session strategy = 'jwt'). This avoids
 * performing the UI sign-in flow and makes authenticated fixtures deterministic.
 *
 * Note: Keep this helper small and opt-in. It is intended for tests only.
 */
/**
 * Create a NextAuth-compatible token. Historically we created a signed JWT
 * with jsonwebtoken. NextAuth in this app expects an encrypted Compact JWE
 * (Encrypted JWT) when NEXTAUTH_SECRET is set and session.strategy = 'jwt'.
 *
 * This helper will attempt to produce a Compact JWE using the NEXTAUTH_SECRET
 * with algorithms matching NextAuth defaults (dir + A256GCM). If JWE creation
 * fails for any reason, we fall back to a signed JWT for environments where
 * NextAuth is configured to accept unsigned/signed tokens in tests.
 */
export async function makeNextAuthJweToken(
  payload: Record<string, unknown>,
  secret: string,
  maxAge = 60 * 60 * 24 * 30,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    exp: now + maxAge,
    iat: now,
    ...payload,
  };

  // NextAuth derives an encryption key from NEXTAUTH_SECRET using a KDF. The
  // simplest interoperable approach here is to derive a 32-byte key by
  // hashing the secret with SHA-256. This matches practical setups where the
  // secret is used directly as a symmetric key material for "dir" + A256GCM.

  try {
    // Derive a 32-byte key by hashing the secret with SHA-256
    const secretBytes = new TextEncoder().encode(secret);
    // Use Node/global crypto.subtle if available
    // Use global/subtle crypto for digest; Node typings may not include subtle
    // so avoid ts-expect-error by asserting as any when necessary.
    const digest = await (
      globalThis.crypto?.subtle ?? (crypto as any).subtle
    ).digest("SHA-256", secretBytes);
    // We'll import the JWK directly below; no need to call jose.importKey here.

    // jose API: new CompactEncrypt(utf8.encode(JSON.stringify(payload))).
    // However, jose's high-level API offers jwtEncrypt which accepts a
    // payload and a key.
    const alg = "dir"; // direct symmetric key
    const encAlg = "A256GCM";

    // Create a CryptoKey from raw digest for jose: use importJWK style with
    // a symmetric key represented as base64url
    const b64Url = jose.base64url.encode(new Uint8Array(digest));
    const jwk = {
      kty: "oct",
      k: b64Url,
      alg: "A256GCM",
    };

    // jose provides a jwtEncrypt helper we can use by importing the raw JWK
    // as a KeyLike via importJWK. Use importJWK which returns a KeyLike.
    const keyLike = await jose.importJWK(jwk as any, encAlg);
    const jwe = await new jose.CompactEncrypt(
      new TextEncoder().encode(JSON.stringify(tokenPayload)),
    )
      .setProtectedHeader({ alg, enc: encAlg })
      .encrypt(keyLike as any);

    return jwe as string;
  } catch (e) {
    // If any part of JWE creation fails, fall back to the original signed
    // JWT approach so tests remain operational in environments where NextAuth
    // is tolerant or tests don't require JWE.
    // eslint-disable-next-line no-console
    console.warn(
      "[makeNextAuthJweToken] JWE creation failed, falling back to signed JWT:",
      String(e),
    );
    return jwt.sign(tokenPayload, secret);
  }
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

    // Diagnostic logging: surface status and headers so Playwright logs will
    // show whether the Set-Cookie header was present and what the server
    // returned. This helps diagnose environments where proxies strip
    // Set-Cookie headers.
    try {
      // headers() may be an object; convert to array for logging
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const hdrs = await (res as any).headers?.();
      console.log(
        `[setAuthCookie] status=${res.status()} headers=${JSON.stringify(hdrs)}`,
      );
    } catch (e) {
      console.log(
        `[setAuthCookie] status=${res.status()} (failed to read headers)`,
      );
    }

    // Return whether the server accepted setting the cookie. Tests will
    // optionally fall back to using Playwright's browser context to set the
    // cookie directly if the endpoint is unavailable or returns an error.
    return res.ok();
  } catch {
    return false;
  }
}
