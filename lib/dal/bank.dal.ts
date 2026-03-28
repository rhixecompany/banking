import { db } from "@/database/db";
import { banks } from "@/database/schema";
import { decrypt, encrypt } from "@/lib/encryption";
import { eq } from "drizzle-orm";

export class BankDal {
  async findById(id: string) {
    const [bank] = await db.select().from(banks).where(eq(banks.id, id));
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
    }
    return bank;
  }

  async findByUserId(userId: string) {
    const bankRecords = await db
      .select()
      .from(banks)
      .where(eq(banks.userId, userId));
    return bankRecords.map((bank) => ({
      ...bank,
      accessToken: decrypt(bank.accessToken),
    }));
  }

  async findBySharableId(sharableId: string) {
    const [bank] = await db
      .select()
      .from(banks)
      .where(eq(banks.sharableId, sharableId));
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
    }
    return bank;
  }

  async findByAccountId(accountId: string) {
    const [bank] = await db
      .select()
      .from(banks)
      .where(eq(banks.accountId, accountId));
    if (bank) {
      bank.accessToken = decrypt(bank.accessToken);
    }
    return bank;
  }

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
  }) {
    const encryptedData = {
      ...data,
      accessToken: encrypt(data.accessToken),
    };
    const [bank] = await db.insert(banks).values(encryptedData).returning();
    bank.accessToken = data.accessToken;
    return bank;
  }

  async delete(id: string) {
    await db.delete(banks).where(eq(banks.id, id));
  }

  async deleteByUserId(userId: string) {
    await db.delete(banks).where(eq(banks.userId, userId));
  }
}

export const bankDal = new BankDal();
