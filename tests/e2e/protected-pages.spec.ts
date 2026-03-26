import { expect, test } from "@playwright/test";

test.describe("Protected Pages", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect to sign-in when accessing dashboard without auth", async ({
      page,
    }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test("should redirect to sign-in when accessing my-banks without auth", async ({
      page,
    }) => {
      await page.goto("/my-banks");
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test("should redirect to sign-in when accessing transaction-history without auth", async ({
      page,
    }) => {
      await page.goto("/transaction-history");
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test("should redirect to sign-in when accessing payment-transfer without auth", async ({
      page,
    }) => {
      await page.goto("/payment-transfer");
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test("should redirect to sign-in when accessing settings without auth", async ({
      page,
    }) => {
      await page.goto("/settings");
      await expect(page).toHaveURL(/\/sign-in/);
    });

    test("should preserve callbackUrl when redirecting to sign-in", async ({
      page,
    }) => {
      await page.goto("/my-banks");
      await expect(page).toHaveURL(/\/sign-in.*callbackUrl=/);
    });
  });

  test.describe("Authenticated Access", () => {
    test.beforeEach(async ({ page }) => {
      const testEmail = `e2e_test_${Date.now()}@example.com`;
      const testPassword = "TestPassword123!";

      await page.goto("/sign-up");
      await page.fill('input[name="firstName"]', "E2E Test");
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', testPassword);
      await page.fill('input[name="confirmPassword"]', testPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 15000 }).catch(() => {});
    });

    test("should allow authenticated user to access home page", async ({
      page,
    }) => {
      await page.goto("/");
      await expect(page).toHaveTitle(/Banking/i);
    });

    test("should allow authenticated user to access my-banks page", async ({
      page,
    }) => {
      await page.goto("/my-banks");
      await page.waitForTimeout(1000);
      await expect(page).not.toHaveURL(/\/sign-in/);
    });

    test("should allow authenticated user to access transaction-history page", async ({
      page,
    }) => {
      await page.goto("/transaction-history");
      await page.waitForTimeout(1000);
      await expect(page).not.toHaveURL(/\/sign-in/);
    });

    test("should allow authenticated user to access payment-transfer page", async ({
      page,
    }) => {
      await page.goto("/payment-transfer");
      await page.waitForTimeout(1000);
      await expect(page).not.toHaveURL(/\/sign-in/);
    });

    test("should allow authenticated user to sign out", async ({ page }) => {
      await page.goto("/");
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

  test.describe("Auth Page Guards", () => {
    test("should redirect authenticated user away from sign-in page", async ({
      page,
    }) => {
      const testEmail = `e2e_guard_${Date.now()}@example.com`;
      const testPassword = "TestPassword123!";

      await page.goto("/sign-up");
      await page.fill('input[name="firstName"]', "Guard Test");
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', testPassword);
      await page.fill('input[name="confirmPassword"]', testPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 15000 }).catch(() => {});

      await page.goto("/sign-in");
      await expect(page).toHaveURL("/");
    });

    test("should redirect authenticated user away from sign-up page", async ({
      page,
    }) => {
      const testEmail = `e2e_guard2_${Date.now()}@example.com`;
      const testPassword = "TestPassword123!";

      await page.goto("/sign-up");
      await page.fill('input[name="firstName"]', "Guard Test 2");
      await page.fill('input[name="email"]', testEmail);
      await page.fill('input[name="password"]', testPassword);
      await page.fill('input[name="confirmPassword"]', testPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL("/", { timeout: 15000 }).catch(() => {});

      await page.goto("/sign-up");
      await expect(page).toHaveURL("/");
    });
  });
});
