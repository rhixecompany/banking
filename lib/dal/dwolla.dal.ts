import { eq } from "drizzle-orm";

import type { Bank } from "@/types/bank";

import { db } from "@/database/db";
import { banks } from "@/database/schema";
import { decrypt, encrypt } from "@/lib/encryption";

/**
 * Data access layer for Dwolla-related bank operations.
 * Handles encrypted read/write access to the `banks` table for ACH transfer fields
 * including Dwolla customer URLs, funding source URLs, and account info.
 *
 * @export
 * @class DwollaDal
 * @typedef {DwollaDal}
 */
export class DwollaDal {
  /**
   * Finds a bank record by its Dwolla customer URL, decrypting sensitive fields before returning.
   *
   * @async
   * @param {string} dwollaCustomerUrl - The Dwolla customer URL to match.
   * @returns {Promise<Bank | undefined>} The decrypted bank record, or `undefined` if not found.
   */
  async findByDwollaCustomerUrl(
    dwollaCustomerUrl: string,
  ): Promise<Bank | undefined> {
    const [bank] = await db
      .select()
      .from(banks)
      .where(eq(banks.dwollaCustomerUrl, dwollaCustomerUrl));
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
      if (bank.accountNumberEncrypted) {
        bank.accountNumberEncrypted = decrypt(bank.accountNumberEncrypted);
      }
    }
    return bank;
  }

  /**
   * Finds a bank record by its Dwolla funding source URL, decrypting sensitive fields before returning.
   *
   * @async
   * @param {string} dwollaFundingSourceUrl - The Dwolla funding source URL to match.
   * @returns {Promise<Bank | undefined>} The decrypted bank record, or `undefined` if not found.
   */
  async findByDwollaFundingSourceUrl(
    dwollaFundingSourceUrl: string,
  ): Promise<Bank | undefined> {
    const [bank] = await db
      .select()
      .from(banks)
      .where(eq(banks.dwollaFundingSourceUrl, dwollaFundingSourceUrl));
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
      if (bank.accountNumberEncrypted) {
        bank.accountNumberEncrypted = decrypt(bank.accountNumberEncrypted);
      }
    }
    return bank;
  }

  /**
   * Updates the Dwolla customer URL on a bank record and returns the updated row with decrypted access token.
   *
   * @async
   * @param {string} bankId - The bank record ID to update.
   * @param {string} dwollaCustomerUrl - The new Dwolla customer URL to set.
   * @returns {Promise<Bank | undefined>} The updated bank record, or `undefined` if not found.
   */
  async updateDwollaCustomerUrl(
    bankId: string,
    dwollaCustomerUrl: string,
  ): Promise<Bank | undefined> {
    const [bank] = await db
      .update(banks)
      .set({ dwollaCustomerUrl, updatedAt: new Date() })
      .where(eq(banks.id, bankId))
      .returning();
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
    }
    return bank;
  }

  /**
   * Updates the Dwolla funding source URL on a bank record and returns the updated row with decrypted access token.
   *
   * @async
   * @param {string} bankId - The bank record ID to update.
   * @param {string} dwollaFundingSourceUrl - The new Dwolla funding source URL to set.
   * @returns {Promise<Bank | undefined>} The updated bank record, or `undefined` if not found.
   */
  async updateDwollaFundingSourceUrl(
    bankId: string,
    dwollaFundingSourceUrl: string,
  ): Promise<Bank | undefined> {
    const [bank] = await db
      .update(banks)
      .set({ dwollaFundingSourceUrl, updatedAt: new Date() })
      .where(eq(banks.id, bankId))
      .returning();
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
    }
    return bank;
  }

  /**
   * Updates the routing number and/or account number (encrypted) on a bank record.
   * Returns the updated bank record with sensitive fields decrypted.
   *
   * @async
   * @param {string} bankId - The bank record ID to update.
   * @param {{
   *       routingNumber?: string;
   *       accountNumber?: string;
   *     }} data - Fields to update; `accountNumber` is encrypted before storage.
   * @returns {Promise<Bank | undefined>} The updated bank record, or `undefined` if not found.
   */
  async updateBankAccountInfo(
    bankId: string,
    data: {
      routingNumber?: string;
      accountNumber?: string;
    },
  ): Promise<Bank | undefined> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (data.routingNumber) {
      updateData.routingNumber = data.routingNumber;
    }
    if (data.accountNumber) {
      updateData.accountNumberEncrypted = encrypt(data.accountNumber);
    }

    const [bank] = await db
      .update(banks)
      .set(updateData)
      .where(eq(banks.id, bankId))
      .returning();

    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
      if (bank.accountNumberEncrypted) {
        bank.accountNumberEncrypted = decrypt(bank.accountNumberEncrypted);
      }
    }
    return bank;
  }

  /**
   * Retrieves all bank records for a user that have a Dwolla customer association,
   * decrypting sensitive fields on each record before returning.
   *
   * @async
   * @param {string} userId - The user ID whose bank records to fetch.
   * @returns {Promise<Bank[]>} All bank records for the user, with decrypted fields.
   */
  async findBanksWithDwollaCustomer(userId: string): Promise<Bank[]> {
    const bankRecords = await db
      .select()
      .from(banks)
      .where(eq(banks.userId, userId));
    return bankRecords.map((bank) => {
      const decrypted = { ...bank };
      decrypted.accessToken = decrypt(bank.accessToken);
      if (bank.accountNumberEncrypted) {
        decrypted.accountNumberEncrypted = decrypt(bank.accountNumberEncrypted);
      }
      return decrypted;
    });
  }

  /**
   * Retrieves all bank records for a user that have a non-null `dwollaFundingSourceUrl`,
   * decrypting sensitive fields on each record before returning.
   *
   * @async
   * @param {string} userId - The user ID whose verified funding sources to fetch.
   * @returns {Promise<Bank[]>} Bank records that have a funding source URL set.
   */
  async findVerifiedFundingSources(userId: string): Promise<Bank[]> {
    const bankRecords = await db
      .select()
      .from(banks)
      .where(eq(banks.userId, userId));
    return bankRecords
      .map((bank) => {
        const decrypted = { ...bank };
        decrypted.accessToken = decrypt(bank.accessToken);
        if (bank.accountNumberEncrypted) {
          decrypted.accountNumberEncrypted = decrypt(
            bank.accountNumberEncrypted,
          );
        }
        return decrypted;
      })
      .filter((bank) => bank.dwollaFundingSourceUrl !== null);
  }

  /**
   * Creates a new bank record with encrypted access token and account number,
   * then returns the created row with sensitive fields in plain text.
   *
   * @async
   * @param {{
   *     userId: string;
   *     accessToken: string;
   *     sharableId: string;
   *     institutionId?: string;
   *     institutionName?: string;
   *     accountId?: string;
   *     accountType?: string;
   *     accountSubtype?: string;
   *     dwollaCustomerUrl?: string;
   *     dwollaFundingSourceUrl?: string;
   *     routingNumber?: string;
   *     accountNumber?: string;
   *   }} data - Bank creation payload; `accessToken` and `accountNumber` are encrypted before storage.
   * @returns {Promise<Bank>} The newly created bank record with sensitive fields in plain text.
   */
  async createBankWithDwolla(data: {
    userId: string;
    accessToken: string;
    sharableId: string;
    institutionId?: string;
    institutionName?: string;
    accountId?: string;
    accountType?: string;
    accountSubtype?: string;
    dwollaCustomerUrl?: string;
    dwollaFundingSourceUrl?: string;
    routingNumber?: string;
    accountNumber?: string;
  }): Promise<Bank> {
    const encryptedData = {
      accessToken: encrypt(data.accessToken),
      accountId: data.accountId,
      accountNumberEncrypted: data.accountNumber
        ? encrypt(data.accountNumber)
        : undefined,
      accountSubtype: data.accountSubtype,
      accountType: data.accountType,
      dwollaCustomerUrl: data.dwollaCustomerUrl,
      dwollaFundingSourceUrl: data.dwollaFundingSourceUrl,
      institutionId: data.institutionId,
      institutionName: data.institutionName,
      routingNumber: data.routingNumber,
      sharableId: data.sharableId,
      userId: data.userId,
    };

    const [bank] = await db
      .insert(banks)
      .values(encryptedData as typeof banks.$inferInsert)
      .returning();
    bank.accessToken = data.accessToken;
    if (data.accountNumber) {
      bank.accountNumberEncrypted = data.accountNumber;
    }
    return bank;
  }
}

/**
 * Singleton instance of {@link DwollaDal} for use throughout the application.
 *
 * @type {DwollaDal}
 */
export const dwollaDal = new DwollaDal();
