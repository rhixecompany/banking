import { test as base, Page } from "@playwright/test";

import { SEED_USER, signInWithSeedUser } from "../e2e/helpers/auth";
import {
  DashboardPage,
  MyWalletsPage,
  PaymentTransferPage,
  SignInPage,
  SignUpPage,
  TransactionHistoryPage,
} from "./pages";

export const SEED_USER_ID = "00000000-0000-4000-8000-000000000003";

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
  authenticatedPage: async ({ page }, run) => {
    // Capture console errors for test debugging
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleErrors.push(msg.text());
      }
    });
    page.on("pageerror", (err) => {
      consoleErrors.push(err.message);
    });

    // Always use UI sign-in for reliable authentication in E2E tests.
    // The JWT cookie approach is unreliable due to timing issues with
    // session establishment before tests run.
    await signInWithSeedUser(page);

    await run(page);
  },

  dashboardPage: async ({ authenticatedPage }, run) => {
    const dashboard = new DashboardPage(authenticatedPage);
    await run(dashboard);
  },

  myWalletsPage: async ({ authenticatedPage }, run) => {
    const myWallets = new MyWalletsPage(authenticatedPage);
    await run(myWallets);
  },

  page: async ({ page }, run) => {
    await run(page);
  },

  paymentTransferPage: async ({ authenticatedPage }, run) => {
    const transfer = new PaymentTransferPage(authenticatedPage);
    await run(transfer);
  },

  // Sign in/up pages use raw page - they're public pages that don't require auth
  signInPage: async ({ page }, run) => {
    const signIn = new SignInPage(page);
    await run(signIn);
  },

  signUpPage: async ({ page }, run) => {
    const signUp = new SignUpPage(page);
    await run(signUp);
  },

  transactionHistoryPage: async ({ authenticatedPage }, run) => {
    const history = new TransactionHistoryPage(authenticatedPage);
    await run(history);
  },

  unauthenticatedPage: async ({ page }, run) => {
    // Capture console errors for test debugging
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        console.error(`[Unauthenticated Page Error]: ${msg.text()}`);
      }
    });
    page.on("pageerror", (err) => {
      console.error(`[Unauthenticated Page Error]: ${err.message}`);
    });

    await page.context().clearCookies();
    await run(page);
  },
});

export { expect } from "@playwright/test";
