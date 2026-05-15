import { z } from "zod";

/**
 * Represents a Dwolla customer record as stored or returned by the application layer.
 *
 * @export
 * @interface DwollaCustomer
 * @typedef {DwollaCustomer}
 */
export interface DwollaCustomer {
  /**
   * Unique Dwolla customer identifier (UUID).
   *
   * @type {string}
   */
  id: string;
  /**
   * Customer's legal first name.
   *
   * @type {string}
   */
  firstName: string;
  /**
   * Customer's legal last name.
   *
   * @type {string}
   */
  lastName: string;
  /**
   * Customer's email address used for Dwolla communications.
   *
   * @type {string}
   */
  email: string;
  /**
   * Indicates whether this is a business or personal Dwolla customer account.
   *
   * @type {("business" | "personal")}
   */
  type: "business" | "personal";
  /**
   * Sub-type of business (e.g., "llc", "corporation"). Only present for business accounts.
   *
   * @type {?string}
   */
  businessType?: string;
  /**
   * Legal business name. Only present for business accounts.
   *
   * @type {?string}
   */
  businessName?: string;
  /**
   * IP address of the end-user at the time of customer creation, used for fraud prevention.
   *
   * @type {?string}
   */
  ipAddress?: string;
  /**
   * ISO 8601 timestamp of when the customer was created.
   *
   * @type {string}
   */
  createdAt: string;
}

/**
 * Full Dwolla API response object for a customer resource, including HAL-style `_links`.
 *
 * @export
 * @interface DwollaCustomerResponse
 * @typedef {DwollaCustomerResponse}
 */
export interface DwollaCustomerResponse {
  /**
   * HAL-style hypermedia links for navigating related Dwolla resources.
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
   * Unique Dwolla customer identifier (UUID).
   *
   * @type {string}
   */
  id: string;
  /**
   * Customer's legal first name.
   *
   * @type {string}
   */
  firstName: string;
  /**
   * Customer's legal last name.
   *
   * @type {string}
   */
  lastName: string;
  /**
   * Customer's email address.
   *
   * @type {string}
   */
  email: string;
  /**
   * Indicates whether this is a business or personal Dwolla customer account.
   *
   * @type {("business" | "personal")}
   */
  type: "business" | "personal";
  /**
   * Sub-type of business. Only present for business accounts.
   *
   * @type {?string}
   */
  businessType?: string;
  /**
   * Legal business name. Only present for business accounts.
   *
   * @type {?string}
   */
  businessName?: string;
  /**
   * ISO 8601 timestamp of when the customer was created, as returned by the Dwolla API.
   *
   * @type {string}
   */
  created: string;
}

/**
 * Represents a funding source (bank account) linked to a Dwolla customer,
 * as stored or returned by the application layer.
 *
 * @export
 * @interface DwollaFundingSource
 * @typedef {DwollaFundingSource}
 */
export interface DwollaFundingSource {
  /**
   * Unique Dwolla funding source identifier (UUID).
   *
   * @type {string}
   */
  id: string;
  /**
   * Name of the financial institution (e.g., "Chase", "Wells Fargo").
   *
   * @type {string}
   */
  bankName: string;
  /**
   * Indicates whether the linked bank account is a checking or savings account.
   *
   * @type {("checking" | "savings")}
   */
  bankAccountType: "checking" | "savings";
  /**
   * Full bank account number. Store encrypted; only use for display after masking.
   *
   * @type {string}
   */
  bankAccountNumber: string;
  /**
   * ABA routing number of the financial institution (9 digits).
   *
   * @type {string}
   */
  routingNumber: string;
  /**
   * Current verification status of the funding source.
   *
   * @type {("failed" | "pending" | "unverified" | "verified")}
   */
  status: "failed" | "pending" | "unverified" | "verified";
  /**
   * How the funding source was added — via manual bank entry ("bank") or instant account
   * verification ("iav").
   *
   * @type {("bank" | "iav")}
   */
  type: "bank" | "iav";
  /**
   * ACH network channel used for this funding source (e.g., "ACH"). Optional.
   *
   * @type {?string}
   */
  channel?: string;
  /**
   * ISO 8601 timestamp of when the funding source was created.
   *
   * @type {string}
   */
  createdAt: string;
}

