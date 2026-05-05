import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const mockReturning = vi.fn();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const mockWhere = vi.fn();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const mockSet = vi.fn();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const mockValues = vi.fn();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const mockFrom = vi.fn();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const mockUpdate = vi.fn();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const mockInsert = vi.fn();
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const mockSelect = vi.fn();

vi.mock("@/database/db", () => ({
  db: {
    insert: mockInsert,
    select: mockSelect,
    update: mockUpdate,
  },
}));

vi.mock("@/lib/encryption", () => ({
  decrypt: vi.fn((v: string) => `decrypted(${v})`),
  encrypt: vi.fn((v: string) => `encrypted(${v})`),
}));

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{ readonly accessToken: "encrypted(raw-token)"; readonly accountId: "acc_abc"; readonly accountNumberEncrypted: "encrypted(12345678)"; readonly accountSubtype: "checking"; readonly accountType: "depository"; ... 10 more ...; readonly userId: "user-1"; }}
 */
const BANK_ROW = {
  accessToken: "encrypted(raw-token)",
  accountId: "acc_abc",
  accountNumberEncrypted: "encrypted(12345678)",
  accountSubtype: "checking",
  accountType: "depository",
  createdAt: new Date("2024-01-01"),
  customerUrl: "https://api.dwolla.com/customers/cust-1",

  deletedAt: null,
  fundingSourceUrl: "https://api.dwolla.com/funding-sources/fs-1",
  id: "bank-1",
  institutionId: "ins_1",
  institutionName: "First Test Bank",
  routingNumber: "021000021",
  sharableId: "sharable-1",
  updatedAt: new Date("2024-01-02"),
  userId: "user-1",
} as const;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{ fundingSourceUrl: string | null; id: string; sharableId: string; accessToken: "encrypted(raw-token)"; accountId: "acc_abc"; accountNumberEncrypted: "encrypted(12345678)"; accountSubtype: "checking"; ... 8 more ...; userId: "user-1"; }}
 */
const BANK_ROW_NO_FS = {
  ...BANK_ROW,

  fundingSourceUrl: null,
  id: "bank-2",
  sharableId: "sharable-2",
};

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {unknown[]} rows
 */
