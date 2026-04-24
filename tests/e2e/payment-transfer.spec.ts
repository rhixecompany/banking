import { dwollaDal, transactionDal } from "@/dal";

import { expect, test } from "../../tests/fixtures/auth";
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
      await page.goto("/payment-transfer");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });

  test.describe("Authenticated Access", () => {
    test.beforeEach(async ({ paymentTransferPage }) => {
      await paymentTransferPage.navigate();
    });

    test("should render payment transfer form with all fields", async ({
      paymentTransferPage,
    }) => {
      await expect(paymentTransferPage.pageHeading).toBeVisible({
        timeout: 15_000,
      });
      await expect(paymentTransferPage.sourceWalletSelect).toBeVisible();
      await expect(paymentTransferPage.recipientSelect).toBeVisible();
      await expect(paymentTransferPage.amountInput).toBeVisible();
      await expect(paymentTransferPage.submitButton).toBeVisible();
    });

    test("should show validation errors for empty form", async ({
      paymentTransferPage,
    }) => {
      await paymentTransferPage.submitTransfer();
      await expect(paymentTransferPage.errorMessage).toBeVisible({
        timeout: 10_000,
      });
    });

    test("should reject invalid amount format", async ({
      paymentTransferPage,
    }) => {
      await paymentTransferPage.enterAmount("abc");
      await paymentTransferPage.submitTransfer();
      await expect(paymentTransferPage.errorMessage).toBeVisible({
        timeout: 10_000,
      });
    });

    test("should reject negative amount", async ({ paymentTransferPage }) => {
      await paymentTransferPage.enterAmount("-10.00");
      await paymentTransferPage.submitTransfer();
      await expect(paymentTransferPage.errorMessage).toBeVisible({
        timeout: 10_000,
      });
    });

    test("should reject zero amount", async ({ paymentTransferPage }) => {
      await paymentTransferPage.enterAmount("0.00");
      await paymentTransferPage.submitTransfer();
      await expect(paymentTransferPage.errorMessage).toBeVisible({
        timeout: 10_000,
      });
    });

    test("should complete successful transfer with mock data", async ({
      paymentTransferPage,
    }) => {
      await completeDwollaTransfer(
        paymentTransferPage.page,
        "10.00",
        "recipient.seed@example.com",
        "seed-share-checking-001",
      );
      const success = paymentTransferPage.page.locator(
        '[data-testid="transfer-success"]',
      );
      await expect.soft(success).toBeVisible({ timeout: 15_000 });
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

      const seededUserId = "00000000-0000-4000-8000-000000000003";
      const transfers = await dwollaDal.findTransfersByUserId(seededUserId);

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

      const seededUserId = "00000000-0000-4000-8000-000000000003";
      const transactions = await transactionDal.findByUserId(seededUserId);

      expect.soft(transactions.length).toBeGreaterThanOrEqual(1);
    });

    test("should show insufficient funds error when balance low", async ({
      paymentTransferPage,
    }) => {
      await paymentTransferPage.enterAmount("999999.00");
      await paymentTransferPage.submitTransfer();
      await expect(paymentTransferPage.errorMessage).toBeVisible({
        timeout: 10_000,
      });
    });
  });
});
