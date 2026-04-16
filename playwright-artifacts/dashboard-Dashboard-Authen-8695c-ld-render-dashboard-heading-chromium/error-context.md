# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard >> Authenticated Access >> should render dashboard heading
- Location: tests\e2e\dashboard.spec.ts:14:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
```

# Test source

```ts
  1   | import {
  2   |   test as base,
  3   |   Page,
  4   |   request as playwrightRequest,
  5   | } from "@playwright/test";
  6   | 
  7   | import { SEED_USER, signInWithSeedUser } from "../e2e/helpers/auth";
  8   | import {
  9   |   makeNextAuthJwtToken,
  10  |   setAuthCookie,
  11  | } from "../e2e/utils/auth-fixtures";
  12  | import {
  13  |   DashboardPage,
  14  |   MyWalletsPage,
  15  |   PaymentTransferPage,
  16  |   SignInPage,
  17  |   SignUpPage,
  18  |   TransactionHistoryPage,
  19  | } from "./pages";
  20  | 
  21  | /**
  22  |  * Test user credentials for E2E — must match [scripts/seed/seed-data.ts](scripts/seed/seed-data.ts).
  23  |  * Ensure DB is seeded before running E2E (`npm run db:push && npm run db:seed -- --reset`).
  24  |  */
  25  | export const TEST_USER = {
  26  |   email: SEED_USER.email,
  27  |   firstName: "Seed",
  28  |   lastName: "User",
  29  |   password: SEED_USER.password,
  30  | };
  31  | 
  32  | /**
  33  |  * Extended test type with custom fixtures for authentication and POM
  34  |  */
  35  | export interface AuthFixtures {
  36  |   /** Dashboard Page Object (authenticated) */
  37  |   dashboardPage: DashboardPage;
  38  |   /** Raw Playwright page for authenticated access */
  39  |   authenticatedPage: Page;
  40  |   /** My Wallets Page Object (authenticated) */
  41  |   myWalletsPage: MyWalletsPage;
  42  |   /** Payment Transfer Page Object (authenticated) */
  43  |   paymentTransferPage: PaymentTransferPage;
  44  |   /** Raw Playwright page - use when no auth needed */
  45  |   page: Page;
  46  |   /** Sign In Page Object (unauthenticated - no auth required) */
  47  |   signInPage: SignInPage;
  48  |   /** Sign Up Page Object (unauthenticated - no auth required) */
  49  |   signUpPage: SignUpPage;
  50  |   /** Transaction History Page Object (authenticated) */
  51  |   transactionHistoryPage: TransactionHistoryPage;
  52  |   /** Raw Playwright page for unauthenticated access */
  53  |   unauthenticatedPage: Page;
  54  | }
  55  | 
  56  | /**
  57  |  * Custom Playwright test with authentication and POM fixtures
  58  |  * Usage:
  59  |  * - test('my-test', async ({ authenticatedPage }) => { ... })
  60  |  * - test('my-test', async ({ dashboardPage }) => { ... })
  61  |  */
  62  | export const test = base.extend<AuthFixtures>({
  63  |   // Page fixtures (in alphabetical order)
  64  |   authenticatedPage: async ({ page }, use) => {
  65  |     // Prefer deterministic session via seeded JWT when NEXTAUTH_SECRET exists
  66  |     // and the tests are running with a seeded DB. Fall back to UI sign-in.
  67  |     // Prefer validated env access via lib/env.ts per project standards. Fallback
  68  |     // to process.env for local runs.
  69  |     // Resolve environment via lib/env if available to satisfy lint rules
  70  |     // and ensure central validation; keep process.env fallback for local runs
  71  |     let secret: string | undefined = undefined;
  72  |     let baseUrl = "http://localhost:3000";
  73  |     try {
  74  |       const { env } = await import("@/lib/env");
  75  |       if (env.NEXTAUTH_SECRET) secret = env.NEXTAUTH_SECRET as string;
  76  |       if (env.PLAYWRIGHT_BASE_URL) baseUrl = env.PLAYWRIGHT_BASE_URL as string;
  77  |     } catch {
  78  |       // fallback to process.env for local setups
  79  |       // eslint-disable-next-line n/no-process-env
  80  |       secret = process.env.NEXTAUTH_SECRET;
  81  |       // eslint-disable-next-line n/no-process-env
  82  |       baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? baseUrl;
  83  |     }
  84  | 
  85  |     if (secret) {
  86  |       const token = makeNextAuthJwtToken({ id: "seed-user" }, secret);
  87  | 
  88  |       // Use Playwright APIRequestContext to set cookie on the app domain
  89  |       // newContext() returns a Promise — await it so TypeScript types align
  90  |       const apiReq = await playwrightRequest.newContext();
  91  |       try {
  92  |         // This hits a small test-only endpoint we'll add to the app in dev mode
  93  |         await setAuthCookie(apiReq, baseUrl, token);
  94  |         // Load the page with the authenticated cookie set
> 95  |         await page.goto(`${baseUrl}/dashboard`);
      |                    ^ Error: page.goto: Target page, context or browser has been closed
  96  |         await page.waitForLoadState("domcontentloaded");
  97  |         await use(page);
  98  |       } finally {
  99  |         await apiReq.dispose();
  100 |       }
  101 |     } else {
  102 |       await signInWithSeedUser(page);
  103 |       await use(page);
  104 |     }
  105 |   },
  106 | 
  107 |   dashboardPage: async ({ authenticatedPage }, use) => {
  108 |     const dashboard = new DashboardPage(authenticatedPage);
  109 |     await use(dashboard);
  110 |   },
  111 | 
  112 |   myWalletsPage: async ({ authenticatedPage }, use) => {
  113 |     const myWallets = new MyWalletsPage(authenticatedPage);
  114 |     await use(myWallets);
  115 |   },
  116 | 
  117 |   page: async ({ page }, use) => {
  118 |     await use(page);
  119 |   },
  120 | 
  121 |   paymentTransferPage: async ({ authenticatedPage }, use) => {
  122 |     const transfer = new PaymentTransferPage(authenticatedPage);
  123 |     await use(transfer);
  124 |   },
  125 | 
  126 |   // Sign in/up pages use raw page - they're public pages that don't require auth
  127 |   signInPage: async ({ page }, use) => {
  128 |     const signIn = new SignInPage(page);
  129 |     await use(signIn);
  130 |   },
  131 | 
  132 |   signUpPage: async ({ page }, use) => {
  133 |     const signUp = new SignUpPage(page);
  134 |     await use(signUp);
  135 |   },
  136 | 
  137 |   transactionHistoryPage: async ({ authenticatedPage }, use) => {
  138 |     const history = new TransactionHistoryPage(authenticatedPage);
  139 |     await use(history);
  140 |   },
  141 | 
  142 |   unauthenticatedPage: async ({ page }, use) => {
  143 |     await page.context().clearCookies();
  144 |     await use(page);
  145 |   },
  146 | });
  147 | 
  148 | export { expect } from "@playwright/test";
  149 | 
```