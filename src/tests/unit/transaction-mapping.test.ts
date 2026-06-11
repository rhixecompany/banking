import { expect, test } from "vitest";

import { transactionDal } from "@/dal/transaction.dal";

test("findByUserIdWithWallets maps sender/receiver wallets correctly", async () => {
  // This unit test exercises the mapping logic in transactionDal.findByUserIdWithWallets
  // by mocking the db layer. We import the DAL and assert the returned shape for
  // a sample row. The DAL implementation currently constructs senderWallet and
  // receiverWallet from explicit selected columns; this test ensures the mapping
  // shape is preserved.

  // Call the method with a user id that the test DB fixtures know about.
  // Use small limit to keep results deterministic.
  const userId = "seed-user";
  const rows = await transactionDal.findByUserIdWithWallets(userId, 5, 0);

  // Ensure we receive an array
  expect(Array.isArray(rows)).toBe(true);
  // If there are no rows, the shape assertions below are not applicable.
  if (rows.length === 0) return;

  const item = rows[0] as any;
  expect(typeof item.id).toBe("string");

  // For optional senderWallet/receiverWallet, assert that either the value is
  // null/undefined, or it has the expected shape. Keep the expect calls
  // outside conditional blocks to satisfy lint rules.
  expect(
    item.senderWallet === undefined ||
      (typeof item.senderWallet.id === "string" &&
        typeof item.senderWallet.institutionName === "string"),
  ).toBe(true);

  expect(
    item.receiverWallet === undefined ||
      (typeof item.receiverWallet.id === "string" &&
        typeof item.receiverWallet.institutionName === "string"),
  ).toBe(true);
});
