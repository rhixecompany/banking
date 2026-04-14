import type { Transaction } from "@/types";

/**
 * Creates a mock transaction object for testing.
 *
 * @param overrides - Partial transaction properties to override defaults
 * @returns A complete mock transaction object
 */
export function createMockTransaction(
  overrides?: Partial<Transaction>,
): Transaction {
  return {
    accountId: "account-123",
    amount: 50.0,
    category: "Food and Drink",
    date: "2024-01-15",
    id: "txn-test-123",
    image: "https://example.com/logo.png",
    name: "Test Transaction",
    paymentChannel: "online",
    pending: false,
    receiverWalletId: "wallet-receiver-456",
    senderWalletId: "wallet-sender-123",
    status: "completed",
    type: "debit",
    ...overrides,
  };
}

/**
 * Creates an array of mock transactions for testing lists.
 *
 * @param count - Number of transactions to create
 * @returns Array of mock transaction objects
 */
export function createMockTransactionList(count: number): Transaction[] {
  const categories = [
    "Food and Drink",
    "Shopping",
    "Travel",
    "Bills",
    "Transfer",
  ];
  const merchants = [
    "Starbucks",
    "Amazon",
    "Uber",
    "Netflix",
    "Whole Foods",
    "Target",
    "Shell Gas",
    "Starbucks Coffee",
    "Trader Joe's",
    "Home Depot",
  ];

  return Array.from({ length: count }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);

    return createMockTransaction({
      amount: Math.round((10 + Math.random() * 100) * 100) / 100,
      category: categories[i % categories.length],
      date: date.toISOString().split("T")[0],
      id: `txn-${i}`,
      name: merchants[i % merchants.length],
      pending: i === 0,
      type: i % 3 === 0 ? "credit" : "debit",
    });
  });
}

/**
 * Creates a transaction for a credit (incoming transfer).
 */
export function createCreditTransaction(
  amount: number,
  senderName = "John Doe",
): Transaction {
  return createMockTransaction({
    amount: Math.abs(amount),
    category: "Transfer",
    name: `Transfer from ${senderName}`,
    type: "credit",
  });
}

/**
 * Creates a transaction for a debit (outgoing transfer).
 */
export function createDebitTransaction(
  amount: number,
  recipientName = "Jane Doe",
): Transaction {
  return createMockTransaction({
    amount: -Math.abs(amount),
    category: "Transfer",
    name: `Transfer to ${recipientName}`,
    type: "debit",
  });
}

/**
 * Creates a pending transaction.
 */
export function createPendingTransaction(
  merchant = "Pending Store",
): Transaction {
  return createMockTransaction({
    name: merchant,
    pending: true,
    status: "pending",
  });
}

/**
 * Transaction history page data structure for pagination testing.
 */
export interface TransactionHistoryPage {
  /** Transactions for the page */
  transactions: Transaction[];
  /** Current page number */
  page: number;
  /** Total pages available */
  totalPages: number;
  /** Whether there are more pages beyond this one */
  hasMore: boolean;
}

/**
 * Creates mock paginated transaction history for testing.
 *
 * @param totalCount - Total number of transactions
 * @param pageSize - Number per page (default: 20)
 * @param currentPage - Current page number (default: 1)
 * @returns Paginated transaction history
 */
export function createMockTransactionHistory(
  totalCount: number,
  pageSize = 20,
  currentPage = 1,
): TransactionHistoryPage {
  const allTransactions = createMockTransactionList(totalCount);
  const start = (currentPage - 1) * pageSize;
  const transactions = allTransactions.slice(start, start + pageSize);

  return {
    hasMore: currentPage < Math.ceil(totalCount / pageSize),
    page: currentPage,
    totalPages: Math.ceil(totalCount / pageSize),
    transactions,
  };
}

/**
 * Seed transaction data matching the database seed script.
 * Use this for E2E tests that require seeded data.
 */
export const SEED_TRANSACTIONS = createMockTransactionList(10);

/**
 * Transaction categories for spending breakdown tests.
 */
export const TRANSACTION_CATEGORIES = [
  "Bills",
  "Food and Drink",
  "Shopping",
  "Transfer",
  "Travel",
] as const;

/**
 * Aggregated transaction count for category breakdown display.
 */
export interface CategoryCount {
  /** Category name */
  name: string;
  /** Count for the category */
  count: number;
  /** Total count used to calculate percentages */
  totalCount: number;
}

/**
 * Creates mock category counts for spending breakdown testing.
 *
 * @param totalCount - Total number of transactions
 * @returns Array of category counts
 */
export function createMockCategoryCounts(totalCount = 100): CategoryCount[] {
  const categories = [
    { name: "Food and Drink", percentage: 0.3 },
    { name: "Shopping", percentage: 0.25 },
    { name: "Bills", percentage: 0.2 },
    { name: "Transfer", percentage: 0.15 },
    { name: "Travel", percentage: 0.1 },
  ];

  return categories.map((cat) => ({
    count: Math.round(totalCount * cat.percentage),
    name: cat.name,
    totalCount,
  }));
}
