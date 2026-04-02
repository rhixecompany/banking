import { expect, test } from "../../tests/fixtures/auth";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Settings", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect to sign-in when accessing /settings", async ({
      page,
    }) => {
      await page.goto("/settings");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 20_000 });
    });
  });

  test.describe("Authenticated Access", () => {
    test("should render settings heading", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/settings");
      await expect
        .soft(page.getByRole("heading", { name: /settings/i }).first())
        .toBeVisible({ timeout: 15_000 });
    });

    test("should display profile form fields", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/settings");
      await expect
        .soft(page.getByLabel(/name/i).first())
        .toBeVisible({ timeout: 10_000 });
    });
  });
});
