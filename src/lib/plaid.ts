import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

import { env } from "@/lib/env";

/**
 * Check if an access token is a mock/seed token (not a real Plaid token)
 * Mock tokens start with "seed-" or "mock-" and will fail when calling Plaid API
 *
 * @param token - The access token to check
 * @returns true if token appears to be a mock/seed token
 */
export function isMockAccessToken(token: string): boolean {
  if (!token) return false;
  const t = token.toLowerCase();
  return (
    t.startsWith("seed-") ||
    t.startsWith("mock-") ||
    t.startsWith("mock_") ||
    t.startsWith("mock")
  );
}

/**
 * Description placeholder
 *
 * @type {*}
 */
const plaidEnvironment = env.PLAID_ENV ?? "sandbox";
/**
 * Description placeholder
 *
 * @type {*}
 */
const hasPlaidEnv = Object.prototype.hasOwnProperty.call(
  PlaidEnvironments,
  plaidEnvironment,
);
/**
 * Description placeholder
 *
 * @type {*}
 */
const basePath =
  env.PLAID_BASE_URL ??
  (hasPlaidEnv
    ? PlaidEnvironments[plaidEnvironment as keyof typeof PlaidEnvironments]
    : PlaidEnvironments.sandbox);

/**
 * Description placeholder
 *
 * @type {*}
 */
const configuration = new Configuration({
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
      "PLAID-SECRET": env.PLAID_SECRET,
    },
  },
  basePath,
});

/**
 * Description placeholder
 *
 * @type {*}
 */
export const plaidClient = new PlaidApi(configuration);
