import { test as base, type BrowserContext, type Page } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

/**
 * Path to store the authenticated session state
 * This file is created after the first login and reused for subsequent tests
 */
const STORAGE_STATE_PATH = path.join(
  process.cwd(),
  ".playwright",
  "auth-state.json"
);

/**
 * Session reuse fixtures for faster test execution
 * Reuses authenticated session across tests instead of logging in each time
 */
export interface SessionReuseFixtures {
  /** Page with pre-authenticated session (faster - no login needed) */
  fastAuthenticatedPage: Page;
  /** Context with pre-authenticated session */
  fastAuthenticatedContext: BrowserContext;
}

/**
 * Ensure the storage state directory exists
 */
function ensureStorageDir(): void {
  const dir = path.dirname(STORAGE_STATE_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

/**
 * Check if a valid storage state file exists
 */
function hasStorageState(): boolean {
  try {
    return fs.existsSync(STORAGE_STATE_PATH) && fs.statSync(STORAGE_STATE_PATH).size > 0;
  } catch {
    return false;
  }
}

/**
 * Get the storage state file path
 */
export function getStorageStatePath(): string {
  return STORAGE_STATE_PATH;
}

/**
 * Create test with session reuse capability
 * 
 * Usage:
 *   import { test, expect } from './fixtures/session-reuse';
 *   
 *   // Use fastAuthenticatedPage to skip login (saves 5-10 seconds per test)
 *   test('my test', async ({ fastAuthenticatedPage }) => {
 *     await fastAuthenticatedPage.goto('/dashboard');
 *   });
 * 
 * To create the initial auth state, run:
 *   npx playwright test --project=chromium --grep="create.*auth.*state" --update-snapshots
 * 
 * Or manually:
 *   1. Run tests normally once to create the storage state
 *   2. The state is cached in .playwright/auth-state.json
 */
export const test = base.extend<SessionReuseFixtures>({
  fastAuthenticatedContext: async ({ browser }, use) => {
    ensureStorageDir();

    let context: BrowserContext;

    if (hasStorageState()) {
      // Reuse existing authenticated session
      context = await browser.newContext({
        storageState: STORAGE_STATE_PATH,
      });
    } else {
      // No storage state - create new context (tests will need to login)
      // This is expected on first run - create auth state by running a login test
      context = await browser.newContext();
    }

    await use(context);
    await context.close();
  },

  fastAuthenticatedPage: async ({ fastAuthenticatedContext }, use) => {
    const page = await fastAuthenticatedContext.newPage();
    await use(page);
    await page.close();
  },
});

export { expect } from "@playwright/test";

/**
 * Create a function to save the current authenticated session
 * Call this after a successful login to cache the session for future tests
 * 
 * Usage in a test:
 *   test('create auth state', async ({ page }) => {
 *     await page.goto('/sign-in');
 *     await page.fill('[name=email]', 'seed-user@example.com');
 *     await page.fill('[name=password]', 'password123');
 *     await page.click('button[type=submit]');
 *     await page.waitForURL('/dashboard');
 *     
 *     // Save the authenticated session
 *     await saveAuthState(page.context());
 *   });
 */
export async function saveAuthState(context: BrowserContext): Promise<void> {
  ensureStorageDir();
  const storageState = await context.storageState();
  fs.writeFileSync(STORAGE_STATE_PATH, JSON.stringify(storageState, null, 2));
  console.log(`[session-reuse] Auth state saved to: ${STORAGE_STATE_PATH}`);
}

/**
 * Clear the cached auth state (useful for testing logout scenarios)
 */
export function clearAuthState(): void {
  if (hasStorageState()) {
    fs.unlinkSync(STORAGE_STATE_PATH);
    console.log(`[session-reuse] Auth state cleared`);
  }
}

/**
 * Check if auth state exists
 */
export function hasAuthState(): boolean {
  return hasStorageState();
}