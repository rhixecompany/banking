import type { User } from "@/types/user";

/**
 * Props for the `WalletCard` component that renders a styled wallet card tile.
 *
 * @export
 * @typedef {WalletCardProps}
 */
export interface WalletCardProps {
  /**
   * The wallet account to display on the card.
   *
   * @type {Account}
   */
  account: Account;
  /**
   * The display name of the account holder shown on the card.
   *
   * @type {string}
   */
  userName: string;
  /**
   * When true, shows the current balance on the card face. Defaults to false.
   *
   * @type {?boolean}
   */
  showBalance?: boolean;
}

/**
 * Props for the `DoughnutChart` component that renders a doughnut chart
 * showing balance distribution across all linked bank accounts.
 *
 * @export
 * @typedef {DoughnutChartProps}
 */
export interface DoughnutChartProps {
  /**
   * Array of linked accounts whose balances are visualized in the chart.
   *
   * @type {Account[]}
   */
  accounts: Account[];
}

/**
 * Props for the `Footer` component that renders user info and a logout link.
 *
 * @export
 * @typedef {FooterProps}
 */
export interface FooterProps {
  /**
   * The currently authenticated user whose info is displayed in the footer.
   *
   * @type {UserWithProfile}
   */
  user: UserWithProfile;
  /**
   * Layout variant: "desktop" renders a full footer row; "mobile" renders a compact version.
   *
   * @type {?("desktop" | "mobile")}
   */
  type?: "desktop" | "mobile";
}

/**
 * Props for the `HeaderBox` component that renders a page header with an optional
 * personalized greeting or a plain title depending on the `type` variant.
 *
 * @export
 * @typedef {HeaderBoxProps}
 */
export interface HeaderBoxProps {
  /**
   * Display variant: "greeting" renders a welcome message with the user's name;
   * "title" renders a plain heading without personalization.
   *
   * @type {?("greeting" | "title")}
   */
  type?: "greeting" | "title";
  /**
   * Primary heading text displayed in the header.
   *
   * @type {string}
   */
  title: string;
  /**
   * Optional secondary text displayed below the title.
   *
   * @type {?string}
   */
  subtext?: string;
  /**
   * User's first name, appended to the greeting when `type` is "greeting".
   *
   * @type {?string}
   */
  user?: string;
  /**
   * Optional action elements (e.g., buttons) displayed on the right side of the header.
   *
   * @type {?React.ReactNode}
   */
  actions?: React.ReactNode;
}

/**
 * Props for the `MobileNav` component that renders the slide-out navigation drawer
 * on small screens.
 *
 * @export
 * @typedef {MobileNavProps}
 */
export interface MobileNavProps {
  /**
   * The currently authenticated user, used to personalise the nav header.
   *
   * @type {UserWithProfile}
   */
  user: UserWithProfile;
}

/**
 * Props for the `RightSidebar` component that renders the contextual panel
 * showing the user's linked wallets and recent transactions.
 *
 * @export
 * @typedef {RightSidebarProps}
 */
export interface RightSidebarProps {
  /**
   * The currently authenticated user displayed at the top of the sidebar.
   *
   * @type {User}
   */
  user: User;
  /**
   * Array of linked wallet records used to render the wallets summary section.
   *
   * @type {Wallet[]}
   */
  wallets: Wallet[];
  /**
   * Array of recent transactions to display in the sidebar transaction list.
   *
   * @type {Transaction[]}
   */
  transactions: Transaction[];
}

/**
 * Props for the `Sidebar` component that renders the main left-hand navigation.
 *
 * @export
 * @typedef {SidebarProps}
 */
export interface SidebarProps {
  /**
   * The currently authenticated user, used to personalise the sidebar header and footer.
   *
   * @type {UserWithProfile}
   */
  user: UserWithProfile;
}

/**
 * Props for the `TotalBalanceBox` component that renders the aggregated balance
 * summary card at the top of the dashboard.
 *
 * @export
 * @typedef {TotalBalanceBoxProps}
 */
export interface TotalBalanceBoxProps {
  /**
   * Array of linked accounts whose balances are summed. Optional — renders a loading state when absent.
   *
   * @type {?Account[]}
   */
  accounts?: Account[];
  /**
   * Total number of linked wallet connections, displayed alongside the balance.
   *
   * @type {number}
   */
  totalWallets: number;
  /**
   * Sum of current balances across all linked accounts, in USD.
   *
   * @type {number}
   */
  totalCurrentBalance: number;
}

