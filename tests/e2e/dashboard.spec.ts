import { expect, test } from "../../tests/fixtures/auth";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Dashboard", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect to sign-in when accessing /dashboard", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 20_000 });
    });
  });

  test.describe("Authenticated Access", () => {
    test("should render dashboard heading", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/dashboard");
      await expect
        .soft(page.getByRole("heading", { name: /welcome back/i }).first())
        .toBeVisible({ timeout: 15_000 });
    });

    test("should show mobile navigation on small viewport", async ({
      authenticatedPage: page,
    }) => {
      await page.setViewportSize({ height: 812, width: 375 });
      await page.goto("/dashboard");
      await page.getByAltText("menu", { exact: true }).click();
      await expect
        .soft(page.getByRole("dialog"))
        .toBeVisible({ timeout: 10_000 });
    });
  });
});
