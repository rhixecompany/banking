import { expect, test } from "@playwright/test";

import { signInWithSeedUser } from "./helpers/auth";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Navigation", () => {
  test("should open mobile navigation sheet on dashboard", async ({ page }) => {
    await page.setViewportSize({ height: 812, width: 375 });
    await signInWithSeedUser(page);
    await page.goto("/dashboard");
    await page.getByAltText("menu").click();
    await expect
      .soft(page.getByRole("dialog"))
      .toBeVisible({ timeout: 10_000 });
  });

  test("should navigate sign-in to sign-up via footer link", async ({
    page,
  }) => {
    await page.goto("/sign-in");
    await page.getByRole("link", { name: /sign up/i }).click();
    await expect.soft(page).toHaveURL(/\/sign-up/, { timeout: 10_000 });
  });
});

test.describe("Forms", () => {
  test("should have working form inputs", async ({ page }) => {
    await page.goto("/sign-in");
    const emailInput = page.getByLabel("Email");
    const passwordInput = page.getByLabel("Password");
    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");
    await expect.soft(emailInput).toHaveValue("test@example.com");
    await expect.soft(passwordInput).toHaveValue("password123");
  });
});
