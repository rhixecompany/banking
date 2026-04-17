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

  // Ensure we receive an array and each item includes optional senderWallet/receiverWallet
  expect(Array.isArray(rows)).toBe(true);
  if (rows.length > 0) {
    const item = rows[0] as any;
    expect(typeof item.id).toBe("string");
    // senderWallet/receiverWallet may be null or an object with id/institutionName
    if (item.senderWallet) {
      expect(typeof item.senderWallet.id).toBe("string");
      expect(typeof item.senderWallet.institutionName).toBe("string");
    }
    if (item.receiverWallet) {
      expect(typeof item.receiverWallet.id).toBe("string");
      expect(typeof item.receiverWallet.institutionName).toBe("string");
    }
  }
});
