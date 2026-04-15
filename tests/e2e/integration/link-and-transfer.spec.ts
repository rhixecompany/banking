import { dwollaDal } from "@/dal";
import { expect, test } from "../../fixtures/auth";
import { completeDwollaTransfer } from "../helpers/dwolla";
import { addMockPlaidInitScript } from "../helpers/plaid.mock";

/**
 * Integration test that wires the Plaid Link client-side stub, verifies the
 * server-side short-circuit path creates a deterministic wallet record, then
 * performs a mocked Dwolla transfer and verifies the UI and DB metadata.
 */
test.describe("Integration: Plaid Link -> Mock Dwolla Transfer", () => {
  test("links a bank using the mocked Plaid.create and performs a transfer", async ({
    myWalletsPage,
  }) => {
    // Install the Plaid stub BEFORE navigating so it runs prior to any
    // third-party script loading on the page.
    await addMockPlaidInitScript(myWalletsPage.page, "MOCK_PUBLIC_TOKEN");

    // Navigate to the page that exposes the Plaid Link button
    await myWalletsPage.navigate();

    // Ensure the Connect / Add Bank button is visible and trigger it.
    const connectBtn = myWalletsPage.addBankButton;
    await connectBtn.waitFor({ state: "visible", timeout: 15_000 });
    await connectBtn.click();

    // The Plaid stub immediately calls the onSuccess handler which in turn
    // triggers the server action that creates a mock wallet. Wait for the
    // expected institution name used by the mock flow to appear in the UI.
    const mockBankCard = myWalletsPage.getWalletCard("Mock Bank");
    await expect(mockBankCard.first()).toBeVisible({ timeout: 15_000 });

    // Now perform a mocked Dwolla transfer using the UI helper. Use seeded
    // recipient details that are inserted by the global seed runner when
    // PLAYWRIGHT_PREPARE_DB=true. The seed runner creates a recipient with
    // email 'recipient.seed@example.com' and seeded wallets with sharable IDs
    // 'seed-share-checking-001' / 'seed-share-savings-002'. We target the
    // seeded sharable id for the receiver.
    const amount = "10.00";
    const recipientEmail = "recipient.seed@example.com";
    const sharableId = "seed-share-checking-001";

    await completeDwollaTransfer(
      myWalletsPage.page,
      amount,
      recipientEmail,
      sharableId,
    );

    // Wait for the success indicator in the UI (helper already asserts soft)
    const success = myWalletsPage.page.locator(
      '[data-testid="transfer-success"]',
    );
    await expect(success).toBeVisible({ timeout: 15_000 });

    // Verify a dwolla_transfers row exists for the seeded user (best-effort).
    // The seeded test user id is deterministic in the seed runner.
    const seededUserId = "00000000-0000-4000-8000-000000000003";
    const transfers = await dwollaDal.findTransfersByUserId(seededUserId);
    expect(transfers.length).toBeGreaterThanOrEqual(1);
  });
});
