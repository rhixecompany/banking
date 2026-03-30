import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

import { env } from "@/lib/env";

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
