/**
 * Seed configuration for E2E tests
 * Values loaded from environment variables
 */

export const SEED_CONFIG = {
  /** Plaid access token for sandbox testing (from environment) */
  accessToken: process.env.PLAID_SANDBOX_ACCESS_TOKEN ?? "",
  /** Plaid item ID (from environment) */
  itemId: process.env.PLAID_SANDBOX_ITEM_ID ?? "",
  /** Use mock tokens (skips Plaid API calls) */
  useMockTokens: true,
};

/**
 * Get the access token to use for seeding bank accounts
 * @returns The configured access token, or a mock token if not configured
 */
export function getSeedAccessToken(): string {
  if (SEED_CONFIG.accessToken) {
    return SEED_CONFIG.accessToken;
  }
  // Return a mock token that will be detected by isMockAccessToken()
  // This allows E2E tests to work without real Plaid credentials
  // Use an uppercase MOCK_ prefix for clarity and consistent detection
  return "MOCK_PLAID_ACCESS_TOKEN";
}

/**
 * Get the item ID for the seeded bank
 * @returns The configured item ID
 */
export function getSeedItemId(): string {
  return SEED_CONFIG.itemId;
}
