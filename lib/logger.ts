/**
 * Logging utility for the Banking application.
 * Provides typed logging methods with optional development-only debug output.
 *
 * In production, only warn and error levels are meaningful.
 * In development, debug level is also enabled.
 */

// Use app-config for environment access in application code
import { appConfig } from "@/app-config";

// Derive development mode from the absence of production configuration.
// Avoid referencing environment variables here directly — use appConfig as the canonical source.
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {boolean}
 */
const isDev = (() => {
  try {
    // appConfig is a typed, centralized config exported from app-config.ts and
    // is safe to read here. Avoid `any` casts to keep strict typing.
    const dbUrl = appConfig.database?.DATABASE_URL;
    const nextAuthUrl = appConfig.auth?.NEXTAUTH_URL;
    // If neither database nor nextauth URL is configured, assume a local/dev run.
    return !dbUrl && !nextAuthUrl;
  } catch {
    return false;
  }
})();

/**
 * Logging utility with typed methods.
 *
 * @example
 * import { logger } from "@/lib/logger";
 *
 * logger.error("Something went wrong", error);
 * logger.warn("Deprecated feature used");
 * logger.info("User logged in", { userId: "123" });
 * logger.debug("Cache miss for key", "user:123");
 */
/* eslint-disable no-console */
export const logger = {
  /**
   * Log debug messages (development only).
   * Silently ignored in production.
   */
  debug: (message: string, ...args: unknown[]): void => {
    if (isDev) {
      console.debug(message, ...args);
    }
  },

  /**
   * Log error messages.
   * Always shown, even in production.
   */
  error: (message: string, ...args: unknown[]): void => {
    console.error(message, ...args);
  },

  /**
   * Log informational messages.
   * Use sparingly - prefer debug for development details.
   */
  info: (message: string, ...args: unknown[]): void => {
    console.info(message, ...args);
  },

  /**
   * Log warning messages.
   * Always shown, even in production.
   */
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(message, ...args);
  },
};
/* eslint-enable no-console */
