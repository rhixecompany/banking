import { expect, test } from "../../tests/fixtures/auth";

test.describe("My Banks Page", () => {
  test.describe("Unauthenticated Access", () => {
    test("should redirect unauthenticated users to sign-in", async ({
      page,
    }) => {
      await page.goto("/my-banks");
      await expect.soft(page).toHaveURL(/\/sign-in/, { timeout: 10_000 });
    });
  });

  test.describe("Authenticated", () => {
    test("should show page title and description", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/my-banks");
      await expect
        .soft(page.getByRole("heading", { exact: true, name: "My Banks" }))
        .toBeVisible();
      await expect
        .soft(page.getByText("Manage your linked bank accounts"))
        .toBeVisible();
    });

    test("should show total balance card", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/my-banks");
      await expect.soft(page.getByText("Total Balance").first()).toBeVisible();
    });

    test("should list seeded bank accounts", async ({
      authenticatedPage: page,
    }) => {
      await page.goto("/my-banks");
      await expect
        .soft(page.getByText("Seed Checking Bank").first())
        .toBeVisible({
          timeout: 15_000,
        });
      await expect
        .soft(page.getByText("Seed Savings Bank").first())
        .toBeVisible();
    });
  });
});
