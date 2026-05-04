import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/database/db", () => ({
  db: {
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "transfer-1",
          },
        ]),
      }),
    }),
  },
}));

vi.mock("@/database/schema", () => ({
  wallets: {
    id: "id",
    customerUrl: "customerUrl",
    accessToken: "accessToken",
    accountNumberEncrypted: "accountNumberEncrypted",
    deletedAt: "deletedAt",
  },
  dwolla_transfers: {
    id: "id",
    dwollaTransferId: "dwollaTransferId",
  },
}));

vi.mock("@/lib/encryption", () => ({
  decrypt: vi.fn((s: string) => `dec_${s}`),
  encrypt: vi.fn((s: string) => `enc_${s}`),
}));

import { dwollaDal } from "@/dal/dwolla.dal";
import { db } from "@/database/db";

describe("DwollaDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findByCustomerUrl", () => {
    it("finds wallet by customer URL", async () => {
      const mockWallet = {
        id: "wallet-1",
        customerUrl: "https://dwolla.com/customers/cust-123",
        accessToken: "token",
        deletedAt: null,
      };
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([mockWallet]),
          }),
        }),
      } as never);

      const result = await dwollaDal.findByCustomerUrl(
        "https://dwolla.com/customers/cust-123",
      );
      expect(result).toBeDefined();
    });

    it("returns undefined when not found", async () => {
      (db.select as ReturnType<typeof vi.fn>).mockReturnValue({
        from: vi.fn().mockReturnValue({
          where: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue([]),
          }),
        }),
      } as never);

      const result = await dwollaDal.findByCustomerUrl(
        "https://dwolla.com/customers/notfound",
      );
      expect(result).toBeUndefined();
    });
  });

  describe("createDwollaTransfer", () => {
    it("creates dwolla transfer", async () => {
      const result = await dwollaDal.createDwollaTransfer({
        amount: "100.00",
        userId: "user-1",
      });
      expect(db.insert).toHaveBeenCalled();
    });

    it("creates with full data", async () => {
      const result = await dwollaDal.createDwollaTransfer({
        dwollaTransferId: "xfer-123",
        amount: "50.00",
        currency: "USD",
        status: "pending",
        userId: "user-1",
      });
      expect(db.insert).toHaveBeenCalled();
    });
  });
});
