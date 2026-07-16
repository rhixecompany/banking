/**
 * Playwright Test Fixtures Index
 *
 * Export all custom fixtures for easy importing in tests.
 *
 * Usage:
 *   // Default auth fixtures (existing)
 *   import { test, expect } from './fixtures/auth';
 *
 *   // Console error handling (new)
 *   import { test, expectNoConsoleErrors } from './fixtures/console-handler';
 *
 *   // Session reuse for speed (new)
 *   import { test, saveAuthState } from './fixtures/session-reuse';
 *
 *   // Test utilities with test.step() (new)
 *   import { test, navigateTo, assertVisible } from './fixtures/test-utils';
 *
 *   // Coverage collection (new)
 *   import { test, getCoverageData, calculateCoveragePercentage } from './fixtures/coverage';
 */

// Re-export existing fixtures (default)
export { SEED_USER_ID, TEST_USER, expect, test } from "./auth";
export type { AuthFixtures } from "./auth";

// Re-export console handler fixtures
export { test as consoleTest, expectNoConsoleErrors } from "./console-handler";
export type { ConsoleHandlerFixtures, ConsoleMessage } from "./console-handler";

// Re-export session reuse fixtures
export {
  clearAuthState,
  getStorageStatePath,
  hasAuthState,
  saveAuthState,
  test as sessionTest,
} from "./session-reuse";
export type { SessionReuseFixtures } from "./session-reuse";

// Re-export test utilities
export {
  assertText,
  assertUrl,
  assertValue,
  assertVisible,
  clickElement,
  debugScreenshot,
  fillField,
  measureTime,
  navigateTo,
  retry,
  softAssert,
  submitForm,
  test as utilsTest,
  waitForElement,
  waitForNetworkIdle,
  waitForResponse,
} from "./test-utils";
export type { SoftAssertResult } from "./test-utils";

// Re-export coverage fixtures
export {
  calculateCSSCoveragePercentage,
  calculateJSCoveragePercentage,
  test as coverageTest,
} from "./coverage";
export type { CoverageData, CoverageFixtures } from "./coverage";
export type { PerformanceMetrics } from "./performance";

// Re-export combined utilities (all-in-one)
import combinedExports from "./combined";
export const {
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
} = combinedExports;
