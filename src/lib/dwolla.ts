import { Client } from "dwolla-v2";

import { env } from "@/lib/env";

/**
 * Description placeholder
 *
 * @export
 * @typedef {DwollaEnvironment}
 */
export type DwollaEnvironment = "production" | "sandbox";

/**
 * Description placeholder
 *
 * @returns {DwollaEnvironment}
 */
const resolveDwollaEnvironment = (): DwollaEnvironment => {
  const value = env.DWOLLA_ENV ?? "sandbox";
  return value === "production" ? "production" : "sandbox";
};

/**
 * Description placeholder
 *
 * @param {DwollaEnvironment} environment
 * @returns {string}
 */
const resolveDwollaBaseUrl = (environment: DwollaEnvironment): string => {
  return (
    env.DWOLLA_BASE_URL ??
    (environment === "production"
      ? "https://api.dwolla.com"
      : "https://api-sandbox.dwolla.com")
  );
};

/**
 * Description placeholder
 *
 * @type {{ baseUrl: string; environment: DwollaEnvironment; }}
 */
export const dwollaConfig = (() => {
  const environment = resolveDwollaEnvironment();
  const baseUrl = resolveDwollaBaseUrl(environment);
  return { baseUrl, environment };
})();

/**
 * Description placeholder
 *
 * @returns {Client}
 */
export const getDwollaClient = (): Client => {
  if (!env.DWOLLA_KEY || !env.DWOLLA_SECRET) {
    throw new Error("DWOLLA_KEY and DWOLLA_SECRET are required");
  }

  return new Client({
    environment: dwollaConfig.environment,
    key: env.DWOLLA_KEY,
    secret: env.DWOLLA_SECRET,
  });
};
