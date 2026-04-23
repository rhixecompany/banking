import { z } from "zod";

// Transfer schema used by server-side Dwolla actions. Matches the shape
// expected when creating a Dwolla transfer: funding source URLs and an
// amount string (e.g. "25.00"). Keep currency optional with default "USD".
export const TransferSchema = z.object({
  amount: z
    .string()
    .trim()
    .refine(
      (val) =>
        !Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      {
        // Use message field as expected by Zod's refine options
        error: "Amount must be a positive number",
      },
    )
    .meta({ description: "Transfer amount as decimal string (e.g. '25.00')" }),
  currency: z
    .string()
    .trim()
    .default("USD")
    .meta({ description: "Currency code" }),
  destinationFundingSourceUrl: z
    .string()
    .trim()
    .url()
    .meta({ description: "Destination funding source URL" }),
  sourceFundingSourceUrl: z
    .string()
    .trim()
    .url()
    .meta({ description: "Source funding source URL" }),
  // Optional ledger creation - when provided, creates transaction record in DAL
  createLedger: z
    .object({
      amount: z.string().optional(),
      category: z.string().optional(),
      channel: z.enum(["in_store", "online", "other"]).optional(),
      currency: z.string().optional(),
      email: z.string().optional(),
      name: z.string().optional(),
      receiverWalletId: z.string().optional(),
      senderWalletId: z.string().optional(),
      status: z
        .enum(["cancelled", "completed", "failed", "pending", "processing"])
        .optional(),
      type: z.enum(["credit", "debit"]).optional(),
    })
    .optional()
    .meta({ description: "Optional ledger record to create" }),
});

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {Transfer}
 */
export type Transfer = z.infer<typeof TransferSchema>;
