import { expect, test } from "@playwright/test";

test.describe("Protected Pages", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect to sign-in when accessing dashboard", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 5000 });
    });

    test("should redirect to sign-in when accessing my-banks", async ({
      page,
    }) => {
      await page.goto("/my-banks");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 5000 });
    });

    test("should redirect to sign-in when accessing transaction-history", async ({
      page,
    }) => {
      await page.goto("/transaction-history");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 5000 });
    });

    test("should redirect to sign-in when accessing payment-transfer", async ({
      page,
    }) => {
      await page.goto("/payment-transfer");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 5000 });
    });

    test("should redirect to sign-in when accessing settings", async ({
      page,
    }) => {
      await page.goto("/settings");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 5000 });
    });
  });
});
