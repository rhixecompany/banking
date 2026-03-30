import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { banks } from "@/database/schema";

/**
 * Description placeholder
 *
 * @export
 * @typedef {Bank}
 */
export type Bank = InferSelectModel<typeof banks>;
/**
 * Description placeholder
 *
 * @export
 * @typedef {NewBank}
 */
export type NewBank = InferInsertModel<typeof banks>;