/**
 * Standard Next.js 16 page props shape for App Router pages that receive
 * dynamic route segments and/or URL query parameters.
 *
 * @export
 * @typedef {SearchParamProps}
 */
export interface SearchParamProps {
  /**
   * Promise resolving to an object of dynamic route segment key/value pairs
   * (e.g., `{ id: "abc123" }` for `[id]` segments).
   *
   * @type {Promise<Record<string, string>>}
   */
  params: Promise<Record<string, string>>;
  /**
   * Promise resolving to the URL query string parameters. Values may be a string,
   * an array of strings (for repeated keys), or undefined.
   *
   * @type {Promise<Record<string, string | string[] | undefined>>}
   */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Extended profile data for a user, stored in the `user_profiles` table.
 * Supplements the core `User` record with address and personal contact fields.
 *
 * @export
 * @typedef {UserProfile}
 */
export interface UserProfile {
  /**
   * Unique profile record identifier (UUID string).
   *
   * @type {string}
   */
  id: string;
  /**
   * Foreign key referencing the associated `users.id` (UUID string).
   *
   * @type {string}
   */
  userId: string;
  /**
   * Street address line. May be null if not yet provided.
   *
   * @type {?(null | string)}
   */
  address?: null | string;
  /**
   * City of residence. May be null if not yet provided.
   *
   * @type {?(null | string)}
   */
  city?: null | string;
  /**
   * US state or territory abbreviation. May be null if not yet provided.
   *
   * @type {?(null | string)}
   */
  state?: null | string;
  /**
   * ZIP or postal code. May be null if not yet provided.
   *
   * @type {?(null | string)}
   */
  postalCode?: null | string;
  /**
   * Contact phone number. May be null if not yet provided.
   *
   * @type {?(null | string)}
   */
  phone?: null | string;
  /**
   * Date of birth in ISO 8601 format (YYYY-MM-DD). May be null if not yet provided.
   *
   * @type {?(null | string)}
   */
  dateOfBirth?: null | string;
}

/**
 * A wallet account returned by Plaid. Combines Plaid balance data with the app's
 * `wallets` record metadata for display in the UI.
 *
 * @export
 * @typedef {Account}
 */
export interface Account {
  /**
   * Plaid account ID, unique within a Plaid Item.
   *
   * @type {string}
   */
  id: string;
  /**
   * Amount of funds available for spending, withdrawal, or other transactions, in the account's currency.
   *
   * @type {number}
   */
  availableBalance: number;
  /**
   * Total amount of funds in the account, including pending transactions, in the account's currency.
   *
   * @type {number}
   */
  currentBalance: number;
  /**
   * The official name of the account as it appears at the financial institution.
   *
   * @type {?string}
   */
  officialName?: string;
  /**
   * The last 2–4 digits of the account number, as returned by Plaid.
   *
   * @type {?string}
   */
  mask?: string;
  /**
   * The Plaid institution ID for the bank that holds this account.
   *
   * @type {?string}
   */
  institutionId?: string;
  /**
   * The user-friendly account name, either set by the user or returned by Plaid.
   *
   * @type {string}
   */
  name: string;
  /**
   * High-level account type: "depository", "credit", "loan", "investment", or "other".
   *
   * @type {string}
   */
  type: string;
  /**
   * Account subtype (e.g., "checking", "savings", "credit card").
   *
   * @type {?string}
   */
  subtype?: string;
  /**
   * Public-safe shareable identifier for this account, stored in the `wallets` table.
   * Used in transfer flows to identify recipient accounts without exposing internal IDs.
   *
   * @type {?string}
   */
  sharableId?: string;
}

/**
 * A financial transaction record, either sourced from Plaid or created internally
 * for an ACH transfer via Dwolla. Stored in the `transactions` table.
 *
 * @export
 * @typedef {Transaction}
 */
export interface Transaction {
  /**
   * Unique transaction identifier (UUID string, primary key in `transactions` table).
   *
   * @type {string}
   */
  id: string;
  /**
   * Human-readable description of the transaction (merchant name, transfer memo, etc.).
   *
   * @type {?string}
   */
  name?: string;
  /**
   * The channel through which the payment was made (e.g., "online", "in store", "other").
   *
   * @type {?string}
   */
  paymentChannel?: string;
  /**
   * Transaction type: "debit" for outflows, "credit" for inflows.
   *
   * @type {?string}
   */
  type?: string;
  /**
   * The Plaid account ID associated with this transaction.
   *
   * @type {?string}
   */
  accountId?: string;
  /**
   * Transaction amount in the account's currency. Positive = debit; negative = credit (Plaid convention).
   *
   * @type {number}
   */
  amount: number;
  /**
   * Whether the transaction is pending (not yet settled).
   *
   * @type {?boolean}
   */
  pending?: boolean;
  /**
   * Plaid-assigned transaction category (e.g., "Food and Drink", "Travel").
   *
   * @type {?string}
   */
  category?: string;
  /**
   * ISO 8601 date string (YYYY-MM-DD) of when the transaction occurred.
   *
   * @type {?string}
   */
  date?: string;
  /**
   * URL of a merchant logo or category image associated with the transaction.
   *
   * @type {?string}
   */
  image?: string;
  /**
   * Foreign key referencing the `wallets.id` of the account that sent this transaction.
   *
   * @type {?string}
   */
  senderWalletId?: string;
  /**
   * Foreign key referencing the `wallets.id` of the account that received this transaction.
   *
   * @type {?string}
   */
  receiverWalletId?: string;
  /**
   * Current status of the transaction (e.g., "pending", "completed", "failed").
   *
   * @type {?string}
   */
  status?: string;
}

/**
 * A linked wallet account record from the `wallets` table. Stores Plaid and Dwolla
 * integration data alongside account metadata for the owning user.
 *
 * @export
 * @typedef {Wallet}
 */
export interface Wallet {
  /**
   * Unique wallet record identifier (UUID string, primary key in `wallets` table).
   *
   * @type {string}
   */
  id: string;
  /**
   * Foreign key referencing the `users.id` (UUID string) of the account owner.
   *
   * @type {string}
   */
  userId: string;
  /**
   * Plaid access token used to retrieve account data and initiate transfers.
   * Stored encrypted (AES-256-GCM) in the database; decrypted before use.
   *
   * @type {string}
   */
  accessToken: string;
  /**
   * Dwolla funding source URL for this wallet. Used as the source or destination
   * in ACH transfer requests. Null until a Dwolla funding source has been created.
   *
   * @type {?(null | string)}
   */
  fundingSourceUrl?: null | string;
  /**
   * Public-safe shareable identifier generated at link time. Used in transfer flows
   * to identify recipient accounts without exposing internal database IDs.
   *
   * @type {string}
   */
  sharableId: string;
  /**
   * Plaid institution ID for the financial institution holding this account.
   *
   * @type {?(null | string)}
   */
  institutionId?: null | string;
  /**
   * Human-readable name of the financial institution (e.g., "Chase", "Bank of America").
   *
   * @type {?(null | string)}
   */
  institutionName?: null | string;
  /**
   * Plaid account ID, unique within the Plaid Item for this wallet connection.
   *
   * @type {?(null | string)}
   */
  accountId?: null | string;
  /**
   * High-level account type as returned by Plaid (e.g., "depository", "credit").
   *
   * @type {?(null | string)}
   */
  accountType?: null | string;
  /**
   * Account subtype as returned by Plaid (e.g., "checking", "savings", "credit card").
   *
   * @type {?(null | string)}
   */
  accountSubtype?: null | string;
  /**
   * Timestamp when the wallet record was created (i.e., when the account was linked).
   *
   * @type {Date}
   */
  createdAt: Date;
  /**
   * Timestamp when the wallet record was last updated.
   *
   * @type {Date}
   */
  updatedAt: Date;
}

/**
 * Union of valid Plaid account types used to categorize linked bank accounts.
 *
 * @export
 * @typedef {AccountTypes}
 */
export type AccountTypes =
  | "credit"
  | "depository"
  | "investment"
  | "loan"
  | "other";

/**
 * The set of transaction categories used to classify and filter transactions
 * in the spending breakdown and category badge components.
 *
 * @export
 * @typedef {Category}
 */
export type Category =
  | "Bills"
  | "Food and Drink"
  | "Shopping"
  | "Transfer"
  | "Travel";

/**
 * Aggregated transaction count data for a single spending category,
 * used by the `Category` component to render proportional progress bars.
 *
 * @export
 * @typedef {CategoryCount}
 */
export interface CategoryCount {
  /**
   * The category label (e.g., "Food and Drink", "Travel").
   *
   * @type {string}
   */
  name: string;
  /**
   * Number of transactions in this category for the current period.
   *
   * @type {number}
   */
  count: number;
  /**
   * Total number of transactions across all categories, used to compute the percentage share.
   *
   * @type {number}
   */
  totalCount: number;
}

/**
 * Parameters required to initiate a Dwolla ACH transfer between two funding sources.
 *
 * @export
 * @typedef {TransferParams}
 */
export interface TransferParams {
  /**
   * Dwolla funding source URL of the sending bank account.
   *
   * @type {string}
   */
  sourceFundingSourceUrl: string;
  /**
   * Dwolla funding source URL of the receiving bank account.
   *
   * @type {string}
   */
  destinationFundingSourceUrl: string;
  /**
   * Transfer amount as a string (e.g., "10.00"), in USD. Dwolla requires string format.
   *
   * @type {string}
   */
  amount: string;
}

/**
 * Parameters for adding a Plaid-verified bank account as a Dwolla funding source
 * via the processor token exchange flow.
 *
 * @export
 * @typedef {AddFundingSourceParams}
 */
export interface AddFundingSourceParams {
  /**
   * The Dwolla customer ID (UUID) of the user adding the funding source.
   *
   * @type {string}
   */
  dwollaCustomerId: string;
  /**
   * Plaid processor token exchanged for Dwolla use. Single-use; obtained via
   * the `processorTokenCreate` Plaid endpoint.
   *
   * @type {string}
   */
  processorToken: string;
  /**
   * Human-readable label for the funding source (typically the institution name).
   *
   * @type {string}
   */
  bankName: string;
}

/**
 * Parameters required to create a new Dwolla personal verified customer.
 * These fields are submitted directly to the Dwolla Customers API.
 *
 * @export
 * @typedef {NewDwollaCustomerParams}
 */
export interface NewDwollaCustomerParams {
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
   * Customer's email address. Must be unique within the Dwolla environment.
   *
   * @type {string}
   */
  email: string;
  /**
   * Dwolla customer type. Use "personal" for individual verified customers.
   *
   * @type {string}
   */
  type: string;
  /**
   * Customer's primary street address line.
   *
   * @type {string}
   */
  address1: string;
  /**
   * Customer's city of residence.
   *
   * @type {string}
   */
  city: string;
  /**
   * Customer's US state abbreviation (e.g., "CA", "NY").
   *
   * @type {string}
   */
  state: string;
  /**
   * Customer's 5-digit US postal code.
   *
   * @type {string}
   */
  postalCode: string;
  /**
   * Customer's date of birth in ISO 8601 format (YYYY-MM-DD).
   *
   * @type {string}
   */
  dateOfBirth: string;
}

/**
 * Props for the `PageHeader` component that renders a two-line header with
 * optional bank connection prompt used on the My Banks and Payment Transfer pages.
 *
 * @export
 * @interface PageHeaderProps
 * @typedef {PageHeaderProps}
 */
export interface PageHeaderProps {
  /**
   * Primary heading text displayed at the top of the header section.
   *
   * @type {string}
   */
  topTitle: string;
  /**
   * Secondary heading text displayed below the top title.
   *
   * @type {string}
   */
  bottomTitle: string;
  /**
   * Descriptive subtitle displayed beneath the top title.
   *
   * @type {string}
   */
  topDescription: string;
  /**
   * Descriptive subtitle displayed beneath the bottom title.
   *
   * @type {string}
   */
  bottomDescription: string;
  /**
   * When true, renders a "Connect Wallet" button prompt in the header. Used on pages
   * where the user has not yet linked any wallet accounts.
   *
   * @type {?boolean}
   */
  connectWallet?: boolean;
}

/**
 * Props for the `Pagination` component that renders previous/next navigation
 * controls for paginated lists.
 *
 * @export
 * @interface PaginationProps
 * @typedef {PaginationProps}
 */
export interface PaginationProps {
  /**
   * The current active page number (1-based).
   *
   * @type {number}
   */
  page: number;
  /**
   * Total number of pages available, used to disable the "next" button on the last page.
   *
   * @type {number}
   */
  totalPages: number;
}

/**
 * Props for the `PlaidLink` component that initiates the Plaid Link flow
 * to connect a new wallet.
 *
 * @export
 * @interface PlaidLinkProps
 * @typedef {PlaidLinkProps}
 */
export interface PlaidLinkProps {
  /**
   * The currently authenticated user. Used to create the Plaid link token
   * and associate the resulting wallet with the correct user record.
   *
   * @type {User}
   */
  user: User;
  /**
   * Button visual variant. "primary" renders a filled button; "ghost" renders a borderless link-style button.
   *
   * @type {?("primary" | "ghost")}
   */
  variant?: "ghost" | "primary";
  /**
   * The user's Dwolla customer ID, required to create a funding source after
   * successfully linking a wallet via Plaid.
   *
   * @type {?string}
   */
  dwollaCustomerId?: string;
}

/**
 * Props for the `WalletDropdown` component that renders a styled dropdown
 * for selecting a source or destination wallet in the transfer form.
 *
 * @export
 * @interface WalletDropdownProps
 * @typedef {WalletDropdownProps}
 */
export interface WalletDropdownProps {
  /**
   * Array of linked accounts to populate the dropdown options.
   *
   * @type {Account[]}
   */
  accounts: Account[];
  /**
   * React Hook Form `setValue` callback used to update the selected account
   * field when the user picks an option from the dropdown.
   *
   * @type {?(name: string, value: unknown) => void}
   */
  setValue?: (name: string, value: unknown) => void;
  /**
   * Additional Tailwind CSS class names applied to the dropdown trigger element.
   *
   * @type {?string}
   */
  otherStyles?: string;
}

/**
 * Props for the `WalletTabItem` component that renders a single tab button
 * in the wallet tab switcher on the Transaction History page.
 *
 * @export
 * @interface WalletTabItemProps
 * @typedef {WalletTabItemProps}
 */
export interface WalletTabItemProps {
  /**
   * The linked wallet this tab represents.
   *
   * @type {Account}
   */
  account: Account;
}

/**
 * Props for the `RecentTransactions` component that renders a tabbed view
 * of recent transactions grouped by linked bank account.
 *
 * @export
 * @interface RecentTransactionsProps
 * @typedef {RecentTransactionsProps}
 */
export interface RecentTransactionsProps {
  /**
   * Array of linked accounts used to generate the account tab selectors.
   *
   * @type {Account[]}
   */
  accounts: Account[];
  /**
   * Array of transactions to display in the active account's transaction list.
   *
   * @type {Transaction[]}
   */
  transactions: Transaction[];
  /**
   * Current page number (1-based) used by the pagination controls.
   *
   * @type {number}
   */
  page: number;
}

/**
 * Props for the `TransactionHistoryTable` component that renders the full
 * paginated transaction table on the Transaction History page.
 *
 * @export
 * @interface TransactionHistoryTableProps
 * @typedef {TransactionHistoryTableProps}
 */
export interface TransactionHistoryTableProps {
  /**
   * Array of transactions for the current page to render in the table rows.
   *
   * @type {Transaction[]}
   */
  transactions: Transaction[];
  /**
   * Current page number (1-based), forwarded to the pagination footer.
   *
   * @type {number}
   */
  page: number;
}

/**
 * Props for the `CategoryBadge` component that renders a styled pill badge
 * representing a transaction's spending category.
 *
 * @export
 * @interface CategoryBadgeProps
 * @typedef {CategoryBadgeProps}
 */
export interface CategoryBadgeProps {
  /**
   * The category label string to display inside the badge
   * (e.g., "Food and Drink", "Travel", "Shopping").
   *
   * @type {string}
   */
  category: string;
}

/**
 * Props for the `TransactionTable` component that renders a sortable table
 * of transaction rows with category badges and status indicators.
 *
 * @export
 * @interface TransactionTableProps
 * @typedef {TransactionTableProps}
 */
export interface TransactionTableProps {
  /**
   * Array of transactions to render as rows in the table.
   *
   * @type {Transaction[]}
   */
  transactions: Transaction[];
}

/**
 * Props for the `Category` component that renders a single spending-category
 * row with a proportional progress bar inside the spending breakdown section.
 *
 * @export
 * @interface CategoryProps
 * @typedef {CategoryProps}
 */
export interface CategoryProps {
  /**
   * Aggregated category data including the category name, transaction count,
   * and total count across all categories used to compute the progress width.
   *
   * @type {CategoryCount}
   */
  category: CategoryCount;
}

/**
 * Props for the `PaymentTransferForm` component that renders the multi-field
 * ACH transfer form allowing users to send money between linked bank accounts.
 *
 * @export
 * @interface PaymentTransferFormProps
 * @typedef {PaymentTransferFormProps}
 */
export interface PaymentTransferFormProps {
  /**
   * Array of the user's linked bank accounts, used to populate the
   * source account dropdown in the transfer form.
   *
   * @type {Account[]}
   */
  accounts: Account[];
}

/**
 * Props for the `AuthForm` component that renders either the sign-in or
 * sign-up form depending on the current authentication page context.
 *
 * @export
 * @interface AuthFormProps
 * @typedef {AuthFormProps}
 */
export interface AuthFormProps {
  /**
   * Determines which form variant to render:
   * - "sign-in" renders email + password login fields.
   * - "sign-up" renders the full registration form with profile fields.
   *
   * @type {("sign-in" | "sign-up")}
   */
  type: "sign-in" | "sign-up";
}

/**
 * Input parameters for retrieving a user's Plaid-linked bank accounts.
 *
 * @export
 * @interface GetAccountsProps
 * @typedef {GetAccountsProps}
 */
export interface GetAccountsProps {
  /**
   * The UUID of the user whose linked bank accounts should be fetched.
   *
   * @type {string}
   */
  userId: string;
}

/**
 * Input parameters for fetching Plaid institution metadata by institution ID.
 *
 * @export
 * @interface GetInstitutionProps
 * @typedef {GetInstitutionProps}
 */
export interface GetInstitutionProps {
  /**
   * Plaid institution ID (e.g., "ins_3" for Chase). Used to retrieve the
   * institution's name, logo, and color from the Plaid Institutions API.
   *
   * @type {string}
   */
  institutionId: string;
}

/**
 * Input parameters for retrieving transactions from Plaid for a linked account.
 *
 * @export
 * @interface GetTransactionsProps
 * @typedef {GetTransactionsProps}
 */
export interface GetTransactionsProps {
  /**
   * Plaid access token for the linked wallet. Obtained after the
   * public token exchange and stored encrypted in the `wallets` table.
   *
   * @type {string}
   */
  accessToken: string;
}

/**
 * Options required to create a new Dwolla funding source for a customer
 * using a Plaid processor token via the Dwolla Funding Sources API.
 *
 * @export
 * @interface CreateFundingSourceOptions
 * @typedef {CreateFundingSourceOptions}
 */
export interface CreateFundingSourceOptions {
  /**
   * The Dwolla customer ID (UUID) of the customer to attach the funding source to.
   *
   * @type {string}
   */
  customerId: string;
  /**
   * Human-readable label for this funding source (typically the bank/institution name).
   *
   * @type {string}
   */
  fundingSourceName: string;
  /**
   * Single-use Plaid processor token obtained via `processorTokenCreate`,
   * used by Dwolla to verify and link the bank account.
   *
   * @type {string}
   */
  plaidToken: string;
  /**
   * HAL-style `_links` object for navigating Dwolla API resource relationships.
   * Provided by the Dwolla on-demand authorization response when present.
   *
   * @type {?object}
   */
  _links?: object;
}

/**
 * Parameters required to record a new ACH transfer transaction in the
 * application's `transactions` table after a Dwolla transfer is initiated.
 *
 * @export
 * @interface CreateTransactionProps
 * @typedef {CreateTransactionProps}
 */
export interface CreateTransactionProps {
  /**
   * Human-readable memo or description for the transaction (e.g., "Rent payment").
   *
   * @type {string}
   */
  name: string;
  /**
   * Transfer amount as a string (e.g., "50.00"), in USD. Stored as string
   * to match Dwolla's API format before being persisted as a numeric value.
   *
   * @type {string}
   */
  amount: string;
  /**
   * User ID (UUID) of the sender, referencing `users.id`.
   *
   * @type {string}
   */
  senderId: string;
  /**
   * Wallet record ID (UUID) of the sender's funding source, referencing `wallets.id`.
   *
   * @type {string}
   */
  senderWalletId: string;
  /**
   * User ID (UUID) of the recipient, referencing `users.id`.
   *
   * @type {string}
   */
  receiverId: string;
  /**
   * Wallet record ID (UUID) of the recipient's funding source, referencing `wallets.id`.
   *
   * @type {string}
   */
  receiverWalletId: string;
  /**
   * Email address of the recipient, used for transfer confirmation notifications.
   *
   * @type {string}
   */
  email: string;
}

/**
 * Input parameters for querying all transactions associated with a specific
 * wallet record in the `transactions` table.
 *
 * @export
 * @interface GetTransactionsByWalletIdProps
 * @typedef {GetTransactionsByWalletIdProps}
 */
export interface GetTransactionsByWalletIdProps {
  /**
   * The UUID of the wallet record (`wallets.id`) whose transactions should be fetched.
   * Matches on either `senderWalletId` or `receiverWalletId`.
   *
   * @type {string}
   */
  walletId: string;
}

/**
 * Credentials passed to the NextAuth Credentials provider to authenticate
 * a user with email and password.
 *
 * @export
 * @interface SignInProps
 * @typedef {SignInProps}
 */
export interface SignInProps {
  /**
   * The user's registered email address.
   *
   * @type {string}
   */
  email: string;
  /**
   * The user's plaintext password, verified against the bcrypt hash stored
   * in the `users` table. Never stored or logged in plaintext.
   *
   * @type {string}
   */
  password: string;
}

/**
 * Input parameters for fetching a user's core record from the `users` table.
 *
 * @export
 * @interface GetUserInfoProps
 * @typedef {GetUserInfoProps}
 */
export interface GetUserInfoProps {
  /**
   * The UUID of the user to look up, referencing `users.id`.
   *
   * @type {string}
   */
  userId: string;
}

/**
 * Parameters for the Plaid public token exchange flow that links a wallet
 * account after the user completes the Plaid Link UI.
 *
 * @export
 * @interface ExchangePublicTokenProps
 * @typedef {ExchangePublicTokenProps}
 */
export interface ExchangePublicTokenProps {
  /**
   * The short-lived public token returned by the Plaid Link `onSuccess`
   * callback. Exchanged for a permanent access token via `itemPublicTokenExchange`.
   *
   * @type {string}
   */
  publicToken: string;
  /**
   * The currently authenticated user. Used to associate the resulting wallet
   * record with the correct user and to create the Dwolla customer if needed.
   *
   * @type {User}
   */
  user: User;
}

/**
 * Parameters for creating a new wallet record in the `wallets` table after
 * successfully completing the Plaid public token exchange.
 *
 * @export
 * @interface CreateWalletProps
 * @typedef {CreateWalletProps}
 */
export interface CreateWalletProps {
  /**
   * Plaid access token for the linked Item. Stored encrypted (AES-256-GCM) in
   * the `wallets.accessToken` column.
   *
   * @type {string}
   */
  accessToken: string;
  /**
   * UUID of the user who linked this account, referencing `users.id`.
   *
   * @type {string}
   */
  userId: string;
  /**
   * Plaid account ID for the specific account within the linked Item.
   *
   * @type {string}
   */
  accountId: string;
  /**
   * Internal wallet record ID (UUID) generated at creation time, used as the
   * primary key in the `wallets` table.
   *
   * @type {string}
   */
  walletId: string;
  /**
   * Dwolla funding source URL created for this wallet. Stored in
   * `wallets.fundingSourceUrl` and used as source/destination in ACH transfers.
   *
   * @type {string}
   */
  fundingSourceUrl: string;
  /**
   * Public-safe shareable identifier generated at link time. Used in transfer
   * flows to identify recipient accounts without exposing database IDs.
   *
   * @type {string}
   */
  sharableId: string;
}

/**
 * Input parameters for fetching all wallet records linked to a specific user.
 *
 * @export
 * @interface GetWalletsProps
 * @typedef {GetWalletsProps}
 */
export interface GetWalletsProps {
  /**
   * The UUID of the user whose linked wallet records should be fetched,
   * referencing `users.id`.
   *
   * @type {string}
   */
  userId: string;
}

/**
 * Input parameters for fetching a single wallet record by its primary key.
 *
 * @export
 * @interface GetWalletProps
 * @typedef {GetWalletProps}
 */
export interface GetWalletProps {
  /**
   * The UUID primary key of the wallet record to fetch (`wallets.id`).
   *
   * @type {string}
   */
  walletId: string;
}

/**
 * Input parameters for fetching a wallet record by its associated Plaid account ID.
 *
 * @export
 * @interface GetWalletByAccountIdProps
 * @typedef {GetWalletByAccountIdProps}
 */
export interface GetWalletByAccountIdProps {
  /**
   * The Plaid account ID (`wallets.accountId`) used to look up the corresponding
   * wallet record. Useful when mapping Plaid transaction data back to internal records.
   *
   * @type {string}
   */
  accountId: string;
}
