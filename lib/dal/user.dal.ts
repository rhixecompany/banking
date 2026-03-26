import { db } from "@/database/db";
import { user_profiles, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export class UserDal {
  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async findById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async findByIdWithProfile(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) return null;

    const [profile] = await db
      .select()
      .from(user_profiles)
      .where(eq(user_profiles.userId, id));

    return { ...user, profile };
  }

  async create(data: { email: string; password: string; name?: string }) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async update(id: string, data: Partial<typeof users.$inferInsert>) {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createWithProfile(data: {
    email: string;
    password: string;
    name?: string;
    profile?: Partial<typeof user_profiles.$inferInsert>;
  }) {
    const [user] = await db
      .insert(users)
      .values({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      .returning();

    if (data.profile) {
      await db.insert(user_profiles).values({
        userId: user.id,
        ...data.profile,
      });
    }

    return this.findByIdWithProfile(user.id);
  }

  async updateProfile(
    userId: string,
    profileData: Partial<typeof user_profiles.$inferInsert>,
  ) {
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

  async toggleAdmin(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) return null;

    return db
      .update(users)
      .set({ isAdmin: !user.isAdmin })
      .where(eq(users.id, id))
      .returning();
  }

  async toggleActive(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));

    if (!user) return null;

    return db
      .update(users)
      .set({ isActive: !user.isActive })
      .where(eq(users.id, id))
      .returning();
  }

  async delete(id: string) {
    await db.delete(users).where(eq(users.id, id));
  }
}

export const userDal = new UserDal();
