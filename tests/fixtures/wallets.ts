import type { Account, Wallet } from "@/types";

/**
 * Creates a mock wallet object for testing.
 *
 * @param overrides - Partial wallet properties to override defaults
 * @returns A complete mock wallet object
 */
export function createMockWallet(overrides?: Partial<Wallet>): Wallet {
  return {
    accessToken: "access-sandbox-xxx",
    accountId: "account-xxx",
    accountSubtype: "checking",
    accountType: "depository",
    createdAt: new Date("2024-01-15"),
    fundingSourceUrl: "https://api-sandbox.dwolla.com/funding-sources/xxx",
    id: "wallet-test-123",
    institutionId: "ins_3",
    institutionName: "Chase",
    sharableId: "sharable-xxx",
    updatedAt: new Date("2024-01-15"),
    userId: "user-test-456",
    ...overrides,
  };
}

/**
 * Creates an array of mock wallets for testing lists/grids.
 *
 * @param count - Number of wallets to create
 * @returns Array of mock wallet objects
 */
export function createMockWalletList(count: number): Wallet[] {
  const institutions = [
    { id: "ins_3", name: "Chase" },
    { id: "ins_4", name: "Bank of America" },
    { id: "ins_5", name: "Wells Fargo" },
    { id: "ins_6", name: "Citi" },
  ];

  return Array.from({ length: count }, (_, i) => {
    const institution = institutions[i % institutions.length];
    return createMockWallet({
      accountSubtype: i % 2 === 0 ? "checking" : "savings",
      id: `wallet-${i}`,
      institutionId: institution.id,
      institutionName: institution.name,
      sharableId: `sharable-${i}`,
    });
  });
}

/**
 * Creates a mock Plaid account object for testing.
 *
 * @param overrides - Partial account properties to override defaults
 * @returns A complete mock account object
 */
export function createMockAccount(overrides?: Partial<Account>): Account {
  return {
    availableBalance: 1000.0,
    currentBalance: 1200.0,
    id: "account-test-123",
    institutionId: "ins_3",
    mask: "1234",
    name: "Chase Checking",
    officialName: "Chase Total Checking",
    sharableId: "sharable-xxx",
    subtype: "checking",
    type: "depository",
    ...overrides,
  };
}

/**
 * Creates an array of mock accounts for testing.
 *
 * @param count - Number of accounts to create
 * @returns Array of mock account objects
 */
export function createMockAccountList(count: number): Account[] {
  return Array.from({ length: count }, (_, i) =>
    createMockAccount({
      availableBalance: 450 + i * 100,
      currentBalance: 500 + i * 100,
      id: `account-${i}`,
      name: `Account ${i + 1}`,
    }),
  );
}

/**
 * Mock wallet with Plaid balance data for dashboard display.
 */
export interface WalletWithBalance {
  wallet: Wallet;
  currentBalance: number;
  availableBalance: number;
  accountType: string;
  accountSubtype: string;
}

/**
 * Creates a mock wallet with balance for testing dashboard components.
 *
 * @param balance - Current balance amount (default: 1000)
 * @param available - Available balance amount (default: 900)
 * @returns Mock wallet with balance data
 */
export function createMockWalletWithBalance(
  balance = 1000,
  available = 900,
): WalletWithBalance {
  return {
    accountSubtype: "checking",
    accountType: "depository",
    availableBalance: available,
    currentBalance: balance,
    wallet: createMockWallet(),
  };
}

/**
 * Seed wallet data matching the database seed script.
 * Use this for E2E tests that require seeded data.
 */
export const SEED_WALLETS = [
  createMockWallet({
    accountSubtype: "checking",
    id: "wallet-seed-1",
    institutionName: "Seed Checking Bank",
    sharableId: "seed-checking-sharable",
  }),
  createMockWallet({
    accountSubtype: "savings",
    id: "wallet-seed-2",
    institutionName: "Seed Savings Bank",
    sharableId: "seed-savings-sharable",
  }),
];

/**
 * Mock access tokens for Plaid sandbox.
 */
export const MOCK_ACCESS_TOKENS = {
  custom: "access-sandbox-custom-user",
  good: "access-sandbox-good-user",
};
