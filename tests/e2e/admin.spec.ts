import { expect, test } from "../../tests/fixtures/auth";

test.describe("Admin Panel", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect to sign-in when accessing /admin without a session", async ({
      page,
    }) => {
      await page.goto("/admin");
      await expect(page).toHaveURL(/\/sign-in/, { timeout: 20_000 });
    });
  });

  test.describe("Non-Admin Authenticated Access", () => {
    test("should redirect to /dashboard when a non-admin visits /admin", async ({
      authenticatedPage: page,
    }) => {
      // The seed user is not an admin — expect redirect to /dashboard
      await page.goto("/admin");
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
    });
  });

  test.describe("Navigation Guard (root routes)", () => {
    test("should allow a non-admin to access /dashboard normally", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/dashboard");
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 20_000 });
    });

    test("should allow a non-admin to access /settings normally", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/settings");
      await expect(page).toHaveURL(/\/settings/, { timeout: 20_000 });
    });
  });
});
