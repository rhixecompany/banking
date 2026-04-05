import { plaidClient } from "@/lib/plaid";

async function createPlaidTokens(): Promise<void> {
  console.log("============================================================");
  console.log("Plaid Sandbox Token Generator");
  console.log("============================================================");

  const env = process.env.PLAID_ENV;

  console.log(`PLAID_ENV: ${env}`);
  console.log("============================================================\n");

  try {
    console.log("Step 1: Creating sandbox public token...");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const publicTokenResponse = await plaidClient.sandboxPublicTokenCreate({
      institution_id: "ins_3",
      initial_products: ["auth", "transactions"] as any,
    });

    const publicToken = publicTokenResponse.data.public_token;
    console.log(`  ✓ Public token created: ${publicToken}`);

    console.log("\nStep 2: Exchanging for access token...");

    const accessTokenResponse = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = accessTokenResponse.data.access_token;
    const itemId = accessTokenResponse.data.item_id;

    console.log(`  ✓ Access token: ${accessToken}`);
    console.log(`  ✓ Item ID: ${itemId}`);

    console.log(
      "\n============================================================",
    );
    console.log("SUCCESS! Use these tokens in your seed data:");
    console.log("============================================================");
    console.log(`\nACCESS_TOKEN=${accessToken}`);
    console.log(`ITEM_ID=${itemId}`);
    console.log("\nOr add to scripts/seed/seed-config.ts:");
    console.log(`
export const SEED_CONFIG = {
  accessToken: "${accessToken}",
  itemId: "${itemId}",
};
`);

    const fs = await import("fs");
    const path = await import("path");

    const configPath = path.resolve(
      process.cwd(),
      "scripts/seed/seed-config.ts",
    );

    const configContent = `
/**
 * Seed configuration for E2E tests
 * Generated tokens from Plaid Sandbox
 */

export const SEED_CONFIG = {
  /** Plaid access token for sandbox testing */
  accessToken: "${accessToken}",
  /** Plaid item ID */
  itemId: "${itemId}",
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
`;

    fs.writeFileSync(configPath, configContent);
    console.log(`\n✓ Updated ${configPath}`);
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

createPlaidTokens();