/**
 * Full Dwolla API response object for a funding source resource, including HAL-style `_links`.
 *
 * @export
 * @interface DwollaFundingSourceResponse
 * @typedef {DwollaFundingSourceResponse}
 */
export interface DwollaFundingSourceResponse {
  /**
   * HAL-style hypermedia links for navigating related Dwolla resources.
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
   * Unique Dwolla funding source identifier (UUID).
   *
   * @type {string}
   */
  id: string;
  /**
   * Normalized account type — "checking" or "savings".
   *
   * @type {("checking" | "savings")}
   */
  bankAccountType: "checking" | "savings";
  /**
   * Raw account type string as returned by the bank, before normalization.
   *
   * @type {?string}
   */
  bankAccountTypeRaw?: string;
  /**
   * Name of the financial institution.
   *
   * @type {string}
   */
  bankName: string;
  /**
   * ABA routing number of the financial institution (9 digits).
   *
   * @type {string}
   */
  bankRoutingNumber: string;
  /**
   * Last 4 digits of the bank account number, safe for display.
   *
   * @type {string}
   */
  bankAccountNumberLast4: string;
  /**
   * Current verification status of the funding source.
   *
   * @type {("failed" | "pending" | "unverified" | "verified")}
   */
  status: "failed" | "pending" | "unverified" | "verified";
  /**
   * How the funding source was added — via manual bank entry ("bank") or instant account
   * verification ("iav").
   *
   * @type {("bank" | "iav")}
   */
  type: "bank" | "iav";
  /**
   * List of ACH channels supported by this funding source (e.g., ["ACH"]).
   *
   * @type {?string[]}
   */
  channels?: string[];
  /**
   * ISO 8601 timestamp of when the funding source was created, as returned by the Dwolla API.
   *
   * @type {string}
   */
  created: string;
}

/**
 * Represents an ACH transfer between two Dwolla funding sources,
 * as stored or returned by the application layer.
 *
 * @export
 * @interface DwollaTransfer
 * @typedef {DwollaTransfer}
 */
export interface DwollaTransfer {
  /**
   * Unique Dwolla transfer identifier (UUID).
   *
   * @type {string}
   */
  id: string;
  /**
   * Transfer amount as a decimal string (e.g., "25.00").
   *
   * @type {string}
   */
  amount: string;
  /**
   * ISO 4217 currency code for the transfer (e.g., "USD").
   *
   * @type {string}
   */
  currency: string;
  /**
   * Current lifecycle status of the transfer.
   * Note: "rucked" is a Dwolla-specific status indicating the transfer was returned.
   *
   * @type {("cancelled" | "failed" | "pending" | "processed" | "rucked")}
   */
  status: "cancelled" | "failed" | "pending" | "processed" | "rucked";
  /**
   * ISO 8601 timestamp of when the transfer was initiated.
   *
   * @type {string}
   */
  createdAt: string;
  /**
   * ISO 8601 timestamp of when the transfer cleared the ACH network.
   *
   * @type {?string}
   */
  clearedAt?: string;
  /**
   * Human-readable date on which the transfer cleared (YYYY-MM-DD).
   *
   * @type {?string}
   */
  clearedDate?: string;
  /**
   * Optional memo or description attached to the transfer.
   *
   * @type {?string}
   */
  description?: string;
  /**
   * Arbitrary key-value pairs attached to the transfer for tracking or reconciliation.
   *
   * @type {?Record<string, string>}
   */
  metadata?: Record<string, string>;
}

/**
 * Full Dwolla API response object for a transfer resource, including HAL-style `_links`.
 *
 * @export
 * @interface DwollaTransferResponse
 * @typedef {DwollaTransferResponse}
 */
