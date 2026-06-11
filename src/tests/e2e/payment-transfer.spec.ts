import { dwollaDal, transactionDal } from "@/dal";

import { expect, SEED_USER_ID, test } from "../../tests/fixtures/auth";
import { completeDwollaTransfer } from "./helpers/dwolla";

/**
 * E2E tests for ACH transfer flow.
 *
 * Tests cover:
 * - Unauthenticated access → redirect
 * - Authenticated access → form render
 * - Form validation (required fields, formats)
 * - Happy path with mock transfer
 * - DB metadata verification
 * - Error handling
 */
test.describe("Payment Transfer", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect unauthenticated users to sign-in", async ({
      page,
    }) => {
      // Page load is slow due to PlaidProvider - increase timeout
      await page.goto("/payment-transfer", { timeout: 30_000 });
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 30_000 });
    });
  });

  test.describe("Authenticated Access", () => {
    test.beforeEach(async ({ paymentTransferPage }) => {
      await paymentTransferPage.navigate();
    });

    test("should render payment transfer form with all fields", async ({
      paymentTransferPage,
    }) => {
      // Page load is slow due to PlaidProvider calling createLinkToken on every render
      // Increase timeout to accommodate ~10s page load + element detection
      await expect.soft(paymentTransferPage.pageHeading).toBeVisible({
        timeout: 30_000,
      });
      await expect.soft(paymentTransferPage.sourceWalletSelect).toBeVisible({
        timeout: 30_000,
      });
      await expect.soft(paymentTransferPage.recipientSelect).toBeVisible({
        timeout: 30_000,
      });
      await expect.soft(paymentTransferPage.amountInput).toBeVisible({
        timeout: 30_000,
      });
      await expect.soft(paymentTransferPage.submitButton).toBeVisible({
        timeout: 30_000,
      });
    });

    test("should show validation errors for empty form", async ({
      paymentTransferPage,
    }) => {
      await paymentTransferPage.submitTransfer();
      await expect.soft(paymentTransferPage.validationError).toBeVisible({
        timeout: 10_000,
      });
    });

    test("should reject invalid amount format", async ({
      paymentTransferPage,
    }) => {
      // Page load is slow due to PlaidProvider - increase timeout
      // Use a value below the minimum (0.01) to trigger validation error
      // Note: Cannot type "abc" into type=number input, so test with 0.001
      await paymentTransferPage.enterAmount("0.001");
      await paymentTransferPage.submitTransfer();
      await expect.soft(paymentTransferPage.validationError).toBeVisible({
        timeout: 30_000,
      });
    });

    test("should reject negative amount", async ({ paymentTransferPage }) => {
      // Page load is slow due to PlaidProvider - increase timeout
      await paymentTransferPage.enterAmount("-10.00");
      await paymentTransferPage.submitTransfer();
      await expect.soft(paymentTransferPage.validationError).toBeVisible({
        timeout: 30_000,
      });
    });

    test("should reject zero amount", async ({ paymentTransferPage }) => {
      // Page load is slow due to PlaidProvider - increase timeout
      await paymentTransferPage.enterAmount("0.00");
      await paymentTransferPage.submitTransfer();
      await expect.soft(paymentTransferPage.validationError).toBeVisible({
        timeout: 30_000,
      });
    });

    test("should complete successful transfer with mock data", async ({
      paymentTransferPage,
    }) => {
      // Page load is slow due to PlaidProvider - increase timeout
      await completeDwollaTransfer(
        paymentTransferPage.page,
        "10.00",
        "recipient.seed@example.com",
        "seed-share-checking-001",
      );
      // Success element uses sr-only class (visually hidden), so use toBeAttached
      // instead of toBeVisible to check if it's in the DOM
      const success = paymentTransferPage.page.locator(
        '[data-testid="transfer-success"]',
      );
      await expect.soft(success).toBeAttached({ timeout: 30_000 });
    });

    test("should create dwolla_transfers row after transfer", async ({
      paymentTransferPage,
    }) => {
      await completeDwollaTransfer(
        paymentTransferPage.page,
        "5.00",
        "recipient.seed@example.com",
        "seed-share-checking-001",
      );

      // Wait for success message before DB check (sr-only element, use toBeAttached)
      const success = paymentTransferPage.page.locator(
        '[data-testid="transfer-success"]',
      );
      await expect.soft(success).toBeAttached({ timeout: 30_000 });

      const transfers = await dwollaDal.findTransfersByUserId(SEED_USER_ID);

      expect.soft(transfers.length).toBeGreaterThanOrEqual(1);
    });

    test("should create transactions row after transfer", async ({
      paymentTransferPage,
    }) => {
      await completeDwollaTransfer(
        paymentTransferPage.page,
        "5.00",
        "recipient.seed@example.com",
        "seed-share-checking-001",
      );

      // Wait for success message before DB check (sr-only element, use toBeAttached)
      const success = paymentTransferPage.page.locator(
        '[data-testid="transfer-success"]',
      );
      await expect.soft(success).toBeAttached({ timeout: 30_000 });

      const transactions = await transactionDal.findByUserId(SEED_USER_ID);

      expect.soft(transactions.length).toBeGreaterThanOrEqual(1);
    });

    test("should show insufficient funds error when balance low", async ({
      paymentTransferPage,
    }) => {
      const page = paymentTransferPage.page;

      // Select source bank - click trigger, wait for dropdown, click option
      await page.locator("#source-bank").click();
      await page.waitForSelector('[role="option"]', { state: "visible" });
      await page.locator('[role="option"]').first().click();

      // Select recipient - click trigger, wait for dropdown, click option
      await page.locator("#recipient").click();
      await page.waitForSelector('[role="option"]', { state: "visible" });
      await page.locator('[role="option"]').first().click();

      // Enter amount exceeding available balance
      await paymentTransferPage.enterAmount("999999.00");
      await paymentTransferPage.submitTransfer();
      await expect.soft(paymentTransferPage.errorMessage).toBeVisible({
        timeout: 30_000,
      });
    });
  });
});
