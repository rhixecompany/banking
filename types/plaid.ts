export interface PlaidLinkToken {
  linkToken: string;
  expiration: string;
  requestId: string;
}

export interface PlaidLinkTokenCreateRequest {
  user: { clientUserId: string };
  clientName: string;
  products: (
    | "auth"
    | "identity"
    | "investments"
    | "liabilities"
    | "transactions"
  )[];
  countryCodes: string[];
  language: string;
}

export interface PlaidExchangePublicTokenRequest {
  publicToken: string;
}

export interface PlaidExchangePublicTokenResponse {
  accessToken: string;
  itemId: string;
  requestId: string;
}

export interface PlaidAccount {
  accountId: string;
  balances: {
    available: null | number;
    current: null | number;
    isoCurrencyCode: null | string;
    limit: null | number;
  };
  mask: null | string;
  name: string;
  officialName: null | string;
  subtype: null | string;
  type: "credit" | "depository" | "investment" | "loan" | "other";
}

export interface PlaidAccountsGetResponse {
  accounts: PlaidAccount[];
  item: {
    itemId: string;
    institutionId: null | string;
  };
  requestId: string;
}

export interface PlaidTransaction {
  transactionId: string;
  accountId: string;
  amount: number;
  isoCurrencyCode: null | string;
  date: string;
  name: string;
  merchantName: null | string;
  category: null | string[];
  categoryId: null | string;
  pending: boolean;
  pendingTransactionId: null | string;
  personalFinanceCategory: null | string;
  paymentChannel: "in store" | "online" | "other";
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

export interface PlaidTransactionsGetRequest {
  accessToken: string;
  startDate: string;
  endDate: string;
  options?: {
    count?: number;
    offset?: number;
    accountIds?: string[];
  };
}

export interface PlaidTransactionsGetResponse {
  accounts: PlaidAccount[];
  transactions: PlaidTransaction[];
  totalTransactions: number;
  requestId: string;
}

export interface PlaidBalance {
  accountId: string;
  balances: {
    available: null | number;
    current: null | number;
    isoCurrencyCode: null | string;
    limit: null | number;
  };
}

export interface PlaidBalanceGetResponse {
  accounts: PlaidAccount[];
  requestId: string;
}

export interface PlaidInstitution {
  institutionId: string;
  name: string;
  logo: null | string;
  primaryColor: null | string;
  url: null | string;
  products: string[];
  countryCodes: string[];
  status?: {
    itemLogin: { status: "error" | "healthy" | "warning" };
    transactionUpdate: { status: "error" | "healthy" | "warning" };
  };
}

export interface PlaidInstitutionGetByIdResponse {
  institution: PlaidInstitution;
  requestId: string;
}

export interface PlaidItemPublicTokenExchangeRequest {
  publicToken: string;
}

export interface PlaidItemPublicTokenExchangeResponse {
  accessToken: string;
  itemId: string;
}

export interface PlaidItemRemoveResponse {
  removed: boolean;
  requestId: string;
}

export interface PlaidWebhookEvent {
  webhookType:
    | "AUTH"
    | "IDENTITY"
    | "INVESTMENTS"
    | "ITEM"
    | "LIABILITIES"
    | "TRANSACTIONS";
  webhookCode: string;
  itemId: string;
  error?: {
    errorCode: string;
    errorMessage: string;
    displayMessage: string;
  };
  added?: PlaidTransaction[];
  modified?: PlaidTransaction[];
  removed?: { transactionId: string }[];
}

export interface PlaidAuthGetResponse {
  accounts: PlaidAccount[];
  numbers: {
    ach: {
      accountId: string;
      routing: string;
      wireRouting: string;
    }[];
  };
  requestId: string;
}

export interface PlaidIdentityGetResponse {
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
  requestId: string;
}

export interface PlaidError {
  errorCode: string;
  errorMessage: string;
  displayMessage: string;
  errorType: string;
  requestId: string;
}
