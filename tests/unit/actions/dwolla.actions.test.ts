import { beforeEach, describe, expect, it, vi } from "vitest";

import { createTransfer } from "@/actions/dwolla.actions";
import { db } from "@/database/db";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({
    expires: new Date(Date.now() + 86400000).toISOString(),
    user: { id: "user-test-1", isAdmin: false, isActive: true },
  }),
}));

vi.mock("@/lib/dwolla", () => ({
  getDwollaClient: () => ({
    post: () =>
      Promise.resolve({
        headers: {
          get: (_: string) => "https://api-sandbox.dwolla.com/transfers/t-123",
        },
      }),
  }),
}));

describe("dwolla.actions.createTransfer transactional path", () => {
  beforeEach(async () => {
    // No-op
  });

  it("creates ledger and dwolla_transfers row atomically when createLedger provided", async () => {
    const payload = {
      amount: "5.00",
      sourceFundingSourceUrl:
        "https://api-sandbox.dwolla.com/funding-sources/src-1",
      destinationFundingSourceUrl:
        "https://api-sandbox.dwolla.com/funding-sources/dst-1",
      createLedger: {
        senderWalletId: "wallet-sender-1",
        receiverWalletId: "wallet-recv-1",
        name: "Test Transfer",
        email: "test@example.com",
        amount: "5.00",
        type: "debit",
        status: "pending",
      },
    };

    // Ensure a user record exists for the transactional insert (foreign key)
    const { users } = await import("@/database/schema");
    await db
      .insert(users)
      .values({ id: "user-test-1", email: "test-user@example.com" })
      .onConflictDoNothing();

    // Ensure sender and receiver wallets exist (FKs on transactions require wallets to exist)
    const { wallets } = await import("@/database/schema");
    await db
      .insert(wallets)
      .values([
        {
          id: "wallet-sender-1",
          accessToken: "token-sender",
          sharableId: "sender-sharable",
          userId: "user-test-1",
        },
        {
          id: "wallet-recv-1",
          accessToken: "token-recv",
          sharableId: "recv-sharable",
          userId: "user-test-1",
        },
      ])
      .onConflictDoNothing();

    const res = await createTransfer(payload as unknown);
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.error("createTransfer failed:", res);
    }
    expect(res.ok).toBe(true);

    // Verify dwolla_transfers entry exists
    const { dwolla_transfers } = await import("@/database/schema");
    const rows = await db
      .select()
      .from(dwolla_transfers)
      .where(
        // use drizzle eq predicate
        (await import("drizzle-orm")).eq(
          dwolla_transfers.transferUrl,
          "https://api-sandbox.dwolla.com/transfers/t-123",
        ),
      );
    expect(rows.length).toBeGreaterThanOrEqual(1);

    // Verify transactions entry exists for user-test-1
    const { transactions } = await import("@/database/schema");
    const txns = await db
      .select()
      .from(transactions)
      .where(
        (await import("drizzle-orm")).eq(transactions.userId, "user-test-1"),
      );
    expect(txns.length).toBeGreaterThanOrEqual(1);
  });
});
