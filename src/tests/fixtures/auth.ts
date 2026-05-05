import { test as base, Page } from "@playwright/test";
import { encode } from "next-auth/jwt";

import { SEED_USER, signInWithSeedUser } from "../e2e/helpers/auth";
import {
  DashboardPage,
  MyWalletsPage,
  PaymentTransferPage,
  SignInPage,
  SignUpPage,
  TransactionHistoryPage,
} from "./pages";

const SEED_USER_ID = "00000000-0000-4000-8000-000000000003";

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
    // Prefer deterministic session cookie (NextAuth JWT) when NEXTAUTH_SECRET
    // exists. Fall back to UI sign-in if missing or if the token isn't accepted.
    let secret: string | undefined;
    // eslint-disable-next-line n/no-process-env
    const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
    try {
      const { env } = await import("@/lib/env");
      if (env.NEXTAUTH_SECRET) secret = env.NEXTAUTH_SECRET as string;
    } catch {
      // eslint-disable-next-line n/no-process-env
      secret = process.env.NEXTAUTH_SECRET;
    }

    if (!secret) {
      await signInWithSeedUser(page);
      await use(page);
      return;
    }

    const isSecure = new URL(baseUrl).protocol === "https:";
    const cookieName = isSecure
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    try {
      const jwt = await encode({
        token: {
          sub: SEED_USER_ID,
          id: SEED_USER_ID,
          email: TEST_USER.email,
          name: `${TEST_USER.firstName} ${TEST_USER.lastName}`,
          isAdmin: false,
          isActive: true,
        },
        secret,
        salt: cookieName,
      });

      await page.context().clearCookies();
      await page.context().addCookies([
        {
          name: cookieName,
          value: jwt,
          url: baseUrl,
          path: "/",
          httpOnly: true,
          secure: isSecure,
          sameSite: "Lax",
        },
      ]);

      await page.goto("/dashboard");
      await page.waitForLoadState("domcontentloaded");
      if (page.url().includes("/sign-in")) {
        await signInWithSeedUser(page);
      }
    } catch {
      await signInWithSeedUser(page);
    }

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
