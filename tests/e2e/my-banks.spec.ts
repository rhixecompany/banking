import { expect, test } from "@playwright/test";

import { signInWithSeedUser } from "./helpers/auth";

test.beforeEach(async ({ page }) => {
  await page.context().clearCookies();
});

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
    test.beforeEach(async ({ page }) => {
      await signInWithSeedUser(page);
    });

    test("should show page title and description", async ({ page }) => {
      await page.goto("/my-banks");
      await expect
        .soft(page.getByRole("heading", { exact: true, name: "My Banks" }))
        .toBeVisible();
      await expect
        .soft(page.getByText("Manage your linked bank accounts"))
        .toBeVisible();
    });

    test("should show total balance card", async ({ page }) => {
      await page.goto("/my-banks");
      await expect.soft(page.getByText("Total Balance")).toBeVisible();
    });

    test("should list seeded bank accounts", async ({ page }) => {
      await page.goto("/my-banks");
      await expect.soft(page.getByText("Seed Checking Bank")).toBeVisible({
        timeout: 15_000,
      });
      await expect.soft(page.getByText("Seed Savings Bank")).toBeVisible();
    });
  });
});
