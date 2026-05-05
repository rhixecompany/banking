import { expect, test } from "@playwright/test";

import { addMockPlaidInitScript } from "../helpers/plaid.mock";

test("Plaid script is loaded at most once on my-wallets", async ({ page }) => {
  await addMockPlaidInitScript(page, "MOCK_PUBLIC_TOKEN");
  await page.goto("/my-wallets");
  // Wait for potential dynamic loads
  await page.waitForLoadState("networkidle");

  const count = await page.$$eval(
    'script[src^="https://cdn.plaid.com/link/v2/stable/link-initialize.js"]',
    (els) => els.length,
  );

  // Use soft assertion helpers where possible; playwright's default
  // assertion is acceptable here but keep the shape consistent.
  expect.soft(count).toBeLessThanOrEqual(1);
});
