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
});

export type Transfer = z.infer<typeof TransferSchema>;
