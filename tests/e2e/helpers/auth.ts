import type { Page } from "@playwright/test";

/**
 * Must match [scripts/seed/seed-data.ts](scripts/seed/seed-data.ts) (`SEED_PASSWORD_PLAIN` and seed user email).
 * Run `npm run db:push && npm run db:seed -- --reset` before E2E when the DB is empty.
 */
export const SEED_USER = {
  email: "seed-user@example.com",
  password: "password123",
} as const;

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

  // Wait for navigation to dashboard after successful sign-in
  await page.waitForURL(/\/dashboard/, { timeout: 25000 });
}
