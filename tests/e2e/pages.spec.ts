import { expect, test } from "@playwright/test";

test.describe("Pages", () => {
  test.describe("Home Page", () => {
    test("should load the home page", async ({ page }) => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Banking/i);
    });

    test("should display welcome message", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("text=/welcome/i")).toBeVisible();
    });

    test("should display navigation elements", async ({ page }) => {
      await page.goto("/");
      await expect(page.locator("nav, header, aside")).toBeVisible();
    });
  });

  test.describe("My Banks Page", () => {
    test("should show My Banks heading when authenticated", async ({
      page,
    }) => {
      await page.goto("/my-banks");
      await expect(page.locator("text=/my banks/i")).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe("Transaction History Page", () => {
    test("should show Transaction History content when authenticated", async ({
      page,
    }) => {
      await page.goto("/transaction-history");
      await expect(page.locator("text=/transaction/i")).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe("Payment Transfer Page", () => {
    test("should show Payment Transfer content when authenticated", async ({
      page,
    }) => {
      await page.goto("/payment-transfer");
      await expect(page.locator("text=/payment|transfer/i")).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe("Sign In Page", () => {
    test("should display sign-in form", async ({ page }) => {
      await page.goto("/sign-in");
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test("should have link to sign-up page", async ({ page }) => {
      await page.goto("/sign-in");
      const signUpLink = page.locator('a[href*="sign-up"]');
      await expect(signUpLink).toBeVisible();
    });

    test("should show validation error for invalid email", async ({ page }) => {
      await page.goto("/sign-in");
      await page.fill('input[name="email"]', "invalid-email");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      await expect(page.locator("text=/email/i")).toBeVisible({
        timeout: 3000,
      });
    });
  });

  test.describe("Sign Up Page", () => {
    test("should display sign-up form", async ({ page }) => {
      await page.goto("/sign-up");
      await expect(page.locator('input[name="firstName"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
    });

    test("should have link to sign-in page", async ({ page }) => {
      await page.goto("/sign-up");
      const signInLink = page.locator('a[href*="sign-in"]');
      await expect(signInLink).toBeVisible();
    });

    test("should show validation error for short password", async ({
      page,
    }) => {
      await page.goto("/sign-up");
      await page.fill('input[name="firstName"]', "John");
      await page.fill('input[name="email"]', "john@example.com");
      await page.fill('input[name="password"]', "short");
      await page.fill('input[name="confirmPassword"]', "short");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      await expect(page.locator("text=/8 characters/i")).toBeVisible({
        timeout: 3000,
      });
    });
  });
});
