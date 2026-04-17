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
    .meta({ description: "Transfer amount in USD, up to 2 decimal places" }),
  destinationFundingSourceUrl: z.string().trim().optional().meta({
    description: "Optional destination funding source URL used by Dwolla",
  }),
  recipientId: z
    .string()
    .trim()
    .min(1, "Please select a recipient")
    .optional()
    .meta({
      description:
        "ID of the recipient to receive funds (optional for direct funding-source transfers)",
    }),
  sourceBankId: z
    .string()
    .trim()
    .min(1, "Please select a source bank")
    .optional()
    .meta({
      description:
        "ID of the source wallet/funding source (optional for direct funding-source transfers)",
    }),
  // Funding source URLs (Dwolla) - optional because some transfer flows
  // reference these values only when creating an on-demand funding transfer.
  sourceFundingSourceUrl: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Optional source funding source URL used by Dwolla" }),
});

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {TransferFormData}
 */
export type TransferFormData = z.infer<typeof TransferSchema>;

export default TransferSchema;
