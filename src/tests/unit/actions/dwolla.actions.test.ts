import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({ user: { id: "user-123" } }),
}));

vi.mock("@/dal", () => ({
  dwollaDal: {
    createDwollaTransfer: vi.fn().mockResolvedValue({ id: "dw-1" }),
  },
  transactionDal: {
    createTransaction: vi.fn().mockResolvedValue({ id: "txn-1" }),
  },
}));

describe("Dwolla Actions (mock short-circuit)", () => {
  it("createFundingSource should short-circuit for mock Plaid token", async () => {
    const { createFundingSource } = await import("@/actions/dwolla.actions");

    const result = await createFundingSource({
      customerId: "cust-123",
      fundingSourceName: "Mock Bank",
      plaidToken: "MOCK_PLAID_ACCESS_TOKEN",
    });

    expect(result.ok).toBe(true);
    expect(result.fundingSourceUrl).toBeDefined();
    expect(result.fundingSourceUrl).toMatch(/mock-/i);
  });

  it("createTransfer should short-circuit for mock funding source urls and persist metadata via DAL", async () => {
    const { createTransfer } = await import("@/actions/dwolla.actions");
    const { dwollaDal, transactionDal } = await import("@/dal");

    const payload = {
      amount: "5.00",
      sourceFundingSourceUrl:
        "https://api.dwolla.com/funding-sources/mock-src-1",
      destinationFundingSourceUrl:
        "https://api.dwolla.com/funding-sources/mock-dst-1",
      createLedger: {
        amount: "5.00",
        receiverWalletId: "wallet-1",
        senderWalletId: "wallet-2",
        name: "Test Transfer",
        status: "pending",
        type: "debit",
      },
    };

    const result = await createTransfer(payload);

    expect(result.ok).toBe(true);
    expect(result.transferUrl).toBeDefined();
    // Ensure DAL was invoked to persist metadata
    expect(dwollaDal.createDwollaTransfer).toHaveBeenCalled();
    expect(transactionDal.createTransaction).toHaveBeenCalled();
  });
});
