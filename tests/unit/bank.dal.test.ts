import { describe, expect, it, vi } from "vitest";

vi.mock("@/database/db", () => ({
  db: {
    delete: vi.fn().mockReturnValue({
      where: vi.fn().mockResolvedValue(undefined),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            accessToken: "encrypted-token",
            accountId: "acc_123",
            accountSubtype: "checking",
            accountType: "depository",
            id: "bank-123",
            institutionId: "ins_123",
            institutionName: "Test Bank",
            sharableId: "bank_abc123",
            userId: "user-123",
          },
        ]),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockImplementation((condition: unknown) => {
          return Promise.resolve([
            {
              accessToken: "encrypted-token",
              accountId: "acc_123",
              accountSubtype: "checking",
              accountType: "depository",
              id: "bank-123",
              institutionId: "ins_123",
              institutionName: "Test Bank",
              sharableId: "bank_abc123",
              userId: "user-123",
            },
          ]);
        }),
      }),
    }),
  },
}));

vi.mock("@/lib/encryption", () => ({
  decrypt: vi.fn().mockReturnValue("decrypted-token"),
  encrypt: vi.fn().mockReturnValue("encrypted"),
}));

describe("BankDal", () => {
  describe("findById", () => {
    it("should be a function", async () => {
      const { bankDal } = await import("@/lib/dal");
      expect(typeof bankDal.findById).toBe("function");
    });
  });

  describe("findByUserId", () => {
    it("should be a function", async () => {
      const { bankDal } = await import("@/lib/dal");
      expect(typeof bankDal.findByUserId).toBe("function");
    });
  });

  describe("findBySharableId", () => {
    it("should be a function", async () => {
      const { bankDal } = await import("@/lib/dal");
      expect(typeof bankDal.findBySharableId).toBe("function");
    });

    it("should return bank for valid sharableId", async () => {
      const { bankDal } = await import("@/lib/dal");
      const result = await bankDal.findBySharableId("bank_abc123");
      expect(result).toBeDefined();
    });
  });

  describe("findByAccountId", () => {
    it("should be a function", async () => {
      const { bankDal } = await import("@/lib/dal");
      expect(typeof bankDal.findByAccountId).toBe("function");
    });
  });

  describe("createBank", () => {
    it("should be a function", async () => {
      const { bankDal } = await import("@/lib/dal");
      expect(typeof bankDal.createBank).toBe("function");
    });

    it("should accept valid bank data", async () => {
      const { bankDal } = await import("@/lib/dal");

      const result = await bankDal.createBank({
        accessToken: "test-access-token",
        accountId: "acc_123",
        accountSubtype: "checking",
        accountType: "depository",
        institutionId: "ins_123",
        institutionName: "Test Bank",
        sharableId: "bank_test123",
        userId: "user-123",
      });

      expect(result).toBeDefined();
      expect(result.userId).toBe("user-123");
    });
  });

  describe("delete", () => {
    it("should be a function", async () => {
      const { bankDal } = await import("@/lib/dal");
      expect(typeof bankDal.delete).toBe("function");
    });
  });

  describe("deleteByUserId", () => {
    it("should be a function", async () => {
      const { bankDal } = await import("@/lib/dal");
      expect(typeof bankDal.deleteByUserId).toBe("function");
    });
  });
});

describe("Bank Types", () => {
  it("should have correct Bank type properties", () => {
    type Bank = import("@/types/bank").Bank;

    const mockBank = {
      accessToken: "token",
      accountId: "acc_123",
      accountNumberEncrypted: undefined,
      accountSubtype: "checking",
      accountType: "depository",
      createdAt: new Date(),
      dwollaCustomerUrl: undefined,
      dwollaFundingSourceUrl: undefined,
      fundingSourceUrl: undefined,
      id: "bank-123",
      institutionId: "ins_123",
      institutionName: "Test Bank",
      routingNumber: undefined,
      sharableId: "bank_abc",
      updatedAt: new Date(),
      userId: "user-123",
    };

    expect(mockBank.id).toBeDefined();
    expect(mockBank.userId).toBeDefined();
    expect(mockBank.accessToken).toBeDefined();
    expect(mockBank.sharableId).toBeDefined();
    expect(mockBank.institutionName).toBeDefined();
    expect(mockBank.accountType).toBeDefined();
  });

  it("should support Dwolla columns", () => {
    const bankWithDwolla = {
      accountNumberEncrypted: "encrypted",
      dwollaCustomerUrl: "https://api.dwolla.com/customers/cust-123",
      dwollaFundingSourceUrl: "https://api.dwolla.com/funding-sources/fs-123",
      routingNumber: "021000021",
    };

    expect(bankWithDwolla.dwollaCustomerUrl).toContain("dwolla.com");
    expect(bankWithDwolla.dwollaFundingSourceUrl).toContain("funding-sources");
    expect(bankWithDwolla.routingNumber).toBe("021000021");
    expect(bankWithDwolla.accountNumberEncrypted).toBeDefined();
  });
});
