import { test as base, type Page, type BrowserContext } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Regular expressions for expected/allowed console errors that shouldn't fail tests.
 * Add patterns here for known non-critical errors (favicon, third-party scripts, etc.)
 */
const ALLOWED_ERROR_PATTERNS = [
  /Failed to load resource.*favicon/,
  /Failed to load resource.*manifest\.json/i,
  /ResizeObserver loop limit exceeded/,
  /ResizeObserver loop detail/,
  /net::ERR_NAME_NOT_RESOLVED/,
  /net::ERR_CONNECTION_REFUSED/,
  /third-party cookie will be blocked/,
  /Failed to decode downloaded font/,
  /OTS parsing error/,
  /Unexpected token.*json/,
];

/**
 * Console message types to capture
 */
export interface ConsoleMessage {
  type: "log" | "info" | "warning" | "error" | "debug";
  text: string;
  location?: { url: string; line: number; column: number };
  timestamp?: number;
}

/**
 * Console error with browser metadata
 */
export interface BrowserConsoleError {
  message: string;
  browser: string;
  context: string;
  page: string;
  timestamp: number;
  stack?: string;
}

/**
 * Console handler fixtures for capturing and managing console errors
 */
export interface ConsoleHandlerFixtures {
  /** Array of console error messages captured during test */
  consoleErrors: string[];
  /** Array of console warning messages captured during test */
  consoleWarnings: string[];
  /** Array of all console messages */
  consoleMessages: ConsoleMessage[];
  /** Page with auto-fail on unexpected console errors enabled */
  failOnConsoleErrorPage: Page;
  /** Browser context with console error collection */
  consoleContext: BrowserContext;
  /** Full console error details with browser info */
  detailedConsoleErrors: BrowserConsoleError[];
}

/**
 * Directory for storing console error logs
 */
const CONSOLE_LOG_DIR = path.join(process.cwd(), ".playwright", "console-logs");

/**
 * Ensure console log directory exists
 */
function ensureConsoleLogDir(): void {
  if (!fs.existsSync(CONSOLE_LOG_DIR)) {
    fs.mkdirSync(CONSOLE_LOG_DIR, { recursive: true });
  }
}

/**
 * Save console errors to file for CI debugging
 */
function saveConsoleErrorsToFile(errors: BrowserConsoleError[], testName: string): void {
  ensureConsoleLogDir();
  const sanitizedName = testName.replace(/[^a-z0-9]/gi, "_").substring(0, 50);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = path.join(CONSOLE_LOG_DIR, `${sanitizedName}_${timestamp}.json`);

  fs.writeFileSync(filename, JSON.stringify(errors, null, 2));
  console.log(`[console-handler] Console errors saved to: ${filename}`);
}

/**
 * Check if an error message matches any allowed pattern
 */
function isAllowedError(errorText: string): boolean {
  return ALLOWED_ERROR_PATTERNS.some((pattern) => pattern.test(errorText));
}

/**
 * Filter out allowed errors from a list of error messages
 */
function filterAllowedErrors(errors: string[]): string[] {
  return errors.filter((error) => !isAllowedError(error));
}

/**
 * Create a console handler fixture that captures all console messages
 */
function createConsoleHandler() {
  return base.extend<ConsoleHandlerFixtures>({
    consoleErrors: async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });
      page.on("pageerror", (err) => {
        errors.push(err.message);
      });
      await use(errors);
    },

    consoleWarnings: async ({ page }, use) => {
      const warnings: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "warning") {
          warnings.push(msg.text());
        }
      });
      await use(warnings);
    },

    consoleMessages: async ({ page }, use) => {
      const messages: ConsoleMessage[] = [];
      const now = Date.now();
      page.on("console", (msg) => {
        const location = msg.location();
        messages.push({
          type: msg.type() as ConsoleMessage["type"],
          text: msg.text(),
          location: location.url
            ? { url: location.url, line: location.lineNumber, column: location.columnNumber }
            : undefined,
          timestamp: now,
        });
      });
      page.on("pageerror", (err) => {
        messages.push({
          type: "error",
          text: err.message,
          timestamp: now,
        });
      });
      await use(messages);
    },

    failOnConsoleErrorPage: async ({ page }, use) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(msg.text());
        }
      });
      page.on("pageerror", (err) => {
        errors.push(err.message);
      });

      await use(page);

      // After test completes, check for unexpected errors
      const unexpectedErrors = filterAllowedErrors(errors);
      if (unexpectedErrors.length > 0) {
        throw new Error(
          `Unexpected console errors detected:\n${unexpectedErrors.map((e) => `  - ${e}`).join("\n")}`
        );
      }
    },

    consoleContext: async ({ context }, use) => {
      // Attach console listeners to context for cross-browser tracking
      const errors: string[] = [];
      const browserName = context.browser()?.browserType().name() || "unknown";

      context.on("console", (msg) => {
        if (msg.type() === "error") {
          errors.push(`[${browserName}] ${msg.text()}`);
        }
      });

      await use(context);
    },

    detailedConsoleErrors: async ({ page }, use) => {
      const errors: BrowserConsoleError[] = [];
      const browserName = page.context().browser()?.browserType().name() || "unknown";
      const contextId = `context-${Date.now()}`;

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const location = msg.location();
          errors.push({
            message: msg.text(),
            browser: browserName,
            context: contextId,
            page: page.url(),
            timestamp: Date.now(),
            stack: location.url ? `at ${location.url}:${location.lineNumber}:${location.columnNumber}` : undefined,
          });
        }
      });
      page.on("pageerror", (err: Error) => {
        errors.push({
          message: err.message,
          browser: browserName,
          context: contextId,
          page: page.url(),
          timestamp: Date.now(),
          stack: err.stack,
        });
      });

      await use(errors);
    },
  });
}

/**
 * Pre-configured test with console error handling
 * Usage:
 *   import { test, expect } from './fixtures/console-handler';
 *
 *   // Option 1: Capture errors for manual assertion
 *   test('my test', async ({ consoleErrors }) => {
 *     await page.goto('/');
 *     expect(consoleErrors).toHaveLength(0);
 *   });
 *
 *   // Option 2: Auto-fail on unexpected errors
 *   test('my test', async ({ failOnConsoleErrorPage }) => {
 *     await failOnConsoleErrorPage.goto('/');
 *   });
 */
export const test = createConsoleHandler();
export { expect } from "@playwright/test";

/**
 * Helper function to assert no console errors in tests
 * Usage: expectNoConsoleErrors(consoleErrors);
 */
export function expectNoConsoleErrors(errors: string[]): void {
  const unexpected = filterAllowedErrors(errors);
  if (unexpected.length > 0) {
    throw new Error(
      `Unexpected console errors detected:\n${unexpected.map((e) => `  - ${e}`).join("\n")}`
    );
  }
}

export default test;