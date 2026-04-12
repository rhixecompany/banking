import { expect, test } from "@playwright/test";

test("Plaid script is loaded at most once on my-wallets", async ({ page }) => {
  await page.goto("/my-wallets");
  // Wait for potential dynamic loads
  await page.waitForLoadState("networkidle");

  const count = await page.$$eval(
    'script[src^="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]',
    (els) => els.length,
  );

  expect(count).toBeLessThanOrEqual(1);
});
