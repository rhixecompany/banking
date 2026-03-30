import { eq } from "drizzle-orm";

import type { NewRecipient, Recipient } from "@/types/recipient";

import { db } from "@/database/db";
import { recipients } from "@/database/schema";

/**
 * Description placeholder
 *
 * @export
 * @class RecipientDal
 * @typedef {RecipientDal}
 */
export class RecipientDal {
  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {Promise<Recipient | undefined>}
   */
  async findById(id: string): Promise<Recipient | undefined> {
    const [recipient] = await db
      .select()
      .from(recipients)
      .where(eq(recipients.id, id));
    return recipient;
  }

  /**
   * Description placeholder
   *
   * @param {string} userId
   * @returns {Promise<Recipient[]>}
   */
  findByUserId(userId: string): Promise<Recipient[]> {
    return db.select().from(recipients).where(eq(recipients.userId, userId));
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {NewRecipient} data
   * @returns {Promise<Recipient>}
   */
  async createRecipient(data: NewRecipient): Promise<Recipient> {
    const [recipient] = await db.insert(recipients).values(data).returning();
    return recipient;
  }

  /**
   * Description placeholder
   *
   * @param {string} id
   * @param {Partial<NewRecipient>} data
   * @returns {Promise<Recipient[]>}
   */
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

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await db.delete(recipients).where(eq(recipients.id, id));
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @returns {Promise<void>}
   */
  async deleteByUserId(userId: string): Promise<void> {
    await db.delete(recipients).where(eq(recipients.userId, userId));
  }
}

/**
 * Description placeholder
 *
 * @type {RecipientDal}
 */
export const recipientDal = new RecipientDal();
