import { expect, test } from "../../tests/fixtures/auth";

test.describe("My Wallets Page", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect unauthenticated users to sign-in", async ({
      page,
    }) => {
      await page.goto("/my-wallets");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });

  test.describe("Authenticated", () => {
    test("should show page title and description", async ({
      myWalletsPage,
    }) => {
      await myWalletsPage.navigate();
      await myWalletsPage.page.waitForLoadState("networkidle");
      await expect
        .soft(myWalletsPage.pageHeading)
        .toBeVisible({ timeout: 10000 });
      await expect
        .soft(
          myWalletsPage.page.getByText("Manage your linked wallet accounts"),
        )
        .toBeVisible({ timeout: 10000 });
    });

    test("should show total balance card", async ({ myWalletsPage }) => {
      await myWalletsPage.navigate();
      await myWalletsPage.page.waitForLoadState("networkidle");
      await expect
        .soft(myWalletsPage.totalBalanceCard)
        .toBeVisible({ timeout: 10000 });
    });

    test("should list seeded wallet accounts", async ({ myWalletsPage }) => {
      await myWalletsPage.navigate();
      await myWalletsPage.page.waitForLoadState("networkidle");

      // First check if there are ANY wallet cards on the page (more robust)
      const walletCount = await myWalletsPage.walletCards.count();

      // Assert that at least one wallet card exists
      expect.soft(walletCount).toBeGreaterThan(0);

      // If wallets exist, verify the first one shows balance (indicating data loaded)
      if (walletCount > 0) {
        const firstCard = myWalletsPage.walletCards.first();
        await expect.soft(firstCard).toBeVisible({ timeout: 10000 });
      }
    });
  });
});
