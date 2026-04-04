/**
 * Represents the Plaid link token response used to initialize the Plaid Link UI.
 *
 * @export
 * @interface PlaidLinkToken
 * @typedef {PlaidLinkToken}
 */
export interface PlaidLinkToken {
  /**
   * Short-lived token used to open the Plaid Link widget in the browser.
   * Pass this to the `PlaidLink` component as `token`.
   *
   * @type {string}
   */
  linkToken: string;
  /**
   * ISO 8601 expiration timestamp for the link token. Tokens expire after 30 minutes.
   *
   * @type {string}
   */
  expiration: string;
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Input payload for creating a Plaid link token via `/link/token/create`.
 *
 * @export
 * @interface PlaidLinkTokenCreateRequest
 * @typedef {PlaidLinkTokenCreateRequest}
 */
export interface PlaidLinkTokenCreateRequest {
  /**
   * Identifies the end-user; `clientUserId` should be a stable, unique ID for the user
   * in your system (e.g., database user ID).
   *
   * @type {{ clientUserId: string }}
   */
  user: { clientUserId: string };
  /**
   * Name of your application, displayed to the user during the Plaid Link flow.
   *
   * @type {string}
   */
  clientName: string;
  /**
   * List of Plaid products to initialize. Determines what data can be retrieved
   * after the user completes the Link flow.
   *
   * @type {(
   *     | "auth"
   *     | "identity"
   *     | "investments"
   *     | "liabilities"
   *     | "transactions"
   *   )[]}
   */
  products: (
    | "auth"
    | "identity"
    | "investments"
    | "liabilities"
    | "transactions"
  )[];
  /**
   * ISO 3166-1 alpha-2 country codes for the institutions shown during Link
   * (e.g., ["US", "CA"]).
   *
   * @type {string[]}
   */
  countryCodes: string[];
  /**
   * IETF BCP 47 language tag for the Link UI language (e.g., "en").
   *
   * @type {string}
   */
  language: string;
}

/**
 * Input payload for exchanging a Plaid public token for a permanent access token.
 *
 * @export
 * @interface PlaidExchangePublicTokenRequest
 * @typedef {PlaidExchangePublicTokenRequest}
 */
export interface PlaidExchangePublicTokenRequest {
  /**
   * Short-lived public token returned by the Plaid Link `onSuccess` callback.
   * Exchange this for a permanent access token via `/item/public_token/exchange`.
   *
   * @type {string}
   */
  publicToken: string;
}

/**
 * Response from `/item/public_token/exchange` containing the permanent access token.
 *
 * @export
 * @interface PlaidExchangePublicTokenResponse
 * @typedef {PlaidExchangePublicTokenResponse}
 */
export interface PlaidExchangePublicTokenResponse {
  /**
   * Permanent access token used to retrieve data for the linked Item. Store encrypted.
   *
   * @type {string}
   */
  accessToken: string;
  /**
   * Plaid Item ID uniquely identifying this bank connection.
   *
   * @type {string}
   */
  itemId: string;
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Represents a single bank account returned by the Plaid API.
 *
 * @export
 * @interface PlaidAccount
 * @typedef {PlaidAccount}
 */
export interface PlaidAccount {
  /**
   * Plaid's unique identifier for this account within an Item.
   *
   * @type {string}
   */
  accountId: string;
  /**
   * Current balance data for this account. Values may be null if the institution
   * does not provide real-time balance information.
   *
   * @type {{
   *     available: null | number;
   *     current: null | number;
   *     isoCurrencyCode: null | string;
   *     limit: null | number;
   *   }}
   */
  balances: {
    available: null | number;
    current: null | number;
    isoCurrencyCode: null | string;
    limit: null | number;
  };
  /**
   * Last 2–4 digits of the account number for display purposes. May be null.
   *
   * @type {(null | string)}
   */
  mask: null | string;
  /**
   * Account name as set by the financial institution (e.g., "Plaid Checking").
   *
   * @type {string}
   */
  name: string;
  /**
   * Full legal name of the account as registered with the institution. May be null.
   *
   * @type {(null | string)}
   */
  officialName: null | string;
  /**
   * Account sub-type (e.g., "checking", "savings", "credit card"). May be null.
   *
   * @type {(null | string)}
   */
  subtype: null | string;
  /**
   * High-level account category.
   *
   * @type {("credit" | "depository" | "investment" | "loan" | "other")}
   */
  type: "credit" | "depository" | "investment" | "loan" | "other";
}

/**
 * Response from `/accounts/get` returning all accounts for a linked Item.
 *
 * @export
 * @interface PlaidAccountsGetResponse
 * @typedef {PlaidAccountsGetResponse}
 */
export interface PlaidAccountsGetResponse {
  /**
   * All accounts associated with the linked Plaid Item.
   *
   * @type {PlaidAccount[]}
   */
  accounts: PlaidAccount[];
  /**
   * Metadata about the Plaid Item (bank connection) itself.
   *
   * @type {{
   *     itemId: string;
   *     institutionId: null | string;
   *   }}
   */
  item: {
    itemId: string;
    institutionId: null | string;
  };
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Represents a single financial transaction returned by the Plaid Transactions API.
 *
 * @export
 * @interface PlaidTransaction
 * @typedef {PlaidTransaction}
 */
export interface PlaidTransaction {
  /**
   * Plaid's unique identifier for this transaction.
   *
   * @type {string}
   */
  transactionId: string;
  /**
   * Plaid account ID of the account this transaction belongs to.
   *
   * @type {string}
   */
  accountId: string;
  /**
   * Transaction amount in the account's currency. Positive values are debits
   * (money leaving the account); negative values are credits.
   *
   * @type {number}
   */
  amount: number;
  /**
   * ISO 4217 currency code for the transaction amount. May be null.
   *
   * @type {(null | string)}
   */
  isoCurrencyCode: null | string;
  /**
   * Date on which the transaction was posted (YYYY-MM-DD format).
   *
   * @type {string}
   */
  date: string;
  /**
   * Merchant name or transaction description as returned by the institution.
   *
   * @type {string}
   */
  name: string;
  /**
   * Cleaned merchant name from Plaid's enrichment. May be null if unavailable.
   *
   * @type {(null | string)}
   */
  merchantName: null | string;
  /**
   * Array of Plaid category strings (e.g., ["Food and Drink", "Restaurants"]).
   * May be null for unclassified transactions.
   *
   * @type {(null | string[])}
   */
  category: null | string[];
  /**
   * Plaid category ID corresponding to the primary category. May be null.
   *
   * @type {(null | string)}
   */
  categoryId: null | string;
  /**
   * Whether the transaction is still pending settlement. Pending transactions
   * may change amount or be removed entirely once settled.
   *
   * @type {boolean}
   */
  pending: boolean;
  /**
   * If this transaction is the settled version of a pending transaction,
   * contains the ID of the original pending transaction. May be null.
   *
   * @type {(null | string)}
   */
  pendingTransactionId: null | string;
  /**
   * Plaid's personal finance category label for the transaction. May be null.
   *
   * @type {(null | string)}
   */
  personalFinanceCategory: null | string;
  /**
   * The channel through which the transaction was made.
   *
   * @type {("in store" | "online" | "other")}
   */
  paymentChannel: "in store" | "online" | "other";
  /**
   * Plaid transaction type classification used for categorization and display.
   *
   * @type {(| "adjustment"
   *     | "advance"
   *     | "airline"
   *     | "atm"
   *     | "cash"
   *     | "charity"
   *     | "coupon"
   *     | "deposit"
   *     | "digital"
   *     | "dividend"
   *     | "fee"
   *     | "finance"
   *     | "food"
   *     | "gambling"
   *     | "game"
   *     | "gas"
   *     | "gift"
   *     | "government"
   *     | "healthcare"
   *     | "income"
   *     | "insurance"
   *     | "interest"
   *     | "investment"
   *     | "loan"
   *     | "mobile"
   *     | "money"
   *     | "mortgage"
   *     | "other"
   *     | "payroll"
   *     | "personal"
   *     | "phone"
   *     | "recreation"
   *     | "refund"
   *     | "rental"
   *     | "repair"
   *     | "restaurant"
   *     | "retail"
   *     | "reward"
   *     | "service"
   *     | "subscription"
   *     | "tax"
   *     | "transfer"
   *     | "travel"
   *     | "uncategorized"
   *     | "utilities")}
   */
  transactionType:
    | "adjustment"
    | "advance"
    | "airline"
    | "atm"
    | "cash"
    | "charity"
    | "coupon"
    | "deposit"
    | "digital"
    | "dividend"
    | "fee"
    | "finance"
    | "food"
    | "gambling"
    | "game"
    | "gas"
    | "gift"
    | "government"
    | "healthcare"
    | "income"
    | "insurance"
    | "interest"
    | "investment"
    | "loan"
    | "mobile"
    | "money"
    | "mortgage"
    | "other"
    | "payroll"
    | "personal"
    | "phone"
    | "recreation"
    | "refund"
    | "rental"
    | "repair"
    | "restaurant"
    | "retail"
    | "reward"
    | "service"
    | "subscription"
    | "tax"
    | "transfer"
    | "travel"
    | "uncategorized"
    | "utilities";
}

/**
 * Input payload for fetching transactions via `/transactions/get`.
 *
 * @export
 * @interface PlaidTransactionsGetRequest
 * @typedef {PlaidTransactionsGetRequest}
 */
export interface PlaidTransactionsGetRequest {
  /**
   * Permanent Plaid access token for the linked Item.
   *
   * @type {string}
   */
  accessToken: string;
  /**
   * Start of the date range for transactions (YYYY-MM-DD, inclusive).
   *
   * @type {string}
   */
  startDate: string;
  /**
   * End of the date range for transactions (YYYY-MM-DD, inclusive).
   *
   * @type {string}
   */
  endDate: string;
  /**
   * Optional pagination and filtering options for the transactions request.
   *
   * @type {?{
   *     count?: number;
   *     offset?: number;
   *     accountIds?: string[];
   *   }}
   */
  options?: {
    count?: number;
    offset?: number;
    accountIds?: string[];
  };
}

/**
 * Response from `/transactions/get` containing accounts, transactions, and pagination info.
 *
 * @export
 * @interface PlaidTransactionsGetResponse
 * @typedef {PlaidTransactionsGetResponse}
 */
export interface PlaidTransactionsGetResponse {
  /**
   * All accounts associated with the linked Plaid Item.
   *
   * @type {PlaidAccount[]}
   */
  accounts: PlaidAccount[];
  /**
   * Transactions for the requested date range and accounts.
   *
   * @type {PlaidTransaction[]}
   */
  transactions: PlaidTransaction[];
  /**
   * Total number of transactions available for the date range, used for pagination.
   *
   * @type {number}
   */
  totalTransactions: number;
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Balance snapshot for a single Plaid account, returned by `/accounts/balance/get`.
 *
 * @export
 * @interface PlaidBalance
 * @typedef {PlaidBalance}
 */
export interface PlaidBalance {
  /**
   * Plaid's unique identifier for the account.
   *
   * @type {string}
   */
  accountId: string;
  /**
   * Current balance data for the account. Values may be null if the institution
   * does not provide real-time balance information.
   *
   * @type {{
   *     available: null | number;
   *     current: null | number;
   *     isoCurrencyCode: null | string;
   *     limit: null | number;
   *   }}
   */
  balances: {
    available: null | number;
    current: null | number;
    isoCurrencyCode: null | string;
    limit: null | number;
  };
}

/**
 * Response from `/accounts/balance/get` with real-time balance data for all accounts.
 *
 * @export
 * @interface PlaidBalanceGetResponse
 * @typedef {PlaidBalanceGetResponse}
 */
export interface PlaidBalanceGetResponse {
  /**
   * All accounts with their latest balance data.
   *
   * @type {PlaidAccount[]}
   */
  accounts: PlaidAccount[];
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Represents a financial institution as returned by the Plaid Institutions API.
 *
 * @export
 * @interface PlaidInstitution
 * @typedef {PlaidInstitution}
 */
export interface PlaidInstitution {
  /**
   * Plaid's unique identifier for the institution (e.g., "ins_3").
   *
   * @type {string}
   */
  institutionId: string;
  /**
   * Human-readable name of the financial institution (e.g., "Chase", "Bank of America").
   *
   * @type {string}
   */
  name: string;
  /**
   * Base64-encoded institution logo image, or null if not available.
   *
   * @type {(null | string)}
   */
  logo: null | string;
  /**
   * Hex color code representing the institution's primary brand color, or null if unavailable.
   *
   * @type {(null | string)}
   */
  primaryColor: null | string;
  /**
   * Institution's public website URL, or null if not available.
   *
   * @type {(null | string)}
   */
  url: null | string;
  /**
   * List of Plaid products supported by this institution.
   *
   * @type {string[]}
   */
  products: string[];
  /**
   * ISO 3166-1 alpha-2 country codes where this institution operates.
   *
   * @type {string[]}
   */
  countryCodes: string[];
  /**
   * Current operational status of the institution for key Plaid product categories.
   * Only present when requested via `include_status: true`.
   *
   * @type {?{
   *     itemLogin: { status: "error" | "healthy" | "warning" };
   *     transactionUpdate: { status: "error" | "healthy" | "warning" };
   *   }}
   */
  status?: {
    itemLogin: { status: "error" | "healthy" | "warning" };
    transactionUpdate: { status: "error" | "healthy" | "warning" };
  };
}

/**
 * Response from `/institutions/get_by_id` with institution details.
 *
 * @export
 * @interface PlaidInstitutionGetByIdResponse
 * @typedef {PlaidInstitutionGetByIdResponse}
 */
export interface PlaidInstitutionGetByIdResponse {
  /**
   * Full institution details including name, logo, status, and supported products.
   *
   * @type {PlaidInstitution}
   */
  institution: PlaidInstitution;
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}

// eslint-disable-next-line no-secrets/no-secrets
/**
 * Input payload for exchanging a public token for a permanent access token
 * via `/item/public_token/exchange`.
 *
 * @export
 * @interface PlaidItemPublicTokenExchangeRequest
 * @typedef {PlaidItemPublicTokenExchangeRequest}
 */
export interface PlaidItemPublicTokenExchangeRequest {
  /**
   * Short-lived public token received from the Plaid Link `onSuccess` callback.
   *
   * @type {string}
   */
  publicToken: string;
}

// eslint-disable-next-line no-secrets/no-secrets
/**
 * Response from `/item/public_token/exchange` with the permanent access token.
 *
 * @export
 * @interface PlaidItemPublicTokenExchangeResponse
 * @typedef {PlaidItemPublicTokenExchangeResponse}
 */
export interface PlaidItemPublicTokenExchangeResponse {
  /**
   * Permanent access token for the linked Item. Store encrypted — never expose to the client.
   *
   * @type {string}
   */
  accessToken: string;
  /**
   * Plaid Item ID uniquely identifying this bank connection.
   *
   * @type {string}
   */
  itemId: string;
}

/**
 * Response from `/item/remove` confirming that a Plaid Item has been deleted.
 *
 * @export
 * @interface PlaidItemRemoveResponse
 * @typedef {PlaidItemRemoveResponse}
 */
export interface PlaidItemRemoveResponse {
  /**
   * `true` if the Item was successfully removed from Plaid. The access token
   * is permanently invalidated after removal.
   *
   * @type {boolean}
   */
  removed: boolean;
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Represents a Plaid webhook event notification delivered to the application's webhook endpoint.
 *
 * @export
 * @interface PlaidWebhookEvent
 * @typedef {PlaidWebhookEvent}
 */
export interface PlaidWebhookEvent {
  /**
   * High-level category of the webhook event corresponding to the Plaid product.
   *
   * @type {(| "AUTH"
   *     | "IDENTITY"
   *     | "INVESTMENTS"
   *     | "ITEM"
   *     | "LIABILITIES"
   *     | "TRANSACTIONS")}
   */
  webhookType:
    | "AUTH"
    | "IDENTITY"
    | "INVESTMENTS"
    | "ITEM"
    | "LIABILITIES"
    | "TRANSACTIONS";
  /**
   * Specific event code within the webhook type (e.g., "TRANSACTIONS_REMOVED",
   * "SYNC_UPDATES_AVAILABLE", "ERROR").
   *
   * @type {string}
   */
  webhookCode: string;
  /**
   * Plaid Item ID of the Item that generated the webhook event.
   *
   * @type {string}
   */
  itemId: string;
  /**
   * Error details if the webhook represents a failure condition. Absent on success events.
   *
   * @type {?{
   *     errorCode: string;
   *     errorMessage: string;
   *     displayMessage: string;
   *   }}
   */
  error?: {
    errorCode: string;
    errorMessage: string;
    displayMessage: string;
  };
  /**
   * Transactions that were newly added since the last webhook (TRANSACTIONS type only).
   *
   * @type {?PlaidTransaction[]}
   */
  added?: PlaidTransaction[];
  /**
   * Transactions that were updated since the last webhook (TRANSACTIONS type only).
   *
   * @type {?PlaidTransaction[]}
   */
  modified?: PlaidTransaction[];
  /**
   * Transactions that were removed or voided since the last webhook (TRANSACTIONS type only).
   *
   * @type {?{ transactionId: string }[]}
   */
  removed?: { transactionId: string }[];
}

/**
 * Response from `/auth/get` containing account and ACH routing number data.
 *
 * @export
 * @interface PlaidAuthGetResponse
 * @typedef {PlaidAuthGetResponse}
 */
export interface PlaidAuthGetResponse {
  /**
   * All accounts associated with the linked Plaid Item.
   *
   * @type {PlaidAccount[]}
   */
  accounts: PlaidAccount[];
  /**
   * ACH routing and account number data for each account, used for initiating ACH transfers.
   *
   * @type {{
   *     ach: {
   *       accountId: string;
   *       routing: string;
   *       wireRouting: string;
   *     }[];
   *   }}
   */
  numbers: {
    ach: {
      accountId: string;
      routing: string;
      wireRouting: string;
    }[];
  };
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Response from `/identity/get` with account ownership and contact information.
 *
 * @export
 * @interface PlaidIdentityGetResponse
 * @typedef {PlaidIdentityGetResponse}
 */
export interface PlaidIdentityGetResponse {
  /**
   * Account identity data including owner names, emails, phone numbers, and addresses
   * as registered with the financial institution.
   *
   * @type {{
   *     accountId: string;
   *     owners: {
   *       names: string[];
   *       emails: { data: string; type: string }[];
   *       phoneNumbers: { data: string; type: string }[];
   *       addresses: {
   *         data: {
   *           street: string;
   *           city: string;
   *           region: string;
   *           postalCode: string;
   *           country: string;
   *         };
   *         primary: boolean;
   *       }[];
   *     }[];
   *   }[]}
   */
  accounts: {
    accountId: string;
    owners: {
      names: string[];
      emails: { data: string; type: string }[];
      phoneNumbers: { data: string; type: string }[];
      addresses: {
        data: {
          street: string;
          city: string;
          region: string;
          postalCode: string;
          country: string;
        };
        primary: boolean;
      }[];
    }[];
  }[];
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Represents a Plaid API error returned when a request fails.
 *
 * @export
 * @interface PlaidError
 * @typedef {PlaidError}
 */
export interface PlaidError {
  /**
   * Machine-readable error code (e.g., "INVALID_ACCESS_TOKEN", "ITEM_LOGIN_REQUIRED").
   *
   * @type {string}
   */
  errorCode: string;
  /**
   * Detailed developer-facing error message describing the failure cause.
   *
   * @type {string}
   */
  errorMessage: string;
  /**
   * User-safe message suitable for display in the UI (e.g., "Please reconnect your bank").
   *
   * @type {string}
   */
  displayMessage: string;
  /**
   * High-level error category (e.g., "INVALID_REQUEST", "ITEM_ERROR", "API_ERROR").
   *
   * @type {string}
   */
  errorType: string;
  /**
   * Plaid request ID for debugging and support inquiries.
   *
   * @type {string}
   */
  requestId: string;
}
