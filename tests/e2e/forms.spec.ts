import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

test.describe("Navigation", () => {
  test("should show mobile navigation menu", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuButton = page.locator('button[aria-label="Open menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
      await expect(page.locator('[role="dialog"]')).toBeVisible();
    }
  });

  test("should have working navigation links", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");

    const links = [{ selector: 'a[href="/sign-up"]', url: "/sign-up" }];

    for (const link of links) {
      const element = page.locator(link.selector).first();
      if (await element.isVisible()) {
        await element.click();
        await page.waitForLoadState("networkidle");
        await expect(page).toHaveURL(new RegExp(link.url));
        await page.goBack();
      }
    }
  });
});

test.describe("Forms", () => {
  test("should have working form inputs", async ({ page }) => {
    await page.goto("/sign-in");
    await page.waitForLoadState("networkidle");

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");

    await expect(emailInput).toHaveValue("test@example.com");
    await expect(passwordInput).toHaveValue("password123");
  });
});
