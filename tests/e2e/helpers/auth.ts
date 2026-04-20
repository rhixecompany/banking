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
export const adminFixtureEmail =
  process.env.E2E_ADMIN_EMAIL ?? "seed-admin@example.com";
export const adminFixturePassword =
  process.env.E2E_ADMIN_PASSWORD ?? "Password1!";

export async function ensureAdminIsSeeded() {
  return { email: adminFixtureEmail, password: adminFixturePassword };
}

/**
 * Sign in with the seeded credentials. The app navigates directly to `/dashboard` after success.
 */
export async function signInWithSeedUser(page: Page): Promise<void> {
  await page.goto("/sign-in");
  await page.waitForLoadState("domcontentloaded");

  // Use placeholder selectors (shadcn/ui uses placeholders, not labels)
  await page.getByPlaceholder(/enter your email/i).fill(SEED_USER.email);
  await page.getByPlaceholder(/enter your password/i).fill(SEED_USER.password);
  await page.getByRole("button", { name: /sign in/i }).click();

  // Wait for navigation to dashboard after successful sign-in.
  // Accept either the URL change OR a stable dashboard element.
  const timeout = 40_000;
  await Promise.any([
    page.waitForURL(/\/dashboard/, { timeout }),
    page.getByRole("heading", { name: /dashboard/i }).waitFor({ timeout }),
    page.getByRole("navigation").first().waitFor({ timeout }),
  ]);
}

// NOTE: This helper deliberately keeps hard-coded seed credentials for E2E
// tests. They are non-sensitive test fixtures and mirrored in scripts/seed.
