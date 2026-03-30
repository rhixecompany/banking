import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

import { recipients } from "@/database/schema";

/**
 * Description placeholder
 *
 * @export
 * @typedef {Recipient}
 */
export type Recipient = InferSelectModel<typeof recipients>;
/**
 * Description placeholder
 *
 * @export
 * @typedef {NewRecipient}
 */
export type NewRecipient = InferInsertModel<typeof recipients>;
