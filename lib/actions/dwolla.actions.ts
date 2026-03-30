"use server";

import { z } from "zod";

import { auth } from "@/lib/auth";
import { getDwollaClient } from "@/lib/dwolla";

const CreateCustomerSchema = z.object({
  address1: z.string().trim().min(1),
  city: z.string().trim().min(1),
  dateOfBirth: z.string().trim().min(4),
  email: z.string().trim().email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  postalCode: z.string().trim().min(3),
  ssn: z.string().trim().min(4),
  state: z.string().trim().min(2),
  type: z.string().trim().min(1),
});

const TransferSchema = z.object({
  amount: z.string().trim().min(1),
  destinationFundingSourceUrl: z.string().trim().min(1),
  sourceFundingSourceUrl: z.string().trim().min(1),
});

const FundingSourceSchema = z.object({
  customerId: z.string().trim().min(1),
  fundingSourceName: z.string().trim().min(1),
  links: z
    .record(z.string().trim(), z.record(z.string().trim(), z.string().trim()))
    .optional(),
  plaidToken: z.string().trim().min(1),
});

const AddFundingSourceSchema = z.object({
  bankName: z.string().trim().min(1),
  dwollaCustomerId: z.string().trim().min(1),
  processorToken: z.string().trim().min(1),
});

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
    console.debug("Creating Dwolla customer failed:", error);
    return { error: "Failed to create Dwolla customer", ok: false };
  }
}

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
    console.debug("Creating Dwolla on-demand authorization failed:", error);
    return { error: "Failed to create on-demand authorization", ok: false };
  }
}

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
    console.debug("Creating Dwolla funding source failed:", error);
    return { error: "Failed to create funding source", ok: false };
  }
}

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
    console.debug("Creating Dwolla transfer failed:", error);
    return { error: "Failed to create transfer", ok: false };
  }
}

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
    console.debug("Adding Dwolla funding source failed:", error);
    return { error: "Failed to add funding source", ok: false };
  }
}
