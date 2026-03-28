import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Auth and Navigation Flow", () => {
  test("should navigate from sign-in to sign-up and back", async ({ page }) => {
    // Visit sign-in page
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/sign-in/);

    // Navigate to sign-up
    await page.getByRole("link", { name: /sign up/i }).click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/sign-up/);

    // Navigate back to sign-in
    await page.getByRole("link", { name: /sign in/i }).click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/sign-in/);
  });
});
