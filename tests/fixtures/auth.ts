import {
  test as base,
  Page,
  request as playwrightRequest,
} from "@playwright/test";

import { SEED_USER, signInWithSeedUser } from "../e2e/helpers/auth";
import {
  makeNextAuthJwtToken,
  setAuthCookie,
} from "../e2e/utils/auth-fixtures";
import {
  DashboardPage,
  MyWalletsPage,
  PaymentTransferPage,
  SignInPage,
  SignUpPage,
  TransactionHistoryPage,
} from "./pages";

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
 * Extended test type with custom fixtures for authentication and POM
 */
export interface AuthFixtures {
  /** Dashboard Page Object (authenticated) */
  dashboardPage: DashboardPage;
  /** Raw Playwright page for authenticated access */
  authenticatedPage: Page;
  /** My Wallets Page Object (authenticated) */
  myWalletsPage: MyWalletsPage;
  /** Payment Transfer Page Object (authenticated) */
  paymentTransferPage: PaymentTransferPage;
  /** Raw Playwright page - use when no auth needed */
  page: Page;
  /** Sign In Page Object (unauthenticated - no auth required) */
  signInPage: SignInPage;
  /** Sign Up Page Object (unauthenticated - no auth required) */
  signUpPage: SignUpPage;
  /** Transaction History Page Object (authenticated) */
  transactionHistoryPage: TransactionHistoryPage;
  /** Raw Playwright page for unauthenticated access */
  unauthenticatedPage: Page;
}

/**
 * Custom Playwright test with authentication and POM fixtures
 * Usage:
 * - test('my-test', async ({ authenticatedPage }) => { ... })
 * - test('my-test', async ({ dashboardPage }) => { ... })
 */
export const test = base.extend<AuthFixtures>({
  // Page fixtures (in alphabetical order)
  authenticatedPage: async ({ page }, use) => {
    // Prefer deterministic session via seeded JWT when NEXTAUTH_SECRET exists
    // and the tests are running with a seeded DB. Fall back to UI sign-in.
    // Prefer validated env access via lib/env.ts per project standards. Fallback
    // to process.env for local runs.
    // Resolve environment via lib/env if available to satisfy lint rules
    // and ensure central validation; keep process.env fallback for local runs
    let secret: string | undefined = undefined;
    let baseUrl = "http://localhost:3000";
    try {
      const { env } = await import("@/lib/env");
      if (env.NEXTAUTH_SECRET) secret = env.NEXTAUTH_SECRET as string;
      if (env.PLAYWRIGHT_BASE_URL) baseUrl = env.PLAYWRIGHT_BASE_URL as string;
    } catch {
      // fallback to process.env for local setups
      // eslint-disable-next-line n/no-process-env
      secret = process.env.NEXTAUTH_SECRET;
      // eslint-disable-next-line n/no-process-env
      baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? baseUrl;
    }

    if (secret) {
      const token = makeNextAuthJwtToken({ id: "seed-user" }, secret);

      // Use Playwright APIRequestContext to set cookie on the app domain
      // newContext() returns a Promise — await it so TypeScript types align
      const apiReq = await playwrightRequest.newContext();
      try {
        // This hits a small test-only endpoint we'll add to the app in dev mode
        await setAuthCookie(apiReq, baseUrl, token);
        // Load the page with the authenticated cookie set
        await page.goto(`${baseUrl}/dashboard`);
        await page.waitForLoadState("domcontentloaded");
        await use(page);
      } finally {
        await apiReq.dispose();
      }
    } else {
      await signInWithSeedUser(page);
      await use(page);
    }
  },

  dashboardPage: async ({ authenticatedPage }, use) => {
    const dashboard = new DashboardPage(authenticatedPage);
    await use(dashboard);
  },

  myWalletsPage: async ({ authenticatedPage }, use) => {
    const myWallets = new MyWalletsPage(authenticatedPage);
    await use(myWallets);
  },

  page: async ({ page }, use) => {
    await use(page);
  },

  paymentTransferPage: async ({ authenticatedPage }, use) => {
    const transfer = new PaymentTransferPage(authenticatedPage);
    await use(transfer);
  },

  // Sign in/up pages use raw page - they're public pages that don't require auth
  signInPage: async ({ page }, use) => {
    const signIn = new SignInPage(page);
    await use(signIn);
  },

  signUpPage: async ({ page }, use) => {
    const signUp = new SignUpPage(page);
    await use(signUp);
  },

  transactionHistoryPage: async ({ authenticatedPage }, use) => {
    const history = new TransactionHistoryPage(authenticatedPage);
    await use(history);
  },

  unauthenticatedPage: async ({ page }, use) => {
    await page.context().clearCookies();
    await use(page);
  },
});

export { expect } from "@playwright/test";
