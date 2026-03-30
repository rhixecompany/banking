import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { transactions } from "@/database/schema";

export type Transaction = InferSelectModel<typeof transactions>;
export type NewTransaction = InferInsertModel<typeof transactions>;

export interface TransactionStats {
  count: number;
  total: null | string;
  type: null | string;
}
