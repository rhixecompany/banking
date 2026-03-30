/**
 * Description placeholder
 *
 * @export
 * @interface PlaidLinkToken
 * @typedef {PlaidLinkToken}
 */
export interface PlaidLinkToken {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  linkToken: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  expiration: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidLinkTokenCreateRequest
 * @typedef {PlaidLinkTokenCreateRequest}
 */
export interface PlaidLinkTokenCreateRequest {
  /**
   * Description placeholder
   *
   * @type {{ clientUserId: string }}
   */
  user: { clientUserId: string };
  /**
   * Description placeholder
   *
   * @type {string}
   */
  clientName: string;
  /**
   * Description placeholder
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
   * Description placeholder
   *
   * @type {string[]}
   */
  countryCodes: string[];
  /**
   * Description placeholder
   *
   * @type {string}
   */
  language: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidExchangePublicTokenRequest
 * @typedef {PlaidExchangePublicTokenRequest}
 */
export interface PlaidExchangePublicTokenRequest {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  publicToken: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidExchangePublicTokenResponse
 * @typedef {PlaidExchangePublicTokenResponse}
 */
export interface PlaidExchangePublicTokenResponse {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accessToken: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  itemId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidAccount
 * @typedef {PlaidAccount}
 */
export interface PlaidAccount {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accountId: string;
  /**
   * Description placeholder
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
   * Description placeholder
   *
   * @type {(null | string)}
   */
  mask: null | string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  officialName: null | string;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  subtype: null | string;
  /**
   * Description placeholder
   *
   * @type {("credit" | "depository" | "investment" | "loan" | "other")}
   */
  type: "credit" | "depository" | "investment" | "loan" | "other";
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidAccountsGetResponse
 * @typedef {PlaidAccountsGetResponse}
 */
export interface PlaidAccountsGetResponse {
  /**
   * Description placeholder
   *
   * @type {PlaidAccount[]}
   */
  accounts: PlaidAccount[];
  /**
   * Description placeholder
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
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidTransaction
 * @typedef {PlaidTransaction}
 */
export interface PlaidTransaction {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  transactionId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accountId: string;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  amount: number;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  isoCurrencyCode: null | string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  date: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  merchantName: null | string;
  /**
   * Description placeholder
   *
   * @type {(null | string[])}
   */
  category: null | string[];
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  categoryId: null | string;
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  pending: boolean;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  pendingTransactionId: null | string;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  personalFinanceCategory: null | string;
  /**
   * Description placeholder
   *
   * @type {("in store" | "online" | "other")}
   */
  paymentChannel: "in store" | "online" | "other";
  /**
   * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @interface PlaidTransactionsGetRequest
 * @typedef {PlaidTransactionsGetRequest}
 */
export interface PlaidTransactionsGetRequest {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accessToken: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  startDate: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  endDate: string;
  /**
   * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @interface PlaidTransactionsGetResponse
 * @typedef {PlaidTransactionsGetResponse}
 */
export interface PlaidTransactionsGetResponse {
  /**
   * Description placeholder
   *
   * @type {PlaidAccount[]}
   */
  accounts: PlaidAccount[];
  /**
   * Description placeholder
   *
   * @type {PlaidTransaction[]}
   */
  transactions: PlaidTransaction[];
  /**
   * Description placeholder
   *
   * @type {number}
   */
  totalTransactions: number;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidBalance
 * @typedef {PlaidBalance}
 */
export interface PlaidBalance {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accountId: string;
  /**
   * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @interface PlaidBalanceGetResponse
 * @typedef {PlaidBalanceGetResponse}
 */
export interface PlaidBalanceGetResponse {
  /**
   * Description placeholder
   *
   * @type {PlaidAccount[]}
   */
  accounts: PlaidAccount[];
  /**
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidInstitution
 * @typedef {PlaidInstitution}
 */
export interface PlaidInstitution {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  institutionId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  logo: null | string;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  primaryColor: null | string;
  /**
   * Description placeholder
   *
   * @type {(null | string)}
   */
  url: null | string;
  /**
   * Description placeholder
   *
   * @type {string[]}
   */
  products: string[];
  /**
   * Description placeholder
   *
   * @type {string[]}
   */
  countryCodes: string[];
  /**
   * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @interface PlaidInstitutionGetByIdResponse
 * @typedef {PlaidInstitutionGetByIdResponse}
 */
export interface PlaidInstitutionGetByIdResponse {
  /**
   * Description placeholder
   *
   * @type {PlaidInstitution}
   */
  institution: PlaidInstitution;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidItemPublicTokenExchangeRequest
 * @typedef {PlaidItemPublicTokenExchangeRequest}
 */
export interface PlaidItemPublicTokenExchangeRequest {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  publicToken: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidItemPublicTokenExchangeResponse
 * @typedef {PlaidItemPublicTokenExchangeResponse}
 */
export interface PlaidItemPublicTokenExchangeResponse {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accessToken: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  itemId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidItemRemoveResponse
 * @typedef {PlaidItemRemoveResponse}
 */
export interface PlaidItemRemoveResponse {
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  removed: boolean;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidWebhookEvent
 * @typedef {PlaidWebhookEvent}
 */
export interface PlaidWebhookEvent {
  /**
   * Description placeholder
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
   * Description placeholder
   *
   * @type {string}
   */
  webhookCode: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  itemId: string;
  /**
   * Description placeholder
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
   * Description placeholder
   *
   * @type {?PlaidTransaction[]}
   */
  added?: PlaidTransaction[];
  /**
   * Description placeholder
   *
   * @type {?PlaidTransaction[]}
   */
  modified?: PlaidTransaction[];
  /**
   * Description placeholder
   *
   * @type {?{ transactionId: string }[]}
   */
  removed?: { transactionId: string }[];
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidAuthGetResponse
 * @typedef {PlaidAuthGetResponse}
 */
export interface PlaidAuthGetResponse {
  /**
   * Description placeholder
   *
   * @type {PlaidAccount[]}
   */
  accounts: PlaidAccount[];
  /**
   * Description placeholder
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
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidIdentityGetResponse
 * @typedef {PlaidIdentityGetResponse}
 */
export interface PlaidIdentityGetResponse {
  /**
   * Description placeholder
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
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidError
 * @typedef {PlaidError}
 */
export interface PlaidError {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  errorCode: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  errorMessage: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  displayMessage: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  errorType: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  requestId: string;
}
