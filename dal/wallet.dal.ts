import { and, eq, isNull } from "drizzle-orm";

import type { Wallet } from "@/types/wallet";

import { db } from "@/database/db";
import { wallets } from "@/database/schema";
import { decrypt, encrypt } from "@/lib/encryption";

function safeDecrypt(value: string): string {
  try {
    return decrypt(value);
  } catch {
    return value;
  }
}

/**
 * Data Access Layer for the `wallets` table.
 * Handles all read/write operations for linked Plaid wallet records,
 * including transparent AES-256-GCM encryption of the access token.
 * All queries automatically exclude soft-deleted records.
 */
export class WalletDal {
  /**
   * Finds a single wallet record by its primary key and decrypts the
   * access token before returning. Excludes soft-deleted records.
   *
   * @async
   * @param {string} id - Wallet record ID.
   * @returns {Promise<Wallet | undefined>} Decrypted wallet record or undefined.
   */
  async findById(id: string): Promise<undefined | Wallet> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.id, id))
      .limit(1);
    if (wallet?.deletedAt !== null) return undefined;
    wallet.accessToken = safeDecrypt(wallet.accessToken);
    return wallet;
  }

  /**
   * Finds all wallet records belonging to a user and decrypts each
   * access token before returning. Excludes soft-deleted records.
   *
   * @async
   * @param {string} userId - User ID.
   * @returns {Promise<Wallet[]>} Array of decrypted wallet records.
   */
  async findByUserId(userId: string): Promise<Wallet[]> {
    const walletRecords = await db
      .select()
      .from(wallets)
      // Filter soft-deleted records at the DB level to avoid transferring
      // unnecessary rows and to centralize the exclusion logic.
      .where(and(eq(wallets.userId, userId), isNull(wallets.deletedAt)));

    return walletRecords.map((wallet) => ({
      ...wallet,
      accessToken: safeDecrypt(wallet.accessToken),
    }));
  }

  /**
   * Finds a single wallet record by its public-safe sharable ID and
   * decrypts the access token before returning. Excludes soft-deleted records.
   *
   * @async
   * @param {string} sharableId - Public sharable ID.
   * @returns {Promise<Wallet | undefined>} Decrypted wallet record or undefined.
   */
  async findBySharableId(sharableId: string): Promise<undefined | Wallet> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.sharableId, sharableId))
      .limit(1);
    if (wallet?.deletedAt !== null) return undefined;
    wallet.accessToken = safeDecrypt(wallet.accessToken);
    return wallet;
  }

  /**
   * Finds a single wallet record by its Plaid account ID and decrypts
   * the access token before returning. Excludes soft-deleted records.
   *
   * @async
   * @param {string} accountId - Plaid account ID.
   * @returns {Promise<Wallet | undefined>} Decrypted wallet record or undefined.
   */
  async findByAccountId(accountId: string): Promise<undefined | Wallet> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.accountId, accountId))
      .limit(1);
    if (wallet?.deletedAt !== null) return undefined;
    wallet.accessToken = safeDecrypt(wallet.accessToken);
    return wallet;
  }

  /**
   * Inserts a new wallet record, encrypting the access token at rest.
   * Returns the inserted record with the plaintext access token restored.
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
   *   }} data - Wallet creation data.
   * @returns {Promise<Wallet>} Created wallet with plaintext access token.
   */
  async createWallet(data: {
    userId: string;
    accessToken: string;
    fundingSourceUrl?: string;
    sharableId: string;
    institutionId?: string;
    institutionName?: string;
    accountId?: string;
    accountType?: string;
    accountSubtype?: string;
  }): Promise<Wallet> {
    const encryptedData = {
      ...data,
      accessToken: encrypt(data.accessToken),
    };
    const [wallet] = await db.insert(wallets).values(encryptedData).returning();
    wallet.accessToken = data.accessToken;
    return wallet;
  }

  /**
   * Soft-deletes a wallet record by setting the deletedAt timestamp.
   *
   * @async
   * @param {string} id - Wallet record ID to soft-delete.
   * @returns {Promise<void>}
   */
  async softDelete(id: string): Promise<void> {
    await db
      .update(wallets)
      .set({ deletedAt: new Date() })
      .where(eq(wallets.id, id));
  }

  /**
   * Hard-deletes a wallet record by its primary key.
   *
   * @async
   * @param {string} id - Wallet record ID to delete.
   * @returns {Promise<void>}
   */
  async hardDelete(id: string): Promise<void> {
    await db.delete(wallets).where(eq(wallets.id, id));
  }

  /**
   * Soft-deletes all wallet records belonging to the given user.
   *
   * @async
   * @param {string} userId - User ID whose wallets to soft-delete.
   * @returns {Promise<void>}
   */
  async softDeleteByUserId(userId: string): Promise<void> {
    await db
      .update(wallets)
      .set({ deletedAt: new Date() })
      .where(eq(wallets.userId, userId));
  }

  /**
   * Hard-deletes all wallet records belonging to the given user.
   *
   * @async
   * @param {string} userId - User ID whose wallets to delete.
   * @returns {Promise<void>}
   */
  async hardDeleteByUserId(userId: string): Promise<void> {
    await db.delete(wallets).where(eq(wallets.userId, userId));
  }
}

/**
 * Shared singleton instance of {@link WalletDal}.
 */
export const walletsDal = new WalletDal();
