import { expect, test } from "../../tests/fixtures/auth";

test.describe("Authentication", () => {
  test.describe("Home Page", () => {
    test("should show landing page for unauthenticated users", async ({
      page,
    }) => {
      await page.goto("/");
      await expect.soft(page).toHaveTitle(/Horizon Banking/i);
      await expect
        .soft(page.getByRole("heading", { name: /ready to get started/i }))
        .toBeVisible();
    });

    test("should show landing page for authenticated users", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/");
      await expect.soft(page).toHaveTitle(/Horizon Banking/i);
      await expect
        .soft(page.getByRole("heading", { name: /ready to get started/i }))
        .toBeVisible();
    });
  });

  test.describe("Navigation Flow", () => {
    test("should navigate from sign-in to sign-up and back", async ({
      signInPage,
      signUpPage,
    }) => {
      await signInPage.navigate();
      await expect.soft(signInPage.page).toHaveURL(/sign-in/);

      await signInPage.goToSignUp();
      await expect.soft(signUpPage.page).toHaveURL(/sign-up/);

      await signUpPage.goToSignIn();
      await expect.soft(signInPage.page).toHaveURL(/sign-in/);
    });
  });

  test.describe("Sign-In Page", () => {
    test("should show sign-in form", async ({ signInPage }) => {
      await signInPage.navigate();
      await expect.soft(signInPage.emailInput).toBeVisible();
      await expect.soft(signInPage.passwordInput).toBeVisible();
    });

    test("should show sign-up link", async ({ signInPage }) => {
      await signInPage.navigate();
      await expect.soft(signInPage.signUpLink).toBeVisible();
    });

    test("should navigate to sign-up page", async ({ signInPage }) => {
      await signInPage.navigate();
      await signInPage.goToSignUp();
      await expect.soft(signInPage.page).toHaveURL(/\/sign-up/);
    });

    test("should show validation error for invalid email", async ({
      signInPage,
    }) => {
      await signInPage.navigate();
      await signInPage.fillEmail("invalid-email");
      await signInPage.fillPassword("password123");
      await signInPage.submit();
      await expect.soft(signInPage.errorMessage).toBeVisible({
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
    test("should show sign-up form", async ({ signUpPage }) => {
      await signUpPage.navigate();
      await expect.soft(signUpPage.firstNameInput).toBeVisible();
      await expect.soft(signUpPage.emailInput).toBeVisible();
      await expect.soft(signUpPage.passwordInput).toBeVisible();
    });

    test("should show sign-in link", async ({ signUpPage }) => {
      await signUpPage.navigate();
      await expect.soft(signUpPage.signInLink).toBeVisible();
    });

    test("should navigate to sign-in page", async ({ signUpPage }) => {
      await signUpPage.navigate();
      await signUpPage.goToSignIn();
      await expect.soft(signUpPage.page).toHaveURL(/\/sign-in/);
    });

    test("should show all sign-up form fields", async ({ signUpPage }) => {
      await signUpPage.navigate();
      await expect.soft(signUpPage.firstNameInput).toBeVisible();
      await expect.soft(signUpPage.lastNameInput).toBeVisible();
      await expect.soft(signUpPage.emailInput).toBeVisible();
      await expect.soft(signUpPage.passwordInput).toBeVisible();
      await expect.soft(signUpPage.confirmPasswordInput).toBeVisible();
    });

    test("should show validation error for short password", async ({
      page,
      signUpPage,
    }) => {
      await signUpPage.navigate();
      await signUpPage.fillFirstName("John");
      await signUpPage.fillLastName("Doe");
      await signUpPage.fillEmail("john@example.com");
      await signUpPage.fillPassword("short");
      await signUpPage.fillConfirmPassword("short");
      await signUpPage.submit();
      await expect
        .soft(page.locator("p.form-message").getByText(/8 characters/i))
        .toBeVisible({ timeout: 5000 });
    });

    test("should show validation error for password mismatch", async ({
      page,
      signUpPage,
    }) => {
      await signUpPage.navigate();
      await signUpPage.fillFirstName("John");
      await signUpPage.fillLastName("Doe");
      await signUpPage.fillEmail("john@example.com");
      await signUpPage.fillPassword("password123");
      await signUpPage.fillConfirmPassword("differentpassword");
      await signUpPage.submit();
      await expect
        .soft(page.getByText("Passwords do not match"))
        .toBeVisible({ timeout: 5000 });
    });

    test("should show validation error for short name", async ({
      page,
      signUpPage,
    }) => {
      await signUpPage.navigate();
      await signUpPage.fillFirstName("J");
      await signUpPage.fillLastName("Doe");
      await signUpPage.fillEmail("john@example.com");
      await signUpPage.fillPassword("password123");
      await signUpPage.fillConfirmPassword("password123");
      await signUpPage.submit();
      await expect
        .soft(page.locator("p.form-message").getByText(/2 characters/i))
        .toBeVisible({ timeout: 5000 });
    });
  });
});
