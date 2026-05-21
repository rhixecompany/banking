import { TransferSchema } from "@/lib/schemas/transfer.schema";

export { TransferSchema };
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {TransferInput}
 */
export type TransferInput = import("zod").infer<typeof TransferSchema>;
