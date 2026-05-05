/**
 * Global teardown for Playwright E2E tests.
 * Runs once after all tests complete. Provides a clean shutdown hook
 * so Playwright exits gracefully and doesn't leave dangling processes.
 *
 * @async
 * @returns {Promise<void>}
 */

import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

/**
 * Timeout configurations
 */
const TIMEOUTS = {
  KILL_PROCESS: 5_000,
  SERVER_CHECK: 5_000,
  SERVER_STOP: 10_000,
} as const;

function getBaseUrl(): string {
  // eslint-disable-next-line n/no-process-env
  return process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
}

/**
 * Print a section header for better log readability
 *
 * @param {string} title
 * @returns {void}
 */
function printSection(title: string): void {
  console.info("");
  console.info("═══════════════════════════════════════════════════");
  console.info(`  ${title}`);
  console.info("═══════════════════════════════════════════════════");
}

/**
 * Get the test results directory path
 */
function getTestResultsDir(): string {
  return join(process.cwd(), "test-results");
}

/**
 * Check if the dev server is running by making a request
 *
 * @returns {Promise<boolean>}
 */
async function isServerRunning(): Promise<boolean> {
  const baseUrl = getBaseUrl();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      TIMEOUTS.SERVER_CHECK,
    );

    const response = await fetch(baseUrl, {
      method: "HEAD",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return (
      response.ok ||
      response.status === 301 ||
      response.status === 302 ||
      response.status === 404
    );
  } catch {
    return false;
  }
}

/**
 * Stop the dev server gracefully
 * First tries to kill by process, then force kills if needed
 *
 * @async
 * @returns {Promise<void>}
 */
async function stopDevServer(): Promise<void> {
  // Avoid killing a developer's existing server locally.
  // Playwright's webServer will manage lifecycle in CI.
  // eslint-disable-next-line n/no-process-env
  const shouldStop = process.env.CI === "true";
  if (!shouldStop) {
    console.info("  - Skipping dev server stop (non-CI run)");
    return;
  }

  const baseUrl = getBaseUrl();
  let port = "3000";
  try {
    const url = new URL(baseUrl);
    port = url.port || (url.protocol === "https:" ? "443" : "80");
  } catch {
    // ignore
  }

  console.info("  Checking if dev server is running...");

  const isRunning = await isServerRunning();

  if (!isRunning) {
    console.info("  - Dev server is not running");
    return;
  }

  console.info("  - Dev server is running, attempting to stop...");

  // Try to find and kill the process using the configured port
  try {
    // Use netstat to find process ID by port
    const { execSync } = await import("node:child_process");

    try {
      // Windows: find process by port
      const result = execSync(
        `netstat -ano | findstr :${port} | findstr LISTENING`,
        {
          encoding: "utf-8",
          windowsHide: true,
        },
      );

      const lines = result.trim().split("\n").filter(Boolean);

      if (lines.length > 0) {
        // Extract PID from the last column of the first matching line
        const parts = lines[0].trim().split(/\s+/);
        const pid = parts.at(-1);

        if (pid && /^\d+$/.test(pid)) {
          console.info(
            `    Found process ${pid} on port ${port}, attempting to stop...`,
          );

          try {
            // Try graceful termination first
            process.kill(Number.parseInt(pid, 10), "SIGTERM");
            console.info("    ✓ Sent SIGTERM to process");
          } catch {
            // If graceful fails, force kill
            console.info("    - SIGTERM failed, sending SIGKILL...");
            process.kill(Number.parseInt(pid, 10), "SIGKILL");
            console.info("    ✓ Sent SIGKILL to process");
          }
        }
      }
    } catch {
      console.info("    - Could not find process by port (this is OK)");
    }
  } catch (error) {
    console.info(`    - Error stopping server: ${error}`);
  }

  // Wait a moment and verify server is stopped
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const stillRunning = await isServerRunning();

  if (stillRunning) {
    console.info("  ⚠ WARNING: Dev server may still be running");
    console.info("     You may need to manually stop the server on port 3000");
  } else {
    console.info("  ✓ Dev server stopped successfully");
  }
}

/**
 * Clean up test artifacts (videos, screenshots)
 */
