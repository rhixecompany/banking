import { http, HttpResponse } from "msw";
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
  http.post(`${PLAID_BASE}/link/token/create`, () =>
    HttpResponse.json(
      {
        expiration: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        link_token: "link-sandbox-123",
        request_id: "req-link-1",
      },
      { status: 200 },
    ),
  ),

  // Plaid: exchange public token
  http.post(`${PLAID_BASE}/item/public_token/exchange`, () =>
    HttpResponse.json(
      {
        access_token: "access-sandbox-123",
        item_id: "item-sandbox-123",
        request_id: "req-exchange-1",
      },
      { status: 200 },
    ),
  ),

  // Plaid: accounts/get
  http.post(`${PLAID_BASE}/accounts/get`, () =>
    HttpResponse.json(
      {
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
      },
      { status: 200 },
    ),
  ),

  // Plaid: transactions/get
  http.post(`${PLAID_BASE}/transactions/get`, () => {
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

    return HttpResponse.json(
      {
        added: txns,
        request_id: "req-tx-1",
        total_transactions: txns.length,
      },
      { status: 200 },
    );
  }),

  // Plaid: accounts/balance/get
  http.post(`${PLAID_BASE}/accounts/balance/get`, () =>
    HttpResponse.json(
      {
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
      },
      { status: 200 },
    ),
  ),

  // Plaid: institutions/get_by_id
  http.post(`${PLAID_BASE}/institutions/get_by_id`, () =>
    HttpResponse.json(
      {
        institution: { institution_id: "ins_123", name: "Mock Bank" },
        request_id: "req-inst-1",
      },
      { status: 200 },
    ),
  ),

  // Dwolla: create customer
  http.post(`${DWOLLA_BASE}/customers`, () => {
    const location = `${DWOLLA_BASE}/customers/cust-123`;
    return new HttpResponse(null, { status: 201, headers: { location } });
  }),

  // Dwolla: create funding source for customer
  http.post(`${DWOLLA_BASE}/customers/:id/funding-sources`, ({ params }) => {
    const id = params.id;
    const location = `${DWOLLA_BASE}/funding-sources/fs-${id}-1`;
    return new HttpResponse(null, { status: 201, headers: { location } });
  }),

  // Dwolla: create transfer
  http.post(`${DWOLLA_BASE}/transfers`, () => {
    const location = `${DWOLLA_BASE}/transfers/transfer-123`;
    return new HttpResponse(null, { status: 201, headers: { location } });
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
