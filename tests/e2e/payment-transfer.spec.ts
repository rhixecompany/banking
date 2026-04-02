import { expect, test } from "../../tests/fixtures/auth";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Payment Transfer", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect unauthenticated users to sign-in", async ({
      page,
    }) => {
      await page.goto("/payment-transfer");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });

  test.describe("Authenticated Access", () => {
    test("should render payment transfer content", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/payment-transfer");
      await expect.soft(page.getByText("Payment Transfer")).toBeVisible({
        timeout: 15_000,
      });
    });
  });
});
