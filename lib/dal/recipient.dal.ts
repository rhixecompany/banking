import { eq } from "drizzle-orm";

import type { NewRecipient, Recipient } from "@/types/recipient";

import { db } from "@/database/db";
import { recipients } from "@/database/schema";

export class RecipientDal {
  async findById(id: string): Promise<Recipient | undefined> {
    const [recipient] = await db
      .select()
      .from(recipients)
      .where(eq(recipients.id, id));
    return recipient;
  }

  findByUserId(userId: string): Promise<Recipient[]> {
    return db.select().from(recipients).where(eq(recipients.userId, userId));
  }

  async createRecipient(data: NewRecipient): Promise<Recipient> {
    const [recipient] = await db.insert(recipients).values(data).returning();
    return recipient;
  }

  updateRecipient(
    id: string,
    data: Partial<NewRecipient>,
  ): Promise<Recipient[]> {
    return db
      .update(recipients)
      .set(data)
      .where(eq(recipients.id, id))
      .returning();
  }

  async delete(id: string): Promise<void> {
    await db.delete(recipients).where(eq(recipients.id, id));
  }

  async deleteByUserId(userId: string): Promise<void> {
    await db.delete(recipients).where(eq(recipients.userId, userId));
  }
}

export const recipientDal = new RecipientDal();
