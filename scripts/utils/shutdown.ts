/**
 * Graceful Shutdown Utility for Banking Scripts
 *
 * Provides graceful shutdown handling for scripts with:
 * - Signal handling (SIGINT, SIGTERM)
 * - Error handling (uncaught exceptions)
 * - Database connection cleanup
 * - Logging
 */

type ShutdownCallback = () => Promise<void> | void;

/**
 * Description placeholder
 *
 * @type {ShutdownCallback[]}
 */
const shutdownCallbacks: ShutdownCallback[] = [];
/**
 * Description placeholder
 *
 * @type {boolean}
 */
let isShuttingDown = false;
/**
 * Description placeholder
 *
 * @type {string}
 */
let scriptName = "script";

/**
 * Description placeholder
 *
 * @export
 * @param {string} name
 */
export function setupGracefulShutdown(name: string): void {
  scriptName = name;

  const log = (message: string) => {
    console.log(`[${scriptName}] ${message}`);
  };

  const cleanup = async () => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    log("Shutting down gracefully...");

    for (const callback of shutdownCallbacks) {
      try {
        await callback();
      } catch (error) {
        log(
          `Error during cleanup: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    log("Shutdown complete");
    process.exit(0);
  };

  process.on("SIGINT", () => {
    log("Received SIGINT");
    void cleanup();
  });

  process.on("SIGTERM", () => {
    log("Received SIGTERM");
    void cleanup();
  });

  process.on("uncaughtException", (error) => {
    log(`Uncaught exception: ${error.message}`);
    console.error(error.stack);
    void cleanup();
  });

  process.on("unhandledRejection", (reason) => {
    log(`Unhandled rejection: ${reason}`);
    void cleanup();
  });

  log("Graceful shutdown handlers registered");
}

/**
 * Description placeholder
 *
 * @export
 * @param {ShutdownCallback} callback
 */
export function onShutdown(callback: ShutdownCallback): void {
  shutdownCallbacks.push(callback);
}

/**
 * Description placeholder
 *
 * @export
 * @async
 * @returns {Promise<void>}
 */
export async function cleanupConnections(): Promise<void> {
  console.log(
    "[cleanup] Database cleanup not implemented (connections handled by Next.js)",
  );
}

/**
 * Description placeholder
 *
 * @export
 * @param {string} reason
 */
export function logShutdown(reason: string): void {
  console.log(`[${scriptName}] Shutdown reason: ${reason}`);
}