export interface DwollaTransferResponse {
  /**
   * HAL-style hypermedia links for navigating related Dwolla resources.
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
   * Unique Dwolla transfer identifier (UUID).
   *
   * @type {string}
   */
  id: string;
  /**
   * Transfer amount with value and currency separated into sub-fields.
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
   * Current lifecycle status of the transfer.
   * Note: "rucked" is a Dwolla-specific status indicating the transfer was returned.
   *
   * @type {("cancelled" | "failed" | "pending" | "processed" | "rucked")}
   */
  status: "cancelled" | "failed" | "pending" | "processed" | "rucked";
  /**
   * ISO 8601 timestamp of when the transfer was created, as returned by the Dwolla API.
   *
   * @type {string}
   */
  created: string;
  /**
   * ISO 8601 timestamp of when the transfer cleared the ACH network.
   *
   * @type {?string}
   */
  cleared?: string;
  /**
   * Human-readable date on which the transfer cleared (YYYY-MM-DD).
   *
   * @type {?string}
   */
  clearedDate?: string;
  /**
   * Optional memo or description attached to the transfer.
   *
   * @type {?string}
   */
  description?: string;
  /**
   * Arbitrary key-value pairs attached to the transfer for tracking or reconciliation.
   *
   * @type {?Record<string, string>}
   */
  metadata?: Record<string, string>;
}

/**
 * Represents a Dwolla webhook event notification sent to the application's webhook endpoint.
 *
 * @export
 * @interface DwollaWebhookEvent
 * @typedef {DwollaWebhookEvent}
 */
export interface DwollaWebhookEvent {
  /**
   * Unique Dwolla webhook event identifier (UUID).
   *
   * @type {string}
   */
  id: string;
  /**
   * ID of the Dwolla resource (customer, funding source, or transfer) that triggered the event.
   *
   * @type {string}
   */
  resourceId: string;
  /**
   * The event topic identifying what happened (e.g., "transfer_created", "customer_verified").
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
   * ISO 8601 timestamp of when the webhook event was emitted by Dwolla.
   *
   * @type {string}
   */
  timestamp: string;
}

/**
 * Represents a micro-deposit verification attempt for a Dwolla funding source,
 * as stored or returned by the application layer.
 *
 * @export
 * @interface DwollaMicroDeposit
 * @typedef {DwollaMicroDeposit}
 */
export interface DwollaMicroDeposit {
  /**
   * Unique Dwolla micro-deposit identifier (UUID).
   *
   * @type {string}
   */
  id: string;
  /**
   * First micro-deposit amount in USD (e.g., 0.03). The customer must confirm both amounts.
   *
   * @type {number}
   */
  amount1: number;
  /**
   * Second micro-deposit amount in USD (e.g., 0.07). The customer must confirm both amounts.
   *
   * @type {number}
   */
  amount2: number;
  /**
   * Current verification status of the micro-deposit.
   *
   * @type {("failed" | "pending" | "verified")}
   */
  status: "failed" | "pending" | "verified";
  /**
   * ISO 8601 timestamp of when the micro-deposit was initiated.
   *
   * @type {string}
   */
  createdAt: string;
}

/**
 * Full Dwolla API response object for a micro-deposit resource, including HAL-style `_links`.
 *
 * @export
 * @interface DwollaMicroDepositResponse
 * @typedef {DwollaMicroDepositResponse}
 */
export interface DwollaMicroDepositResponse {
  /**
   * HAL-style hypermedia links for navigating related Dwolla resources.
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
   * Unique Dwolla micro-deposit identifier (UUID).
   *
   * @type {string}
   */
  id: string;
  /**
   * The two micro-deposit amounts that the customer must verify to confirm bank ownership.
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
   * Current verification status of the micro-deposit.
   *
   * @type {("failed" | "pending" | "verified")}
   */
  status: "failed" | "pending" | "verified";
  /**
   * ISO 8601 timestamp of when the micro-deposit was created, as returned by the Dwolla API.
   *
   * @type {string}
   */
  created: string;
}

/**
 * Input payload for initiating a Dwolla ACH transfer between two funding sources.
 *
 * @export
 * @interface DwollaTransferRequest
 * @typedef {DwollaTransferRequest}
 */
