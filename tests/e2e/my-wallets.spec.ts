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
      await expect.soft(myWalletsPage.pageHeading.first()).toBeVisible();
      await expect
        .soft(
          myWalletsPage.pageHeading.getByText(
            "Manage your linked wallet accounts",
          ),
        )
        .toBeVisible();
    });

    test("should show total balance card", async ({ myWalletsPage }) => {
      await myWalletsPage.navigate();
      await expect.soft(myWalletsPage.totalBalanceCard).toBeVisible();
    });

    test("should list seeded wallet accounts", async ({ myWalletsPage }) => {
      await myWalletsPage.navigate();
      await expect
        .soft(myWalletsPage.getWalletCard("Seed Checking Bank"))
        .toBeVisible({
          timeout: 15_000,
        });
      await expect
        .soft(myWalletsPage.getWalletCard("Seed Savings Bank"))
        .toBeVisible();
    });
  });
});
