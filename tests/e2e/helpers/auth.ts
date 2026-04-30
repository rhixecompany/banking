import type { Page } from "@playwright/test";

/**
 * Must match [scripts/seed/seed-data.ts](scripts/seed/seed-data.ts) (`SEED_PASSWORD_PLAIN` and seed user email).
 * Run `npm run db:push && npm run db:seed -- --reset` before E2E when the DB is empty.
 */
export const SEED_USER = {
  email: "seed-user@example.com",
  password: "password123",
} as const;

// Provenance: read tests/fixtures/seed-user.json and tests/fixtures/seed-admin.json — update helper to expose admin fixture name
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
export const adminFixtureEmail =
  process.env.E2E_ADMIN_EMAIL ?? "seed-admin@example.com";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
export const adminFixturePassword =
  process.env.E2E_ADMIN_PASSWORD ?? "Password1!";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @returns {unknown}
 */
export async function ensureAdminIsSeeded() {
  return { email: adminFixtureEmail, password: adminFixturePassword };
}

/**
 * Sign in with the seeded credentials. The app navigates directly to `/dashboard` after success.
 */
export async function signInWithSeedUser(page: Page): Promise<void> {
  const authResponses: Array<{
    url: string;
    status: number;
    contentType: string | null;
    bodyPreview: string;
  }> = [];

  const authRequests: Array<{
    url: string;
    method: string;
    postDataPreview: string;
    contentType: string | null;
    csrfCookieTokenPartFromHeader: string | null;
  }> = [];

  const onResponse = async (
    resp: Parameters<Page["on"]>[1] extends (
      event: "response",
      listener: infer L,
    ) => any
      ? L
      : never,
  ) => {
    // Only capture NextAuth-related traffic to avoid log spam.
    const url = resp.url();
    if (!url.includes("/api/auth/")) return;

    try {
      const contentType = resp.headers()["content-type"] ?? null;
      const text = await resp.text();
      authResponses.push({
        url,
        status: resp.status(),
        contentType,
        bodyPreview: text.slice(0, 500),
      });
    } catch {
      // Ignore response body read errors (e.g. already consumed/stream issues).
      authResponses.push({
        url,
        status: resp.status(),
        contentType: resp.headers()["content-type"] ?? null,
        bodyPreview: "<unavailable>",
      });
    }
  };

  const onRequest = (
    req: Parameters<Page["on"]>[1] extends (
      event: "request",
      listener: infer L,
    ) => any
      ? L
      : never,
  ) => {
    const url = req.url();
    if (!url.includes("/api/auth/")) return;

    const headers = req.headers();

    let csrfCookieTokenPartFromHeader: string | null = null;
    if (url.includes("/api/auth/callback/credentials")) {
      const cookieHeader = headers["cookie"];
      if (cookieHeader) {
        const match = cookieHeader.match(
          /(?:^|;\s*)next-auth\.csrf-token=([^;]+)/,
        );
        if (match?.[1]) {
          try {
            const decoded = decodeURIComponent(match[1]);
            csrfCookieTokenPartFromHeader = decoded.split("|")[0] ?? null;
          } catch {
            csrfCookieTokenPartFromHeader = "<decode-failed>";
          }
        }
      }
    }

    authRequests.push({
      url,
      method: req.method(),
      contentType: headers["content-type"] ?? null,
      postDataPreview: (req.postData() ?? "").slice(0, 800),
      csrfCookieTokenPartFromHeader,
    });
  };

  page.on("request", onRequest);
  page.on("response", onResponse);

  await page.goto("/sign-in");
  await page.waitForLoadState("domcontentloaded");

  // Use placeholder selectors (shadcn/ui uses placeholders, not labels)
  await page.getByPlaceholder(/enter your email/i).fill(SEED_USER.email);
  await page.getByPlaceholder(/enter your password/i).fill(SEED_USER.password);
  await page.getByRole("button", { name: /sign in/i }).click();

  const timeout = 40_000;

  try {
    // Fast-path: the app navigates to /dashboard after successful sign-in.
    await page.waitForURL(/\/dashboard/, { timeout });
    return;
  } catch {
    // Fall through to diagnostics.
  } finally {
    page.off("request", onRequest);
    page.off("response", onResponse);
  }

  const toastTexts = await page
    .locator("[data-sonner-toast]")
    .allInnerTexts()
    .catch(() => []);

  const cookies = await page.context().cookies();
  const cookieNames = cookies.map((c) => c.name).sort();
  const authCookies = cookieNames.filter((n) => n.includes("next-auth"));

  const csrfCookie = cookies.find((c) => c.name === "next-auth.csrf-token");
  const decodedCsrfCookieValue = csrfCookie?.value
    ? decodeURIComponent(csrfCookie.value)
    : undefined;
  const csrfCookieTokenPart = decodedCsrfCookieValue?.split("|")[0];
  const csrfCookiePreview = decodedCsrfCookieValue
    ? `${csrfCookieTokenPart ?? ""}|<hash>`
    : undefined;

  // Include the last few auth responses (most recent are usually most relevant).
  const recentAuthResponses = authResponses.slice(-5);
  const recentAuthRequests = authRequests.slice(-8);

  throw new Error(
    [
      `Seed user sign-in did not reach /dashboard within ${timeout}ms.`,
      `Current URL: ${page.url()}`,
      `Auth cookies present: ${authCookies.length ? authCookies.join(", ") : "<none>"}`,
      `CSRF cookie token part: ${csrfCookieTokenPart ?? "<none>"}`,
      `CSRF cookie preview: ${csrfCookiePreview ?? "<none>"}`,
      `Sonner toasts: ${toastTexts.length ? toastTexts.join(" | ") : "<none>"}`,
      `Recent /api/auth responses: ${recentAuthResponses.length ? "" : "<none>"}`,
      ...recentAuthResponses.map((r) =>
        [
          `- ${r.status} ${r.url}`,
          `  content-type: ${r.contentType ?? "<none>"}`,
          `  body: ${r.bodyPreview.replaceAll("\n", " ")}`,
        ].join("\n"),
      ),
      `Recent /api/auth requests: ${recentAuthRequests.length ? "" : "<none>"}`,
      ...recentAuthRequests.map((r) =>
        [
          `- ${r.method} ${r.url}`,
          `  content-type: ${r.contentType ?? "<none>"}`,
          `  csrfCookieTokenPart(from header): ${r.csrfCookieTokenPartFromHeader ?? "<none>"}`,
          `  postData: ${r.postDataPreview.replaceAll("\n", " ") || "<none>"}`,
        ].join("\n"),
      ),
    ].join("\n"),
  );
}

// NOTE: This helper deliberately keeps hard-coded seed credentials for E2E
// tests. They are non-sensitive test fixtures and mirrored in scripts/seed.
