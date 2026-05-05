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
  authenticatedPage: async ({ page }, run) => {
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
      await run(page);
      return;
    }

    const isSecure = new URL(baseUrl).protocol === "https:";
    const cookieName = isSecure
      ? "__Secure-next-auth.session-token"
      : "next-auth.session-token";

    try {
      const jwt = await encode({
        salt: cookieName,
        secret,
        token: {
          email: TEST_USER.email,
          id: SEED_USER_ID,
          isActive: true,
          isAdmin: false,
          name: `${TEST_USER.firstName} ${TEST_USER.lastName}`,
          sub: SEED_USER_ID,
        },
      });

      await page.context().clearCookies();
      await page.context().addCookies([
        {
          httpOnly: true,
          name: cookieName,
          path: "/",
          sameSite: "Lax",
          secure: isSecure,
          url: baseUrl,
          value: jwt,
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
    await page.context().clearCookies();
    await run(page);
  },
});

export { expect } from "@playwright/test";
