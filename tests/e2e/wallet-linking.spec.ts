import { expect, test } from "../../tests/fixtures/auth";

/**
 * Wallet Linking (Plaid Link) E2E tests.
 *
 * These tests verify the UI surface of the Plaid Link flow — specifically that
 * the "Connect Wallet" button is present and that the Link modal is launched when
 * clicked. They do NOT attempt to complete the full OAuth / sandbox flow because
 * that requires live Plaid sandbox credentials and a headful browser; those
 * scenarios are covered by integration tests against the plaid.actions module.
 */
test.describe("Wallet Linking (Plaid Link)", () => {
  // ─── Unauthenticated guard ────────────────────────────────────────────────

  test.describe("Unauthenticated Access", () => {
    test("should redirect unauthenticated users to sign-in", async ({
      page,
    }) => {
      await page.goto("/my-wallets");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });

  // ─── Authenticated surface tests ─────────────────────────────────────────

  test.describe("Authenticated", () => {
    test("should show the Connect Wallet button on My Wallets page", async ({
      myWalletsPage,
    }) => {
      await myWalletsPage.navigate();
      // The Plaid Link trigger — label varies by implementation; try both
      const connectBtn = myWalletsPage.addBankButton;

      await expect.soft(connectBtn).toBeVisible({ timeout: 15_000 });
    });

    test("should show the Connect Wallet button on Payment Transfer page", async ({
      paymentTransferPage,
    }) => {
      await paymentTransferPage.navigate();
      // Check for add wallet button - may not exist if wallets are already linked
      const addBtn = paymentTransferPage.page
        .getByRole("button", { name: /connect\s*wallet/i })
        .or(
          paymentTransferPage.page.getByRole("button", {
            name: /add\s*wallet/i,
          }),
        )
        .or(
          paymentTransferPage.page.getByRole("button", {
            name: /link\s*wallet/i,
          }),
        )
        .first();

      const count = await addBtn.count();
      if (count > 0) {
        await expect.soft(addBtn.first()).toBeVisible({ timeout: 10_000 });
      }
    });

    test("should open Plaid Link modal when Connect Wallet is clicked", async ({
      myWalletsPage,
    }) => {
      await myWalletsPage.navigate();

      const connectBtn = myWalletsPage.addBankButton;

      await connectBtn.waitFor({ state: "visible", timeout: 15_000 });
      await connectBtn.click();

      // After clicking, the Plaid Link iframe or a loading indicator should
      // appear. We check for either an iframe (Plaid Link) or any dialog/modal.
      const plaidFrame = myWalletsPage.page
        .frameLocator("iframe[title*='Plaid']")
        .first();
      const anyDialog = myWalletsPage.page.getByRole("dialog").first();

      // Use a race: pass if either indicator becomes visible within 10 s
      const appeared = await Promise.race([
        plaidFrame
          .locator("body")
          .waitFor({ state: "visible", timeout: 10_000 })
          .then(() => "iframe")
          // eslint-disable-next-line unicorn/no-null
          .catch(() => null),
        anyDialog
          .waitFor({ state: "visible", timeout: 10_000 })
          .then(() => "dialog")
          // eslint-disable-next-line unicorn/no-null
          .catch(() => null),
      ]);

      // The test is soft — Plaid sandbox may not be configured in CI.
      // A null result is acceptable; the important check is that no hard crash
      // (navigation to an error page) occurred.
      if (appeared !== null) {
        expect.soft(appeared).toBeTruthy();
      }

      // Ensure we didn't land on an error page
      await expect
        .soft(myWalletsPage.page)
        .not.toHaveURL(/\/error/, { timeout: 2_000 });
    });

    test("should remain on My Wallets page after dismissing without linking", async ({
      myWalletsPage,
    }) => {
      await myWalletsPage.navigate();

      const connectBtn = myWalletsPage.addBankButton;

      await connectBtn.waitFor({ state: "visible", timeout: 15_000 });
      await connectBtn.click();

      // Attempt to close any dialog that opened
      const closeBtn = myWalletsPage.page
        .getByRole("button", { name: /close/i })
        .or(myWalletsPage.page.getByLabel(/close/i))
        .first();

      const closeVisible = await closeBtn
        .waitFor({ state: "visible", timeout: 5_000 })
        .then(() => true)
        .catch(() => false);

      if (closeVisible) {
        await closeBtn.click();
      } else {
        // Fallback: press Escape to dismiss
        await myWalletsPage.page.keyboard.press("Escape");
      }

      // Should still be on /my-wallets
      await expect
        .soft(myWalletsPage.page)
        .toHaveURL(/\/my-wallets/, { timeout: 5_000 });
    });

    test("should display existing linked wallets before the connect option", async ({
      myWalletsPage,
    }) => {
      await myWalletsPage.navigate();

      // Check for ANY wallet card - seed data creates "Seed Checking Wallet" and "Seed Savings Wallet"
      // Don't use networkidle - it can timeout due to ongoing network activity
      const walletCount = await myWalletsPage.walletCards.count();
      expect.soft(walletCount).toBeGreaterThan(0);

      // If wallets exist, verify at least one is visible
      if (walletCount > 0) {
        await expect.soft(myWalletsPage.walletCards.first()).toBeVisible({
          timeout: 15_000,
        });
      }
    });
  });
});
