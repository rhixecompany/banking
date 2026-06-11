import { expect, test } from "../../tests/fixtures/auth";

test.describe("Transaction History", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect to sign-in when accessing /transaction-history", async ({
      page,
    }) => {
      await page.goto("/transaction-history");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 20_000 });
    });
  });

  test.describe("Authenticated Access", () => {
    test("should render transaction history heading", async ({
      transactionHistoryPage,
    }) => {
      await transactionHistoryPage.navigate();
      await expect
        .soft(transactionHistoryPage.pageHeading.first())
        .toBeVisible({ timeout: 15_000 });
    });

    test("should display transaction table", async ({
      transactionHistoryPage,
    }) => {
      await transactionHistoryPage.navigate();
      await expect
        .soft(transactionHistoryPage.transactionTable.first())
        .toBeVisible({ timeout: 15_000 });
    });
  });
});
