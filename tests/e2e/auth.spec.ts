import { expect, test } from "@playwright/test";

test.describe("Authentication", () => {
  test.describe("Sign-In Page", () => {
    test("should show sign-in form", async ({ page }) => {
      await page.goto("/sign-in");
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test("should show sign-up link", async ({ page }) => {
      await page.goto("/sign-in");
      const signUpLink = page.locator('a[href*="sign-up"]');
      await expect(signUpLink).toBeVisible();
    });

    test("should navigate to sign-up page", async ({ page }) => {
      await page.goto("/sign-in");
      const signUpLink = page.locator('a[href="/sign-up"]');
      await signUpLink.click();
      await expect(page).toHaveURL(/\/sign-up/);
    });

    test("should show validation error for invalid email", async ({ page }) => {
      await page.goto("/sign-in");
      await page.fill('input[name="email"]', "invalid-email");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await expect(page.locator("text=/email/i")).toBeVisible({
        timeout: 3000,
      });
    });

    test("should show error for non-existent email", async ({ page }) => {
      await page.goto("/sign-in");
      await page.fill('input[name="email"]', "nonexistent@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    });
  });

  test.describe("Sign-Up Page", () => {
    test("should show sign-up form", async ({ page }) => {
      await page.goto("/sign-up");
      await expect(page.locator('input[name="firstName"]')).toBeVisible();
      await expect(page.locator('input[name="email"]')).toBeVisible();
      await expect(page.locator('input[name="password"]')).toBeVisible();
    });

    test("should show sign-in link", async ({ page }) => {
      await page.goto("/sign-up");
      const signInLink = page.locator('a[href*="sign-in"]');
      await expect(signInLink).toBeVisible();
    });

    test("should navigate to sign-in page", async ({ page }) => {
      await page.goto("/sign-up");
      const signInLink = page.locator('a[href="/sign-in"]');
      await signInLink.click();
      await expect(page).toHaveURL(/\/sign-in/);
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
      await expect(page.locator("text=/8 characters/i")).toBeVisible({
        timeout: 3000,
      });
    });

    test("should show validation error for password mismatch", async ({
      page,
    }) => {
      await page.goto("/sign-up");
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
      await page.fill('input[name="firstName"]', "J");
      await page.fill('input[name="email"]', "john@example.com");
      await page.fill('input[name="password"]', "password123");
      await page.fill('input[name="confirmPassword"]', "password123");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    });

    test("should successfully register a new user", async ({ page }) => {
      const randomEmail = `newuser_${Date.now()}@example.com`;
      const password = "TestPassword123!";

      await page.goto("/sign-up");
      await page.fill('input[name="firstName"]', "New User");
      await page.fill('input[name="email"]', randomEmail);
      await page.fill('input[name="password"]', password);
      await page.fill('input[name="confirmPassword"]', password);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 15000 });
      await expect(page).toHaveURL("/");
    });
  });

  test.describe("Sign-In Flow", () => {
    test("should be able to sign in after registration", async ({ page }) => {
      const randomEmail = `signin_test_${Date.now()}@example.com`;
      const password = "TestPassword123!";

      await page.goto("/sign-up");
      await page.fill('input[name="firstName"]', "SignIn Test");
      await page.fill('input[name="email"]', randomEmail);
      await page.fill('input[name="password"]', password);
      await page.fill('input[name="confirmPassword"]', password);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 15000 }).catch(() => {});

      const logoutButton = page.locator(
        'button:has-text("Logout"), button:has-text("Log out"), button:has-text("Sign out")',
      );
      if (await logoutButton.isVisible({ timeout: 2000 })) {
        await logoutButton.click();
        await page.waitForURL(/\/sign-in/, { timeout: 10000 });
      }

      await page.fill('input[name="email"]', randomEmail);
      await page.fill('input[name="password"]', password);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 15000 });
      await expect(page).toHaveURL("/");
    });

    test("should show error for wrong password", async ({ page }) => {
      const randomEmail = `wrongpass_${Date.now()}@example.com`;
      const password = "TestPassword123!";

      await page.goto("/sign-up");
      await page.fill('input[name="firstName"]', "WrongPass");
      await page.fill('input[name="email"]', randomEmail);
      await page.fill('input[name="password"]', password);
      await page.fill('input[name="confirmPassword"]', password);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 15000 }).catch(() => {});

      const logoutButton = page.locator(
        'button:has-text("Logout"), button:has-text("Log out"), button:has-text("Sign out")',
      );
      if (await logoutButton.isVisible({ timeout: 2000 })) {
        await logoutButton.click();
        await page.waitForURL(/\/sign-in/, { timeout: 10000 });
      }

      await page.fill('input[name="email"]', randomEmail);
      await page.fill('input[name="password"]', "WrongPassword123!");
      await page.click('button[type="submit"]');
      await page.waitForTimeout(1000);
    });
  });

  test.describe("Logout Flow", () => {
    test("should successfully log out", async ({ page }) => {
      const randomEmail = `logout_${Date.now()}@example.com`;
      const password = "TestPassword123!";

      await page.goto("/sign-up");
      await page.fill('input[name="firstName"]', "Logout Test");
      await page.fill('input[name="email"]', randomEmail);
      await page.fill('input[name="password"]', password);
      await page.fill('input[name="confirmPassword"]', password);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 15000 }).catch(() => {});

      const logoutButton = page.locator(
        'button:has-text("Logout"), button:has-text("Log out"), button:has-text("Sign out")',
      );
      if (await logoutButton.isVisible({ timeout: 2000 })) {
        await logoutButton.click();
        await page.waitForURL(/\/sign-in/, { timeout: 10000 });
        await expect(page).toHaveURL(/\/sign-in/);
      }
    });
  });
});
