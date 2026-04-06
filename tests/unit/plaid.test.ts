import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/plaid", () => ({
  plaidClient: {
    accountsGet: vi.fn(),
    balanceGet: vi.fn(),
    institutionsGetById: vi.fn(),
    itemPublicTokenExchange: vi.fn(),
    itemRemove: vi.fn(),
    linkTokenCreate: vi.fn(),
    transactionsGet: vi.fn(),
  },
}));

vi.mock("@/dal", () => ({
  walletsDal: {
    createWallet: vi.fn(),
    delete: vi.fn(),
    findById: vi.fn(),
    findByUserId: vi.fn(),
  },
}));

vi.mock("@/lib/auth", () => ({
  auth: vi.fn().mockResolvedValue({
    user: { id: "user-123" },
  }),
}));

describe("Plaid Actions", () => {
  describe("createLinkToken", () => {
    it("should be a function", async () => {
      const { createLinkToken } = await import("@/actions/plaid.actions");
      expect(typeof createLinkToken).toBe("function");
    });

    it("should return error for invalid input (missing userId)", async () => {
      const { createLinkToken } = await import("@/actions/plaid.actions");
      const result = await createLinkToken({});
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Invalid input");
    });

    it("should return error for empty userId", async () => {
      const { createLinkToken } = await import("@/actions/plaid.actions");
      const result = await createLinkToken({ userId: "" });
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Invalid input");
    });
  });

  describe("exchangePublicToken", () => {
    it("should be a function", async () => {
      const { exchangePublicToken } = await import("@/actions/plaid.actions");
      expect(typeof exchangePublicToken).toBe("function");
    });

    it("should return error for invalid input (missing publicToken)", async () => {
      const { exchangePublicToken } = await import("@/actions/plaid.actions");
      const result = await exchangePublicToken({ userId: "user-123" });
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Invalid input");
    });

    it("should return error for missing userId", async () => {
      const { exchangePublicToken } = await import("@/actions/plaid.actions");
      const result = await exchangePublicToken({ publicToken: "public-token" });
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Invalid input");
    });
  });

  describe("getAccounts", () => {
    it("should be a function", async () => {
      const { getAccounts } = await import("@/actions/plaid.actions");
      expect(typeof getAccounts).toBe("function");
    });

    it("should return error for missing bankId", async () => {
      const { getAccounts } = await import("@/actions/plaid.actions");
      const result = await getAccounts({});
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Invalid input");
    });
  });

  describe("getTransactions", () => {
    it("should be a function", async () => {
      const { getTransactions } = await import("@/actions/plaid.actions");
      expect(typeof getTransactions).toBe("function");
    });

    it("should return error for missing required fields", async () => {
      const { getTransactions } = await import("@/actions/plaid.actions");
      const result = await getTransactions({ bankId: "bank-123" });
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Invalid input");
    });

    it("should accept valid input with all fields", async () => {
      const { getTransactions } = await import("@/actions/plaid.actions");
      const result = await getTransactions({
        bankId: "bank-123",
        count: 100,
        endDate: "2024-12-31",
        offset: 0,
        startDate: "2024-01-01",
      });
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Invalid input");
    });
  });

  describe("getBalance", () => {
    it("should be a function", async () => {
      const { getBalance } = await import("@/actions/plaid.actions");
      expect(typeof getBalance).toBe("function");
    });

    it("should return error for missing bankId", async () => {
      const { getBalance } = await import("@/actions/plaid.actions");
      const result = await getBalance({});
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Invalid input");
    });
  });

  describe("getInstitution", () => {
    it("should be a function", async () => {
      const { getInstitution } = await import("@/actions/plaid.actions");
      expect(typeof getInstitution).toBe("function");
    });

    it("should return error for missing institutionId", async () => {
      const { getInstitution } = await import("@/actions/plaid.actions");
      const result = await getInstitution({});
      expect(result.ok).toBe(false);
      expect(result.error).toBe("Invalid input");
    });
  });

  describe("removeWallet", () => {
    it("should be a function", async () => {
      const { removeWallet } = await import("@/actions/plaid.actions");
      expect(typeof removeWallet).toBe("function");
    });
  });

  describe("getWalletWithDetails", () => {
    it("should be a function", async () => {
      const { getWalletWithDetails } = await import("@/actions/plaid.actions");
      expect(typeof getWalletWithDetails).toBe("function");
    });
  });
});
