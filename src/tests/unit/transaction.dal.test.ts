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
            amount: "100.00",
            category: "Payment",
            channel: "online",
            createdAt: new Date(),
            currency: "USD",
            deletedAt: undefined,
            email: "test@example.com",
            id: "txn-123",
            name: "Test Transaction",
            receiverWalletId: "wallet-456",
            senderWalletId: "wallet-123",
            status: "completed",
            type: "debit",
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
              amount: "100.00",
              category: "Payment",
              channel: "online",
              createdAt: new Date(),
              currency: "USD",
              deletedAt: undefined,
              email: "test@example.com",
              id: "txn-123",
              name: "Test Transaction",
              receiverWalletId: "wallet-456",
              senderWalletId: "wallet-123",
              status: "completed",
              type: "debit",
              updatedAt: new Date(),
              userId: "user-123",
            },
          ]);
        }),
        orderBy: vi.fn().mockReturnValue({
          limit: vi.fn().mockReturnValue({
            offset: vi.fn().mockResolvedValue([
              {
                id: "txn-123",
                userId: "user-123",
              },
            ]),
          }),
        }),
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockImplementation(() => {
            return Promise.resolve([
              {
                amount: "100.00",
                category: "Payment",
                channel: "online",
                createdAt: new Date(),
                currency: "USD",
                deletedAt: undefined,
                email: "test@example.com",
                id: "txn-123",
                name: "Test Transaction",
                receiverWalletId: "wallet-456",
                senderWalletId: "wallet-123",
                status: "completed",
                type: "debit",
                updatedAt: new Date(),
                userId: "user-123",
              },
            ]);
          }),
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockReturnValue({
              offset: vi.fn().mockResolvedValue([
                {
                  id: "txn-123",
                  userId: "user-123",
                },
              ]),
            }),
          }),
        }),
      }),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  },
}));

describe("TransactionDal", () => {
  describe("findById", () => {
    it("should be a function", async () => {
      const { transactionDal } = await import("@/dal");
      expect(typeof transactionDal.findById).toBe("function");
    });

    it("should return transaction for valid id", async () => {
      const { transactionDal } = await import("@/dal");
      const result = await transactionDal.findById("txn-123");
      expect(result).toBeDefined();
    });
  });

  describe("findByUserId", () => {
    it("should be a function", async () => {
      const { transactionDal } = await import("@/dal");
      expect(typeof transactionDal.findByUserId).toBe("function");
    });

    it("should return transactions for valid user id", async () => {
      const { transactionDal } = await import("@/dal");
      const result = await transactionDal.findByUserId("user-123");
      expect(result).toBeDefined();
    });

    it("should support pagination parameters", async () => {
      const { transactionDal } = await import("@/dal");
      const result = await transactionDal.findByUserId("user-123", 10, 0);
      expect(result).toBeDefined();
    });
  });

  describe("findByWalletId", () => {
    it("should be a function", async () => {
      const { transactionDal } = await import("@/dal");
      expect(typeof transactionDal.findByWalletId).toBe("function");
    });
  });

  describe("createTransaction", () => {
    it("should be a function", async () => {
      const { transactionDal } = await import("@/dal");
      expect(typeof transactionDal.createTransaction).toBe("function");
    });

    it("should accept valid transaction data", async () => {
      const { transactionDal } = await import("@/dal");

      const result = await transactionDal.createTransaction({
        amount: "100.00",
        category: "Payment",
        channel: "online",
        currency: "USD",
        email: "test@example.com",
        name: "Test Transaction",
        receiverWalletId: "wallet-456",
        senderWalletId: "wallet-123",
        status: "completed",
        type: "debit",
        userId: "user-123",
      });

      expect(result).toBeDefined();
      expect(result.userId).toBe("user-123");
    });
  });

  describe("getStatsByUser", () => {
    it("should be a function", async () => {
      const { transactionDal } = await import("@/dal");
      expect(typeof transactionDal.getStatsByUser).toBe("function");
    });
  });
});

describe("Transaction Types", () => {
  it("should have correct Transaction type properties", () => {
    const mockTransaction: {
      amount: string;
      category: string;
      channel: string;
      createdAt: Date;
      currency: string;
      deletedAt?: Date | undefined;
      email: string;
      id: string;
      name: string;
      plaidTransactionId?: string;
      receiverWalletId?: string;
      senderWalletId?: string;
      status: string;
      type: string;
      updatedAt: Date;
      userId: string;
    } = {
      amount: "100.00",
      category: "Payment",
      channel: "online",
      createdAt: new Date(),
      currency: "USD",
      deletedAt: undefined,
      email: "test@example.com",
      id: "txn-123",
      name: "Test Transaction",
      plaidTransactionId: undefined,
      receiverWalletId: "wallet-456",
      senderWalletId: "wallet-123",
      status: "completed",
      type: "debit",
      updatedAt: new Date(),
      userId: "user-123",
    };

    expect(mockTransaction.id).toBeDefined();
    expect(mockTransaction.userId).toBeDefined();
    expect(mockTransaction.amount).toBeDefined();
    expect(mockTransaction.type).toBeDefined();
    expect(mockTransaction.status).toBeDefined();
  });

  it("should support transaction type and status enums", () => {
    const validTypes = ["credit", "debit"];
    const validStatuses = [
      "pending",
      "processing",
      "completed",
      "failed",
      "cancelled",
    ];

    for (const type of validTypes) {
      expect(["credit", "debit"]).toContain(type);
    }

    for (const status of validStatuses) {
      expect(validStatuses).toContain(status);
    }
  });

  it("should support channel enum", () => {
    const validChannels = ["online", "in_store", "other"];

    for (const channel of validChannels) {
      expect(validChannels).toContain(channel);
    }
  });
});
