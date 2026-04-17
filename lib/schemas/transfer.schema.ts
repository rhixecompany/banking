import { z } from "zod";

/**
 * Transfer form schema shared between client and server.
 * Fields include descriptions per repository standards.
 */
export const TransferSchema = z.object({
  amount: z.coerce
    .number()
    .positive("Amount must be greater than zero")
    .multipleOf(0.01, "Amount may have at most 2 decimal places")
    .describe("Transfer amount in USD, up to 2 decimal places"),
  recipientId: z
    .string()
    .trim()
    .min(1, "Please select a recipient")
    .describe("ID of the recipient to receive funds"),
  sourceBankId: z
    .string()
    .trim()
    .min(1, "Please select a source bank")
    .describe("ID of the source wallet/funding source"),
});

export type TransferFormData = z.infer<typeof TransferSchema>;

export default TransferSchema;
