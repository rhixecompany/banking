import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/database/db", () => ({
  db: {
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockReturnValue({
        returning: vi.fn().mockResolvedValue([
          {
            id: "transfer-1",
          },
        ]),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue([]),
        }),
      }),
    }),
  },
}));

vi.mock("@/database/schema", () => ({
  dwolla_transfers: {
    dwollaTransferId: "dwollaTransferId",
    id: "id",
  },
  wallets: {
    accessToken: "accessToken",
    accountNumberEncrypted: "accountNumberEncrypted",
    customerUrl: "customerUrl",
    deletedAt: "deletedAt",
    id: "id",
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
        accessToken: "token",
        customerUrl: "https://dwolla.com/customers/cust-123",
        deletedAt: null,
        id: "wallet-1",
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
        amount: "50.00",
        currency: "USD",
        dwollaTransferId: "xfer-123",
        status: "pending",
        userId: "user-1",
      });
      expect(db.insert).toHaveBeenCalled();
    });
  });
});
