/**
 * Test-only endpoint at the root path for Playwright to set cookies on the
 * app domain. Tests call `${baseUrl}/__playwright__/set-cookie` (no `/api`).
 *
 * This route is intentionally minimal and only enabled in non-production or
 * when explicit test flags are present.
 */
export async function POST(request: Request) {
  const { handlePlaywrightSetCookie } =
    await import("@/lib/playwright/set-cookie.helper");
  return handlePlaywrightSetCookie(request as Request);
}
