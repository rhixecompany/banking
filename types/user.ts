import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { user_profiles, users } from "@/database/schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type UserProfile = InferSelectModel<typeof user_profiles>;
export type NewUserProfile = InferInsertModel<typeof user_profiles>;

export type UserWithProfile = { profile?: undefined | UserProfile } & User;
