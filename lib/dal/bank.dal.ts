import { eq } from "drizzle-orm";

import type { Bank } from "@/types/bank";

import { db } from "@/database/db";
import { banks } from "@/database/schema";
import { decrypt, encrypt } from "@/lib/encryption";

/**
 * Data Access Layer for the `banks` table.
 * Handles all read/write operations for linked Plaid bank records,
 * including transparent AES-256-GCM encryption of the access token.
 *
 * @export
 * @class BankDal
 * @typedef {BankDal}
 */
export class BankDal {
  /**
   * Finds a single bank record by its primary key and decrypts the
   * access token before returning.
   *
   * @async
   * @param {string} id
   * @returns {Promise<Bank | undefined>}
   */
  async findById(id: string): Promise<Bank | undefined> {
    const [bank] = await db.select().from(banks).where(eq(banks.id, id));
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
    }
    return bank;
  }

  /**
   * Finds all bank records belonging to a user and decrypts each
   * access token before returning.
   *
   * @async
   * @param {string} userId
   * @returns {Promise<Bank[]>}
   */
  async findByUserId(userId: string): Promise<Bank[]> {
    const bankRecords = await db
      .select()
      .from(banks)
      .where(eq(banks.userId, userId));
    return bankRecords.map((bank) => ({
      ...bank,
      accessToken: decrypt(bank.accessToken),
    }));
  }

  /**
   * Finds a single bank record by its public-safe sharable ID and
   * decrypts the access token before returning.
   *
   * @async
   * @param {string} sharableId
   * @returns {Promise<Bank | undefined>}
   */
  async findBySharableId(sharableId: string): Promise<Bank | undefined> {
    const [bank] = await db
      .select()
      .from(banks)
      .where(eq(banks.sharableId, sharableId));
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
    }
    return bank;
  }

  /**
   * Finds a single bank record by its Plaid account ID and decrypts
   * the access token before returning.
   *
   * @async
   * @param {string} accountId
   * @returns {Promise<Bank | undefined>}
   */
  async findByAccountId(accountId: string): Promise<Bank | undefined> {
    const [bank] = await db
      .select()
      .from(banks)
      .where(eq(banks.accountId, accountId));
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
    }
    return bank;
  }

  /**
   * Inserts a new bank record, encrypting the access token at rest.
   * Returns the inserted record with the plaintext access token restored
   * so callers receive a usable value.
   *
   * @async
   * @param {{
   *     userId: string;
   *     accessToken: string;
   *     fundingSourceUrl?: string;
   *     sharableId: string;
   *     institutionId?: string;
   *     institutionName?: string;
   *     accountId?: string;
   *     accountType?: string;
   *     accountSubtype?: string;
   *   }} data
   * @returns {Promise<Bank>}
   */
  async createBank(data: {
    userId: string;
    accessToken: string;
    fundingSourceUrl?: string;
    sharableId: string;
    institutionId?: string;
    institutionName?: string;
    accountId?: string;
    accountType?: string;
    accountSubtype?: string;
  }): Promise<Bank> {
    const encryptedData = {
      ...data,
      accessToken: encrypt(data.accessToken),
    };
    const [bank] = await db.insert(banks).values(encryptedData).returning();
    bank.accessToken = data.accessToken;
    return bank;
  }

  /**
   * Deletes a bank record by its primary key.
   *
   * @async
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await db.delete(banks).where(eq(banks.id, id));
  }

  /**
   * Deletes all bank records belonging to the given user.
   *
   * @async
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async deleteByUserId(userId: string): Promise<void> {
    await db.delete(banks).where(eq(banks.userId, userId));
  }
}

/**
 * Shared singleton instance of {@link BankDal}.
 * Import this instead of instantiating the class directly.
 *
 * @type {BankDal}
 */
export const bankDal = new BankDal();
