import { expect, test } from "../../tests/fixtures/auth";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Transaction History", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect to sign-in when accessing /transaction-history", async ({
      page,
    }) => {
      await page.goto("/transaction-history");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 20_000 });
    });
  });

  test.describe("Authenticated Access", () => {
    test("should render transaction history heading", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/transaction-history");
      await expect
        .soft(
          page.getByRole("heading", { name: /transaction history/i }).first(),
        )
        .toBeVisible({ timeout: 15_000 });
    });

    test("should display transaction table", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/transaction-history");
      await expect
        .soft(page.getByRole("table").first())
        .toBeVisible({ timeout: 15_000 });
    });
  });
});
