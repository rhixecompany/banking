/**
 * Test-only endpoint for Playwright to set cookies on the app domain.
 * Tests call `${baseUrl}/__playwright__/set-cookie` directly.
 */
export async function POST(request: Request) {
  const { handlePlaywrightSetCookie } =
    await import("@/lib/playwright/set-cookie.helper");
  return handlePlaywrightSetCookie(request);
}
