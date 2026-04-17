import { rest } from "msw";
import { setupServer } from "msw/node";

import { env } from "@/lib/env";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const PLAID_BASE = env.PLAID_BASE_URL ?? "https://sandbox.plaid.com";
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const DWOLLA_BASE = env.DWOLLA_BASE_URL ?? "https://api-sandbox.dwolla.com";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{}}
 */
const handlers = [
  // Plaid: create link token
  rest.post(`${PLAID_BASE}/link/token/create`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        link_token: "link-sandbox-123",
        request_id: "req-link-1",
      }),
    ),
  ),

  // Plaid: exchange public token
  rest.post(`${PLAID_BASE}/item/public_token/exchange`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        access_token: "access-sandbox-123",
        item_id: "item-sandbox-123",
        request_id: "req-exchange-1",
      }),
    ),
  ),

  // Plaid: accounts/get
  rest.post(`${PLAID_BASE}/accounts/get`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        accounts: [
          {
            account_id: "acc-1",
            balances: {
              available: 100.0,
              current: 120.0,
              iso_currency_code: "USD",
            },
            mask: "0000",
            name: "Mock Checking",
            official_name: "Mock Checking Account",
            subtype: "checking",
            type: "depository",
          },
        ],
        item: { institution_id: "ins_123" },
        request_id: "req-accounts-1",
      }),
    ),
  ),

  // Plaid: transactions/get
  rest.post(`${PLAID_BASE}/transactions/get`, (req, res, ctx) => {
    const txns = [
      {
        account_id: "acc-1",
        amount: 10.0,
        category: ["Food and Drink"],
        date: new Date().toISOString().split("T")[0],
        name: "Mock Transaction",
        payment_channel: "online",
        pending: false,
        transaction_id: "txn-1",
      },
    ];

    return res(
      ctx.status(200),
      ctx.json({
        added: txns,
        request_id: "req-tx-1",
        total_transactions: txns.length,
      }),
    );
  }),

  // Plaid: accounts/balance/get
  rest.post(`${PLAID_BASE}/accounts/balance/get`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        accounts: [
          {
            account_id: "acc-1",
            balances: {
              available: 100.0,
              current: 120.0,
              iso_currency_code: "USD",
            },
            mask: "0000",
            name: "Mock Checking",
            subtype: "checking",
            type: "depository",
          },
        ],
        request_id: "req-balance-1",
      }),
    ),
  ),

  // Plaid: institutions/get_by_id
  rest.post(`${PLAID_BASE}/institutions/get_by_id`, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        institution: { institution_id: "ins_123", name: "Mock Bank" },
        request_id: "req-inst-1",
      }),
    ),
  ),

  // Dwolla: create customer
  rest.post(`${DWOLLA_BASE}/customers`, (req, res, ctx) => {
    const location = `${DWOLLA_BASE}/customers/cust-123`;
    return res(ctx.status(201), ctx.set("location", location));
  }),

  // Dwolla: create funding source for customer
  rest.post(`${DWOLLA_BASE}/customers/:id/funding-sources`, (req, res, ctx) => {
    const { id } = (req.params as any) ?? {};
    const location = `${DWOLLA_BASE}/funding-sources/fs-${id}-1`;
    return res(ctx.status(201), ctx.set("location", location));
  }),

  // Dwolla: create transfer
  rest.post(`${DWOLLA_BASE}/transfers`, (req, res, ctx) => {
    const location = `${DWOLLA_BASE}/transfers/transfer-123`;
    return res(ctx.status(201), ctx.set("location", location));
  }),
];

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const server = setupServer(...handlers);

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 */
export function startMockServer(): void {
  const globalState = globalThis as {
    __MSW_NODE_SERVER_STARTED__?: boolean;
  } & typeof globalThis;

  // Prevent starting multiple times in a single Node process
  if (globalState.__MSW_NODE_SERVER_STARTED__) return;
  server.listen({ onUnhandledRequest: "warn" });
  globalState.__MSW_NODE_SERVER_STARTED__ = true;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 */
export function stopMockServer(): void {
  const globalState = globalThis as {
    __MSW_NODE_SERVER_STARTED__?: boolean;
  } & typeof globalThis;

  try {
    server.close();
    globalState.__MSW_NODE_SERVER_STARTED__ = false;
  } catch {
    return;
  }
}
