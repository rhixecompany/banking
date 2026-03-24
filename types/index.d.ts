export type CreditCardProps = {
  account: Account;
  userName: string;
  showBalance?: boolean;
};

export type DoughnutChartProps = {
  accounts: Account[];
};

export type FooterProps = {
  user: User;
  type?: "desktop" | "mobile";
};

export type HeaderBoxProps = {
  type?: "title" | "greeting";
  title: string;
  subtext?: string;
  user?: string;
};

export type MobileNavProps = {
  user: User;
};

export type RightSidebarProps = {
  user: User;
  banks: Bank[];
  transactions: Transaction[];
};

export type SiderbarProps = {
  user: User;
};

export type TotlaBalanceBoxProps = {
  accounts: Account[];
  totalBanks: number;
  totalCurrentBalance: number;
};

export type SearchParamProps = {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type User = {
  id: number;
  email: string;
  password?: string;
  name?: string | null;
  image?: string | null;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type UserProfile = {
  id: number;
  userId: number;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  ssn?: string | null;
};

export type Account = {
  id: string;
  availableBalance: number;
  currentBalance: number;
  officialName?: string;
  mask?: string;
  institutionId?: string;
  name: string;
  type: string;
  subtype?: string;
  sharableId?: string;
};

export type Transaction = {
  id: string;
  name?: string;
  paymentChannel?: string;
  type?: string;
  accountId?: string;
  amount: number;
  pending?: boolean;
  category?: string;
  date?: string;
  image?: string;
  senderBankId?: string;
  receiverBankId?: string;
  status?: string;
};

export type Bank = {
  id: number;
  userId: number;
  accessToken: string;
  fundingSourceUrl?: string | null;
  sharableId: string;
  institutionId?: string | null;
  institutionName?: string | null;
  accountId?: string | null;
  accountType?: string | null;
  accountSubtype?: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AccountTypes =
  | "depository"
  | "credit"
  | "loan"
  | "investment"
  | "other";

export type Category =
  | "Food and Drink"
  | "Travel"
  | "Transfer"
  | "Shopping"
  | "Bills";

export type CategoryCount = {
  name: string;
  count: number;
  totalCount: number;
};

export type TransferParams = {
  sourceFundingSourceUrl: string;
  destinationFundingSourceUrl: string;
  amount: string;
};

export type AddFundingSourceParams = {
  dwollaCustomerId: string;
  processorToken: string;
  bankName: string;
};

export type NewDwollaCustomerParams = {
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  dateOfBirth: string;
  ssn: string;
};

export interface PageHeaderProps {
  topTitle: string;
  bottomTitle: string;
  topDescription: string;
  bottomDescription: string;
  connectBank?: boolean;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
}

export interface PlaidLinkProps {
  user: User;
  variant?: "primary" | "ghost";
  dwollaCustomerId?: string;
}

export interface BankDropdownProps {
  accounts: Account[];
  setValue?: (name: string, value: unknown) => void;
  otherStyles?: string;
}

export interface BankTabItemProps {
  account: Account;
  appwriteItemId?: string;
}

export interface RecentTransactionsProps {
  accounts: Account[];
  transactions: Transaction[];
  page: number;
}

export interface TransactionHistoryTableProps {
  transactions: Transaction[];
  page: number;
}

export interface CategoryBadgeProps {
  category: string;
}

export interface TransactionTableProps {
  transactions: Transaction[];
}

export interface CategoryProps {
  category: CategoryCount;
}

export interface PaymentTransferFormProps {
  accounts: Account[];
}

export interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

export interface getAccountsProps {
  userId: string;
}

export interface getInstitutionProps {
  institutionId: string;
}

export interface getTransactionsProps {
  accessToken: string;
}

export interface CreateFundingSourceOptions {
  customerId: string;
  fundingSourceName: string;
  plaidToken: string;
  _links?: object;
}

export interface CreateTransactionProps {
  name: string;
  amount: string;
  senderId: string;
  senderBankId: string;
  receiverId: string;
  receiverBankId: string;
  email: string;
}

export interface getTransactionsByBankIdProps {
  bankId: string;
}

export interface signInProps {
  email: string;
  password: string;
}

export interface getUserInfoProps {
  userId: string;
}

export interface exchangePublicTokenProps {
  publicToken: string;
  user: User;
}

export interface createBankAccountProps {
  accessToken: string;
  userId: string;
  accountId: string;
  bankId: string;
  fundingSourceUrl: string;
  sharableId: string;
}

export interface getBanksProps {
  userId: string;
}

export interface getBankProps {
  documentId: string;
}

export interface getBankByAccountIdProps {
  accountId: string;
}
