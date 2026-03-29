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
 * Description placeholder
 *
 * @export
 * @class UserDal
 * @typedef {UserDal}
 */
export class UserDal {
  /**
   * Description placeholder
   *
   * @async
   * @param {string} email
   * @returns {unknown}
   */
  async findByEmail(email: string): Promise<undefined | User> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {unknown}
   */
  async findById(id: string): Promise<undefined | User> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {unknown}
   */
  async findByIdWithProfile(id: string): Promise<undefined | UserWithProfile> {
    // Single query with JOIN - avoids N+1
    const [result] = await db
      .select({
        createdAt: users.createdAt,
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
          state: user_profiles.state,
          updatedAt: user_profiles.updatedAt,
          userId: user_profiles.userId,
        },
        role: users.role,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(user_profiles, eq(users.id, user_profiles.userId))
      .where(eq(users.id, id));

    if (!result) return undefined;

    // Flatten the result - profile will be null if no join match
    const { profile, ...user } = result as {
      profile: null | typeof user_profiles.$inferSelect;
    } & typeof result;

    return { ...user, profile: profile ?? undefined };
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {{ email: string; password: string; name?: string }} data
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @param {Partial<typeof users.\$inferInsert>} data
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {{
   *     email: string;
   *     password: string;
   *     name?: string;
   *     profile?: Partial<typeof user_profiles.\$inferInsert>;
   *   }} data
   * @returns {unknown}
   */
  async createWithProfile(data: {
    email: string;
    password: string;
    name?: string;
    profile?: Partial<NewUserProfile>;
  }): Promise<undefined | UserWithProfile> {
    // Use transaction to batch inserts - ensures atomicity and reduces round trips
    // Profile insert depends on user insert, so they must be in a transaction
    let userId: string | undefined;

    await db.transaction(async (tx) => {
      // Insert user
      const [user] = await tx
        .insert(users)
        .values({
          email: data.email,
          name: data.name,
          password: data.password,
        })
        .returning();

      userId = user.id;

      // Insert profile if provided
      if (data.profile) {
        await tx.insert(user_profiles).values({
          userId: user.id,
          ...data.profile,
        });
      }
    });

    // After transaction completes, fetch the result with profile
    // This keeps the method's return type consistent with findByIdWithProfile
    if (!userId) return undefined;

    return this.findByIdWithProfile(userId);
  }

  /**
   * Description placeholder
   *
   * @async
   * @param {string} userId
   * @param {Partial<typeof user_profiles.\$inferInsert>} profileData
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {unknown}
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
   * Description placeholder
   *
   * @async
   * @param {string} id
   * @returns {*}
   */
  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id));
  }
}

/**
 * Description placeholder
 *
 * @type {UserDal}
 */
export const userDal = new UserDal();
