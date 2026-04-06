"use server";

import { z } from "zod";

import { auth } from "@/lib/auth";
import { getDwollaClient } from "@/lib/dwolla";
import { logger } from "@/lib/logger";

/**
 * Zod schema for validating Dwolla customer creation payload.
 */
const CreateCustomerSchema = z.object({
  address1: z
    .string()
    .trim()
    .min(1, "Address is required")
    .meta({ description: "Street address" }),
  city: z
    .string()
    .trim()
    .min(1, "City is required")
    .meta({ description: "City" }),
  dateOfBirth: z
    .string()
    .trim()
    .min(4, "Date of birth is required")
    .meta({ description: "Date of birth" }),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .meta({ description: "Email address" }),
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .meta({ description: "First name" }),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .meta({ description: "Last name" }),
  postalCode: z
    .string()
    .trim()
    .min(3, "Postal code is required")
    .meta({ description: "Postal/ZIP code" }),
  ssn: z
    .string()
    .trim()
    .min(4, "SSN is required")
    .meta({ description: "Social Security Number" }),
  state: z
    .string()
    .trim()
    .min(2, "State is required")
    .meta({ description: "State" }),
  type: z
    .string()
    .trim()
    .min(1, "Customer type is required")
    .meta({ description: "Customer type (e.g., personal)" }),
});

/**
 * Zod schema for validating an ACH transfer payload.
 */
const TransferSchema = z.object({
  amount: z
    .string()
    .trim()
    .min(1, "Amount is required")
    .meta({ description: "Transfer amount in USD" }),
  destinationFundingSourceUrl: z
    .string()
    .trim()
    .min(1, "Destination URL is required")
    .meta({ description: "Destination funding source URL" }),
  sourceFundingSourceUrl: z
    .string()
    .trim()
    .min(1, "Source URL is required")
    .meta({ description: "Source funding source URL" }),
});

/**
 * Zod schema for validating a Dwolla funding source creation payload.
 */
const FundingSourceSchema = z.object({
  customerId: z
    .string()
    .trim()
    .min(1, "Customer ID is required")
    .meta({ description: "Dwolla customer ID" }),
  fundingSourceName: z
    .string()
    .trim()
    .min(1, "Funding source name is required")
    .meta({ description: "Name for the funding source" }),
  links: z
    .record(z.string().trim(), z.record(z.string().trim(), z.string().trim()))
    .optional()
    .meta({ description: "HAL links for authorization" }),
  plaidToken: z
    .string()
    .trim()
    .min(1, "Plaid token is required")
    .meta({ description: "Plaid processor token" }),
});

/**
 * Zod schema for validating the add-funding-source payload (bank name, customer ID, processor token).
 */
const AddFundingSourceSchema = z.object({
  bankName: z
    .string()
    .trim()
    .min(1, "Bank name is required")
    .meta({ description: "Name of the bank" }),
  dwollaCustomerId: z
    .string()
    .trim()
    .min(1, "Customer ID is required")
    .meta({ description: "Dwolla customer ID" }),
  processorToken: z
    .string()
    .trim()
    .min(1, "Processor token is required")
    .meta({ description: "Plaid processor token" }),
});

/**
 * Creates a new Dwolla verified customer for the authenticated user.
 *
 * @export
 * @async
 * @param {unknown} input - Must satisfy CreateCustomerSchema fields
 * @returns {Promise<{ ok: boolean; customerUrl?: string; error?: string }>}
 */
export async function createDwollaCustomer(input: unknown): Promise<{
  ok: boolean;
  customerUrl?: string;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const parsed = CreateCustomerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid customer payload", ok: false };
  }

  try {
    const client = getDwollaClient();
    const response = await client.post("customers", parsed.data);
    const customerUrl = response.headers.get("location") ?? undefined;
    return { customerUrl, ok: true };
  } catch (error) {
    logger.debug("Creating Dwolla customer failed:", error);
    return { error: "Failed to create Dwolla customer", ok: false };
  }
}

/**
 * Creates a Dwolla on-demand authorization and returns the resulting HAL links.
 *
 * @export
 * @async
 * @returns {Promise<{
 *   ok: boolean;
 *   links?: Record<string, Record<string, string>>;
 *   error?: string;
 * }>}
 */
export async function createOnDemandAuthorization(): Promise<{
  ok: boolean;
  links?: Record<string, Record<string, string>>;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  try {
    const client = getDwollaClient();
    const response = await client.post("on-demand-authorizations");
    const links =
      response.body && typeof response.body === "object"
        ? (response.body as Record<string, unknown>)._links
        : undefined;
    return {
      links: links as Record<string, Record<string, string>> | undefined,
      ok: true,
    };
  } catch (error) {
    logger.debug("Creating Dwolla on-demand authorization failed:", error);
    return { error: "Failed to create on-demand authorization", ok: false };
  }
}

/**
 * Creates a Dwolla funding source for the given customer using a Plaid processor token.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   fundingSourceUrl?: string;
 *   error?: string;
 * }>}
 */
export async function createFundingSource(input: unknown): Promise<{
  ok: boolean;
  fundingSourceUrl?: string;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const parsed = FundingSourceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid funding source payload", ok: false };
  }

  try {
    const client = getDwollaClient();
    const response = await client.post(
      `customers/${parsed.data.customerId}/funding-sources`,
      {
        _links: parsed.data.links,
        name: parsed.data.fundingSourceName,
        plaidToken: parsed.data.plaidToken,
      },
    );
    const fundingSourceUrl = response.headers.get("location") ?? undefined;
    return { fundingSourceUrl, ok: true };
  } catch (error) {
    logger.debug("Creating Dwolla funding source failed:", error);
    return { error: "Failed to create funding source", ok: false };
  }
}

/**
 * Initiates an ACH transfer between two Dwolla funding sources.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   transferUrl?: string;
 *   error?: string;
 * }>}
 */
export async function createTransfer(input: unknown): Promise<{
  ok: boolean;
  transferUrl?: string;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const parsed = TransferSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid transfer payload", ok: false };
  }

  try {
    const client = getDwollaClient();
    const response = await client.post("transfers", {
      _links: {
        destination: { href: parsed.data.destinationFundingSourceUrl },
        source: { href: parsed.data.sourceFundingSourceUrl },
      },
      amount: {
        currency: "USD",
        value: parsed.data.amount,
      },
    });

    const transferUrl = response.headers.get("location") ?? undefined;
    return { ok: true, transferUrl };
  } catch (error) {
    logger.debug("Creating Dwolla transfer failed:", error);
    return { error: "Failed to create transfer", ok: false };
  }
}

/**
 * Orchestrates on-demand authorization and funding source creation for a bank account.
 * Calls createOnDemandAuthorization then createFundingSource in sequence.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   fundingSourceUrl?: string;
 *   error?: string;
 * }>}
 */
export async function addFundingSource(input: unknown): Promise<{
  ok: boolean;
  fundingSourceUrl?: string;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  const parsed = AddFundingSourceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid funding source payload", ok: false };
  }

  try {
    const authResult = await createOnDemandAuthorization();
    if (!authResult.ok || !authResult.links) {
      return { error: authResult.error ?? "Authorization failed", ok: false };
    }

    return await createFundingSource({
      customerId: parsed.data.dwollaCustomerId,
      fundingSourceName: parsed.data.bankName,
      links: authResult.links,
      plaidToken: parsed.data.processorToken,
    });
  } catch (error) {
    logger.debug("Adding Dwolla funding source failed:", error);
    return { error: "Failed to add funding source", ok: false };
  }
}
