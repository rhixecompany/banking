import { z } from "zod";

export interface DwollaCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: "business" | "personal";
  businessType?: string;
  businessName?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface DwollaCustomerResponse {
  _links: {
    self: { href: string };
    fundingSources: { href: string };
    transfers: { href: string };
  };
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: "business" | "personal";
  businessType?: string;
  businessName?: string;
  created: string;
}

export interface DwollaFundingSource {
  id: string;
  bankName: string;
  bankAccountType: "checking" | "savings";
  bankAccountNumber: string;
  routingNumber: string;
  status: "failed" | "pending" | "unverified" | "verified";
  type: "bank" | "iav";
  channel?: string;
  createdAt: string;
}

export interface DwollaFundingSourceResponse {
  _links: {
    self: { href: string };
    customer: { href: string };
  };
  id: string;
  bankAccountType: "checking" | "savings";
  bankAccountTypeRaw?: string;
  bankName: string;
  bankRoutingNumber: string;
  bankAccountNumberLast4: string;
  status: "failed" | "pending" | "unverified" | "verified";
  type: "bank" | "iav";
  channels?: string[];
  created: string;
}

export interface DwollaTransfer {
  id: string;
  amount: string;
  currency: string;
  status: "cancelled" | "failed" | "pending" | "processed" | "rucked";
  createdAt: string;
  clearedAt?: string;
  clearedDate?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface DwollaTransferResponse {
  _links: {
    self: { href: string };
    source: { href: string };
    destination: { href: string };
    "source-funding-source": { href: string };
    "destination-funding-source": { href: string };
  };
  id: string;
  amount: {
    value: string;
    currency: string;
  };
  status: "cancelled" | "failed" | "pending" | "processed" | "rucked";
  created: string;
  cleared?: string;
  clearedDate?: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface DwollaWebhookEvent {
  id: string;
  resourceId: string;
  topic:
    | "customer_activated"
    | "customer_activation_sent"
    | "customer_created"
    | "customer_deactivated"
    | "customer_deactivation"
    | "customer_verified"
    | "funding_source_created"
    | "funding_source_failed"
    | "funding_source_unverified"
    | "funding_source_verified"
    | "funding_sourceRemoved"
    | "transfer_cancelled"
    | "transfer_created"
    | "transfer_failed"
    | "transfer_pending"
    | "transfer_processed";
  timestamp: string;
}

export interface DwollaMicroDeposit {
  id: string;
  amount1: number;
  amount2: number;
  status: "failed" | "pending" | "verified";
  createdAt: string;
}

export interface DwollaMicroDepositResponse {
  _links: {
    self: { href: string };
    fundingSource: { href: string };
  };
  id: string;
  amounts: {
    amount1: number;
    amount2: number;
  };
  status: "failed" | "pending" | "verified";
  created: string;
}

export interface DwollaTransferRequest {
  amount: string;
  currency: string;
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  metadata?: Record<string, string>;
  description?: string;
}

export interface DwollaCreateCustomerRequest {
  firstName: string;
  lastName: string;
  email: string;
  type: "business" | "personal";
  businessType?: string;
  businessName?: string;
  ipAddress?: string;
}

export interface DwollaAddFundingSourceRequest {
  fundingSourceUrl: string;
  bankAccountType: "checking" | "savings";
  routingNumber: string;
  accountNumber: string;
  name: string;
  description?: string;
}

export const createCustomerSchema = z.object({
  businessName: z.string().trim().optional(),
  businessType: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email address"),
  firstName: z.string().trim().min(1, "First name is required"),
  ipAddress: z.string().trim().optional(),
  lastName: z.string().trim().min(1, "Last name is required"),
  type: z.enum(["personal", "business"]),
});

export const createFundingSourceSchema = z.object({
  accountNumber: z
    .string()
    .trim()
    .min(4, "Account number must be at least 4 digits"),
  bankAccountType: z.enum(["checking", "savings"]),
  description: z.string().trim().optional(),
  fundingSourceUrl: z.string().trim().url("Invalid customer URL"),
  name: z.string().trim().min(1, "Account name is required"),
  routingNumber: z.string().trim().length(9, "Routing number must be 9 digits"),
});

export const createTransferSchema = z.object({
  amount: z
    .string()
    .trim()
    .refine(
      (val) =>
        !Number.isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      {
        error: "Amount must be a positive number",
      },
    ),
  currency: z.string().trim().default("USD"),
  description: z.string().trim().optional(),
  destinationFundingSourceUrl: z
    .string()
    .trim()
    .url("Invalid destination funding source URL"),
  metadata: z.record(z.string().trim(), z.string().trim()).optional(),
  sourceFundingSourceUrl: z
    .string()
    .trim()
    .url("Invalid source funding source URL"),
});

export const verifyMicroDepositSchema = z.object({
  amount1: z.number().min(0.01, "Amount must be at least $0.01"),
  amount2: z.number().min(0.01, "Amount must be at least $0.01"),
  fundingSourceUrl: z.string().trim().url("Invalid funding source URL"),
});
