import { expect, test } from "../../tests/fixtures/auth";
import { completeDwollaTransfer } from "./helpers/dwolla";

test.describe("Payment Transfer Flow (seeded)", () => {
  test("performs a transfer using seeded recipient and wallets", async ({
    myWalletsPage,
  }) => {
    // Use seeded data prepared by the Playwright seed runner (PLAYWRIGHT_PREPARE_DB=true)
    const amount = "5.00";
    const recipientEmail = "recipient.seed@example.com";
    const sharableId = "seed-share-checking-001";

    // Ensure page is ready and then perform the transfer via helper
    await completeDwollaTransfer(
      myWalletsPage.page,
      amount,
      recipientEmail,
      sharableId,
    );

    // Assert success indicator present
    const success = myWalletsPage.page.locator(
      '[data-testid="transfer-success"]',
    );
    await expect(success).toBeVisible({ timeout: 15_000 });
  });
});
