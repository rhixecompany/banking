import { expect, test } from "@playwright/test";

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

    const links = [{ selector: 'a[href="/sign-up"]', url: "/sign-up" }];

    for (const link of links) {
      const element = page.locator(link.selector).first();
      if (await element.isVisible()) {
        await element.click();
        await expect(page).toHaveURL(new RegExp(link.url));
        await page.goBack();
      }
    }
  });
});

test.describe("Forms", () => {
  test("should have working form inputs", async ({ page }) => {
    await page.goto("/sign-in");

    const emailInput = page.locator('input[name="email"]');
    const passwordInput = page.locator('input[name="password"]');

    await emailInput.fill("test@example.com");
    await passwordInput.fill("password123");

    await expect(emailInput).toHaveValue("test@example.com");
    await expect(passwordInput).toHaveValue("password123");
  });

  test("should clear form on reset", async ({ page }) => {
    await page.goto("/sign-up");

    await page.fill('input[name="firstName"]', "John");
    await page.fill('input[name="email"]', "john@example.com");
    await page.fill('input[name="password"]', "password123");

    await page.click('button:has-text("Reset")');

    await expect(page.locator('input[name="firstName"]')).toHaveValue("");
  });
});
