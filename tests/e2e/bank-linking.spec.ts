import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Bank Linking", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect to sign-in when accessing my-banks", async ({
      page,
    }) => {
      await page.goto("/my-banks");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });

  test.describe("Sign-in validation", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/sign-in");
    });

    test("should show sign-in form", async ({ page }) => {
      await expect.soft(page.getByLabel("Email")).toBeVisible();
      await expect.soft(page.getByLabel("Password")).toBeVisible();
    });

    test("should show error toast for invalid credentials", async ({
      page,
    }) => {
      await page.getByLabel("Email").fill("invalid@example.com");
      await page.getByLabel("Password").fill("wrongpassword");
      await page.getByRole("button", { name: /sign in/i }).click();
      await expect
        .soft(page.locator("[data-sonner-toast]").first())
        .toBeVisible({
          timeout: 15_000,
        });
    });
  });
});
