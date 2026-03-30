import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { banks } from "@/database/schema";

export type Bank = InferSelectModel<typeof banks>;
export type NewBank = InferInsertModel<typeof banks>;
