/**
 * Combined test utilities for E2E testing
 *
 * Provides unified utilities that combine:
 * - Console error handling (console-handler.ts)
 * - Coverage collection (coverage.ts)
 * - Performance monitoring (performance.ts)
 *
 * Usage:
 *   import { setupInstrumentedPage, getConsoleErrors } from './fixtures/combined';
 *
 *   test('user can login', async ({ page }) => {
 *     const { getConsoleErrors } = setupInstrumentedPage(page);
 *     await page.goto('/dashboard');
 *     const errors = getConsoleErrors();
 *     expect(errors).toHaveLength(0);
 *   });
 */

import { Page } from "@playwright/test";

import type { PerformanceThresholds } from "./performance";

import {
  assertPerformance,
  getResourceTiming,
  measureOperation,
  measurePerformance,
  PERFORMANCE_CONFIG,
} from "./performance";

/**
 * Console error tracking state
 */
class ConsoleErrorTracker {
  private errors: {
    message: string;
    page: string;
    timestamp: number;
    browser: string;
    context: string;
  }[] = [];

  private allowedPatterns: RegExp[] = [];

  init(page: Page, allowedErrors: RegExp[]): void {
    this.allowedPatterns = allowedErrors;
    this.errors = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text();
        const isAllowed = this.allowedPatterns.some((pattern: RegExp) =>
          pattern.test(text),
        );

        if (!isAllowed) {
          this.errors.push({
            browser: "chromium",
            context: "console",
            message: text,
            page: page.url(),
            timestamp: Date.now(),
          });
        }
      }
    });

    page.on("pageerror", (error) => {
      this.errors.push({
        browser: "chromium",
        context: "pageerror",
        message: error.message,
        page: page.url(),
        timestamp: Date.now(),
      });
    });
  }

  getErrors() {
    return [...this.errors];
  }

  clear(): void {
    this.errors = [];
  }
}

// Singleton tracker instance
let consoleTracker: ConsoleErrorTracker | null = null;

/**
 * Set up console error tracking on a page
 */
export function setupInstrumentedPage(
  page: Page,
  allowedErrors: RegExp[] = [
    /ResizeObserver/,
    /favicon\.ico/,
    /Failed to load resource/,
  ],
): {
  getConsoleErrors: () => {
    message: string;
    page: string;
    timestamp: number;
    browser: string;
    context: string;
  }[];
  clearConsoleErrors: () => void;
} {
  consoleTracker = new ConsoleErrorTracker();
  consoleTracker.init(page, allowedErrors);

  return {
    clearConsoleErrors: () => consoleTracker?.clear() ?? void 0,
    getConsoleErrors: () => consoleTracker?.getErrors() ?? [],
  };
}

/**
 * Get collected console errors
 */
export function getConsoleErrors(): {
  message: string;
  page: string;
  timestamp: number;
  browser: string;
  context: string;
}[] {
  return consoleTracker?.getErrors() ?? [];
}

/**
 * Clear console errors
 */
export function clearConsoleErrors(): void {
  consoleTracker?.clear();
}

// Coverage state
const coverageData: null | unknown[] = null;

/**
 * Start coverage collection on a page
 */
export async function startCoverageCollection(page: Page): Promise<void> {
  await page.coverage?.startJSCoverage();
}

/**
 * Stop coverage collection and return data
 */
export async function stopCoverageCollection(): Promise<unknown[]> {
  return coverageData ?? [];
}

/**
 * Get coverage data
 */
export function getCoverage(): null | unknown[] {
  return coverageData;
}

// Re-export performance utilities
export {
  assertPerformance,
  getResourceTiming,
  measureOperation,
  measurePerformance,
  PERFORMANCE_CONFIG,
};

export type { PerformanceThresholds };

/**
 * Full instrumentation setup
 */
export async function setupFullInstrumentation(
  page: Page,
  options: {
    trackConsoleErrors?: boolean;
    collectCoverage?: boolean;
    allowedErrors?: RegExp[];
  } = {},
): Promise<{
  getConsoleErrors: () => {
    message: string;
    page: string;
    timestamp: number;
    browser: string;
    context: string;
  }[];
  clearConsoleErrors: () => void;
  startCoverageCollection: () => Promise<void>;
  stopCoverageCollection: () => Promise<unknown[]>;
  measureOperation: (operation: () => Promise<void>) => Promise<number>;
  assertPerformance: (thresholds: PerformanceThresholds) => Promise<void>;
}> {
  const {
    allowedErrors,
    collectCoverage = false,
    trackConsoleErrors = true,
  } = options;

  const consoleController = trackConsoleErrors
    ? setupInstrumentedPage(page, allowedErrors)
    : { clearConsoleErrors: () => {}, getConsoleErrors: () => [] };

  const startCoverage = collectCoverage
    ? () => startCoverageCollection(page)
    : async () => {};

  return {
    ...consoleController,
    assertPerformance: (thresholds: PerformanceThresholds) =>
      assertPerformance(page, thresholds),
    measureOperation: (op: () => Promise<void>) => measureOperation(page, op),
    startCoverageCollection: startCoverage,
    stopCoverageCollection,
  };
}

export default {
  assertPerformance,
  clearConsoleErrors,
  getConsoleErrors,
  getCoverage,
  getResourceTiming,
  measureOperation,
  measurePerformance,
  PERFORMANCE_CONFIG,
  setupFullInstrumentation,
  setupInstrumentedPage,
  startCoverageCollection,
  stopCoverageCollection,
};
