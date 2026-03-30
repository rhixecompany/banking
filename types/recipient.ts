import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { recipients } from "@/database/schema";

export type Recipient = InferSelectModel<typeof recipients>;
export type NewRecipient = InferInsertModel<typeof recipients>;
