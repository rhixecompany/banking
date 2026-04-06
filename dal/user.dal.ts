import { eq } from "drizzle-orm";

import type {
  NewUserProfile,
  User,
  UserProfile,
  UserWithProfile,
} from "@/types/user";

import { db } from "@/database/db";
import { user_profiles, users } from "@/database/schema";

/**
 * Data access layer for the `users` and `user_profiles` tables.
 * Provides authentication, profile management, and admin operations.
 * All queries automatically exclude soft-deleted records (deletedAt IS NULL).
 */
export class UserDal {
  /**
   * Finds a single user by email address.
   * Excludes soft-deleted users.
   *
   * @async
   * @param {string} email - The email address to look up.
   * @returns {Promise<User | undefined>} The matching user, or `undefined` if not found.
   */
  async findByEmail(email: string): Promise<undefined | User> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user?.deletedAt === null ? user : undefined;
  }

  /**
   * Finds a single user by their primary key.
   * Excludes soft-deleted users.
   *
   * @async
   * @param {string} id - The user ID to look up.
   * @returns {Promise<User | undefined>} The matching user, or `undefined` if not found.
   */
  async findById(id: string): Promise<undefined | User> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return user?.deletedAt === null ? user : undefined;
  }

  /**
   * Finds a user by ID along with their profile via a single JOIN query (no N+1).
   * Returns `undefined` if the user does not exist or is soft-deleted.
   * The `profile` field will be `undefined` if no profile row exists yet.
   *
   * @async
   * @param {string} id - The user ID to look up.
   * @returns {Promise<UserWithProfile | undefined>} The user with their profile, or `undefined` if not found.
   */
  async findByIdWithProfile(id: string): Promise<undefined | UserWithProfile> {
    const [result] = await db
      .select({
        createdAt: users.createdAt,
        deletedAt: users.deletedAt,
        email: users.email,
        emailVerified: users.emailVerified,
        id: users.id,
        image: users.image,
        isActive: users.isActive,
        isAdmin: users.isAdmin,
        name: users.name,
        password: users.password,
        profile: {
          address: user_profiles.address,
          city: user_profiles.city,
          createdAt: user_profiles.createdAt,
          dateOfBirth: user_profiles.dateOfBirth,
          id: user_profiles.id,
          phone: user_profiles.phone,
          postalCode: user_profiles.postalCode,
          ssnEncrypted: user_profiles.ssnEncrypted,
          state: user_profiles.state,
          updatedAt: user_profiles.updatedAt,
          userId: user_profiles.userId,
        },
        role: users.role,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(user_profiles, eq(users.id, user_profiles.userId))
      .where(eq(users.id, id))
      .limit(1);

    if (!result) return undefined;
    if (result.deletedAt !== null) return undefined;

    const {
      deletedAt: _deletedAt,
      profile,
      ...user
    } = result as {
      deletedAt: Date | null;
      profile: null | typeof user_profiles.$inferSelect;
    } & Omit<typeof users.$inferSelect, "deletedAt">;

    return { ...user, profile: profile ?? undefined };
  }

  /**
   * Inserts a new user record and returns the created row.
   *
   * @async
   * @param {{ email: string; password: string; name?: string }} data - User fields to insert.
   * @returns {Promise<User>} The newly created user record.
   */
  async create(data: {
    email: string;
    password: string;
    name?: string;
  }): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  /**
   * Applies a partial update to a user record by ID and returns the updated row.
   *
   * @async
   * @param {string} id - The user ID to update.
   * @param {Partial<typeof users.$inferInsert>} data - Partial fields to apply.
   * @returns {Promise<User>} The updated user record.
   */
  async update(
    id: string,
    data: Partial<typeof users.$inferInsert>,
  ): Promise<User> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  /**
   * Creates a user and, optionally, a linked profile row in a single database transaction.
   * After the transaction commits, fetches and returns the full `UserWithProfile` via a JOIN.
   *
   * @async
   * @param {{
   *     email: string;
   *     password: string;
   *     name?: string;
   *     profile?: Partial<typeof user_profiles.$inferInsert>;
   *   }} data - User and optional profile fields to insert.
   * @returns {Promise<UserWithProfile | undefined>} The created user with their profile, or `undefined` on failure.
   */
  async createWithProfile(data: {
    email: string;
    password: string;
    name?: string;
    profile?: Partial<NewUserProfile>;
  }): Promise<undefined | UserWithProfile> {
    let userId: string | undefined;

    await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({
          email: data.email,
          name: data.name,
          password: data.password,
        })
        .returning();

      userId = user.id;

      if (data.profile) {
        await tx.insert(user_profiles).values({
          userId: user.id,
          ...data.profile,
        });
      }
    });

    if (!userId) return undefined;

    return this.findByIdWithProfile(userId);
  }

  /**
   * Upserts the profile row for a user — updates if one exists, inserts if it does not.
   * Returns the resulting profile row(s).
   *
   * @async
   * @param {string} userId - The user ID whose profile to update or create.
   * @param {Partial<typeof user_profiles.$inferInsert>} profileData - Profile fields to apply.
   * @returns {Promise<UserProfile[]>} The upserted profile records.
   */
  async updateProfile(
    userId: string,
    profileData: Partial<NewUserProfile>,
  ): Promise<UserProfile[]> {
    const [profile] = await db
      .select()
      .from(user_profiles)
      .where(eq(user_profiles.userId, userId));

    if (profile) {
      return db
        .update(user_profiles)
        .set(profileData)
        .where(eq(user_profiles.userId, userId))
        .returning();
    }

    return db
      .insert(user_profiles)
      .values({ userId, ...profileData })
      .returning();
  }

  /**
   * Toggles the `isAdmin` flag on a user. Reads current state first, then flips it.
   * Returns `undefined` if the user does not exist.
   *
   * @async
   * @param {string} id - The user ID to toggle admin status for.
   * @returns {Promise<User[] | undefined>} The updated user rows, or `undefined` if the user was not found.
   */
  async toggleAdmin(id: string): Promise<undefined | User[]> {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) return undefined;

    return db
      .update(users)
      .set({ isAdmin: !user.isAdmin })
      .where(eq(users.id, id))
      .returning();
  }

  /**
   * Toggles the `isActive` flag on a user. Reads current state first, then flips it.
   * Returns `undefined` if the user does not exist.
   *
   * @async
   * @param {string} id - The user ID to toggle active status for.
   * @returns {Promise<User[] | undefined>} The updated user rows, or `undefined` if the user was not found.
   */
  async toggleActive(id: string): Promise<undefined | User[]> {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) return undefined;

    return db
      .update(users)
      .set({ isActive: !user.isActive })
      .where(eq(users.id, id))
      .returning();
  }

  /**
   * Soft-deletes a user record by setting the deletedAt timestamp.
   * Use hardDelete() for permanent removal.
   *
   * @async
   * @param {string} id - The user ID to soft-delete.
   * @returns {Promise<void>}
   */
  async softDelete(id: string): Promise<void> {
    await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, id));
  }

  /**
   * Hard-deletes a user record by ID (permanent removal).
   * Use softDelete() for reversible deletion.
   *
   * @async
   * @param {string} id - The user ID to delete.
   * @returns {Promise<void>}
   */
  async hardDelete(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }
}

/**
 * Singleton instance of {@link UserDal} for use throughout the application.
 */
export const userDal = new UserDal();
