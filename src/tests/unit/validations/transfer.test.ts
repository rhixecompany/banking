/**
 * Unit Tests: Transfer Schema Validation
 *
 * Tests for currency precision and transfer amount validation.
 * Verifies:
 * - Exactly 2 decimal places required (prevents floating-point errors)
 * - Positive amounts only
 * - Rejects invalid formats (no decimals, 1 decimal, 3+ decimals)
 * - Dwolla API compatibility
 *
 * @see lib/schemas/transfer.schema.ts
 * @see coding-standards.md (currency precision rules)
 */

import { describe, expect, it } from "vitest";

import { TransferSchema } from "@/lib/schemas/transfer.schema";

describe("TransferSchema - Amount Validation (Currency Precision)", () => {
  const validTransfer = {
    amount: "25.00",
    currency: "USD",
    destinationFundingSourceUrl:
      "https://api.dwolla.com/funding-sources/receiver-id",
    sourceFundingSourceUrl: "https://api.dwolla.com/funding-sources/sender-id",
  };

  describe("Valid Amounts (Exactly 2 Decimals)", () => {
    it("should accept standard transfer amount", () => {
      const result = TransferSchema.safeParse(validTransfer);
      expect(result.success).toBe(true);
    });

    it("should accept amount with leading zeros", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "0.50",
      });
      expect(result.success).toBe(true);
    });

    it("should accept large amounts with 2 decimals", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "999999.99",
      });
      expect(result.success).toBe(true);
    });

    it("should accept $1.00", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "1.00",
      });
      expect(result.success).toBe(true);
    });

    it("should accept $0.01 (minimum transaction)", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "0.01",
      });
      expect(result.success).toBe(true);
    });

    it("should accept amount with many leading digits", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "1234567890.99",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("Invalid Amounts (Precision Violations)", () => {
    it("should reject amount with no decimal places", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "25",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain(
        "exactly 2 decimal places",
      );
    });

    it("should reject amount with 1 decimal place", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "25.5",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain(
        "exactly 2 decimal places",
      );
    });

    it("should reject amount with 3 decimal places", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "25.500",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain(
        "exactly 2 decimal places",
      );
    });

    it("should reject amount with trailing zeros and more decimals", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "25.0000",
      });
      expect(result.success).toBe(false);
    });

    it("should reject amount with only one digit after decimal", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "100.1",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Invalid Amounts (Value Violations)", () => {
    it("should reject zero amount", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "0.00",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain("positive");
    });

    it("should reject negative amount", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "-25.00",
      });
      expect(result.success).toBe(false);
    });

    it("should reject empty string", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "",
      });
      expect(result.success).toBe(false);
    });

    it("should reject non-numeric string", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "abc.de",
      });
      expect(result.success).toBe(false);
    });

    it("should reject whitespace-only amount", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "   ",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Floating-Point Safety (Critical for Financial Data)", () => {
    it("should reject amounts that appear valid but result from floating-point errors", () => {
      // JavaScript: 0.1 + 0.2 = 0.30000000000000004
      // This should be formatted as "0.30" before validation
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "0.30000000000000004",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].message).toContain(
        "exactly 2 decimal places",
      );
    });

    it("should reject amounts with extra precision from floating-point operations", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "99.99999999999999",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Whitespace Handling", () => {
    it("should trim leading/trailing whitespace and validate amount", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "  25.00  ",
      });
      expect(result.success).toBe(true);
      expect(result.success && result.data.amount).toBe("25.00");
    });

    it("should reject amount with internal whitespace", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "25 . 00",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Real-World Scenarios", () => {
    it("should validate typical ACH transfer amounts", () => {
      const amounts = ["100.00", "500.00", "1000.00", "25.50", "0.99"];
      amounts.forEach((amount) => {
        const result = TransferSchema.safeParse({
          ...validTransfer,
          amount,
        });
        expect(result.success).toBe(true);
      });
    });

    it("should validate full transfer object with all required fields", () => {
      const fullTransfer = {
        amount: "150.75",
        currency: "USD",
        destinationFundingSourceUrl:
          "https://api.dwolla.com/funding-sources/destination",
        sourceFundingSourceUrl: "https://api.dwolla.com/funding-sources/source",
      };
      const result = TransferSchema.safeParse(fullTransfer);
      expect(result.success).toBe(true);
    });

    it("should validate transfer with optional ledger creation", () => {
      const transferWithLedger = {
        ...validTransfer,
        createLedger: {
          category: "transfer",
          status: "pending",
          type: "debit",
        },
      };
      const result = TransferSchema.safeParse(transferWithLedger);
      expect(result.success).toBe(true);
    });
  });

  describe("Error Messages", () => {
    it("should provide clear error message for precision violations", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        amount: "25.5",
      });
      expect(result.success).toBe(false);
      expect(!result.success && result.error.issues[0].message).toContain(
        "exactly 2 decimal places",
      );
    });
  });

  describe("Currency Compatibility", () => {
    it("should use USD as default currency", () => {
      const result = TransferSchema.safeParse({
        amount: "25.00",
        destinationFundingSourceUrl:
          "https://api.dwolla.com/funding-sources/receiver-id",
        sourceFundingSourceUrl:
          "https://api.dwolla.com/funding-sources/sender-id",
      });
      expect(result.success).toBe(true);
      expect(result.success && result.data.currency).toBe("USD");
    });

    it("should accept custom currency codes", () => {
      const result = TransferSchema.safeParse({
        ...validTransfer,
        currency: "CAD",
      });
      expect(result.success).toBe(true);
    });
  });
});
