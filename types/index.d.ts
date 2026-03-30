/**
 * Description placeholder
 *
 * @export
 * @typedef {CreditCardProps}
 */
export interface CreditCardProps {
  /**
   * Description placeholder
   *
   * @type {Account}
   */
  account: Account;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  userName: string;
  /**
   * Description placeholder
   *
   * @type {?boolean}
   */
  showBalance?: boolean;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {DoughnutChartProps}
 */
export interface DoughnutChartProps {
  /**
   * Description placeholder
   *
   * @type {Account[]}
   */
  accounts: Account[];
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {FooterProps}
 */
export interface FooterProps {
  /**
   * Description placeholder
   *
   * @type {User}
   */
  user: User;
  /**
   * Description placeholder
   *
   * @type {?("desktop" | "mobile")}
   */
  type?: "desktop" | "mobile";
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {HeaderBoxProps}
 */
export interface HeaderBoxProps {
  /**
   * Description placeholder
   *
   * @type {?("greeting" | "title")}
   */
  type?: "greeting" | "title";
  /**
   * Description placeholder
   *
   * @type {string}
   */
  title: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  subtext?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  user?: string;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {MobileNavProps}
 */
export interface MobileNavProps {
  /**
   * Description placeholder
   *
   * @type {User}
   */
  user: User;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {RightSidebarProps}
 */
export interface RightSidebarProps {
  /**
   * Description placeholder
   *
   * @type {User}
   */
  user: User;
  /**
   * Description placeholder
   *
   * @type {Bank[]}
   */
  banks: Bank[];
  /**
   * Description placeholder
   *
   * @type {Transaction[]}
   */
  transactions: Transaction[];
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {SiderbarProps}
 */
export interface SiderbarProps {
  /**
   * Description placeholder
   *
   * @type {User}
   */
  user: User;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {TotlaBalanceBoxProps}
 */
export interface TotlaBalanceBoxProps {
  /**
   * Description placeholder
   *
   * @type {Account[]}
   */
  accounts: Account[];
  /**
   * Description placeholder
   *
   * @type {number}
   */
  totalBanks: number;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  totalCurrentBalance: number;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {SearchParamProps}
 */
export interface SearchParamProps {
  /**
   * Description placeholder
   *
   * @type {Promise<Record<string, string>>}
   */
  params: Promise<Record<string, string>>;
  /**
   * Description placeholder
   *
   * @type {Promise<Record<string, string | string[] | undefined>>}
   */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {User}
 */
export interface User {
  /**
   * Description placeholder
   *
   * @type {number}
   */
  id: number;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  email: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  password?: string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  name?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  image?: null | string;
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  isAdmin: boolean;
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  isActive: boolean;
  /**
   * Description placeholder
   *
   * @type {Date}
   */
  createdAt: Date;
  /**
   * Description placeholder
   *
   * @type {Date}
   */
  updatedAt: Date;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {UserProfile}
 */
export interface UserProfile {
  /**
   * Description placeholder
   *
   * @type {number}
   */
  id: number;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  userId: number;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  address?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  city?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  state?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  postalCode?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  phone?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  dateOfBirth?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  ssn?: null | string;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {Account}
 */
export interface Account {
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
  availableBalance: number;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  currentBalance: number;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  officialName?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  mask?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  institutionId?: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  type: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  subtype?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  sharableId?: string;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {Transaction}
 */
export interface Transaction {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  id: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  name?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  paymentChannel?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  type?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  accountId?: string;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  amount: number;
  /**
   * Description placeholder
   *
   * @type {?boolean}
   */
  pending?: boolean;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  category?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  date?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  image?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  senderBankId?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  receiverBankId?: string;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  status?: string;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {Bank}
 */
export interface Bank {
  /**
   * Description placeholder
   *
   * @type {number}
   */
  id: number;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  userId: number;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accessToken: string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  fundingSourceUrl?: null | string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  sharableId: string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  institutionId?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  institutionName?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  accountId?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  accountType?: null | string;
  /**
   * Description placeholder
   *
   * @type {?(null | string)}
   */
  accountSubtype?: null | string;
  /**
   * Description placeholder
   *
   * @type {Date}
   */
  createdAt: Date;
  /**
   * Description placeholder
   *
   * @type {Date}
   */
  updatedAt: Date;
}

/**
 * Description placeholder
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
 * Description placeholder
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
 * Description placeholder
 *
 * @export
 * @typedef {CategoryCount}
 */
export interface CategoryCount {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  count: number;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  totalCount: number;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {TransferParams}
 */
export interface TransferParams {
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
   * @type {string}
   */
  amount: string;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {AddFundingSourceParams}
 */
export interface AddFundingSourceParams {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  dwollaCustomerId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  processorToken: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bankName: string;
}

/**
 * Description placeholder
 *
 * @export
 * @typedef {NewDwollaCustomerParams}
 */
export interface NewDwollaCustomerParams {
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
   * @type {string}
   */
  type: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  address1: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  city: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  state: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  postalCode: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  dateOfBirth: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  ssn: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PageHeaderProps
 * @typedef {PageHeaderProps}
 */
export interface PageHeaderProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  topTitle: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bottomTitle: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  topDescription: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bottomDescription: string;
  /**
   * Description placeholder
   *
   * @type {?boolean}
   */
  connectBank?: boolean;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PaginationProps
 * @typedef {PaginationProps}
 */
export interface PaginationProps {
  /**
   * Description placeholder
   *
   * @type {number}
   */
  page: number;
  /**
   * Description placeholder
   *
   * @type {number}
   */
  totalPages: number;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PlaidLinkProps
 * @typedef {PlaidLinkProps}
 */
export interface PlaidLinkProps {
  /**
   * Description placeholder
   *
   * @type {User}
   */
  user: User;
  /**
   * Description placeholder
   *
   * @type {?("primary" | "ghost")}
   */
  variant?: "ghost" | "primary";
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  dwollaCustomerId?: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface BankDropdownProps
 * @typedef {BankDropdownProps}
 */
export interface BankDropdownProps {
  /**
   * Description placeholder
   *
   * @type {Account[]}
   */
  accounts: Account[];
  /**
   * Description placeholder
   *
   * @type {?(name: string, value: unknown) => void}
   */
  setValue?: (name: string, value: unknown) => void;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  otherStyles?: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface BankTabItemProps
 * @typedef {BankTabItemProps}
 */
export interface BankTabItemProps {
  /**
   * Description placeholder
   *
   * @type {Account}
   */
  account: Account;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  appwriteItemId?: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface RecentTransactionsProps
 * @typedef {RecentTransactionsProps}
 */
export interface RecentTransactionsProps {
  /**
   * Description placeholder
   *
   * @type {Account[]}
   */
  accounts: Account[];
  /**
   * Description placeholder
   *
   * @type {Transaction[]}
   */
  transactions: Transaction[];
  /**
   * Description placeholder
   *
   * @type {number}
   */
  page: number;
}

/**
 * Description placeholder
 *
 * @export
 * @interface TransactionHistoryTableProps
 * @typedef {TransactionHistoryTableProps}
 */
export interface TransactionHistoryTableProps {
  /**
   * Description placeholder
   *
   * @type {Transaction[]}
   */
  transactions: Transaction[];
  /**
   * Description placeholder
   *
   * @type {number}
   */
  page: number;
}

/**
 * Description placeholder
 *
 * @export
 * @interface CategoryBadgeProps
 * @typedef {CategoryBadgeProps}
 */
export interface CategoryBadgeProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  category: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface TransactionTableProps
 * @typedef {TransactionTableProps}
 */
export interface TransactionTableProps {
  /**
   * Description placeholder
   *
   * @type {Transaction[]}
   */
  transactions: Transaction[];
}

/**
 * Description placeholder
 *
 * @export
 * @interface CategoryProps
 * @typedef {CategoryProps}
 */
export interface CategoryProps {
  /**
   * Description placeholder
   *
   * @type {CategoryCount}
   */
  category: CategoryCount;
}

/**
 * Description placeholder
 *
 * @export
 * @interface PaymentTransferFormProps
 * @typedef {PaymentTransferFormProps}
 */
export interface PaymentTransferFormProps {
  /**
   * Description placeholder
   *
   * @type {Account[]}
   */
  accounts: Account[];
}

/**
 * Description placeholder
 *
 * @export
 * @interface AuthFormProps
 * @typedef {AuthFormProps}
 */
export interface AuthFormProps {
  /**
   * Description placeholder
   *
   * @type {("sign-in" | "sign-up")}
   */
  type: "sign-in" | "sign-up";
}

/**
 * Description placeholder
 *
 * @export
 * @interface getAccountsProps
 * @typedef {getAccountsProps}
 */
export interface getAccountsProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  userId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface getInstitutionProps
 * @typedef {getInstitutionProps}
 */
export interface getInstitutionProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  institutionId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface getTransactionsProps
 * @typedef {getTransactionsProps}
 */
export interface getTransactionsProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accessToken: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface CreateFundingSourceOptions
 * @typedef {CreateFundingSourceOptions}
 */
export interface CreateFundingSourceOptions {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  customerId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  fundingSourceName: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  plaidToken: string;
  /**
   * Description placeholder
   *
   * @type {?object}
   */
  _links?: object;
}

/**
 * Description placeholder
 *
 * @export
 * @interface CreateTransactionProps
 * @typedef {CreateTransactionProps}
 */
export interface CreateTransactionProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  name: string;
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
  senderId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  senderBankId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  receiverId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  receiverBankId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  email: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface getTransactionsByBankIdProps
 * @typedef {getTransactionsByBankIdProps}
 */
export interface getTransactionsByBankIdProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bankId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface signInProps
 * @typedef {signInProps}
 */
export interface signInProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  email: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  password: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface getUserInfoProps
 * @typedef {getUserInfoProps}
 */
export interface getUserInfoProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  userId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface exchangePublicTokenProps
 * @typedef {exchangePublicTokenProps}
 */
export interface exchangePublicTokenProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  publicToken: string;
  /**
   * Description placeholder
   *
   * @type {User}
   */
  user: User;
}

/**
 * Description placeholder
 *
 * @export
 * @interface createBankAccountProps
 * @typedef {createBankAccountProps}
 */
export interface createBankAccountProps {
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
  userId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accountId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  bankId: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  fundingSourceUrl: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  sharableId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface getBanksProps
 * @typedef {getBanksProps}
 */
export interface getBanksProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  userId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface getBankProps
 * @typedef {getBankProps}
 */
export interface getBankProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  documentId: string;
}

/**
 * Description placeholder
 *
 * @export
 * @interface getBankByAccountIdProps
 * @typedef {getBankByAccountIdProps}
 */
export interface getBankByAccountIdProps {
  /**
   * Description placeholder
   *
   * @type {string}
   */
  accountId: string;
}
