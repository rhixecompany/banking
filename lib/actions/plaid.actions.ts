"use server";

import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
  revalidatePath,
  revalidateTag,
  updateTag,
} from "next/cache";
import { z } from "zod";

import type { Account } from "@/types";
import type { Bank } from "@/types/bank";
import type { PlaidBalance } from "@/types/plaid";

import { auth } from "@/lib/auth";
import { bankDal } from "@/lib/dal";
import { plaidClient } from "@/lib/plaid";

/**
 * Zod schema for validating the input to {@link createLinkToken}.
 * Requires a non-empty user ID string.
 *
 * @type {*}
 */
const CreateLinkTokenSchema = z.object({
  userId: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to {@link exchangePublicToken}.
 * Requires a non-empty Plaid public token and the user ID.
 *
 * @type {*}
 */
const ExchangePublicTokenSchema = z.object({
  publicToken: z.string().trim().min(1),
  userId: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to {@link getAccounts}.
 * Requires a non-empty bank record ID.
 *
 * @type {*}
 */
const GetAccountsSchema = z.object({
  bankId: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to {@link getTransactions}.
 * Requires a bank ID, ISO date strings for start/end, and optional count/offset.
 *
 * @type {*}
 */
const GetTransactionsSchema = z.object({
  bankId: z.string().trim().min(1),
  count: z.number().min(1).max(500).optional(),
  endDate: z.string().trim().min(1),
  offset: z.number().min(0).optional(),
  startDate: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to {@link getBalance}.
 * Requires a non-empty bank record ID.
 *
 * @type {*}
 */
const GetBalanceSchema = z.object({
  bankId: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to a single-bank account refresh.
 * Requires a non-empty bank record ID.
 *
 * @type {*}
 */
const RefreshAccountsSchema = z.object({
  bankId: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to {@link getInstitution}.
 * Requires a non-empty Plaid institution ID string.
 *
 * @type {*}
 */
const GetInstitutionSchema = z.object({
  institutionId: z.string().trim().min(1),
});

/**
 * Creates a Plaid Link token for the given user, which is used to initialise
 * the Plaid Link UI in the browser.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{ ok: boolean; linkToken?: string; error?: string }>}
 */
export async function createLinkToken(
  input: unknown,
): Promise<{ ok: boolean; linkToken?: string; error?: string }> {
  const parsed = CreateLinkTokenSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { userId } = parsed.data;

  const request = {
    client_name: "Banking App",
    country_codes: ["US"] as unknown as Parameters<
      typeof plaidClient.linkTokenCreate
    >[0]["country_codes"],
    language: "en",
    products: ["auth", "transactions"] as unknown as Parameters<
      typeof plaidClient.linkTokenCreate
    >[0]["products"],
    user: { client_user_id: userId },
  };

  try {
    const response = await plaidClient.linkTokenCreate(request);
    return {
      linkToken: response.data.link_token,
      ok: true,
    };
  } catch (error) {
    console.error("Plaid createLinkToken error:", error);
    return { error: "Failed to create link token", ok: false };
  }
}

/**
 * Exchanges a Plaid public token for a permanent access token, stores the
 * linked bank record in the database, and revalidates the dashboard and
 * my-banks pages.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{ ok: boolean; bank?: Bank; error?: string }>}
 */
export async function exchangePublicToken(
  input: unknown,
): Promise<{ ok: boolean; bank?: Bank; error?: string }> {
  const parsed = ExchangePublicTokenSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { publicToken, userId } = parsed.data;

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", ok: false };
  }

  try {
    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    const accountResponse = await plaidClient.accountsGet({
      access_token: accessToken,
    });

    const account = accountResponse.data.accounts[0];
    const institutionId = accountResponse.data.item.institution_id;

    let institutionName = "Unknown Bank";
    if (institutionId) {
      try {
        const institutionResponse = await plaidClient.institutionsGetById({
          country_codes: ["US"] as unknown as Parameters<
            typeof plaidClient.institutionsGetById
          >[0]["country_codes"],
          institution_id: institutionId,
        });
        institutionName =
          institutionResponse.data.institution.name || "Unknown Bank";
      } catch {
        console.warn("Could not fetch institution name");
      }
    }

    const sharableId = `bank_${crypto.randomUUID().slice(0, 16)}`;

    const bank = await bankDal.createBank({
      accessToken,
      accountId: account?.account_id,
      accountSubtype: account?.subtype ?? undefined,
      accountType: account?.type ?? undefined,
      institutionId: institutionId ?? undefined,
      institutionName,
      sharableId,
      userId,
    });

    revalidatePath("/my-banks");
    revalidatePath("/dashboard");
    revalidateTag("balances", "max");
    updateTag("balances");
    return { bank, ok: true };
  } catch (error) {
    console.error("Plaid exchangePublicToken error:", error);
    return { error: "Failed to exchange public token", ok: false };
  }
}

/**
 * Retrieves all Plaid accounts for a single linked bank record.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   accounts?: unknown[];
 *   error?: string;
 * }>}
 */
export async function getAccounts(input: unknown): Promise<{
  ok: boolean;
  accounts?: unknown[];
  error?: string;
}> {
  const parsed = GetAccountsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { bankId } = parsed.data;

  try {
    const bank = await bankDal.findById(bankId);
    if (!bank) {
      return { error: "Bank not found", ok: false };
    }

    const response = await plaidClient.accountsGet({
      access_token: bank.accessToken,
    });

    return { accounts: response.data.accounts, ok: true };
  } catch (error) {
    console.error("Plaid getAccounts error:", error);
    return { error: "Failed to get accounts", ok: false };
  }
}

/**
 * Retrieves paginated Plaid transactions for a single linked bank record
 * within the given date range.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   transactions?: unknown[];
 *   totalTransactions?: number;
 *   error?: string;
 * }>}
 */
export async function getTransactions(input: unknown): Promise<{
  ok: boolean;
  transactions?: unknown[];
  totalTransactions?: number;
  error?: string;
}> {
  const parsed = GetTransactionsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { bankId, count = 100, endDate, offset = 0, startDate } = parsed.data;

  try {
    const bank = await bankDal.findById(bankId);
    if (!bank) {
      return { error: "Bank not found", ok: false };
    }

    const request = {
      access_token: bank.accessToken,
      end_date: endDate,
      options: {
        count,
        offset,
      },
      start_date: startDate,
    };

    const response = await plaidClient.transactionsGet(request);

    return {
      ok: true,
      totalTransactions: response.data.total_transactions,
      transactions: response.data.transactions,
    };
  } catch (error) {
    console.error("Plaid getTransactions error:", error);
    return { error: "Failed to get transactions", ok: false };
  }
}

/**
 * Retrieves real-time account balances for a single linked bank record
 * via the Plaid `/accounts/balance/get` endpoint.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   balances?: PlaidBalance[];
 *   error?: string;
 * }>}
 */
export async function getBalance(input: unknown): Promise<{
  ok: boolean;
  balances?: PlaidBalance[];
  error?: string;
}> {
  const parsed = GetBalanceSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { bankId } = parsed.data;

  try {
    const bank = await bankDal.findById(bankId);
    if (!bank) {
      return { error: "Bank not found", ok: false };
    }

    const response = await plaidClient.accountsBalanceGet({
      access_token: bank.accessToken,
    });

    const balances: PlaidBalance[] = response.data.accounts.map((account) => ({
      accountId: account.account_id,
      balances: {
        available: account.balances.available,
        current: account.balances.current,
        isoCurrencyCode: account.balances.iso_currency_code ?? null,
        limit: account.balances.limit,
      },
    }));

    return { balances, ok: true };
  } catch (error) {
    console.error("Plaid getBalance error:", error);
    return { error: "Failed to get balance", ok: false };
  }
}

/**
 * Retrieves real-time account balances for all linked bank records belonging
 * to the authenticated user. Each bank is queried in parallel; banks that
 * fail are returned as empty arrays (graceful degradation).
 *
 * Results are cached with a "minutes" lifetime and tagged "balances" so
 * they can be invalidated after bank link/unlink operations.
 *
 * @export
 * @async
 * @returns {Promise<{
 *   ok: boolean;
 *   balances?: Record<string, PlaidBalance[]>;
 *   error?: string;
 * }>}
 */
export async function getAllBalances(): Promise<{
  ok: boolean;
  balances?: Record<string, PlaidBalance[]>;
  error?: string;
}> {
  "use cache";
  cacheLife("minutes");
  cacheTag("balances");

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  try {
    const banks = await bankDal.findByUserId(session.user.id);

    const entries = await Promise.all(
      banks.map(async (bank): Promise<[string, PlaidBalance[]]> => {
        try {
          const response = await plaidClient.accountsBalanceGet({
            access_token: bank.accessToken,
          });
          return [
            bank.id,
            response.data.accounts.map((account) => ({
              accountId: account.account_id,
              balances: {
                available: account.balances.available,
                current: account.balances.current,
                isoCurrencyCode: account.balances.iso_currency_code ?? null,
                limit: account.balances.limit,
              },
            })),
          ];
        } catch (error) {
          console.error(`Failed to get balance for bank ${bank.id}:`, error);
          return [bank.id, []];
        }
      }),
    );

    return { balances: Object.fromEntries(entries), ok: true };
  } catch (error) {
    console.error("Plaid getAllBalances error:", error);
    return { error: "Failed to get balances", ok: false };
  }
}

/**
 * Fetches all Plaid accounts for the authenticated user across all linked banks.
 * Maps raw Plaid AccountBase objects to the typed Account interface.
 * Banks that fail to fetch are skipped with a warning (graceful degradation).
 *
 * @export
 * @async
 * @returns {Promise<{ ok: boolean; accounts?: Account[]; error?: string }>}
 */
export async function getAllAccounts(): Promise<{
  ok: boolean;
  accounts?: Account[];
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  try {
    const banks = await bankDal.findByUserId(session.user.id);

    const accountArrays = await Promise.all(
      banks.map(async (bank): Promise<Account[]> => {
        try {
          const response = await plaidClient.accountsGet({
            access_token: bank.accessToken,
          });
          return response.data.accounts.map((account) => ({
            availableBalance: account.balances.available ?? 0,
            currentBalance: account.balances.current ?? 0,
            id: account.account_id,
            institutionId: bank.institutionId ?? undefined,
            mask: account.mask ?? undefined,
            name: account.name,
            officialName: account.official_name ?? undefined,
            sharableId: bank.sharableId,
            subtype: account.subtype ?? undefined,
            type: account.type,
          }));
        } catch (err) {
          console.warn(`getAllAccounts: skipping bank ${bank.id}:`, err);
          return [];
        }
      }),
    );

    return { accounts: accountArrays.flat(), ok: true };
  } catch (error) {
    console.error("Plaid getAllAccounts error:", error);
    return { error: "Failed to get accounts", ok: false };
  }
}

/**
 * Retrieves Plaid institution metadata (name, logo, colours) for the given
 * Plaid institution ID.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   institution?: unknown;
 *   error?: string;
 * }>}
 */
export async function getInstitution(input: unknown): Promise<{
  ok: boolean;
  institution?: unknown;
  error?: string;
}> {
  const parsed = GetInstitutionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { institutionId } = parsed.data;

  try {
    const response = await plaidClient.institutionsGetById({
      country_codes: ["US"] as unknown as Parameters<
        typeof plaidClient.institutionsGetById
      >[0]["country_codes"],
      institution_id: institutionId,
    });

    return { institution: response.data.institution, ok: true };
  } catch (error) {
    console.error("Plaid getInstitution error:", error);
    return { error: "Failed to get institution", ok: false };
  }
}

/**
 * Zod schema for validating the input to {@link getBankWithDetails}.
 * Requires a non-empty bank record ID.
 *
 * @type {*}
 */
const GetBankWithDetailsSchema = z.object({
  bankId: z.string().trim().min(1),
});

/**
 * Fetches both real-time balances and recent transactions (last 30 days,
 * up to 10) for a single linked bank record in a single parallel call.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   balances?: unknown[];
 *   transactions?: unknown[];
 *   error?: string;
 * }>}
 */
export async function getBankWithDetails(input: unknown): Promise<{
  ok: boolean;
  balances?: unknown[];
  transactions?: unknown[];
  error?: string;
}> {
  const parsed = GetBankWithDetailsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { bankId } = parsed.data;

  try {
    const bank = await bankDal.findById(bankId);
    if (!bank) {
      return { error: "Bank not found", ok: false };
    }

    // Fetch balance and transactions in parallel for a single bank
    const [balancesResult, transactionsResult] = await Promise.all([
      getBalance({ bankId }),
      getTransactions({
        bankId,
        count: 10,
        endDate: new Date().toISOString().split("T")[0],
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      }),
    ]);

    const balances = balancesResult.ok ? (balancesResult.balances ?? []) : [];

    return {
      balances,
      ok: true,
      transactions: transactionsResult.ok
        ? transactionsResult.transactions
        : [],
    };
  } catch (error) {
    console.error("Plaid getBankWithDetails error:", error);
    return { error: "Failed to get bank details", ok: false };
  }
}

/**
 * Zod schema for validating the input to {@link removeBank}.
 * Requires a non-empty bank record ID.
 *
 * @type {*}
 */
const RemoveBankSchema = z.object({
  bankId: z.string().trim().min(1),
});

/**
 * Removes a linked bank record owned by the authenticated user from the
 * database and revalidates the my-banks page cache.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   error?: string;
 * }>}
 */
export async function removeBank(input: unknown): Promise<{
  ok: boolean;
  error?: string;
}> {
  const parsed = RemoveBankSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { bankId } = parsed.data;

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", ok: false };
  }

  try {
    const bank = await bankDal.findById(bankId);
    if (!bank) {
      return { error: "Bank not found", ok: false };
    }
    if (bank.userId !== session.user.id) {
      return { error: "Forbidden", ok: false };
    }

    await bankDal.delete(bankId);
    revalidatePath("/my-banks");
    revalidateTag("balances", "max");
    updateTag("balances");
    return { ok: true };
  } catch (error) {
    console.error("Plaid removeBank error:", error);
    return { error: "Failed to remove bank", ok: false };
  }
}
