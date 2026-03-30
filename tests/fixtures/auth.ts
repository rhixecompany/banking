import { test as base, Page } from "@playwright/test";

import { SEED_USER, signInWithSeedUser } from "../e2e/helpers/auth";

/**
 * Test user credentials for E2E — must match [scripts/seed/seed-data.ts](scripts/seed/seed-data.ts).
 * Ensure DB is seeded before running E2E (`npm run db:push && npm run db:seed -- --reset`).
 */
export const TEST_USER = {
  email: SEED_USER.email,
  firstName: "Seed",
  lastName: "User",
  password: SEED_USER.password,
};

/**
 * Extended test type with custom fixtures
 */
export interface AuthFixtures {
  /**
   * Description placeholder
   *
   * @type {Page}
   */
  authenticatedPage: Page;
  /**
   * Description placeholder
   *
   * @type {Page}
   */
  unauthenticatedPage: Page;
}

/**
 * Custom Playwright test with authentication fixtures
 * Usage: test('my-test', async ({ authenticatedPage }) => { ... })
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await signInWithSeedUser(page);
    await use(page);
  },

  unauthenticatedPage: async ({ page }, use) => {
    await page.context().clearCookies();
    await use(page);
  },
});

export { expect } from "@playwright/test";
