import { beforeEach, describe, expect, it, vi } from "vitest";

// ---------------------------------------------------------------------------
// DB mock — must be hoisted before any DAL import
// ---------------------------------------------------------------------------

const mockReturning = vi.fn();
const mockWhere = vi.fn();
const mockSet = vi.fn();
const mockValues = vi.fn();
const mockFrom = vi.fn();
const mockUpdate = vi.fn();
const mockInsert = vi.fn();
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

// ---------------------------------------------------------------------------
// Shared fixture — a complete Bank row as Drizzle would return it
// ---------------------------------------------------------------------------

const BANK_ROW = {
  accessToken: "encrypted(raw-token)",
  accountId: "acc_abc",
  accountNumberEncrypted: "encrypted(12345678)",
  accountSubtype: "checking",
  accountType: "depository",
  createdAt: new Date("2024-01-01"),
  dwollaCustomerUrl: "https://api.dwolla.com/customers/cust-1",
  dwollaFundingSourceUrl: "https://api.dwolla.com/funding-sources/fs-1",
  // eslint-disable-next-line unicorn/no-null
  fundingSourceUrl: null,
  id: "bank-1",
  institutionId: "ins_1",
  institutionName: "First Test Bank",
  routingNumber: "021000021",
  sharableId: "sharable-1",
  updatedAt: new Date("2024-01-02"),
  userId: "user-1",
} as const;

// A variant without a funding source URL (for filter tests)
const BANK_ROW_NO_FS = {
  ...BANK_ROW,
  // eslint-disable-next-line unicorn/no-null
  dwollaFundingSourceUrl: null,
  id: "bank-2",
  sharableId: "sharable-2",
};

// ---------------------------------------------------------------------------
// Helper — wire the DB mock chain for a given terminal result
// Covers: db.select().from().where()  →  result
//         db.update().set().where().returning()  →  result
//         db.insert().values().returning()  →  result
// ---------------------------------------------------------------------------

function setupSelectMock(rows: unknown[]): void {
  mockWhere.mockResolvedValue(rows);
  mockFrom.mockReturnValue({ where: mockWhere });
  mockSelect.mockReturnValue({ from: mockFrom });
}

function setupUpdateMock(rows: unknown[]): void {
  mockReturning.mockResolvedValue(rows);
  mockWhere.mockReturnValue({ returning: mockReturning });
  mockSet.mockReturnValue({ where: mockWhere });
  mockUpdate.mockReturnValue({ set: mockSet });
}

