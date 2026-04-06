import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { user_profiles, users } from "@/database/schema";

/**
 * User type derived from Drizzle schema.
 * Includes soft-delete deletedAt field.
 * @export
 */
export type User = InferSelectModel<typeof users>;
/**
 * NewUser type for inserting users.
 * @export
 */
export type NewUser = InferInsertModel<typeof users>;
/**
 * UserProfile type derived from Drizzle schema.
 * Includes ssnEncrypted field for encrypted SSN storage.
 * @export
 */
export type UserProfile = InferSelectModel<typeof user_profiles>;
/**
 * NewUserProfile type for inserting user profiles.
 * @export
 */
export type NewUserProfile = InferInsertModel<typeof user_profiles>;

/**
 * UserWithProfile combines the User type with an optional nested profile.
 * Used when fetching a user with their associated profile data.
 * @export
 */
export type UserWithProfile = {
  profile?: undefined | UserProfile;
} & Omit<User, "deletedAt">;
