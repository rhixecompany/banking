import { eq } from "drizzle-orm";

import type { Bank } from "@/types/bank";

import { db } from "@/database/db";
import { banks } from "@/database/schema";
import { decrypt, encrypt } from "@/lib/encryption";

export class DwollaDal {
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

export const dwollaDal = new DwollaDal();
