import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

import { env } from "@/lib/env";

/**
 * Description placeholder
 *
 * @type {*}
 */
const plaidEnvironment = env.PLAID_ENV ?? "sandbox";
const hasPlaidEnv = Object.prototype.hasOwnProperty.call(
  PlaidEnvironments,
  plaidEnvironment,
);
const basePath =
  env.PLAID_BASE_URL ??
  (hasPlaidEnv
    ? PlaidEnvironments[plaidEnvironment as keyof typeof PlaidEnvironments]
    : PlaidEnvironments.sandbox);

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
