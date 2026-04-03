/**
 * Global teardown for Playwright E2E tests.
 * Runs once after all tests complete. Provides a clean shutdown hook
 * so Playwright exits gracefully and doesn't leave dangling processes.
 */
export default async function globalTeardown(): Promise<void> {
  // No-op: Playwright handles browser/context cleanup automatically.
  // This file exists to register a clean shutdown hook with the test runner.
}
