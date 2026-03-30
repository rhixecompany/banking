import { expect, test } from "@playwright/test";

import { signInWithSeedUser } from "./helpers/auth";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Pages", () => {
  test.describe("Home Page", () => {
    test("should redirect to sign-in when not authenticated", async ({
      page,
    }) => {
      await page.goto("/");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });

    test("should redirect authenticated users from home to dashboard", async ({
      page,
    }) => {
      await signInWithSeedUser(page);
      await page.goto("/");
      await expect.soft(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    });
  });

  test.describe("My Banks Page", () => {
    test("should redirect to sign-in when not authenticated", async ({
      page,
    }) => {
      await page.goto("/my-banks");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });

  test.describe("Transaction History Page", () => {
    test("should redirect to sign-in when not authenticated", async ({
      page,
    }) => {
      await page.goto("/transaction-history");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });

  test.describe("Payment Transfer Page", () => {
    test("should redirect to sign-in when not authenticated", async ({
      page,
    }) => {
      await page.goto("/payment-transfer");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });

  test.describe("Sign In Page", () => {
    test("should display sign-in form", async ({ page }) => {
      await page.goto("/sign-in");
      await expect.soft(page.getByLabel("Email")).toBeVisible();
      await expect.soft(page.getByLabel("Password")).toBeVisible();
      await expect
        .soft(page.getByRole("button", { name: /sign in/i }))
        .toBeVisible();
    });

    test("should have link to sign-up page", async ({ page }) => {
      await page.goto("/sign-in");
      await page.getByRole("link", { name: /sign up/i }).click();
      await expect.soft(page).toHaveURL(/\/sign-up/, { timeout: 10_000 });
    });

    test("should show validation error for invalid email", async ({ page }) => {
      await page.goto("/sign-in");
      await page.getByLabel("Email").fill("invalid-email");
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: /sign in/i }).click();
      await expect.soft(page.getByText("Invalid email address")).toBeVisible({
        timeout: 5000,
      });
    });
  });

  test.describe("Sign Up Page", () => {
    test("should display sign-up form", async ({ page }) => {
      await page.goto("/sign-up");
      await expect.soft(page.getByLabel("First Name")).toBeVisible();
      await expect.soft(page.getByLabel("Last Name")).toBeVisible();
      await expect.soft(page.getByLabel("Email")).toBeVisible();
      await expect.soft(page.getByLabel(/^Password$/)).toBeVisible();
      await expect.soft(page.getByLabel("Confirm Password")).toBeVisible();
      await expect.soft(page.getByLabel("SSN")).toBeVisible();
    });

    test("should have link to sign-in page", async ({ page }) => {
      await page.goto("/sign-up");
      await page.getByRole("link", { name: /sign in/i }).click();
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });

    test("should show validation error for short password", async ({
      page,
    }) => {
      await page.goto("/sign-up");
      await page.getByLabel("First Name").fill("John");
      await page.getByLabel("Last Name").fill("Doe");
      await page.getByLabel("Address").fill("123 Main St");
      await page.getByLabel("City").fill("New York");
      await page.getByLabel("State").fill("NY");
      await page.getByLabel("Postal Code").fill("10001");
      await page.getByLabel("Date of Birth").fill("1990-01-01");
      await page.getByLabel("SSN").fill("1234");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel(/^Password$/).fill("short");
      await page.getByLabel("Confirm Password").fill("short");
      await page.getByRole("button", { name: /sign up/i }).click();
      await expect
        .soft(
          page
            .locator("p.form-message")
            .filter({ hasText: /8 characters/i })
            .first(),
        )
        .toBeVisible({ timeout: 5000 });
    });
  });
});
