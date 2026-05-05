import { describe, expect, it } from "vitest";

import { TransferSchema } from "@/lib/schemas/transfer.schema";

/**
 * Unit: Currency Precision
 *
 * Verifies that currency amounts are validated at the Zod schema level:
 * 1. Accepts valid decimal string amounts (e.g., "25.00")
 * 2. Rejects non-numeric amounts
 * 3. Rejects negative amounts
 * 4. Requires proper funding source URLs
 *
 * These tests validate schema behavior without DB access.
 */

const validFundingSourceUrl = "https://api.dwolla.com/funding-sources/12345";

describe("Currency Precision (Zod Schema)", () => {
  it("should accept valid decimal string amount", () => {
    const result = TransferSchema.safeParse({
      amount: "25.00",
      currency: "USD",
      destinationFundingSourceUrl: validFundingSourceUrl,
      sourceFundingSourceUrl: validFundingSourceUrl,
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.amount).toBe("25.00");
    expect(result.data.currency).toBe("USD");
  });

  it("should accept various valid amount formats", () => {
    const validAmounts = ["1.00", "100.50", "0.01", "999999.99"];
    for (const amount of validAmounts) {
      const result = TransferSchema.safeParse({
        amount,
        currency: "USD",
        destinationFundingSourceUrl: validFundingSourceUrl,
        sourceFundingSourceUrl: validFundingSourceUrl,
      });
      expect(result.success).toBe(true);
      if (!result.success) continue;
      expect(result.data.amount).toBe(amount);
    }
  });

  it("should reject non-numeric amounts", () => {
    const result = TransferSchema.safeParse({
      amount: "abc",
      currency: "USD",
      destinationFundingSourceUrl: validFundingSourceUrl,
      sourceFundingSourceUrl: validFundingSourceUrl,
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative amounts", () => {
    const result = TransferSchema.safeParse({
      amount: "-10.00",
      currency: "USD",
      destinationFundingSourceUrl: validFundingSourceUrl,
      sourceFundingSourceUrl: validFundingSourceUrl,
    });
    expect(result.success).toBe(false);
  });

  it("should reject zero amount", () => {
    const result = TransferSchema.safeParse({
      amount: "0.00",
      currency: "USD",
      destinationFundingSourceUrl: validFundingSourceUrl,
      sourceFundingSourceUrl: validFundingSourceUrl,
    });
    expect(result.success).toBe(false);
  });

  it("should reject whitespace-only amounts", () => {
    const result = TransferSchema.safeParse({
      amount: "   ",
      currency: "USD",
      destinationFundingSourceUrl: validFundingSourceUrl,
      sourceFundingSourceUrl: validFundingSourceUrl,
    });
    expect(result.success).toBe(false);
  });

  it("should require valid destination funding source URL", () => {
    const result = TransferSchema.safeParse({
      amount: "25.00",
      currency: "USD",
      destinationFundingSourceUrl: "not-a-url",
      sourceFundingSourceUrl: validFundingSourceUrl,
    });
    expect(result.success).toBe(false);
  });

  it("should require valid source funding source URL", () => {
    const result = TransferSchema.safeParse({
      amount: "25.00",
      currency: "USD",
      destinationFundingSourceUrl: validFundingSourceUrl,
      sourceFundingSourceUrl: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("should use USD as default currency", () => {
    const result = TransferSchema.safeParse({
      amount: "25.00",
      destinationFundingSourceUrl: validFundingSourceUrl,
      sourceFundingSourceUrl: validFundingSourceUrl,
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.currency).toBe("USD");
  });

  it("should accept optional createLedger object", () => {
    const result = TransferSchema.safeParse({
      amount: "25.00",
      createLedger: {
        amount: "25.00",
        receiverWalletId: "wallet-2",
        senderWalletId: "wallet-1",
        status: "completed",
      },
      currency: "USD",
      destinationFundingSourceUrl: validFundingSourceUrl,
      sourceFundingSourceUrl: validFundingSourceUrl,
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.createLedger?.senderWalletId).toBe("wallet-1");
  });
});
