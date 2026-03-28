import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Authentication", () => {
  test.describe("Sign-In Page", () => {
    test("should show sign-in form", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForLoadState("networkidle");
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test("should show sign-up link", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForLoadState("networkidle");
      const signUpLink = page.locator('a[href*="sign-up"]');
      await expect(signUpLink).toBeVisible();
    });

    test("should navigate to sign-up page", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForLoadState("networkidle");
      const signUpLink = page.locator('a[href="/sign-up"]');
      await signUpLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/sign-up/);
    });

    test("should show validation error for invalid email", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForLoadState("networkidle");
      await page.fill('input[name="email"]', "invalid-email");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await expect(page.getByText("Email is Invalid.")).toBeVisible({
        timeout: 3000,
      });
    });

    test("should show error for non-existent email", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForLoadState("networkidle");
      await page.fill('input[name="email"]', "nonexistent@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    });
  });

  test.describe("Sign-Up Page", () => {
    test("should show sign-up form", async ({ page }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");
      await expect(page.locator('input[name="firstName"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test("should show sign-in link", async ({ page }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");
      const signInLink = page.locator('a[href*="sign-in"]');
      await expect(signInLink).toBeVisible();
    });

    test("should navigate to sign-in page", async ({ page }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");
      const signInLink = page.locator('a[href="/sign-in"]');
      await signInLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test("should show validation error for short password", async ({
      page,
    }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");
      await page.fill('input[name="firstName"]', "John");
      await page.fill('input[name="email"]', "john@example.com");
      await page.fill('input[name="password"]', "short");
      await page.fill('input[name="confirmPassword"]', "short");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=/8 characters/i").first()).toBeVisible({
        timeout: 3000,
      });
    });

    test("should show validation error for password mismatch", async ({
      page,
    }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");
      await page.fill('input[name="firstName"]', "John");
      await page.fill('input[name="email"]', "john@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "differentpassword");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      const errorText = page.locator("text=/match|same|password/i");
      await expect(errorText.first()).toBeVisible({ timeout: 3000 });
    });

    test("should show validation error for short name", async ({ page }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");
      await page.fill('input[name="firstName"]', "J");
      await page.fill('input[name="email"]', "john@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    });
  });
});
