
/**
 * Seed configuration for E2E tests
 * Generated tokens from Plaid Sandbox
 */

export const SEED_CONFIG = {
  /** Plaid access token for sandbox testing */
  accessToken: "access-sandbox-c176c052-60f0-437d-a7fa-6ec189bc0cd2",
  /** Plaid item ID */
  itemId: "4W6apxLGvEfQgRKbq8oaIXBbBElx7nigEE69n",
  /** Use mock tokens (skips Plaid API calls) */
  useMockTokens: false,
};

/**
 * Get the access token to use for seeding bank accounts
 * @returns The configured access token
 */
export function getSeedAccessToken(): string {
  return SEED_CONFIG.accessToken;
}

/**
 * Get the item ID for the seeded bank
 * @returns The configured item ID
 */
export function getSeedItemId(): string {
  return SEED_CONFIG.itemId;
}
