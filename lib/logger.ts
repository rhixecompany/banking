// Simple structured logger used during admin actions and server wrappers.
// Keep lightweight and non-blocking; avoids leaking secrets into logs.
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {unknown[]} args
 * @returns {{ module: any; message: any; meta: any; }}
 */
function normalizeArgs(args: unknown[]) {
  // Returns { module, message, meta }
  if (!args || args.length === 0) {
    return { message: "", meta: undefined, module: "app" };
  }

  if (args.length === 1) {
    return { message: String(args[0]), meta: undefined, module: "app" };
  }

  if (args.length === 2) {
    const [a0, a1] = args;
    if (
      a1 &&
      typeof a1 === "object" &&
      ("stack" in (a1 as any) || "message" in (a1 as any))
    ) {
      // message, error
      return { message: String(a0), meta: a1, module: "app" };
    }
    // treat as module, message
    return { message: String(a1), meta: undefined, module: String(a0) };
  }

  // 3+ args: module, message, meta...
  return {
    message: String(args[1]),
    meta: args.slice(2),
    module: String(args[0]),
  };
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} level
 * @param {string} moduleName
 * @param {string} message
 * @param {?unknown} [meta]
 */
function output(
  level: string,
  moduleName: string,
  message: string,
  meta?: unknown,
) {
  try {
    const payload = {
      level,
      message,
      meta,
      module: moduleName,
      ts: new Date().toISOString(),
    };
    /* eslint-disable no-console -- logger utility intentionally uses console */
    if (level === "debug") console.debug(JSON.stringify(payload));
    else if (level === "info") console.info(JSON.stringify(payload));
    else console.error(JSON.stringify(payload));
    /* eslint-enable no-console */
  } catch {
    // ignore
  }
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {...unknown[]} args
 */
export function debug(...args: unknown[]) {
  const { message, meta, module } = normalizeArgs(args);
  output("debug", module, message, meta);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {...unknown[]} args
 */
export function info(...args: unknown[]) {
  const { message, meta, module } = normalizeArgs(args);
  output("info", module, message, meta);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {...unknown[]} args
 */
export function warn(...args: unknown[]) {
  const { message, meta, module } = normalizeArgs(args);
  output("info", module, message, meta); // map warn -> info level
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {...unknown[]} args
 */
export function error(...args: unknown[]) {
  const { message, meta, module } = normalizeArgs(args);
  output("error", module, message, meta);
}

// Provide a convenience object for callers that import { logger } from '@/lib/logger'
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{ debug: (...args: {}) => void; info: (...args: {}) => void; warn: (...args: {}) => void; error: (...args: {}) => void; }}
 */
export const logger = {
  debug,
  error,
  info,
  warn,
};
