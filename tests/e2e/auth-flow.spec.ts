import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Auth and Navigation Flow", () => {
  test("should navigate from sign-in to sign-up and back", async ({ page }) => {
    await page.goto("/sign-in");
    await expect.soft(page).toHaveURL(/sign-in/);

    await page.getByRole("link", { name: /sign up/i }).click();
    await expect.soft(page).toHaveURL(/sign-up/, { timeout: 10_000 });

    await page.getByRole("link", { name: /sign in/i }).click();
    await expect.soft(page).toHaveURL(/sign-in/, { timeout: 10_000 });
  });
});
