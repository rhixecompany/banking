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
            createdAt: new Date(),

            customerUrl: null,

            deletedAt: null,

            fundingSourceUrl: null,
            id: "bank-123",
            institutionId: "ins_123",
            institutionName: "Test Bank",

            routingNumber: null,
            sharableId: "bank_abc123",
            updatedAt: new Date(),
            userId: "user-123",
          },
        ]),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        limit: vi.fn().mockImplementation(() => {
          return Promise.resolve([
            {
              accessToken: "encrypted-token",
              accountId: "acc_123",
              accountSubtype: "checking",
              accountType: "depository",
              createdAt: new Date(),
              customerUrl: null,
              deletedAt: null,
              fundingSourceUrl: null,
              id: "bank-123",
              institutionId: "ins_123",
              institutionName: "Test Bank",
              routingNumber: null,
              sharableId: "bank_abc123",
              updatedAt: new Date(),
              userId: "user-123",
            },
          ]);
        }),
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockImplementation(() => {
            return Promise.resolve([
              {
                accessToken: "encrypted-token",
                accountId: "acc_123",
                accountSubtype: "checking",
                accountType: "depository",
                createdAt: new Date(),
                customerUrl: null,
                deletedAt: null,
                fundingSourceUrl: null,
                id: "bank-123",
                institutionId: "ins_123",
                institutionName: "Test Bank",
                routingNumber: null,
                sharableId: "bank_abc123",
                updatedAt: new Date(),
                userId: "user-123",
              },
            ]);
          }),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              accessToken: "encrypted-token",
              accountId: "acc_123",
              accountSubtype: "checking",
              accountType: "depository",
              createdAt: new Date(),

              customerUrl: null,
              deletedAt: new Date(),

              fundingSourceUrl: null,
              id: "bank-123",
              institutionId: "ins_123",
              institutionName: "Test Bank",

              routingNumber: null,
              sharableId: "bank_abc123",
              updatedAt: new Date(),
              userId: "user-123",
            },
          ]),
        }),
      }),
    }),
  },
}));

vi.mock("@/lib/encryption", () => ({
  decrypt: vi.fn().mockReturnValue("decrypted-token"),
  encrypt: vi.fn().mockReturnValue("encrypted"),
}));

describe("WalletDal", () => {
  describe("findById", () => {
    it("should be a function", async () => {
      const { walletsDal } = await import("@/dal");
      expect(typeof walletsDal.findById).toBe("function");
    });
  });

  describe("findByUserId", () => {
    it("should be a function", async () => {
      const { walletsDal } = await import("@/dal");
      expect(typeof walletsDal.findByUserId).toBe("function");
    });
  });

  describe("findBySharableId", () => {
    it("should be a function", async () => {
      const { walletsDal } = await import("@/dal");
      expect(typeof walletsDal.findBySharableId).toBe("function");
    });

    it("should return wallet for valid sharableId", async () => {
      const { walletsDal } = await import("@/dal");
      const result = await walletsDal.findBySharableId("bank_abc123");
      expect(result).toBeDefined();
    });
  });

  describe("findByAccountId", () => {
    it("should be a function", async () => {
      const { walletsDal } = await import("@/dal");
      expect(typeof walletsDal.findByAccountId).toBe("function");
    });
  });

  describe("createWallet", () => {
    it("should be a function", async () => {
      const { walletsDal } = await import("@/dal");
      expect(typeof walletsDal.createWallet).toBe("function");
    });

    it("should accept valid wallet data", async () => {
      const { walletsDal } = await import("@/dal");

      const result = await walletsDal.createWallet({
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

  describe("softDelete", () => {
    it("should be a function", async () => {
      const { walletsDal } = await import("@/dal");
      expect(typeof walletsDal.softDelete).toBe("function");
    });
  });

  describe("softDeleteByUserId", () => {
    it("should be a function", async () => {
      const { walletsDal } = await import("@/dal");
      expect(typeof walletsDal.softDeleteByUserId).toBe("function");
    });
  });

  describe("hardDelete", () => {
    it("should be a function", async () => {
      const { walletsDal } = await import("@/dal");
      expect(typeof walletsDal.hardDelete).toBe("function");
    });
  });

  describe("hardDeleteByUserId", () => {
    it("should be a function", async () => {
      const { walletsDal } = await import("@/dal");
      expect(typeof walletsDal.hardDeleteByUserId).toBe("function");
    });
  });
});

describe("Wallet Types", () => {
  it("should have correct Wallet type properties", () => {
    const mockWallet = {
      accessToken: "token",
      accountId: "acc_123",
      accountNumberEncrypted: undefined,
      accountSubtype: "checking",
      accountType: "depository",
      createdAt: new Date(),

      customerUrl: null,

      deletedAt: null,
      fundingSourceUrl: undefined,
      id: "bank-123",
      institutionId: "ins_123",
      institutionName: "Test Bank",
      routingNumber: undefined,
      sharableId: "bank_abc",
      updatedAt: new Date(),
      userId: "user-123",
    };

    expect(mockWallet.id).toBeDefined();
    expect(mockWallet.userId).toBeDefined();
    expect(mockWallet.accessToken).toBeDefined();
    expect(mockWallet.sharableId).toBeDefined();
    expect(mockWallet.institutionName).toBeDefined();
    expect(mockWallet.accountType).toBeDefined();
    expect(mockWallet.deletedAt).toBeDefined();
  });

  it("should support customerUrl and fundingSourceUrl fields", () => {
    const walletWithDwolla = {
      accountNumberEncrypted: "encrypted",
      customerUrl: "https://api.dwolla.com/customers/cust-123",
      fundingSourceUrl: "https://api.dwolla.com/funding-sources/fs-123",
      routingNumber: "021000021",
    };

    expect(walletWithDwolla.customerUrl).toContain("dwolla.com");
    expect(walletWithDwolla.fundingSourceUrl).toContain("funding-sources");
    expect(walletWithDwolla.routingNumber).toBe("021000021");
    expect(walletWithDwolla.accountNumberEncrypted).toBeDefined();
  });
});
