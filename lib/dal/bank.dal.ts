import { eq } from "drizzle-orm";

import type { Bank } from "@/types/bank";

import { db } from "@/database/db";
import { banks } from "@/database/schema";
import { decrypt, encrypt } from "@/lib/encryption";

/**
 * Description placeholder
 *
 * @export
 * @class BankDal
 * @typedef {BankDal}
 */
export class BankDal {
  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {unknown}
   */
  async findById(id: string): Promise<Bank | undefined> {
    const [bank] = await db.select().from(banks).where(eq(banks.id, id));
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
    }
    return bank;
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {string} sharableId
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {string} accountId
   * @returns {unknown}
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
   * Description placeholder
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
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {*}
   */
  async delete(id: string): Promise<void> {
    await db.delete(banks).where(eq(banks.id, id));
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {*}
   */
  async deleteByUserId(userId: string): Promise<void> {
    await db.delete(banks).where(eq(banks.userId, userId));
  }
}

/**
 * Description placeholder
 *
 * @type {BankDal}
 */
export const bankDal = new BankDal();