function setupSelectMock(rows: unknown[]): void {
  const thenableObject = Object.assign(Promise.resolve(rows), {
    limit: vi.fn().mockResolvedValue(rows),
  });
  mockWhere.mockReturnValue(thenableObject);
  mockFrom.mockReturnValue({
    where: mockWhere,
    limit: vi.fn().mockResolvedValue(rows),
  });
  mockSelect.mockReturnValue({ from: mockFrom });
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {unknown[]} rows
 */
function setupUpdateMock(rows: unknown[]): void {
  mockReturning.mockResolvedValue(rows);
  mockWhere.mockReturnValue({ returning: mockReturning });
  mockSet.mockReturnValue({ where: mockWhere });
  mockUpdate.mockReturnValue({ set: mockSet });
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {unknown[]} rows
 */
function setupInsertMock(rows: unknown[]): void {
  mockReturning.mockResolvedValue(rows);
  mockValues.mockReturnValue({ returning: mockReturning });
  mockInsert.mockReturnValue({ values: mockValues });
}

describe("DwollaDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("findByCustomerUrl", () => {
    it("returns decrypted bank when a matching row exists", async () => {
      setupSelectMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findByCustomerUrl(
        "https://api.dwolla.com/customers/cust-1",
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe("bank-1");
      expect(result?.accessToken).toMatch(/^decrypted\(/);
      expect(result?.accountNumberEncrypted).toMatch(/^decrypted\(/);
    });

    it("returns undefined when no matching row exists", async () => {
      setupSelectMock([]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findByCustomerUrl("no-such-url");

      expect(result).toBeUndefined();
    });

    it("skips accountNumberEncrypted decryption when field is null", async () => {
      const row = {
        ...BANK_ROW,

        accountNumberEncrypted: null,
      };
      setupSelectMock([row]);
      const { dwollaDal } = await import("@/dal");
      const { decrypt } = await import("@/lib/encryption");

      await dwollaDal.findByCustomerUrl(
        "https://api.dwolla.com/customers/cust-1",
      );

      expect(decrypt).toHaveBeenCalledTimes(1);
    });

    it("returns undefined for soft-deleted rows", async () => {
      const deletedRow = { ...BANK_ROW, deletedAt: new Date() };
      setupSelectMock([deletedRow]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findByCustomerUrl(
        "https://api.dwolla.com/customers/cust-1",
      );

      expect(result).toBeUndefined();
    });
  });

  describe("findByFundingSourceUrl", () => {
    it("returns decrypted bank when a matching row exists", async () => {
      setupSelectMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findByFundingSourceUrl(
        "https://api.dwolla.com/funding-sources/fs-1",
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe("bank-1");
      expect(result?.accessToken).toMatch(/^decrypted\(/);
    });

    it("returns undefined when no matching row exists", async () => {
      setupSelectMock([]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findByFundingSourceUrl("no-such-url");

      expect(result).toBeUndefined();
    });
  });

  describe("updateCustomerUrl", () => {
    it("returns decrypted bank after updating the customer URL", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.updateCustomerUrl(
        "bank-1",
        "https://api.dwolla.com/customers/cust-new",
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe("bank-1");
      expect(result?.accessToken).toMatch(/^decrypted\(/);
    });

    it("returns undefined when the bank row does not exist", async () => {
      setupUpdateMock([]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.updateCustomerUrl(
        "no-such-bank",
        "https://api.dwolla.com/customers/cust-new",
      );

      expect(result).toBeUndefined();
    });
  });

  describe("updateFundingSourceUrl", () => {
    it("returns decrypted bank after updating the funding source URL", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.updateFundingSourceUrl(
        "bank-1",
        "https://api.dwolla.com/funding-sources/fs-new",
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe("bank-1");
      expect(result?.accessToken).toMatch(/^decrypted\(/);
    });

    it("returns undefined when the bank row does not exist", async () => {
      setupUpdateMock([]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.updateFundingSourceUrl(
        "no-such-bank",
        "https://api.dwolla.com/funding-sources/fs-new",
      );

      expect(result).toBeUndefined();
    });
  });

  describe("updateWalletAccountInfo", () => {
    it("encrypts the accountNumber before persisting it", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");
      const { encrypt } = await import("@/lib/encryption");

      await dwollaDal.updateWalletAccountInfo("bank-1", {
        accountNumber: "9876543210",
        routingNumber: "021000021",
      });

      expect(encrypt).toHaveBeenCalledWith("9876543210");
    });

    it("does not call encrypt when accountNumber is omitted", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");
      const { encrypt } = await import("@/lib/encryption");

      await dwollaDal.updateWalletAccountInfo("bank-1", {
        routingNumber: "021000021",
      });

      expect(encrypt).not.toHaveBeenCalled();
    });

    it("returns decrypted wallet after update", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.updateWalletAccountInfo("bank-1", {
        routingNumber: "021000021",
      });

      expect(result?.accessToken).toMatch(/^decrypted\(/);
    });

    it("returns undefined when the wallet row does not exist", async () => {
      setupUpdateMock([]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.updateWalletAccountInfo("no-such-wallet", {
        routingNumber: "021000021",
      });

      expect(result).toBeUndefined();
    });
  });

  describe("findWalletsWithCustomerUrl", () => {
    it("returns all wallets for a given userId with decrypted tokens", async () => {
      setupSelectMock([{ ...BANK_ROW }, { ...BANK_ROW_NO_FS }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findWalletsWithCustomerUrl("user-1");

      expect(result).toHaveLength(2);
      expect(result[0]?.accessToken).toMatch(/^decrypted\(/);
    });

    it("returns empty array when no wallets exist for the user", async () => {
      setupSelectMock([]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findWalletsWithCustomerUrl("no-such-user");

      expect(result).toEqual([]);
    });

    it("excludes soft-deleted wallets", async () => {
      const deletedRow = { ...BANK_ROW, deletedAt: new Date() };
      setupSelectMock([deletedRow, { ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findWalletsWithCustomerUrl("user-1");

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("bank-1");
    });
  });

  describe("findVerifiedFundingSources", () => {
    it("returns only banks that have a non-null fundingSourceUrl", async () => {
      setupSelectMock([{ ...BANK_ROW }, { ...BANK_ROW_NO_FS }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findVerifiedFundingSources("user-1");

      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("bank-1");
    });

    it("returns empty array when no verified funding sources exist", async () => {
      setupSelectMock([{ ...BANK_ROW_NO_FS }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.findVerifiedFundingSources("user-1");

      expect(result).toEqual([]);
    });

    it("returns decrypted tokens for matching banks", async () => {
      setupSelectMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const [bank] = await dwollaDal.findVerifiedFundingSources("user-1");

      expect(bank?.accessToken).toMatch(/^decrypted\(/);
    });
  });

  describe("createWalletWithDwolla", () => {
    it("encrypts accessToken and accountNumber before insert", async () => {
      setupInsertMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");
      const { encrypt } = await import("@/lib/encryption");

      await dwollaDal.createWalletWithDwolla({
        accessToken: "raw-token",
        accountNumber: "12345678",
        sharableId: "sharable-1",
        userId: "user-1",
      });

      expect(encrypt).toHaveBeenCalledWith("raw-token");
      expect(encrypt).toHaveBeenCalledWith("12345678");
    });

    it("does not call encrypt for accountNumber when omitted", async () => {
      setupInsertMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");
      const { encrypt } = await import("@/lib/encryption");

      await dwollaDal.createWalletWithDwolla({
        accessToken: "raw-token",
        sharableId: "sharable-1",
        userId: "user-1",
      });

      expect(encrypt).toHaveBeenCalledTimes(1);
      expect(encrypt).toHaveBeenCalledWith("raw-token");
    });

    it("returns wallet with plain-text accessToken restored", async () => {
      setupInsertMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.createWalletWithDwolla({
        accessToken: "raw-token",
        sharableId: "sharable-1",
        userId: "user-1",
      });

      expect(result.accessToken).toBe("raw-token");
    });

    it("returns wallet with plain-text accountNumber restored when provided", async () => {
      setupInsertMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.createWalletWithDwolla({
        accessToken: "raw-token",
        accountNumber: "12345678",
        sharableId: "sharable-1",
        userId: "user-1",
      });

      expect(result.accountNumberEncrypted).toBe("12345678");
    });

    it("persists optional fields when provided", async () => {
      setupInsertMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/dal");

      const result = await dwollaDal.createWalletWithDwolla({
        accessToken: "raw-token",
        accountSubtype: "checking",
        accountType: "depository",
        customerUrl: "https://api.dwolla.com/customers/cust-1",
        fundingSourceUrl: "https://api.dwolla.com/funding-sources/fs-1",
        institutionId: "ins_1",
        institutionName: "First Test Bank",
        routingNumber: "021000021",
        sharableId: "sharable-1",
        userId: "user-1",
      });

      expect(result).toBeDefined();
      expect(result.id).toBe("bank-1");
    });
  });
});
