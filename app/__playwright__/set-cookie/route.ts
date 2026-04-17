// Convenience wrapper so tests can call `${baseUrl}/__playwright__/set-cookie`
// (root path) instead of `/api/__playwright__/set-cookie`. This keeps the
// test helper simple and avoids confusion between API and app routes in dev.

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @param {Request} req
 * @returns {unknown}
 */
export async function POST(req: Request) {
  const { handlePlaywrightSetCookie } =
    await import("@/lib/playwright/set-cookie.helper");
  return handlePlaywrightSetCookie(req as Request);
}
