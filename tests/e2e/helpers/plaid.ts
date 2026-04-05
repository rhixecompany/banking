import type { Page } from "@playwright/test";

/**
 * Completes the Plaid Link flow in sandbox environment.
 * This helper navigates through the Plaid Link iframe to connect a bank account.
 *
 * @param page - Playwright page object
 * @returns Promise that resolves when the flow is complete
 */
export async function completePlaidFlow(page: Page): Promise<void> {
  // Click the Plaid Link button to open the iframe
  await page.click('[data-testid="plaid-link-button"]');

  // Wait for the Plaid Link iframe to load
  const frame = page.frameLocator('[title="Plaid Link"]');

  // Click Continue to proceed to credentials
  await frame.locator('button:has-text("Continue")').click();

  // Enter sandbox credentials
  await frame.locator('[name="username"]').fill("user_good");
  await frame.locator('[name="password"]').fill("pass_good");

  // Submit credentials
  await frame.locator('button:has-text("Submit")').click();

  // Handle any MFA if required (click Continue again)
  await frame.locator('button:has-text("Continue")').click();

  // Select the first bank account (usually the default selection)
  await frame.locator('button:has-text("Continue")').click();

  // Wait for the flow to complete
  await page.waitForURL(/\/(my-banks|dashboard)/, { timeout: 10000 });
}

/**
 * Navigates to the bank connection page and initiates Plaid Link.
 *
 * @param page - Playwright page object
 */
export async function openPlaidLink(page: Page): Promise<void> {
  await page.goto("/my-banks");
  await page.click('[data-testid="connect-bank-button"]');
}

/**
 * Verifies that a bank account appears in the connected banks list.
 *
 * @param page - Playwright page object
 * @param bankName - Expected bank name to verify
 * @returns Promise that resolves to true if bank is found
 */
export async function verifyConnectedBank(
  page: Page,
  bankName: string,
): Promise<boolean> {
  const bankElement = page.locator(
    `[data-testid="bank-item"]:has-text("${bankName}")`,
  );
  return await bankElement.isVisible();
}
