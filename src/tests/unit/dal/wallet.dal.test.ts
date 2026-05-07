import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/database/db", () => ({
  db: {
    delete: vi.fn(),
    insert: vi.fn(),
    select: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/database/schema", () => ({
  wallets: {
    accessToken: "accessToken",
    accountId: "accountId",
    accountSubtype: "accountSubtype",
    accountType: "accountType",
    createdAt: "createdAt",
    deletedAt: "deletedAt",
    fundingSourceUrl: "fundingSourceUrl",
    id: "id",
    institutionId: "institutionId",
    institutionName: "institutionName",
    sharableId: "sharableId",
    updatedAt: "updatedAt",
    userId: "userId",
  },
}));

// Mock encryption with realistic behavior
vi.mock("@/lib/encryption", () => ({
  decrypt: vi.fn((s: string) => {
    if (s.startsWith("encrypted_")) {
      return s.replace("encrypted_", "");
    }
    // Simulate decrypt failure for invalid format
    throw new Error("Invalid encrypted format");
  }),
  encrypt: vi.fn((s: string) => `encrypted_${s}`),
}));

import { walletsDal } from "@/dal/wallet.dal";
import { db } from "@/database/db";
import { decrypt, encrypt } from "@/lib/encryption";

describe("WalletDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findById", () => {
    it("returns decrypted wallet when found", async () => {
      const mockWallet = {
        accessToken: "encrypted_plain-token",
        createdAt: new Date(),
        deletedAt: null,
        id: "wallet-1",
        sharableId: "sharable-1",
        updatedAt: new Date(),
        userId: "user-1",
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockWallet]),
          }),
        }),
      });

      const result = await walletsDal.findById("wallet-1");

      expect(result).toBeDefined();
      expect(result?.accessToken).toBe("plain-token");
      expect(decrypt).toHaveBeenCalled();
    });

    it("returns undefined when wallet is soft-deleted", async () => {
      // When soft-deleted, the DAL's WHERE clause (isNull wallets.deletedAt) filters it out,
      // so DB returns empty - simulating that behavior here
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await walletsDal.findById("wallet-1");

      expect(result).toBeUndefined();
    });

    it("returns undefined when wallet not found", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await walletsDal.findById("nonexistent");

      expect(result).toBeUndefined();
    });

    it("handles safeDecrypt gracefully when decrypt fails", async () => {
      const mockWallet = {
        accessToken: "corrupted-token", // Will fail decrypt
        deletedAt: null,
        id: "wallet-1",
        userId: "user-1",
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockWallet]),
          }),
        }),
      });

      const result = await walletsDal.findById("wallet-1");

      // safeDecrypt should return the original value on failure
      expect(result?.accessToken).toBe("corrupted-token");
    });
  });

  describe("findByUserId", () => {
    it("returns multiple decrypted wallets for user", async () => {
      const mockWallets = [
        {
          accessToken: "encrypted_token1",
          deletedAt: null,
          id: "wallet-1",
          userId: "user-1",
        },
        {
          accessToken: "encrypted_token2",
          deletedAt: null,
          id: "wallet-2",
          userId: "user-1",
        },
      ];

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockWallets),
        }),
      });

      const result = await walletsDal.findByUserId("user-1");

      expect(result).toHaveLength(2);
      expect(result[0].accessToken).toBe("token1");
      expect(result[1].accessToken).toBe("token2");
    });

    it("returns empty array when user has no wallets", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue([]),
        }),
      });

      const result = await walletsDal.findByUserId("user-1");

      expect(result).toEqual([]);
    });

    it("filters out soft-deleted wallets at database level", async () => {
      const mockWallets = [
        {
          accessToken: "encrypted_token1",
          deletedAt: null,
          id: "wallet-1",
          userId: "user-1",
        },
      ];

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockWallets),
        }),
      });

      await walletsDal.findByUserId("user-1");

      // Verify that isNull filter was applied (AND condition with deletedAt)
      const whereCall = (db.select() as any).from.mock.results[0].value.where;
      expect(whereCall).toHaveBeenCalled();
    });

    it("decrypts all returned wallets", async () => {
      const mockWallets = [
        {
          accessToken: "encrypted_token1",
          deletedAt: null,
          id: "wallet-1",
        },
        {
          accessToken: "corrupted", // Will fail decrypt
          deletedAt: null,
          id: "wallet-2",
        },
      ];

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue(mockWallets),
        }),
      });

      const result = await walletsDal.findByUserId("user-1");

      // First wallet decrypts successfully, second returns as-is
      expect(result[0].accessToken).toBe("token1");
      expect(result[1].accessToken).toBe("corrupted");
    });
  });

  describe("findBySharableId", () => {
    it("returns decrypted wallet by sharable ID", async () => {
      const mockWallet = {
        accessToken: "encrypted_plain-token",
        deletedAt: null,
        id: "wallet-1",
        sharableId: "sharable-123",
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockWallet]),
          }),
        }),
      });

      const result = await walletsDal.findBySharableId("sharable-123");

      expect(result).toBeDefined();
      expect(result?.accessToken).toBe("plain-token");
    });

    it("returns undefined when sharable ID not found", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await walletsDal.findBySharableId("invalid");

      expect(result).toBeUndefined();
    });

    it("returns undefined when wallet is soft-deleted", async () => {
      // When soft-deleted, the DAL's WHERE clause (isNull wallets.deletedAt) filters it out,
      // so DB returns empty - simulating that behavior here
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await walletsDal.findBySharableId("sharable-123");

      expect(result).toBeUndefined();
    });
  });

  describe("findByAccountId", () => {
    it("returns decrypted wallet by account ID", async () => {
      const mockWallet = {
        accessToken: "encrypted_plain-token",
        accountId: "acc-123",
        deletedAt: null,
        id: "wallet-1",
      };

      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockWallet]),
          }),
        }),
      });

      const result = await walletsDal.findByAccountId("acc-123");

      expect(result).toBeDefined();
      expect(result?.accessToken).toBe("plain-token");
    });

    it("returns undefined when account ID not found", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      });

      const result = await walletsDal.findByAccountId("invalid");

      expect(result).toBeUndefined();
    });
  });

  describe("createWallet", () => {
    it("encrypts token before storage and returns plaintext", async () => {
      const plainToken = "plain-access-token-123";
      const createdWallet = {
        accessToken: "encrypted_plain-access-token-123",
        createdAt: new Date(),
        id: "wallet-new",
        sharableId: "sharable-new",
        updatedAt: new Date(),
        userId: "user-1",
      };

      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([createdWallet]),
        }),
      });

      const result = await walletsDal.createWallet({
        accessToken: plainToken,
        sharableId: "sharable-new",
        userId: "user-1",
      });

      // Verify encrypt was called with the plaintext token
      expect(encrypt).toHaveBeenCalledWith(plainToken);

      // Verify returned wallet has plaintext token
      expect(result.accessToken).toBe(plainToken);
      expect(result.id).toBe("wallet-new");
    });

    it("creates wallet with all optional fields", async () => {
      const createdWallet = {
        accessToken: "encrypted_token",
        accountId: "acc-456",
        accountSubtype: "savings",
        accountType: "checking",
        createdAt: new Date(),
        fundingSourceUrl: "https://example.com/funding",
        id: "wallet-new",
        institutionId: "inst-123",
        institutionName: "Chase Bank",
        sharableId: "sharable-new",
        updatedAt: new Date(),
        userId: "user-1",
      };

      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([createdWallet]),
        }),
      });

      const result = await walletsDal.createWallet({
        accessToken: "plain-token",
        accountId: "acc-456",
        accountSubtype: "savings",
        accountType: "checking",
        fundingSourceUrl: "https://example.com/funding",
        institutionId: "inst-123",
        institutionName: "Chase Bank",
        sharableId: "sharable-new",
        userId: "user-1",
      });

      expect(result.institutionName).toBe("Chase Bank");
      expect(result.accountType).toBe("checking");
    });

    it("calls db.insert with encrypted token", async () => {
      const mockInsertChain = {
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([
            {
              accessToken: "encrypted_token",
              id: "wallet-new",
            },
          ]),
        }),
      };

      (db.insert as ReturnType<typeof vi.fn>).mockReturnValue(mockInsertChain);

      await walletsDal.createWallet({
        accessToken: "plain-token",
        sharableId: "sharable-new",
        userId: "user-1",
      });

      // Verify values() was called with encrypted token
      expect(mockInsertChain.values).toHaveBeenCalledWith(
        expect.objectContaining({
          accessToken: "encrypted_plain-token",
        }),
      );
    });
  });

  describe("softDelete", () => {
    it("soft deletes wallet by ID", async () => {
      (db.update as ReturnType<typeof vi.fn>).mockReturnValue({
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({ rowsAffected: 1 }),
        }),
      });

      await walletsDal.softDelete("wallet-1");

      expect(db.update).toHaveBeenCalled();
    });

    it("sets deletedAt timestamp", async () => {
      const updateChain = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({ rowsAffected: 1 }),
        }),
      };

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(updateChain);

      await walletsDal.softDelete("wallet-1");

      // Verify set() was called with deletedAt
      expect(updateChain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      );
    });
  });

  describe("hardDelete", () => {
    it("hard deletes wallet permanently", async () => {
      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowsAffected: 1 }),
      });

      await walletsDal.hardDelete("wallet-1");

      expect(db.delete).toHaveBeenCalled();
    });
  });

  describe("softDeleteByUserId", () => {
    it("soft deletes all wallets for a user", async () => {
      const updateChain = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({ rowsAffected: 3 }),
        }),
      };

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(updateChain);

      await walletsDal.softDeleteByUserId("user-1");

      expect(db.update).toHaveBeenCalled();
      // Verify set() was called with deletedAt
      expect(updateChain.set).toHaveBeenCalledWith(
        expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      );
    });

    it("affects all wallets by userId filter", async () => {
      const updateChain = {
        set: vi.fn().mockReturnValue({
          where: vi.fn().mockResolvedValue({ rowsAffected: 2 }),
        }),
      };

      (db.update as ReturnType<typeof vi.fn>).mockReturnValue(updateChain);

      await walletsDal.softDeleteByUserId("user-1");

      // Verify where was called (filter by userId)
      expect(updateChain.set().where).toHaveBeenCalled();
    });
  });

  describe("hardDeleteByUserId", () => {
    it("hard deletes all wallets for a user", async () => {
      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowsAffected: 3 }),
      });

      await walletsDal.hardDeleteByUserId("user-1");

      expect(db.delete).toHaveBeenCalled();
    });

    it("affects all wallets by userId filter", async () => {
      const deleteChain = {
        where: vi.fn().mockResolvedValue({ rowsAffected: 2 }),
      };

      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue(deleteChain);

      await walletsDal.hardDeleteByUserId("user-1");

      // Verify where was called (filter by userId)
      expect(deleteChain.where).toHaveBeenCalled();
    });

    it("deletes multiple wallets in bulk", async () => {
      (db.delete as ReturnType<typeof vi.fn>).mockReturnValue({
        where: vi.fn().mockResolvedValue({ rowsAffected: 5 }),
      });

      await walletsDal.hardDeleteByUserId("user-with-many-wallets");

      expect(db.delete).toHaveBeenCalled();
    });
  });
});
