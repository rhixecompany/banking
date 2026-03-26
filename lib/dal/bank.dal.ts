import { db } from "@/database/db";
import { banks } from "@/database/schema";
import { eq } from "drizzle-orm";

export class BankDal {
  async findById(id: string) {
    const [bank] = await db.select().from(banks).where(eq(banks.id, id));
    return bank;
  }

  async findByUserId(userId: string) {
    return db.select().from(banks).where(eq(banks.userId, userId));
  }

  async findBySharableId(sharableId: string) {
    const [bank] = await db
      .select()
      .from(banks)
      .where(eq(banks.sharableId, sharableId));
    return bank;
  }

  async findByAccountId(accountId: string) {
    const [bank] = await db
      .select()
      .from(banks)
      .where(eq(banks.accountId, accountId));
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
    const [bank] = await db.insert(banks).values(data).returning();
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
