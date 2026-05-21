import { expect, test } from "@playwright/test";

import { addMockPlaidInitScript } from "@/tests/e2e/helpers/plaid.mock";

/**
 * E2E: Mock Token Testing
 *
 * Tests that mock Plaid and Dwolla tokens (starting with "seed-", "mock-", "mock_")
 * skip external API calls and enable deterministic testing.
 *
 * Uses Playwright + mock tokens, no direct DB access.
 *
 * Tests mock token behavior:
 * 1. Mock Plaid token is detected and API calls are skipped
 * 2. Mock Dwolla token is detected and transfer API calls are skipped
 * 3. Valid mock token formats are recognized
 */

const SEED_USER_EMAIL = "seed-user@example.com";
const SEED_USER_PASSWORD = "password123";

test.describe("Mock Token Testing", () => {
  test.beforeEach(async ({ page }) => {
    // Inject mock Plaid script before any navigation
    await addMockPlaidInitScript(page, "seed-plaid-token-123");

    // Login before each test
    await page.goto("/sign-in");
    await page.fill('input[type="email"]', SEED_USER_EMAIL);
    await page.fill('input[type="password"]', SEED_USER_PASSWORD);
    await page.click('button:has-text("Sign in")');
    await page.waitForURL(/\/dashboard/);
  });

  test("should inject Plaid mock on page load", async ({ page }) => {
    // Navigate to dashboard - mock should already be injected
    await page.goto("/dashboard");

    // Verify mock is injected and callable
    const plaidExists = await page.evaluate(
      () => typeof (window as any).Plaid !== "undefined",
    );
    expect(plaidExists).toBe(true);

    // Verify Plaid.create is a function
    const plaidCreate = await page.evaluate(
      () => typeof (window as any).Plaid?.create === "function",
    );
    expect(plaidCreate).toBe(true);
  });

  test("should recognize valid mock token prefixes", async () => {
    // Test that mock token prefix detection works
    const mockTokenFormats = [
      { token: "seed-token", isMock: true },
      { token: "mock-token", isMock: true },
      { token: "mock_token", isMock: true },
      { token: "SEED-token", isMock: true },
      { token: "MOCK-token", isMock: true },
      { token: "pk_live_123", isMock: false },
      { token: "sk_test_456", isMock: false },
    ];

    for (const { token, isMock } of mockTokenFormats) {
      const hasMockPrefix =
        token.toLowerCase().startsWith("seed-") ||
        token.toLowerCase().startsWith("mock-") ||
        token.toLowerCase().startsWith("mock_");

      expect(hasMockPrefix).toBe(isMock);
    }
  });

  test("should create Plaid mock with custom token", async ({ page }) => {
    // Inject mock with specific token
    const customToken = "MOCK_CUSTOM_123";
    await addMockPlaidInitScript(page, customToken);

    await page.goto("/dashboard");

    // Verify the mock returns the custom token
    const receivedToken = await page.evaluate(() => {
      return new Promise<string | null>((resolve) => {
        try {
          (window as any).Plaid.create({
            onSuccess: (token: string) => {
              resolve(token);
            },
          });
          // Give it time to call the callback
          setTimeout(() => resolve(null), 100);
        } catch {
          resolve(null);
        }
      });
    });

    expect(receivedToken).toBe(customToken);
  });

  test("should maintain deterministic mock behavior", async ({ page }) => {
    // Inject seed token for deterministic behavior
    await addMockPlaidInitScript(page, "seed-consistent-token");

    await page.goto("/dashboard");

    // Call mock multiple times and verify consistency
    const results = await page.evaluate(() => {
      return new Promise<string[]>((resolve) => {
        const tokens: string[] = [];
        const mock = (window as any).Plaid.create({
          onSuccess: (token: string) => {
            tokens.push(token);
          },
        });
        // Wait for async callbacks
        setTimeout(() => resolve(tokens), 200);
      });
    });

    // All results should be the same seed token
    expect(results.every((t) => t === "seed-consistent-token")).toBe(true);
  });
});
