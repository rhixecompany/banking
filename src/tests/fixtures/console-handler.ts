import { test as base, type BrowserContext, type Page } from "@playwright/test";
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
  type: "debug" | "error" | "info" | "log" | "warning";
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
function saveConsoleErrorsToFile(
  errors: BrowserConsoleError[],
  testName: string,
): void {
  ensureConsoleLogDir();
  const sanitizedName = testName.replaceAll(/[^a-z0-9]/gi, "_").slice(0, 50);
  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-");
  const filename = path.join(
    CONSOLE_LOG_DIR,
    `${sanitizedName}_${timestamp}.json`,
  );

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

    consoleMessages: async ({ page }, use) => {
      const messages: ConsoleMessage[] = [];
      const now = Date.now();
      page.on("console", (msg) => {
        const location = msg.location();
        messages.push({
          location: location.url
            ? {
                column: location.columnNumber,
                line: location.lineNumber,
                url: location.url,
              }
            : undefined,
          text: msg.text(),
          timestamp: now,
          type: msg.type() as ConsoleMessage["type"],
        });
      });
      page.on("pageerror", (err) => {
        messages.push({
          text: err.message,
          timestamp: now,
          type: "error",
        });
      });
      await use(messages);
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

    detailedConsoleErrors: async ({ page }, use) => {
      const errors: BrowserConsoleError[] = [];
      const browserName =
        page.context().browser()?.browserType().name() || "unknown";
      const contextId = `context-${Date.now()}`;

      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const location = msg.location();
          errors.push({
            browser: browserName,
            context: contextId,
            message: msg.text(),
            page: page.url(),
            stack: location.url
              ? `at ${location.url}:${location.lineNumber}:${location.columnNumber}`
              : undefined,
            timestamp: Date.now(),
          });
        }
      });
      page.on("pageerror", (err: Error) => {
        errors.push({
          browser: browserName,
          context: contextId,
          message: err.message,
          page: page.url(),
          stack: err.stack,
          timestamp: Date.now(),
        });
      });

      await use(errors);
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
          `Unexpected console errors detected:\n${unexpectedErrors.map((e) => `  - ${e}`).join("\n")}`,
        );
      }
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
      `Unexpected console errors detected:\n${unexpected.map((e) => `  - ${e}`).join("\n")}`,
    );
  }
}

export default test;
