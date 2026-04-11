"use server";

import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { z } from "zod";

import type { Account } from "@/types";
import type { PlaidBalance, PlaidTransaction } from "@/types/plaid";
import type { Wallet, WalletWithDetails } from "@/types/wallet";

import { walletsDal } from "@/dal";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { isMockAccessToken, plaidClient } from "@/lib/plaid";

/**
 * Zod schema for validating the input to {@link createLinkToken}.
 * Requires a non-empty user ID string.
 *
 * @type {*}
 */
const CreateLinkTokenSchema = z.object({
  userId: z
    .string()
    .trim()
    .min(1, "User ID is required")
    .meta({ description: "User ID for Plaid Link" }),
});

/**
 * Zod schema for validating the input to {@link exchangePublicToken}.
 * Requires a non-empty Plaid public token and the user ID.
 *
 * @type {*}
 */
const ExchangePublicTokenSchema = z.object({
  publicToken: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to {@link getAccounts}.
 * Requires a non-empty wallet record ID.
 *
 * @type {*}
 */
const GetAccountsSchema = z.object({
  walletId: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to {@link getTransactions}.
 * Requires a wallet ID, ISO date strings for start/end, and optional count/offset.
 *
 * @type {*}
 */
const GetTransactionsSchema = z.object({
  count: z.number().min(1).max(500).optional(),
  endDate: z.string().trim().min(1),
  offset: z.number().min(0).optional(),
  startDate: z.string().trim().min(1),
  walletId: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to {@link getBalance}.
 * Requires a non-empty wallet record ID.
 *
 * @type {*}
 */
const GetBalanceSchema = z.object({
  walletId: z.string().trim().min(1),
});

/**
 * Zod schema for validating the input to a single-wallet account refresh.
 * Requires a non-empty wallet record ID.
 *
 * @type {*}
 */
const RefreshAccountsSchema = z.object({
  walletId: z.string().trim().min(1),
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
    // Defensive: ensure errors are logged and return a stable error shape so
    // callers do not throw. This reduces the chance of uncaught exceptions
    // propagating to the dev server during Playwright runs.
    logger.error("Plaid createLinkToken error:", error);
    return { error: "Failed to create link token", ok: false };
  }
}

/**
 * Exchanges a Plaid public token for a permanent access token, stores the
 * linked wallet record in the database, and revalidates the dashboard and
 * my-wallets pages.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{ ok: boolean; wallet?: Wallet; error?: string }>}
 */
export async function exchangePublicToken(
  input: unknown,
): Promise<{ ok: boolean; wallet?: Wallet; error?: string }> {
  const parsed = ExchangePublicTokenSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { publicToken } = parsed.data;

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
        logger.warn("Could not fetch institution name");
      }
    }

    const sharableId = `wallet_${crypto.randomUUID().slice(0, 16)}`;

    const wallet = await walletsDal.createWallet({
      accessToken,
      accountId: account?.account_id,
      accountSubtype: account?.subtype ?? undefined,
      accountType: account?.type ?? undefined,
      institutionId: institutionId ?? undefined,
      institutionName,
      sharableId,
      userId: session.user.id,
    });

    revalidatePath("/my-wallets");
    revalidatePath("/dashboard");
    revalidateTag("balances", "minutes");
    updateTag("balances");
    return { ok: true, wallet };
  } catch (error) {
    // Defensive: log and return a stable error so server-render paths don't
    // throw uncaught exceptions during E2E runs.
    logger.error("Plaid exchangePublicToken error:", error);
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
 *   accounts?: Account[];
 *   error?: string;
 * }>}
 */
export async function getAccounts(input: unknown): Promise<{
  ok: boolean;
  accounts?: Account[];
  error?: string;
}> {
  const parsed = GetAccountsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { walletId } = parsed.data;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", ok: false };
    }

    const wallet = await walletsDal.findById(walletId);
    if (!wallet) {
      return { error: "Wallet not found", ok: false };
    }
    if (wallet.userId !== session.user.id) {
      return { error: "Forbidden", ok: false };
    }

    const response = await plaidClient.accountsGet({
      access_token: wallet.accessToken,
    });

    const accounts: Account[] = response.data.accounts.map((account) => ({
      availableBalance: account.balances.available ?? 0,
      currentBalance: account.balances.current ?? 0,
      id: account.account_id,
      institutionId: response.data.item.institution_id ?? undefined,
      mask: account.mask ?? undefined,
      name: account.name,
      officialName: account.official_name ?? undefined,
      sharableId: wallet.sharableId ?? undefined,
      subtype: account.subtype ?? undefined,
      type: account.type,
    }));

    return { accounts, ok: true };
  } catch (error) {
    logger.error("Plaid getAccounts error:", error);
    return { error: "Failed to get accounts", ok: false };
  }
}

/**
 * Retrieves paginated Plaid transactions for a single linked wallet record
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

  const { count = 100, endDate, offset = 0, startDate, walletId } = parsed.data;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", ok: false };
    }

    const wallet = await walletsDal.findById(walletId);
    if (!wallet) {
      return { error: "Wallet not found", ok: false };
    }
    if (wallet.userId !== session.user.id) {
      return { error: "Forbidden", ok: false };
    }

    const request = {
      access_token: wallet.accessToken,
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
    logger.error("Plaid getTransactions error:", error);
    return { error: "Failed to get transactions", ok: false };
  }
}

/**
 * Retrieves real-time account balances for a single linked wallet record
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

  const { walletId } = parsed.data;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", ok: false };
    }

    const wallet = await walletsDal.findById(walletId);
    if (!wallet) {
      return { error: "Wallet not found", ok: false };
    }
    if (wallet.userId !== session.user.id) {
      return { error: "Forbidden", ok: false };
    }

    const response = await plaidClient.accountsBalanceGet({
      access_token: wallet.accessToken,
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
    logger.error("Plaid getBalance error:", error);
    return { error: "Failed to get balance", ok: false };
  }
}

/**
 * Retrieves real-time account balances for all linked wallet records belonging
 * to the authenticated user. Each wallet is queried in parallel; wallets that
 * fail are returned as empty arrays (graceful degradation).
 *
 * Results are cached with a "minutes" lifetime and tagged "balances" so
 * they can be invalidated after wallet link/unlink operations.
 *
 * @export
 * @async
 * @returns {Promise<{
 *   ok: boolean;
 *   balances?: Record<string, PlaidBalance[]>;
 *   error?: string;
 * }>}
 */
export async function getAllBalances(userId: string): Promise<{
  ok: boolean;
  balances?: Record<string, PlaidBalance[]>;
  error?: string;
}> {
  try {
    const wallets = await walletsDal.findByUserId(userId);

    const entries = await Promise.all(
      wallets.map(async (wallet): Promise<[string, PlaidBalance[]]> => {
        try {
          // Silently skip wallets with empty or mock tokens
          if (
            !wallet.accessToken ||
            wallet.accessToken.trim() === "" ||
            isMockAccessToken(wallet.accessToken)
          ) {
            return [wallet.id, []];
          }

          const response = await plaidClient.accountsBalanceGet({
            access_token: wallet.accessToken,
          });
          return [
            wallet.id,
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
          logger.error(`Failed to get balance for wallet ${wallet.id}:`, error);
          return [wallet.id, []];
        }
      }),
    );

    return { balances: Object.fromEntries(entries), ok: true };
  } catch (error) {
    logger.error("Plaid getAllBalances error:", error);
    return { error: "Failed to get balances", ok: false };
  }
}

/**
 * Fetches all Plaid accounts for the authenticated user across all linked wallets.
 * Maps raw Plaid AccountBase objects to the typed Account interface.
 * Wallets that fail to fetch are skipped with a warning (graceful degradation).
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
    const wallets = await walletsDal.findByUserId(session.user.id);

    const accountArrays = await Promise.all(
      wallets.map(async (wallet): Promise<Account[]> => {
        try {
          // Skip wallets with empty or missing access tokens
          // Silently skip - these are expected in E2E test environments
          if (!wallet.accessToken || wallet.accessToken.trim() === "") {
            return [];
          }

          // Check if this is a mock/seed token and skip gracefully
          // Silently skip - these are expected in E2E test environments
          if (isMockAccessToken(wallet.accessToken)) {
            return [];
          }

          const response = await plaidClient.accountsGet({
            access_token: wallet.accessToken,
          });
          return response.data.accounts.map((account) => ({
            availableBalance: account.balances.available ?? 0,
            currentBalance: account.balances.current ?? 0,
            id: account.account_id,
            institutionId: wallet.institutionId ?? undefined,
            mask: account.mask ?? undefined,
            name: account.name,
            officialName: account.official_name ?? undefined,
            sharableId: wallet.sharableId,
            subtype: account.subtype ?? undefined,
            type: account.type,
          }));
        } catch (err) {
          // Check for specific Plaid error types and handle gracefully
          const errorMessage = err instanceof Error ? err.message : String(err);
          const isInvalidToken =
            errorMessage.includes("INVALID_ACCESS_TOKEN") ||
            errorMessage.includes("ITEM_LOGIN_REQUIRED") ||
            errorMessage.includes("ITEM_EXPIRED") ||
            errorMessage.includes("access_token") ||
            errorMessage.includes("non-empty");

          if (isInvalidToken) {
            // Silently skip wallets with invalid/expired tokens
            return [];
          }

          // Log other unexpected errors
          logger.warn(`getAllAccounts: skipping wallet ${wallet.id}:`, err);
          return [];
        }
      }),
    );

    return { accounts: accountArrays.flat(), ok: true };
  } catch (error) {
    logger.error("Plaid getAllAccounts error:", error);
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
    logger.error("Plaid getInstitution error:", error);
    return { error: "Failed to get institution", ok: false };
  }
}

/**
 * Zod schema for validating the input to {@link getWalletWithDetails}.
 * Requires a non-empty wallet record ID.
 *
 * @type {*}
 */
const GetWalletWithDetailsSchema = z.object({
  walletId: z.string().trim().min(1),
});

/**
 * Fetches both real-time balances and recent transactions (last 30 days,
 * up to 10) for a single linked wallet record in a single parallel call.
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
export async function getWalletWithDetails(input: unknown): Promise<{
  ok: boolean;
  balances?: unknown[];
  transactions?: unknown[];
  error?: string;
}> {
  const parsed = GetWalletWithDetailsSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { walletId } = parsed.data;

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized", ok: false };
    }

    const wallet = await walletsDal.findById(walletId);
    if (!wallet) {
      return { error: "Wallet not found", ok: false };
    }
    if (wallet.userId !== session.user.id) {
      return { error: "Forbidden", ok: false };
    }

    // Fetch balance and transactions in parallel for a single wallet
    const [balancesResult, transactionsResult] = await Promise.all([
      getBalance({ walletId }),
      getTransactions({
        count: 10,
        endDate: new Date().toISOString().split("T")[0],
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        walletId,
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
    logger.error("Plaid getWalletWithDetails error:", error);
    return { error: "Failed to get wallet details", ok: false };
  }
}

/**
 * Fetches all linked wallets for the authenticated user along with their
 * balances and recent transactions in a batched fashion. Uses the cached
 * `getAllBalances` for balance data and fetches transactions in parallel.
 *
 * This avoids the N+1 pattern of calling `getWalletWithDetails` per wallet.
 *
 * @export
 * @async
 * @returns {Promise<{
 *   ok: boolean;
 *   walletsWithDetails?: WalletWithDetails[];
 *   totalBalance?: number;
 *   error?: string;
 * }>}
 */
export async function getAllWalletsWithDetails(): Promise<{
  ok: boolean;
  walletsWithDetails?: WalletWithDetails[];
  totalBalance?: number;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated", ok: false };
  }

  try {
    const wallets = await walletsDal.findByUserId(session.user.id);

    if (wallets.length === 0) {
      return { ok: true, totalBalance: 0, walletsWithDetails: [] };
    }

    const balancesResult = await getAllBalances(session.user.id);
    const allBalances = balancesResult.ok
      ? (balancesResult.balances ?? {})
      : {};

    const transactionsByWallet = await Promise.all(
      wallets.map(async (wallet): Promise<[string, PlaidTransaction[]]> => {
        try {
          if (
            !wallet.accessToken ||
            wallet.accessToken.trim() === "" ||
            isMockAccessToken(wallet.accessToken)
          ) {
            return [wallet.id, []];
          }

          const txResult = await getTransactions({
            count: 10,
            endDate: new Date().toISOString().split("T")[0],
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0],
            walletId: wallet.id,
          });

          return [
            wallet.id,
            txResult.ok
              ? ((txResult.transactions as PlaidTransaction[]) ?? [])
              : [],
          ];
        } catch (error) {
          logger.error(
            `Failed to get transactions for wallet ${wallet.id}:`,
            error,
          );
          return [wallet.id, []];
        }
      }),
    );

    const allTransactions = Object.fromEntries(transactionsByWallet);

    const walletsWithDetails: WalletWithDetails[] = wallets.map((wallet) => ({
      ...wallet,
      balances: (allBalances[wallet.id] as PlaidBalance[]) ?? [],
      transactions: allTransactions[wallet.id] ?? [],
    }));

    const totalBalance = walletsWithDetails.reduce((sum, wallet) => {
      return sum + (wallet.balances[0]?.balances?.current ?? 0);
    }, 0);

    return { ok: true, totalBalance, walletsWithDetails };
  } catch (error) {
    logger.error("Plaid getAllWalletsWithDetails error:", error);
    return { error: "Failed to get wallet details", ok: false };
  }
}

