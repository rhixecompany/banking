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
export { test, expect, SEED_USER_ID, TEST_USER } from "./auth";
export type { AuthFixtures } from "./auth";

// Re-export console handler fixtures
export { test as consoleTest, expectNoConsoleErrors } from "./console-handler";
export type { ConsoleHandlerFixtures, ConsoleMessage } from "./console-handler";

// Re-export session reuse fixtures
export {
  test as sessionTest,
  saveAuthState,
  clearAuthState,
  hasAuthState,
  getStorageStatePath,
} from "./session-reuse";
export type { SessionReuseFixtures } from "./session-reuse";

// Re-export test utilities
export {
  test as utilsTest,
  navigateTo,
  fillField,
  clickElement,
  submitForm,
  waitForElement,
  assertVisible,
  assertText,
  assertValue,
  assertUrl,
  waitForResponse,
  softAssert,
  measureTime,
  retry,
  waitForNetworkIdle,
  debugScreenshot,
} from "./test-utils";
export type { SoftAssertResult } from "./test-utils";

// Re-export coverage fixtures
export {
  test as coverageTest,
  calculateJSCoveragePercentage,
  calculateCSSCoveragePercentage,
} from "./coverage";
export type { CoverageFixtures, CoverageData } from "./coverage";

// Re-export combined utilities (all-in-one)
import combinedExports from "./combined";
export const {
  setupInstrumentedPage,
  getConsoleErrors,
  clearConsoleErrors,
  startCoverageCollection,
  stopCoverageCollection,
  getCoverage,
  setupFullInstrumentation,
  measurePerformance,
  getResourceTiming,
  measureOperation,
  assertPerformance,
  PERFORMANCE_CONFIG,
} = combinedExports;
export type { PerformanceMetrics } from "./performance";