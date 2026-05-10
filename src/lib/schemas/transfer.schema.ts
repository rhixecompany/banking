import { z } from "zod";

// Transfer schema used by server-side Dwolla actions. Matches the shape
// expected when creating a Dwolla transfer: funding source URLs and an
// amount string (e.g. "25.00"). Keep currency optional with default "USD".
export const TransferSchema = z.object({
  amount: z
    .string()
    .trim()
    .refine(
      (val) => {
        // CRITICAL: Amount must have exactly 2 decimal places for financial safety
        // Prevents floating-point precision errors and ensures Dwolla API compatibility.
        // Valid: "25.00", "0.50", "1000.99"
        // Invalid: "25", "25.5", "25.100"
        if (!/^\d+\.\d{2}$/.test(val)) {
          return false;
        }
        // Verify the parsed value is positive
        const parsed = Number.parseFloat(val);
        return !Number.isNaN(parsed) && parsed > 0;
      },
      {
        error:
          "Amount must be a positive number with exactly 2 decimal places (e.g., '25.00')",
      },
    )
    .refine(
      (val) => {
        // Enforce transfer limits: minimum $0.01, maximum $10,000 per transfer
        // This is a common ACH compliance requirement to limit exposure
        const parsed = Number.parseFloat(val);
        return parsed >= 0.01 && parsed <= 10000;
      },
      {
        error: "Amount must be between $0.01 and $10,000.00",
      },
    )
    .meta({
      description:
        "Transfer amount as decimal string with exactly 2 decimal places (e.g. '25.00')",
    }),
  // Optional ledger creation - when provided, creates transaction record in DAL
  createLedger: z
    .object({
      amount: z.string().trim().optional(),
      category: z.string().trim().optional(),
      channel: z.enum(["in_store", "online", "other"]).optional(),
      currency: z.string().trim().optional(),
      email: z.string().trim().optional(),
      name: z.string().trim().optional(),
      receiverWalletId: z.string().trim().optional(),
      senderWalletId: z.string().trim().optional(),
      status: z
        .enum(["cancelled", "completed", "failed", "pending", "processing"])
        .optional(),
      type: z.enum(["credit", "debit"]).optional(),
    })
    .optional()
    .meta({ description: "Optional ledger record to create" }),
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
});

/**
 * Transfer type inferred from TransferSchema.
 * Represents an ACH transfer request with amount, funding sources, and optional ledger creation.
 * Used by createTransfer() Server Action to validate and process Dwolla ACH transfers.
 *
 * @export
 * @typedef {Transfer}
 */
export type Transfer = z.infer<typeof TransferSchema>;
