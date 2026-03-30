import { z } from "zod";

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaCustomer
 * @typedef {DwollaCustomer}
 */
export interface DwollaCustomer {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  firstName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  lastName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  email: string;
  /**
   * Description placeholder
   *
   * @type {("business" | "personal")}
   */
  type: "business" | "personal";
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  businessType?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  businessName?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  ipAddress?: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  createdAt: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaCustomerResponse
 * @typedef {DwollaCustomerResponse}
 */
export interface DwollaCustomerResponse {
  /**
   * Description placeholder
   *
   * @type {{
   *     self: { href: string };
   *     fundingSources: { href: string };
   *     transfers: { href: string };
   *   }}
   */
  _links: {
    self: { href: string };
    fundingSources: { href: string };
    transfers: { href: string };
  };
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  firstName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  lastName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  email: string;
  /**
   * Description placeholder
   *
   * @type {("business" | "personal")}
   */
  type: "business" | "personal";
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  businessType?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  businessName?: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  created: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaFundingSource
 * @typedef {DwollaFundingSource}
 */
export interface DwollaFundingSource {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bankName: string;
  /**
   * Description placeholder
   *
   * @type {("checking" | "savings")}
   */
  bankAccountType: "checking" | "savings";
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bankAccountNumber: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  routingNumber: string;
  /**
   * Description placeholder
   *
   * @type {("failed" | "pending" | "unverified" | "verified")}
   */
  status: "failed" | "pending" | "unverified" | "verified";
  /**
   * Description placeholder
   *
   * @type {("bank" | "iav")}
   */
  type: "bank" | "iav";
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  channel?: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  createdAt: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaFundingSourceResponse
 * @typedef {DwollaFundingSourceResponse}
 */
export interface DwollaFundingSourceResponse {
  /**
   * Description placeholder
   *
   * @type {{
   *     self: { href: string };
   *     customer: { href: string };
   *   }}
   */
  _links: {
    self: { href: string };
    customer: { href: string };
  };
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {("checking" | "savings")}
   */
  bankAccountType: "checking" | "savings";
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  bankAccountTypeRaw?: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bankName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bankRoutingNumber: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bankAccountNumberLast4: string;
  /**
   * Description placeholder
   *
   * @type {("failed" | "pending" | "unverified" | "verified")}
   */
  status: "failed" | "pending" | "unverified" | "verified";
  /**
   * Description placeholder
   *
   * @type {("bank" | "iav")}
   */
  type: "bank" | "iav";
  /**
   * Description placeholder
   *
   * @type {?string[]}
   */
  channels?: string[];
  /**
   * Description placeholder
   *
   * @type {string}
   */
  created: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaTransfer
 * @typedef {DwollaTransfer}
 */
export interface DwollaTransfer {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  amount: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  currency: string;
  /**
   * Description placeholder
   *
   * @type {("cancelled" | "failed" | "pending" | "processed" | "rucked")}
   */
  status: "cancelled" | "failed" | "pending" | "processed" | "rucked";
  /**
   * Description placeholder
   *
   * @type {string}
   */
  createdAt: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  clearedAt?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  clearedDate?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  description?: string;
  /**
   * Description placeholder
   *
   * @type {?Record<string, string>}
   */
  metadata?: Record<string, string>;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaTransferResponse
 * @typedef {DwollaTransferResponse}
 */
export interface DwollaTransferResponse {
  /**
   * Description placeholder
   *
   * @type {{
   *     self: { href: string };
   *     source: { href: string };
   *     destination: { href: string };
   *     "source-funding-source": { href: string };
   *     "destination-funding-source": { href: string };
   *   }}
   */
  _links: {
    self: { href: string };
    source: { href: string };
    destination: { href: string };
    "source-funding-source": { href: string };
    "destination-funding-source": { href: string };
  };
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {{
   *     value: string;
   *     currency: string;
   *   }}
   */
  amount: {
    value: string;
    currency: string;
  };
  /**
   * Description placeholder
   *
   * @type {("cancelled" | "failed" | "pending" | "processed" | "rucked")}
   */
  status: "cancelled" | "failed" | "pending" | "processed" | "rucked";
  /**
   * Description placeholder
   *
   * @type {string}
   */
  created: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  cleared?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  clearedDate?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  description?: string;
  /**
   * Description placeholder
   *
   * @type {?Record<string, string>}
   */
  metadata?: Record<string, string>;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaWebhookEvent
 * @typedef {DwollaWebhookEvent}
 */
export interface DwollaWebhookEvent {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  resourceId: string;
  /**
   * Description placeholder
   *
   * @type {(| "customer_activated"
   *     | "customer_activation_sent"
   *     | "customer_created"
   *     | "customer_deactivated"
   *     | "customer_deactivation"
   *     | "customer_verified"
   *     | "funding_source_created"
   *     | "funding_source_failed"
   *     | "funding_source_unverified"
   *     | "funding_source_verified"
   *     | "funding_sourceRemoved"
   *     | "transfer_cancelled"
   *     | "transfer_created"
   *     | "transfer_failed"
   *     | "transfer_pending"
   *     | "transfer_processed")}
   */
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
  /**
   * Description placeholder
   *
   * @type {string}
   */
  timestamp: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaMicroDeposit
 * @typedef {DwollaMicroDeposit}
 */
export interface DwollaMicroDeposit {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  amount1: number;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  amount2: number;
  /**
   * Description placeholder
   *
   * @type {("failed" | "pending" | "verified")}
   */
  status: "failed" | "pending" | "verified";
  /**
   * Description placeholder
   *
   * @type {string}
   */
  createdAt: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaMicroDepositResponse
 * @typedef {DwollaMicroDepositResponse}
 */
export interface DwollaMicroDepositResponse {
  /**
   * Description placeholder
   *
   * @type {{
   *     self: { href: string };
   *     fundingSource: { href: string };
   *   }}
   */
  _links: {
    self: { href: string };
    fundingSource: { href: string };
  };
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {{
   *     amount1: number;
   *     amount2: number;
   *   }}
   */
  amounts: {
    amount1: number;
    amount2: number;
  };
  /**
   * Description placeholder
   *
   * @type {("failed" | "pending" | "verified")}
   */
  status: "failed" | "pending" | "verified";
  /**
   * Description placeholder
   *
   * @type {string}
   */
  created: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaTransferRequest
 * @typedef {DwollaTransferRequest}
 */
export interface DwollaTransferRequest {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  amount: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  currency: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  sourceFundingSourceUrl: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  destinationFundingSourceUrl: string;
  /**
   * Description placeholder
   *
   * @type {?Record<string, string>}
   */
  metadata?: Record<string, string>;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  description?: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaCreateCustomerRequest
 * @typedef {DwollaCreateCustomerRequest}
 */
export interface DwollaCreateCustomerRequest {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  firstName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  lastName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  email: string;
  /**
   * Description placeholder
   *
   * @type {("business" | "personal")}
   */
  type: "business" | "personal";
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  businessType?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  businessName?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  ipAddress?: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface DwollaAddFundingSourceRequest
 * @typedef {DwollaAddFundingSourceRequest}
 */
export interface DwollaAddFundingSourceRequest {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  fundingSourceUrl: string;
  /**
   * Description placeholder
   *
   * @type {("checking" | "savings")}
   */
  bankAccountType: "checking" | "savings";
  /**
   * Description placeholder
   *
   * @type {string}
   */
  routingNumber: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accountNumber: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  description?: string;
}

/**
 * Description placeholder
 *
 * @type {*}
 */
export const createCustomerSchema = z.object({
  businessName: z.string().trim().optional(),
  businessType: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email address"),
  firstName: z.string().trim().min(1, "First name is required"),
  ipAddress: z.string().trim().optional(),
  lastName: z.string().trim().min(1, "Last name is required"),
  type: z.enum(["personal", "business"]),
});

/**
 * Description placeholder
 *
 * @type {*}
 */
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

/**
 * Description placeholder
 *
 * @type {*}
 */
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

/**
 * Description placeholder
 *
 * @type {*}
 */
export const verifyMicroDepositSchema = z.object({
  amount1: z.number().min(0.01, "Amount must be at least $0.01"),
  amount2: z.number().min(0.01, "Amount must be at least $0.01"),
  fundingSourceUrl: z.string().trim().url("Invalid funding source URL"),
});
