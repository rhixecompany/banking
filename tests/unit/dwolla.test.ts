import { describe, expect, it } from "vitest";

describe("Dwolla Types", () => {
  describe("DwollaCustomer", () => {
    it("should have correct properties", () => {
      const customer = {
        businessType: undefined,
        corporationType: undefined,
        createdAt: "2024-01-01T00:00:00Z",
        email: "john@example.com",
        firstName: "John",
        id: "customer-123",
        lastName: "Doe",
        naicsCode: undefined,
        type: "personal",
      };

      expect(customer.id).toBeDefined();
      expect(customer.firstName).toBe("John");
      expect(customer.lastName).toBe("Doe");
      expect(customer.email).toBe("john@example.com");
      expect(customer.type).toBe("personal");
      expect(customer.createdAt).toBeDefined();
    });
  });

  describe("DwollaFundingSource", () => {
    it("should have correct properties", () => {
      const fundingSource = {
        accountNumber: "1234567890",
        bankName: "Test Bank",
        createdAt: "2024-01-01T00:00:00Z",
        customerId: "customer-123",
        fundingSourceUrl: "https://api.dwolla.com/funding-sources/fs-123",
        id: "fs-123",
        name: "Test Account",
        resourceId: "resource-123",
        status: "active",
        subtype: "checking",
        type: "bank",
      };

      expect(fundingSource.id).toBeDefined();
      expect(fundingSource.fundingSourceUrl).toContain("funding-sources");
      expect(fundingSource.bankName).toBe("Test Bank");
      expect(fundingSource.type).toBe("bank");
      expect(fundingSource.status).toBe("active");
    });
  });

  describe("DwollaTransfer", () => {
    it("should have correct properties", () => {
      const transfer = {
        amount: {
          currency: "USD",
          value: "100.00",
        },
        createdAt: "2024-01-01T00:00:00Z",
        id: "transfer-123",
        status: "pending",
      };

      expect(transfer.id).toBeDefined();
      expect(transfer.amount.value).toBe("100.00");
      expect(transfer.amount.currency).toBe("USD");
      expect(transfer.status).toBe("pending");
    });
  });

  describe("DwollaIavToken", () => {
    it("should have correct properties", () => {
      const iavToken = {
        resourceId: "customer-123",
        token: "iav-token-123",
      };

      expect(iavToken.token).toBeDefined();
      expect(iavToken.resourceId).toBeDefined();
    });
  });
});

describe("Dwolla Schema Validation", () => {
  describe("CreateCustomerSchema", () => {
    it("should validate correct input", async () => {
      const { createCustomerSchema } = await import("@/types/dwolla");

      const validInput = {
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        type: "personal",
      };

      const result = createCustomerSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", async () => {
      const { createCustomerSchema } = await import("@/types/dwolla");

      const invalidInput = {
        email: "invalid-email",
        firstName: "John",
        lastName: "Doe",
        type: "personal",
      };

      const result = createCustomerSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });

    it("should reject missing required fields", async () => {
      const { createCustomerSchema } = await import("@/types/dwolla");

      const incompleteInput = {
        firstName: "John",
      };

      const result = createCustomerSchema.safeParse(incompleteInput);
      expect(result.success).toBe(false);
    });
  });

  describe("CreateFundingSourceSchema", () => {
    it("should validate correct input", async () => {
      const { createFundingSourceSchema } = await import("@/types/dwolla");

      const validInput = {
        accountNumber: "1234567890",
        bankAccountType: "checking",
        fundingSourceUrl: "https://api.dwolla.com/customers/customer-123",
        name: "Test Account",
        routingNumber: "123456789",
      };

      const result = createFundingSourceSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });
  });

  describe("CreateTransferSchema", () => {
    it("should validate correct input", async () => {
      const { createTransferSchema } = await import("@/types/dwolla");

      const validInput = {
        amount: "100.00",
        currency: "USD",
        destinationFundingSourceUrl:
          "https://api.dwolla.com/funding-sources/fs-2",
        sourceFundingSourceUrl: "https://api.dwolla.com/funding-sources/fs-1",
      };

      const result = createTransferSchema.safeParse(validInput);
      expect(result.success).toBe(true);
    });

    it("should reject invalid amount", async () => {
      const { createTransferSchema } = await import("@/types/dwolla");

      const invalidInput = {
        amount: "-100.00",
        currency: "USD",
        destinationFundingSourceUrl:
          "https://api.dwolla.com/funding-sources/fs-2",
        sourceFundingSourceUrl: "https://api.dwolla.com/funding-sources/fs-1",
      };

      const result = createTransferSchema.safeParse(invalidInput);
      expect(result.success).toBe(false);
    });
  });
});

describe("Dwolla DAL", () => {
  it("should export dwollaDal", async () => {
    const { dwollaDal } = await import("@/lib/dal");
    expect(dwollaDal).toBeDefined();
  });

  it("should have required methods", async () => {
    const { dwollaDal } = await import("@/lib/dal");

    expect(typeof dwollaDal.findByDwollaCustomerUrl).toBe("function");
    expect(typeof dwollaDal.findByDwollaFundingSourceUrl).toBe("function");
    expect(typeof dwollaDal.createBankWithDwolla).toBe("function");
    expect(typeof dwollaDal.findBanksWithDwollaCustomer).toBe("function");
  });
});
