# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: dashboard.spec.ts >> Dashboard >> Unauthenticated Access >> should redirect to sign-in when accessing /dashboard
- Location: tests\e2e\dashboard.spec.ts:5:5

# Error details

```
Error: page.goto: Target page, context or browser has been closed
```

# Test source

```ts
  1  | import { expect, test } from "../../tests/fixtures/auth";
  2  | 
  3  | test.describe("Dashboard", () => {
  4  |   test.describe("Unauthenticated Access", () => {
  5  |     test("should redirect to sign-in when accessing /dashboard", async ({
  6  |       page,
  7  |     }) => {
> 8  |       await page.goto("/dashboard");
     |                  ^ Error: page.goto: Target page, context or browser has been closed
  9  |       await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 20_000 });
  10 |     });
  11 |   });
  12 | 
  13 |   test.describe("Authenticated Access", () => {
  14 |     test("should render dashboard heading", async ({ dashboardPage }) => {
  15 |       await dashboardPage.navigate();
  16 |       await expect
  17 |         .soft(dashboardPage.welcomeHeading.first())
  18 |         .toBeVisible({ timeout: 15_000 });
  19 |     });
  20 | 
  21 |     test("should show mobile navigation on small viewport", async ({
  22 |       authenticatedPage: page,
  23 |     }) => {
  24 |       await page.setViewportSize({ height: 812, width: 375 });
  25 |       await page.goto("/dashboard");
  26 |       await page.getByAltText("menu", { exact: true }).click();
  27 |       await expect
  28 |         .soft(page.getByRole("dialog"))
  29 |         .toBeVisible({ timeout: 10_000 });
  30 |     });
  31 |   });
  32 | });
  33 | 
```