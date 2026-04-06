import { eq } from "drizzle-orm";

import type { NewRecipient, Recipient } from "@/types/recipient";

import { db } from "@/database/db";
import { recipients } from "@/database/schema";

/**
 * Data access layer for the `recipients` table.
 * Provides CRUD operations for payment recipient records.
 */
export class RecipientDal {
  /**
   * Finds a single recipient by its primary key.
   *
   * @async
   * @param {string} id - The recipient ID to look up.
   * @returns {Promise<Recipient | undefined>} The matching recipient, or undefined.
   */
  async findById(id: string): Promise<Recipient | undefined> {
    const [recipient] = await db
      .select()
      .from(recipients)
      .where(eq(recipients.id, id))
      .limit(1);
    return recipient;
  }

  /**
   * Retrieves all recipients belonging to a given user.
   *
   * @param {string} userId - The ID of the user whose recipients to fetch.
   * @returns {Promise<Recipient[]>} The list of recipients for that user.
   */
  findByUserId(userId: string): Promise<Recipient[]> {
    return db.select().from(recipients).where(eq(recipients.userId, userId));
  }

  /**
   * Inserts a new recipient record and returns the created row.
   *
   * @async
   * @param {NewRecipient} data - Recipient fields to insert.
   * @returns {Promise<Recipient>} The newly created recipient record.
   */
  async createRecipient(data: NewRecipient): Promise<Recipient> {
    const [recipient] = await db.insert(recipients).values(data).returning();
    return recipient;
  }

  /**
   * Updates a recipient record by ID and returns the updated rows.
   *
   * @param {string} id - The ID of the recipient to update.
   * @param {Partial<NewRecipient>} data - Partial fields to apply.
   * @returns {Promise<Recipient[]>} The updated recipient rows.
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
   * Deletes a recipient record by its primary key.
   *
   * @async
   * @param {string} id - The ID of the recipient to delete.
   * @returns {Promise<void>}
   */
  async delete(id: string): Promise<void> {
    await db.delete(recipients).where(eq(recipients.id, id));
  }

  /**
   * Deletes all recipient records belonging to a given user.
   *
   * @async
   * @param {string} userId - The user ID whose recipients to remove.
   * @returns {Promise<void>}
   */
  async deleteByUserId(userId: string): Promise<void> {
    await db.delete(recipients).where(eq(recipients.userId, userId));
  }
}

/**
 * Singleton instance of {@link RecipientDal} for use throughout the application.
 */
export const recipientDal = new RecipientDal();