function cleanupTestArtifacts(): void {
  const resultsDir = getTestResultsDir();

  if (!existsSync(resultsDir)) {
    console.info("  - No test-results directory found");
    return;
  }

  try {
    const entries = readdirSync(resultsDir);
    let cleanedCount = 0;

    for (const entry of entries) {
      const entryPath = join(resultsDir, entry);

      // Clean up video and screenshot files
      if (entry.endsWith(".webm") || entry.endsWith(".png")) {
        try {
          rmSync(entryPath, { force: true });
          cleanedCount++;
        } catch {
          // Ignore individual cleanup failures
        }
      }
    }

    if (cleanedCount > 0) {
      console.info(`  ✓ Cleaned up ${cleanedCount} test artifact(s)`);
    } else {
      console.info("  - No test artifacts to clean up");
    }
  } catch (error) {
    console.info(`  ⚠ Could not clean up artifacts: ${error}`);
  }
}

/**
 * Parse and display test results from Playwright JSON report
 */
function parseAndDisplayTestResults(): void {
  const resultsDir = getTestResultsDir();

  if (!existsSync(resultsDir)) {
    console.info("  - No test-results directory found");
    return;
  }

  // Look for the most recent JSON report
  const entries = readdirSync(resultsDir).filter((e) => e.endsWith(".json"));

  if (entries.length === 0) {
    console.info("  - No test result files found");
    return;
  }

  // Use the most recent report
  const latestReport = entries.sort().at(-1);
  if (!latestReport) return;

  try {
    const reportPath = join(resultsDir, latestReport);
    const reportData = JSON.parse(readFileSync(reportPath, "utf-8"));

    const stats = reportData.stats ?? {};
    const suites = reportData.suites ?? [];

    console.info("");
    console.info("  ════════════════════════════════════════════════════");
    console.info("    TEST RESULTS SUMMARY");
    console.info("  ════════════════════════════════════════════════════");
    console.info(`    Total:   ${stats.tests ?? 0}`);
    console.info(`    Passed:  ${stats.passed ?? 0}`);
    console.info(`    Failed:  ${stats.failures ?? 0}`);
    console.info(`    Skipped: ${stats.skipped ?? 0}`);
    console.info(`    Duration: ${(stats.duration ?? 0) / 1000}s`);

    // List failed tests if any
    if ((stats.failures ?? 0) > 0) {
      console.info("");
      console.info("  Failed Tests:");
      for (const suite of suites) {
        for (const test of suite.tests ?? []) {
          if (test.ok === false) {
            console.info(`    - ${test.title}`);
          }
        }
      }
    }

    console.info("");
    console.info("  To view detailed report:");
    console.info("    npx playwright show-report");
  } catch (error) {
    console.info(`  ⚠ Could not parse test results: ${error}`);
  }
}

/**
 * Print test results summary information
 *
 * @returns {void}
 */
function printResultsSummary(): void {
  console.info("  Test Execution Complete");
  console.info("");
  console.info("  To view detailed results:");
  console.info("    npm run test:ui:report");
  console.info("");
  console.info("  To run tests again:");
  console.info("    npm run test:ui");
  console.info("");
}

/**
 * Main global teardown function
 * Runs after all tests complete to clean up resources
 *
 * @export
 * @async
 * @returns {Promise<void>}
 */
export default async function globalTeardown(): Promise<void> {
  printSection("PLAYWRIGHT E2E GLOBAL TEARDOWN");

  try {
    // Step 1: Parse and display test results
    console.info("  Step 1/3: Parsing test results...");
    parseAndDisplayTestResults();

    // Step 2: Clean up test artifacts
    console.info("  Step 2/3: Cleaning up test artifacts...");
    cleanupTestArtifacts();

    // Step 3: Stop dev server
    console.info("  Step 3/3: Stopping dev server...");
    await stopDevServer();

    printSection("TEARDOWN COMPLETE");
  } catch (error) {
    console.error("  ⚠ Error during teardown:");
    console.error(
      `     ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    console.info("  Attempting to continue cleanup...");

    // Still try to stop server even if summary fails
    try {
      await stopDevServer();
    } catch {
      console.info("  - Server cleanup also failed");
    }

    printSection("TEARDOWN COMPLETED WITH ERRORS");
  }
}
