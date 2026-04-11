import { eq } from "drizzle-orm";

import type { Wallet } from "@/types/wallet";

import { db } from "@/database/db";
import { dwolla_transfers, wallets } from "@/database/schema";
import { decrypt, encrypt } from "@/lib/encryption";

/**
 * Data access layer for Dwolla-related wallet operations.
 * Handles encrypted read/write access to the `wallets` table for ACH transfer fields.
 * All queries automatically exclude soft-deleted records.
 */
export class DwollaDal {
  /**
   * Finds a wallet record by its Dwolla customer URL, decrypting sensitive fields.
   * Excludes soft-deleted records.
   *
   * @async
   * @param {string} customerUrl - The Dwolla customer URL to match.
   * @returns {Promise<Wallet | undefined>} Decrypted wallet record, or undefined.
   */
  async findByCustomerUrl(customerUrl: string): Promise<undefined | Wallet> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.customerUrl, customerUrl))
      .limit(1);
    if (wallet?.deletedAt !== null) return undefined;
    wallet.accessToken = decrypt(wallet.accessToken);
    if (wallet.accountNumberEncrypted) {
      wallet.accountNumberEncrypted = decrypt(wallet.accountNumberEncrypted);
    }
    return wallet;
  }

  /**
   * Creates a Dwolla transfer metadata record in the dwolla_transfers table.
   * Returns the created row.
   */
  async createDwollaTransfer(data: {
    dwollaTransferId?: string;
    transferUrl?: string;
    amount: number | string;
    currency?: string;
    status?: string;
    sourceFundingSourceUrl?: string;
    destinationFundingSourceUrl?: string;
    senderWalletId?: string;
    receiverWalletId?: string;
    userId?: string;
  }) {
    const insertData = {
      amount:
        typeof data.amount === "string" ? data.amount : String(data.amount),
      createdAt: new Date(),
      currency: data.currency ?? "USD",
      destinationFundingSourceUrl: data.destinationFundingSourceUrl,
      dwollaTransferId: data.dwollaTransferId,
      receiverWalletId: data.receiverWalletId ?? undefined,
      senderWalletId: data.senderWalletId ?? undefined,
      sourceFundingSourceUrl: data.sourceFundingSourceUrl,
      status: data.status ?? undefined,
      transferUrl: data.transferUrl,
      updatedAt: new Date(),
      userId: data.userId ?? undefined,
    } as typeof dwolla_transfers.$inferInsert;

    const [row] = await db
      .insert(dwolla_transfers)
      .values(insertData)
      .returning();
    return row;
  }

  /**
   * Finds dwolla_transfers rows by user id.
   */
  findTransfersByUserId(userId: string) {
    return db
      .select()
      .from(dwolla_transfers)
      .where(eq(dwolla_transfers.userId, userId));
  }

  /**
   * Updates status for a dwolla transfer by id and returns updated row.
   */
  async updateTransferStatus(id: string, status: string) {
    const [row] = await db
      .update(dwolla_transfers)
      .set({ status, updatedAt: new Date() })
      .where(eq(dwolla_transfers.id, id))
      .returning();
    return row;
  }

  /**
   * Finds a wallet record by its Dwolla funding source URL, decrypting sensitive fields.
   * Excludes soft-deleted records.
   *
   * @async
   * @param {string} fundingSourceUrl - The Dwolla funding source URL to match.
   * @returns {Promise<Wallet | undefined>} Decrypted wallet record, or undefined.
   */
  async findByFundingSourceUrl(
    fundingSourceUrl: string,
  ): Promise<undefined | Wallet> {
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.fundingSourceUrl, fundingSourceUrl))
      .limit(1);
    if (wallet?.deletedAt !== null) return undefined;
    wallet.accessToken = decrypt(wallet.accessToken);
    if (wallet.accountNumberEncrypted) {
      wallet.accountNumberEncrypted = decrypt(wallet.accountNumberEncrypted);
    }
    return wallet;
  }

  /**
   * Updates the customer URL on a wallet record and returns the updated row.
   *
   * @async
   * @param {string} walletId - The wallet record ID to update.
   * @param {string} customerUrl - The new customer URL to set.
   * @returns {Promise<Wallet | undefined>} Updated wallet record, or undefined.
   */
  async updateCustomerUrl(
    walletId: string,
    customerUrl: string,
  ): Promise<undefined | Wallet> {
    const [wallet] = await db
      .update(wallets)
      .set({ customerUrl, updatedAt: new Date() })
      .where(eq(wallets.id, walletId))
      .returning();
    if (wallet) {
      wallet.accessToken = decrypt(wallet.accessToken);
    }
    return wallet;
  }

  /**
   * Updates the funding source URL on a wallet record and returns the updated row.
   *
   * @async
   * @param {string} walletId - The wallet record ID to update.
   * @param {string} fundingSourceUrl - The new funding source URL to set.
   * @returns {Promise<Wallet | undefined>} Updated wallet record, or undefined.
   */
  async updateFundingSourceUrl(
    walletId: string,
    fundingSourceUrl: string,
  ): Promise<undefined | Wallet> {
    const [wallet] = await db
      .update(wallets)
      .set({ fundingSourceUrl, updatedAt: new Date() })
      .where(eq(wallets.id, walletId))
      .returning();
    if (wallet) {
      wallet.accessToken = decrypt(wallet.accessToken);
    }
    return wallet;
  }

  /**
   * Updates the routing number and/or account number (encrypted) on a wallet record.
   *
   * @async
   * @param {string} walletId - The wallet record ID to update.
   * @param {{ routingNumber?: string; accountNumber?: string }} data - Fields to update.
   * @returns {Promise<Wallet | undefined>} Updated wallet record, or undefined.
   */
  async updateWalletAccountInfo(
    walletId: string,
    data: {
      routingNumber?: string;
      accountNumber?: string;
    },
  ): Promise<undefined | Wallet> {
    const updateData: Record<string, unknown> = { updatedAt: new Date() };

    if (data.routingNumber) {
      updateData.routingNumber = data.routingNumber;
    }
    if (data.accountNumber) {
      updateData.accountNumberEncrypted = encrypt(data.accountNumber);
    }

    const [wallet] = await db
      .update(wallets)
      .set(updateData)
      .where(eq(wallets.id, walletId))
      .returning();

    if (wallet) {
      wallet.accessToken = decrypt(wallet.accessToken);
      if (wallet.accountNumberEncrypted) {
        wallet.accountNumberEncrypted = decrypt(wallet.accountNumberEncrypted);
      }
    }
    return wallet;
  }

  /**
   * Retrieves all wallet records for a user that have a customer URL,
   * decrypting sensitive fields on each record.
   *
   * @async
   * @param {string} userId - The user ID whose wallet records to fetch.
   * @returns {Promise<Wallet[]>} All wallet records for the user with decrypted fields.
   */
  async findWalletsWithCustomerUrl(userId: string): Promise<Wallet[]> {
    const walletRecords = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));
    return walletRecords
      .filter(
        (wallet) => wallet.deletedAt === null && wallet.customerUrl !== null,
      )
      .map((wallet) => {
        const decrypted = { ...wallet };
        decrypted.accessToken = decrypt(wallet.accessToken);
        if (wallet.accountNumberEncrypted) {
          decrypted.accountNumberEncrypted = decrypt(
            wallet.accountNumberEncrypted,
          );
        }
        return decrypted;
      });
  }

  /**
   * Retrieves all wallet records for a user that have a funding source URL,
   * decrypting sensitive fields on each record.
   *
   * @async
   * @param {string} userId - The user ID whose verified funding sources to fetch.
   * @returns {Promise<Wallet[]>} Wallet records with funding source URL.
   */
  async findVerifiedFundingSources(userId: string): Promise<Wallet[]> {
    const walletRecords = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, userId));
    return walletRecords
      .filter(
        (wallet) =>
          wallet.deletedAt === null && wallet.fundingSourceUrl !== null,
      )
      .map((wallet) => {
        const decrypted = { ...wallet };
        decrypted.accessToken = decrypt(wallet.accessToken);
        if (wallet.accountNumberEncrypted) {
          decrypted.accountNumberEncrypted = decrypt(
            wallet.accountNumberEncrypted,
          );
        }
        return decrypted;
      });
  }

  /**
   * Creates a new wallet record with encrypted access token and account number.
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
   *     customerUrl?: string;
   *     fundingSourceUrl?: string;
   *     routingNumber?: string;
   *     accountNumber?: string;
   *   }} data - Wallet creation payload with encrypted fields.
   * @returns {Promise<Wallet>} Created wallet with plaintext sensitive fields.
   */
  async createWalletWithDwolla(data: {
    userId: string;
    accessToken: string;
    sharableId: string;
    institutionId?: string;
    institutionName?: string;
    accountId?: string;
    accountType?: string;
    accountSubtype?: string;
    customerUrl?: string;
    fundingSourceUrl?: string;
    routingNumber?: string;
    accountNumber?: string;
  }): Promise<Wallet> {
    const encryptedData = {
      accessToken: encrypt(data.accessToken),
      accountId: data.accountId,
      accountNumberEncrypted: data.accountNumber
        ? encrypt(data.accountNumber)
        : undefined,
      accountSubtype: data.accountSubtype,
      accountType: data.accountType,
      customerUrl: data.customerUrl,
      fundingSourceUrl: data.fundingSourceUrl,
      institutionId: data.institutionId,
      institutionName: data.institutionName,
      routingNumber: data.routingNumber,
      sharableId: data.sharableId,
      userId: data.userId,
    };

    const [wallet] = await db
      .insert(wallets)
      .values(encryptedData as typeof wallets.$inferInsert)
      .returning();
    wallet.accessToken = data.accessToken;
    if (data.accountNumber) {
      wallet.accountNumberEncrypted = data.accountNumber;
    }
    return wallet;
  }
}

/**
 * Singleton instance of {@link DwollaDal} for use throughout the application.
 */
export const dwollaDal = new DwollaDal();