function setupInsertMock(rows: unknown[]): void {
  mockReturning.mockResolvedValue(rows);
  mockValues.mockReturnValue({ returning: mockReturning });
  mockInsert.mockReturnValue({ values: mockValues });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("DwollaDal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ── findByDwollaCustomerUrl ──────────────────────────────────────────────

  describe("findByDwollaCustomerUrl", () => {
    it("returns decrypted bank when a matching row exists", async () => {
      setupSelectMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.findByDwollaCustomerUrl(
        "https://api.dwolla.com/customers/cust-1",
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe("bank-1");
      // accessToken must have been decrypted
      expect(result?.accessToken).toMatch(/^decrypted\(/);
      // accountNumberEncrypted must have been decrypted
      expect(result?.accountNumberEncrypted).toMatch(/^decrypted\(/);
    });

    it("returns undefined when no matching row exists", async () => {
      setupSelectMock([]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.findByDwollaCustomerUrl("no-such-url");

      expect(result).toBeUndefined();
    });

    it("skips accountNumberEncrypted decryption when field is null", async () => {
      // eslint-disable-next-line unicorn/no-null
      const row = { ...BANK_ROW, accountNumberEncrypted: null };
      setupSelectMock([row]);
      const { dwollaDal } = await import("@/lib/dal");
      const { decrypt } = await import("@/lib/encryption");

      await dwollaDal.findByDwollaCustomerUrl(
        "https://api.dwolla.com/customers/cust-1",
      );

      // decrypt should only be called once — for accessToken
      expect(decrypt).toHaveBeenCalledTimes(1);
    });
  });

  // ── findByDwollaFundingSourceUrl ─────────────────────────────────────────

  describe("findByDwollaFundingSourceUrl", () => {
    it("returns decrypted bank when a matching row exists", async () => {
      setupSelectMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.findByDwollaFundingSourceUrl(
        "https://api.dwolla.com/funding-sources/fs-1",
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe("bank-1");
      expect(result?.accessToken).toMatch(/^decrypted\(/);
    });

    it("returns undefined when no matching row exists", async () => {
      setupSelectMock([]);
      const { dwollaDal } = await import("@/lib/dal");

      const result =
        await dwollaDal.findByDwollaFundingSourceUrl("no-such-url");

      expect(result).toBeUndefined();
    });
  });

  // ── updateDwollaCustomerUrl ──────────────────────────────────────────────

  describe("updateDwollaCustomerUrl", () => {
    it("returns decrypted bank after updating the customer URL", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.updateDwollaCustomerUrl(
        "bank-1",
        "https://api.dwolla.com/customers/cust-new",
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe("bank-1");
      expect(result?.accessToken).toMatch(/^decrypted\(/);
    });

    it("returns undefined when the bank row does not exist", async () => {
      setupUpdateMock([]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.updateDwollaCustomerUrl(
        "no-such-bank",
        "https://api.dwolla.com/customers/cust-new",
      );

      expect(result).toBeUndefined();
    });
  });

  // ── updateDwollaFundingSourceUrl ─────────────────────────────────────────

  describe("updateDwollaFundingSourceUrl", () => {
    it("returns decrypted bank after updating the funding source URL", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.updateDwollaFundingSourceUrl(
        "bank-1",
        "https://api.dwolla.com/funding-sources/fs-new",
      );

      expect(result).toBeDefined();
      expect(result?.id).toBe("bank-1");
      expect(result?.accessToken).toMatch(/^decrypted\(/);
    });

    it("returns undefined when the bank row does not exist", async () => {
      setupUpdateMock([]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.updateDwollaFundingSourceUrl(
        "no-such-bank",
        "https://api.dwolla.com/funding-sources/fs-new",
      );

      expect(result).toBeUndefined();
    });
  });

  // ── updateBankAccountInfo ────────────────────────────────────────────────

  describe("updateBankAccountInfo", () => {
    it("encrypts the accountNumber before persisting it", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");
      const { encrypt } = await import("@/lib/encryption");

      await dwollaDal.updateBankAccountInfo("bank-1", {
        accountNumber: "9876543210",
        routingNumber: "021000021",
      });

      expect(encrypt).toHaveBeenCalledWith("9876543210");
    });

    it("does not call encrypt when accountNumber is omitted", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");
      const { encrypt } = await import("@/lib/encryption");

      await dwollaDal.updateBankAccountInfo("bank-1", {
        routingNumber: "021000021",
      });

      expect(encrypt).not.toHaveBeenCalled();
    });

    it("returns decrypted bank after update", async () => {
      setupUpdateMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.updateBankAccountInfo("bank-1", {
        routingNumber: "021000021",
      });

      expect(result?.accessToken).toMatch(/^decrypted\(/);
    });

    it("returns undefined when the bank row does not exist", async () => {
      setupUpdateMock([]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.updateBankAccountInfo("no-such-bank", {
        routingNumber: "021000021",
      });

      expect(result).toBeUndefined();
    });
  });

  // eslint-disable-next-line no-secrets/no-secrets
  // ── findBanksWithDwollaCustomer ──────────────────────────────────────────

  // eslint-disable-next-line no-secrets/no-secrets
  describe("findBanksWithDwollaCustomer", () => {
    it("returns all banks for a given userId with decrypted tokens", async () => {
      setupSelectMock([{ ...BANK_ROW }, { ...BANK_ROW_NO_FS }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.findBanksWithDwollaCustomer("user-1");

      expect(result).toHaveLength(2);
      // Every returned bank must have its token decrypted
      for (const bank of result) {
        expect(bank.accessToken).toMatch(/^decrypted\(/);
      }
    });

    it("returns an empty array when no banks exist for the user", async () => {
      setupSelectMock([]);
      const { dwollaDal } = await import("@/lib/dal");

      const result =
        await dwollaDal.findBanksWithDwollaCustomer("no-such-user");

      expect(result).toEqual([]);
    });
  });

  // ── findVerifiedFundingSources ───────────────────────────────────────────

  describe("findVerifiedFundingSources", () => {
    it("returns only banks that have a non-null dwollaFundingSourceUrl", async () => {
      setupSelectMock([{ ...BANK_ROW }, { ...BANK_ROW_NO_FS }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.findVerifiedFundingSources("user-1");

      // BANK_ROW has a funding source URL; BANK_ROW_NO_FS does not
      expect(result).toHaveLength(1);
      expect(result[0]?.id).toBe("bank-1");
    });

    it("returns an empty array when no verified funding sources exist", async () => {
      setupSelectMock([{ ...BANK_ROW_NO_FS }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.findVerifiedFundingSources("user-1");

      expect(result).toEqual([]);
    });

    it("returns decrypted tokens for matching banks", async () => {
      setupSelectMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");

      const [bank] = await dwollaDal.findVerifiedFundingSources("user-1");

      expect(bank?.accessToken).toMatch(/^decrypted\(/);
    });
  });

  // ── createBankWithDwolla ─────────────────────────────────────────────────

  describe("createBankWithDwolla", () => {
    it("encrypts accessToken and accountNumber before insert", async () => {
      setupInsertMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");
      const { encrypt } = await import("@/lib/encryption");

      await dwollaDal.createBankWithDwolla({
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
      const { dwollaDal } = await import("@/lib/dal");
      const { encrypt } = await import("@/lib/encryption");

      await dwollaDal.createBankWithDwolla({
        accessToken: "raw-token",
        sharableId: "sharable-1",
        userId: "user-1",
      });

      // encrypt called once — only for accessToken
      expect(encrypt).toHaveBeenCalledTimes(1);
      expect(encrypt).toHaveBeenCalledWith("raw-token");
    });

    it("returns bank with plain-text accessToken restored", async () => {
      setupInsertMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.createBankWithDwolla({
        accessToken: "raw-token",
        sharableId: "sharable-1",
        userId: "user-1",
      });

      // createBankWithDwolla restores the plain-text token on the returned row
      expect(result.accessToken).toBe("raw-token");
    });

    it("returns bank with plain-text accountNumber restored when provided", async () => {
      setupInsertMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.createBankWithDwolla({
        accessToken: "raw-token",
        accountNumber: "12345678",
        sharableId: "sharable-1",
        userId: "user-1",
      });

      expect(result.accountNumberEncrypted).toBe("12345678");
    });

    it("persists optional fields when provided", async () => {
      setupInsertMock([{ ...BANK_ROW }]);
      const { dwollaDal } = await import("@/lib/dal");

      const result = await dwollaDal.createBankWithDwolla({
        accessToken: "raw-token",
        accountSubtype: "checking",
        accountType: "depository",
        dwollaCustomerUrl: "https://api.dwolla.com/customers/cust-1",
        dwollaFundingSourceUrl: "https://api.dwolla.com/funding-sources/fs-1",
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
