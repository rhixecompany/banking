import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { user_profiles, users } from "@/database/schema";

/**
 * Description placeholder
 *
 * @export
 * @typedef {User}
 */
export type User = InferSelectModel<typeof users>;
/**
 * Description placeholder
 *
 * @export
 * @typedef {NewUser}
 */
export type NewUser = InferInsertModel<typeof users>;
/**
 * Description placeholder
 *
 * @export
 * @typedef {UserProfile}
 */
export type UserProfile = InferSelectModel<typeof user_profiles>;
/**
 * Description placeholder
 *
 * @export
 * @typedef {NewUserProfile}
 */
export type NewUserProfile = InferInsertModel<typeof user_profiles>;

/**
 * Description placeholder
 *
 * @export
 * @typedef {UserWithProfile}
 */
export type UserWithProfile = { profile?: undefined | UserProfile } & User;