/**
 * Zod schema for validating the input to {@link removeWallet}.
 * Requires a non-empty wallet record ID.
 *
 * @type {*}
 */
const RemoveWalletSchema = z.object({
  walletId: z.string().trim().min(1),
});

/**
 * Removes a linked wallet record owned by the authenticated user from the
 * database and revalidates the my-wallets page cache.
 *
 * @export
 * @async
 * @param {unknown} input
 * @returns {Promise<{
 *   ok: boolean;
 *   error?: string;
 * }>}
 */
export async function removeWallet(input: unknown): Promise<{
  ok: boolean;
  error?: string;
}> {
  const parsed = RemoveWalletSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid input", ok: false };
  }

  const { walletId } = parsed.data;

  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized", ok: false };
  }

  try {
    const wallet = await walletsDal.findById(walletId);
    if (!wallet) {
      return { error: "Wallet not found", ok: false };
    }
    if (wallet.userId !== session.user.id) {
      return { error: "Forbidden", ok: false };
    }

    await walletsDal.softDelete(walletId);
    revalidatePath("/my-wallets");
    revalidateTag("balances", "minutes");
    updateTag("balances");
    return { ok: true };
  } catch (error) {
    logger.error("Plaid removeWallet error:", error);
    return { error: "Failed to remove wallet", ok: false };
  }
}
