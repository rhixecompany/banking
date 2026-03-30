/**
 * Lightweight graceful shutdown helper for one-off scripts.
 *
 * Call setupGracefulShutdown('script-name') early in your script to attach
 * signal and exception handlers that exit the process cleanly.
 *
 * @param name - Human readable name for log messages
 * @param opts - Optional exit configuration
 * @returns teardown function to remove handlers (useful in tests)
 */
export const setupGracefulShutdown = (
  name: string,
  { exitCode = 1 }: { exitCode?: number } = {},
): (() => void) => {
  let shuttingDown = false;

  const cleanup = (signal: string): void => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(
      `\n🛑 ${name}: received ${signal}, shutting down gracefully...`,
    );
    // Best-effort cleanup: keep this short and synchronous
    try {
      // Place for lightweight cleanup tasks if needed in future
    } catch (error) {
      console.error(`${name}: error during shutdown cleanup:`, error);
    }

    // Exit with a non-zero code to indicate abnormal termination
    try {
      process.exit(exitCode);
    } catch (error) {
      // If process.exit is stubbed or overridden (e.g. in tests), surface the failure.
      const message = error instanceof Error ? error.message : String(error);
      console.error(`${name}: process.exit failed:`, message);
      throw error;
    }
  };

  const onSigInt = (): void => cleanup("SIGINT");
  const onSigTerm = (): void => cleanup("SIGTERM");
  const onSigHup = (): void => cleanup("SIGHUP");
  const onUncaught = (error: unknown): void => {
    console.error(`${name}: Uncaught exception:`, error);
    cleanup("uncaughtException");
  };
  const onUnhandledRejection = (reason: unknown): void => {
    console.error(`${name}: Unhandled promise rejection:`, reason);
    cleanup("unhandledRejection");
  };

  process.on("SIGINT", onSigInt);
  process.on("SIGTERM", onSigTerm);
  process.on("SIGHUP", onSigHup);
  process.on("uncaughtException", onUncaught);
  process.on("unhandledRejection", onUnhandledRejection);

  // Return a teardown function useful for tests or if a caller wants to remove handlers
  return (): void => {
    process.removeListener("SIGINT", onSigInt);
    process.removeListener("SIGTERM", onSigTerm);
    process.removeListener("SIGHUP", onSigHup);
    process.removeListener("uncaughtException", onUncaught);
    process.removeListener("unhandledRejection", onUnhandledRejection);
  };
};