export interface DwollaTransferRequest {
  /**
   * Transfer amount as a decimal string (e.g., "25.00").
   *
   * @type {string}
   */
  amount: string;
  /**
   * ISO 4217 currency code (e.g., "USD").
   *
   * @type {string}
   */
  currency: string;
  /**
   * Dwolla funding source URL for the sending account
   * (e.g., "https://api-sandbox.dwolla.com/funding-sources/{id}").
   *
   * @type {string}
   */
  sourceFundingSourceUrl: string;
  /**
   * Dwolla funding source URL for the receiving account
   * (e.g., "https://api-sandbox.dwolla.com/funding-sources/{id}").
   *
   * @type {string}
   */
  destinationFundingSourceUrl: string;
  /**
   * Arbitrary key-value pairs to attach to the transfer for tracking or reconciliation.
   *
   * @type {?Record<string, string>}
   */
  metadata?: Record<string, string>;
  /**
   * Optional memo or description for the transfer, visible in the Dwolla dashboard.
   *
   * @type {?string}
   */
  description?: string;
}

/**
 * Input payload for creating a new Dwolla customer (personal or business).
 *
 * @export
 * @interface DwollaCreateCustomerRequest
 * @typedef {DwollaCreateCustomerRequest}
 */
export interface DwollaCreateCustomerRequest {
  /**
   * Customer's legal first name.
   *
   * @type {string}
   */
  firstName: string;
  /**
   * Customer's legal last name.
   *
   * @type {string}
   */
  lastName: string;
  /**
   * Customer's email address — must be unique within the Dwolla environment.
   *
   * @type {string}
   */
  email: string;
  /**
   * Indicates whether this is a business or personal Dwolla customer account.
   *
   * @type {("business" | "personal")}
   */
  type: "business" | "personal";
  /**
   * Sub-type of business (e.g., "llc", "corporation"). Required for business accounts.
   *
   * @type {?string}
   */
  businessType?: string;
  /**
   * Legal business name. Required for business accounts.
   *
   * @type {?string}
   */
  businessName?: string;
  /**
   * IP address of the end-user at time of customer creation, used for fraud prevention.
   *
   * @type {?string}
   */
  ipAddress?: string;
}

/**
 * Input payload for adding a bank account as a funding source to a Dwolla customer.
 *
 * @export
 * @interface DwollaAddFundingSourceRequest
 * @typedef {DwollaAddFundingSourceRequest}
 */
export interface DwollaAddFundingSourceRequest {
  /**
   * Dwolla customer URL to attach the funding source to
   * (e.g., "https://api-sandbox.dwolla.com/customers/{id}").
   *
   * @type {string}
   */
  fundingSourceUrl: string;
  /**
   * Indicates whether the bank account is a checking or savings account.
   *
   * @type {("checking" | "savings")}
   */
  bankAccountType: "checking" | "savings";
  /**
   * ABA routing number of the financial institution (9 digits).
   *
   * @type {string}
   */
  routingNumber: string;
  /**
   * Full bank account number to link as a funding source.
   *
   * @type {string}
   */
  accountNumber: string;
  /**
   * Display name for the funding source shown in the Dwolla dashboard (e.g., "My Chase Checking").
   *
   * @type {string}
   */
  name: string;
  /**
   * Optional description for the funding source.
   *
   * @type {?string}
   */
  description?: string;
}

/**
 * Zod schema for validating the create-customer request payload.
 * Enforces required fields, trims whitespace, and validates email format.
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
 * Zod schema for validating the add-funding-source request payload.
 * Ensures account number length, routing number is exactly 9 digits, and URL is valid.
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
 * Zod schema for validating the create-transfer request payload.
 * Ensures amount is a positive decimal string and both funding source URLs are valid.
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
 * Zod schema for validating the verify-micro-deposit request payload.
 * Both deposit amounts must be at least $0.01 and the funding source URL must be valid.
 *
 * @type {*}
 */
export const verifyMicroDepositSchema = z.object({
  amount1: z.number().min(0.01, "Amount must be at least $0.01"),
  amount2: z.number().min(0.01, "Amount must be at least $0.01"),
  fundingSourceUrl: z.string().trim().url("Invalid funding source URL"),
});
