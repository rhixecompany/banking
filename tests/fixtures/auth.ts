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
    await signInWithSeedUser(page);
    await use(page);
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
