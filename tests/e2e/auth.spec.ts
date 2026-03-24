import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test("should show sign-in form", async ({ page }) => {
    await page.goto("/sign-in");
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("should show sign-up form", async ({ page }) => {
    await page.goto("/sign-up");
    await expect(page.locator('input[name="firstName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });

  test("should navigate between sign-in and sign-up", async ({ page }) => {
    await page.goto("/sign-in");
    const signUpLink = page.locator('a[href="/sign-up"]');
    await expect(signUpLink).toBeVisible();
    await signUpLink.click();
    await expect(page).toHaveURL(/\/sign-up/);
  });

  test("should show validation error for invalid email", async ({ page }) => {
    await page.goto("/sign-in");
    await page.fill('input[name="email"]', "invalid-email");
    await page.fill('input[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=/email/i")).toBeVisible();
  });

  test("should show validation error for short password on sign-up", async ({
    page,
  }) => {
    await page.goto("/sign-up");
    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="password"]', "short");
    await page.fill('input[name="confirmPassword"]', "short");
    await page.click('button[type="submit"]');
    await expect(page.locator("text=/8 characters/i")).toBeVisible();
  });
});
