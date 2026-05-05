import { expect, type Page } from "@playwright/test";

/**
 * Completes a Dwolla transfer in sandbox environment.
 * This helper fills in the transfer form and submits the transaction.
 *
 * @param page - Playwright page object
 * @param amount - Transfer amount as string (e.g., "100.00")
 * @param recipientEmail - Recipient's email address
 * @param sharableId - Recipient's Plaid sharable ID
 * @returns Promise that resolves when the transfer is submitted
 */
export async function completeDwollaTransfer(
  page: Page,
  amount: string,
  recipientEmail: string,
  sharableId: string,
): Promise<void> {
  // Navigate to payment transfer page
  await page.goto("/payment-transfer");

  // Fill in the transfer form
  await page.fill('[data-testid="transfer-amount"]', amount);
  await page.fill('[data-testid="recipient-email"]', recipientEmail);
  await page.fill('[data-testid="sharable-id"]', sharableId);

  // Select source bank if required
  const sourceBankSelect = page.locator('[data-testid="sender-bank"]');
  if (await sourceBankSelect.isVisible()) {
    await sourceBankSelect.click();
    await page.locator('[data-testid="bank-option"]').first().click();
  }

  // Submit the transfer
  await page.click('[data-testid="transfer-submit"]');

  // Wait for success indicator
  await expect
    .soft(page.locator('[data-testid="transfer-success"]'))
    .toBeVisible({ timeout: 15000 });
}

/**
 * Fills in the payment transfer form without submitting.
 *
 * @param page - Playwright page object
 * @param amount - Transfer amount
 * @param recipientEmail - Recipient email
 * @param sharableId - Recipient's sharable ID
 */
export async function fillTransferForm(
  page: Page,
  amount: string,
  recipientEmail: string,
  sharableId: string,
): Promise<void> {
  await page.goto("/payment-transfer");

  await page.fill('[data-testid="transfer-amount"]', amount);
  await page.fill('[data-testid="recipient-email"]', recipientEmail);
  await page.fill('[data-testid="sharable-id"]', sharableId);
}

/**
 * Submits the transfer form and waits for result.
 *
 * @param page - Playwright page object
 * @returns Promise that resolves to true if transfer was successful
 */
export async function submitTransfer(page: Page): Promise<boolean> {
  await page.click('[data-testid="transfer-submit"]');

  try {
    await expect
      .soft(page.locator('[data-testid="transfer-success"]'))
      .toBeVisible({ timeout: 15000 });
    return true;
  } catch {
    // Check for error message
    const error = page.locator('[data-testid="transfer-error"]');
    return await error.isVisible();
  }
}

/**
 * Gets the current balance from the dashboard.
 *
 * @param page - Playwright page object
 * @returns Promise that resolves to the balance as a number
 */
export async function getCurrentBalance(page: Page): Promise<number> {
  await page.goto("/dashboard");
  const balanceText = await page
    .locator('[data-testid="total-balance"]')
    .textContent();
  const numericString = balanceText?.replaceAll(/[^0-9.]/g, "") ?? "0";
  return Number.parseFloat(numericString);
}
