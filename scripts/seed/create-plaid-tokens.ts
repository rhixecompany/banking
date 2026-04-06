/* eslint-disable no-secrets/no-secrets */
import type { Products } from "plaid";

import { plaidClient } from "@/lib/plaid";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {Promise<void>}
 */
async function createPlaidTokens(): Promise<void> {
  console.warn("============================================================");
  console.warn("Plaid Sandbox Token Generator");
  console.warn("============================================================");

  const env = process.env.PLAID_ENV;

  console.warn(`PLAID_ENV: ${env}`);
  console.warn(
    "============================================================\n",
  );

  try {
    console.warn("Step 1: Creating sandbox public token...");

    const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate({
      initial_products: ["auth", "transactions"] as Products[],
      institution_id: "ins_3",
    });

    const publicToken = publicTokenResponse.data.public_token;
    console.warn(`  Public token created: ${publicToken}`);

    console.warn("\nStep 2: Exchanging for access token...");

    const accessTokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = accessTokenResponse.data.access_token;
    const itemId = accessTokenResponse.data.item_id;

    console.warn(`  Access token: ${accessToken}`);
    console.warn(`  Item ID: ${itemId}`);

    console.warn(
      "\n============================================================",
    );
    console.warn("SUCCESS! Use these tokens in your environment:");
    console.warn(
      "============================================================",
    );
    console.warn(`\nPLAID_SANDBOX_ACCESS_TOKEN=${accessToken}`);
    console.warn(`PLAID_SANDBOX_ITEM_ID=${itemId}`);
    console.warn("\nOr add to .env.local:");
    console.warn(`
PLAID_SANDBOX_ACCESS_TOKEN=${accessToken}
PLAID_SANDBOX_ITEM_ID=${itemId}
`);

    const fs = await import("fs");
    const path = await import("path");

    const configPath = path.resolve(
      process.cwd(),
      "scripts/seed/seed-config.ts",
    );

    const configContent = `
/* eslint-disable no-secrets/no-secrets */
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
`;

    fs.writeFileSync(configPath, configContent);
    console.warn(`\nUpdated ${configPath}`);
  } catch (error) {
    console.error(
      "\n============================================================",
    );
    console.error("Error creating sandbox tokens:");
    console.error(
      "============================================================",
    );
    if (error instanceof Error) {
      console.error(`Error message: ${error.message}`);
      if (error.message.includes("400")) {
        console.error("\nPossible causes:");
        console.error("- The sandbox environment may need to be reset");
        console.error("- Check your Plaid dashboard for issues");
      }
    }
    console.error("\nTroubleshooting:");
    console.error("1. Verify PLAID_CLIENT_ID and PLAID_SECRET in .env.local");
    console.error("2. Ensure you're using a sandbox environment");
    console.error("3. Check that your Plaid sandbox application is active");
    console.error("4. Check https://plaid.com/docs/sandbox/test-credentials/");
    process.exit(1);
  }
}

void createPlaidTokens();
