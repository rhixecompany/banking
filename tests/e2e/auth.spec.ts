import { expect, test } from "../../tests/fixtures/auth";

test.describe("Authentication", () => {
  test.describe("Home Redirect", () => {
    test("should redirect unauthenticated users from / to sign-in", async ({
      page,
    }) => {
      await page.goto("/");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });

    test("should redirect authenticated users from / to dashboard", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/");
      await expect.soft(page).toHaveURL(/\/dashboard/, { timeout: 10_000 });
    });
  });

  test.describe("Navigation Flow", () => {
    test("should navigate from sign-in to sign-up and back", async ({
      page,
    }) => {
      await page.goto("/sign-in");
      await expect.soft(page).toHaveURL(/sign-in/);

      await page.getByRole("link", { name: /sign up/i }).click();
      await expect.soft(page).toHaveURL(/sign-up/, { timeout: 10_000 });

      await page.getByRole("link", { name: /sign in/i }).click();
      await expect.soft(page).toHaveURL(/sign-in/, { timeout: 10_000 });
    });
  });

  test.describe("Sign-In Page", () => {
    test("should show sign-in form", async ({ page }) => {
      await page.goto("/sign-in");
      await expect.soft(page.getByLabel("Email")).toBeVisible();
      await expect.soft(page.getByLabel("Password")).toBeVisible();
    });

    test("should show sign-up link", async ({ page }) => {
      await page.goto("/sign-in");
      await expect
        .soft(page.getByRole("link", { name: /sign up/i }))
        .toBeVisible();
    });

    test("should navigate to sign-up page", async ({ page }) => {
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

    test("should show error toast for non-existent email", async ({ page }) => {
      await page.goto("/sign-in");
      await page.getByLabel("Email").fill("nonexistent@example.com");
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: /sign in/i }).click();
      await expect
        .soft(page.locator("[data-sonner-toast]").first())
        .toBeVisible({
          timeout: 15_000,
        });
    });
  });

  test.describe("Sign-Up Page", () => {
    test("should show sign-up form", async ({ page }) => {
      await page.goto("/sign-up");
      await expect.soft(page.getByLabel("First Name")).toBeVisible();
      await expect.soft(page.getByLabel("Email")).toBeVisible();
      await expect.soft(page.getByLabel(/^Password$/)).toBeVisible();
    });

    test("should show sign-in link", async ({ page }) => {
      await page.goto("/sign-up");
      await expect
        .soft(page.getByRole("link", { name: /sign in/i }))
        .toBeVisible();
    });

    test("should navigate to sign-in page", async ({ page }) => {
      await page.goto("/sign-up");
      await page.getByRole("link", { name: /sign in/i }).click();
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });

    test("should show all sign-up form fields", async ({ page }) => {
      await page.goto("/sign-up");
      await expect.soft(page.getByLabel("First Name")).toBeVisible();
      await expect.soft(page.getByLabel("Last Name")).toBeVisible();
      await expect.soft(page.getByLabel("Address")).toBeVisible();
      await expect.soft(page.getByLabel("City")).toBeVisible();
      await expect.soft(page.getByLabel("State")).toBeVisible();
      await expect.soft(page.getByLabel("Postal Code")).toBeVisible();
      await expect.soft(page.getByLabel("Date of Birth")).toBeVisible();
      await expect.soft(page.getByLabel("SSN")).toBeVisible();
      await expect.soft(page.getByLabel("Email")).toBeVisible();
      await expect.soft(page.getByLabel(/^Password$/)).toBeVisible();
      await expect.soft(page.getByLabel("Confirm Password")).toBeVisible();
    });

    test("should show validation error for short password", async ({
      page,
    }) => {
      await page.goto("/sign-up");
      await page.getByLabel("First Name").fill("John");
      await page.getByLabel("Last Name").fill("Doe");
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

    test("should show validation error for password mismatch", async ({
      page,
    }) => {
      await page.goto("/sign-up");
      await page.getByLabel("First Name").fill("John");
      await page.getByLabel("Last Name").fill("Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel(/^Password$/).fill("password123");
      await page.getByLabel("Confirm Password").fill("differentpassword");
      await page.getByRole("button", { name: /sign up/i }).click();
      await expect.soft(page.getByText("Passwords do not match")).toBeVisible({
        timeout: 5000,
      });
    });

    test("should show validation error for short name", async ({ page }) => {
      await page.goto("/sign-up");
      await page.getByLabel("First Name").fill("J");
      await page.getByLabel("Last Name").fill("Doe");
      await page.getByLabel("Email").fill("john@example.com");
      await page.getByLabel(/^Password$/).fill("password123");
      await page.getByLabel("Confirm Password").fill("password123");
      await page.getByRole("button", { name: /sign up/i }).click();
      await expect
        .soft(
          page
            .locator("p.form-message")
            .filter({ hasText: /2 characters/i })
            .first(),
        )
        .toBeVisible({ timeout: 5000 });
    });
  });
});
