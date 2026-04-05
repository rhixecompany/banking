/**
 * Global teardown for Playwright E2E tests.
 * Runs once after all tests complete. Provides a clean shutdown hook
 * so Playwright exits gracefully and doesn't leave dangling processes.
 *
 * @async
 * @returns {Promise<void>}
 */

/**
 * Timeout configurations
 */
const TIMEOUTS = {
  SERVER_CHECK: 5_000,
  SERVER_STOP: 10_000,
  KILL_PROCESS: 5_000,
} as const;

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
 * Check if the dev server is running by making a request
 *
 * @returns {Promise<boolean>}
 */
async function isServerRunning(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      TIMEOUTS.SERVER_CHECK,
    );

    const response = await fetch("http://localhost:3000", {
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
  console.info("  Checking if dev server is running...");

  const isRunning = await isServerRunning();

  if (!isRunning) {
    console.info("  - Dev server is not running");
    return;
  }

  console.info("  - Dev server is running, attempting to stop...");

  // Try to find and kill the process using port 3000
  try {
    // Use netstat to find process ID on port 3000
    const { execSync } = await import("node:child_process");

    try {
      // Windows: find process using port 3000
      const result = execSync(
        "netstat -ano | findstr :3000 | findstr LISTENING",
        {
          encoding: "utf-8",
          windowsHide: true,
        },
      );

      const lines = result.trim().split("\n").filter(Boolean);

      if (lines.length > 0) {
        // Extract PID from the last column of the first matching line
        const parts = lines[0].trim().split(/\s+/);
        const pid = parts[parts.length - 1];

        if (pid && /^\d+$/.test(pid)) {
          console.info(
            `    Found process ${pid} on port 3000, attempting to stop...`,
          );

          try {
            // Try graceful termination first
            process.kill(parseInt(pid, 10), "SIGTERM");
            console.info("    ✓ Sent SIGTERM to process");
          } catch {
            // If graceful fails, force kill
            console.info("    - SIGTERM failed, sending SIGKILL...");
            process.kill(parseInt(pid, 10), "SIGKILL");
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
    // Step 1: Print results summary
    console.info("  Step 1/2: Printing results summary...");
    printResultsSummary();

    // Step 2: Stop dev server
    console.info("  Step 2/2: Stopping dev server...");
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
