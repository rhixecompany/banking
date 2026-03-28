import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Pages", () => {
  test.describe("Home Page", () => {
    test("should redirect to sign-in when not authenticated", async ({
      page,
    }) => {
      await page.goto("/");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 5000 });
    });

    test("should load the home page when authenticated", async ({ page }) => {
      // This test would require authentication setup
      // For now, skip or mock authentication
      test.skip();
    });
  });

  test.describe("My Banks Page", () => {
    test("should redirect to sign-in when not authenticated", async ({
      page,
    }) => {
      await page.goto("/my-banks");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 5000 });
    });
  });

  test.describe("Transaction History Page", () => {
    test("should redirect to sign-in when not authenticated", async ({
      page,
    }) => {
      await page.goto("/transaction-history");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 5000 });
    });
  });

  test.describe("Payment Transfer Page", () => {
    test("should redirect to sign-in when not authenticated", async ({
      page,
    }) => {
      await page.goto("/payment-transfer");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 5000 });
    });
  });

  test.describe("Sign In Page", () => {
    test("should display sign-in form", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForLoadState("networkidle");
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test("should have link to sign-up page", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForLoadState("networkidle");
      const signUpLink = page.locator('a[href*="sign-up"]');
      await expect(signUpLink).toBeVisible();
    });

    test("should show validation error for invalid email", async ({ page }) => {
      await page.goto("/sign-in");
      await page.waitForLoadState("networkidle");
      await page.fill('input[name="email"]', "invalid-email");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      await expect(page.getByText("Email is Invalid.")).toBeVisible({
        timeout: 3000,
      });
    });
  });

  test.describe("Sign Up Page", () => {
    test("should display sign-up form", async ({ page }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");
      await expect(page.locator('input[name="firstName"]')).toBeVisible();
      await expect(page.locator('input[name="lastName"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
      await expect(page.locator('input[name="confirmPassword"]')).toBeVisible();
      await expect(page.locator('input[name="ssn"]')).toBeVisible();
    });

    test("should have link to sign-in page", async ({ page }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");
      const signInLink = page.locator('a[href*="sign-in"]');
      await expect(signInLink).toBeVisible();
    });

    test("should show validation error for short password", async ({
      page,
    }) => {
      await page.goto("/sign-up");
      await page.waitForLoadState("networkidle");
      await page.fill('input[name="firstName"]', "John");
      await page.fill('input[name="lastName"]', "Doe");
      await page.fill('input[name="address1"]', "123 Main St");
      await page.fill('input[name="city"]', "New York");
      await page.fill('input[name="state"]', "NY");
      await page.fill('input[name="postalCode"]', "10001");
      await page.fill('input[name="dateOfBirth"]', "1990-01-01");
      await page.fill('input[name="ssn"]', "1234");
      await page.fill('input[name="email"]', "john@example.com");
      await page.fill('input[name="password"]', "short");
      await page.fill('input[name="confirmPassword"]', "short");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
      await expect(page.locator("text=/8 characters/i").first()).toBeVisible({
        timeout: 3000,
      });
    });
  });
});
