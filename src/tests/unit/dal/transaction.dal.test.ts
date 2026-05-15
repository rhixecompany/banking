import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/database/db", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            amount: "100.00",
            id: "txn-1",
            userId: "user-1",
          },
        ]),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
          orderBy: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      }),
    }),
  },
}));

vi.mock("@/database/schema", () => ({
  transactions: {
    amount: "amount",
    createdAt: "createdAt",
    deletedAt: "deletedAt",
    id: "id",
    receiverWalletId: "receiverWalletId",
    senderWalletId: "senderWalletId",
    status: "status",
    type: "type",
    userId: "userId",
  },
  wallets: {
    fundingSourceUrl: "fundingSourceUrl",
    id: "id",
    institutionName: "institutionName",
  },
}));

import { transactionDal } from "@/dal/transaction.dal";
import { db } from "@/database/db";

describe("TransactionDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("finds transaction by id", async () => {
      const mockTxn = { deletedAt: null, id: "txn-1" };
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockTxn]),
          }),
        }),
      } as never);

      const result = await transactionDal.findById("txn-1");
      expect(result).toBeDefined();
    });
  });

  describe("findByUserId", () => {
    it("finds transactions by user id", async () => {
      const mockTxns = [
        { id: "txn-1", userId: "user-1" },
        { id: "txn-2", userId: "user-1" },
      ];
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(mockTxns),
              }),
            }),
          }),
        }),
      } as never);

      const result = await transactionDal.findByUserId("user-1");
      expect(result).toBeDefined();
      expect(db.select).toHaveBeenCalled();
    });

    it("finds with pagination", async () => {
      const mockTxns = [{ id: "txn-1" }];
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                offset: vi.fn().mockResolvedValue(mockTxns),
              }),
            }),
          }),
        }),
      } as never);

      const result = await transactionDal.findByUserId("user-1", 10, 20);
      expect(result).toBeDefined();
      expect(db.select).toHaveBeenCalled();
    });
  });

  describe("findByWalletId", () => {
    it("finds transactions by wallet", async () => {
      const mockTxns = [{ id: "txn-1", senderWalletId: "wallet-1" }];
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            orderBy: vi.fn().mockReturnValue({
              limit: vi.fn().mockResolvedValue(mockTxns),
            }),
          }),
        }),
      } as never);

      const result = await transactionDal.findByWalletId("wallet-1");
      expect(result).toBeDefined();
    });
  });

  describe("createTransaction", () => {
    it("creates transaction", async () => {
      const result = await transactionDal.createTransaction({
        amount: "100.00",
        userId: "user-1",
      });
      expect(db.insert).toHaveBeenCalled();
    });
  });

  describe("getStatsByUser", () => {
    it("gets stats for user", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            groupBy: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as never);

      const result = await transactionDal.getStatsByUser("user-1");
      expect(result).toBeDefined();
    });
  });

  describe("findByUserIdWithWallets", () => {
    it("finds transactions with wallet data", async () => {
      const mockTxns = [
        { id: "txn-1", receiverWalletId: null, senderWalletId: "wallet-1" },
      ];
      const mockWallets = [
        {
          fundingSourceUrl: "https://bank.com",
          id: "wallet-1",
          institutionName: "Bank",
        },
      ];

      // First call: select transactions
      // Second call: select wallets
      (db.select as ReturnType<typeof vi.fn>)
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockReturnValue({
              orderBy: vi.fn().mockReturnValue({
                limit: vi.fn().mockReturnValue({
                  offset: vi.fn().mockResolvedValue(mockTxns),
                }),
              }),
            }),
          }),
        } as never)
        .mockReturnValueOnce({
          from: vi.fn().mockReturnValue({
            where: vi.fn().mockResolvedValue(mockWallets),
          }),
        } as never);

      const result = await transactionDal.findByUserIdWithWallets("user-1");
      expect(result).toBeDefined();
      expect(db.select).toHaveBeenCalled();
    });
  });
});
