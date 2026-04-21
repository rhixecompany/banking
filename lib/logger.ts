// Simple structured logger used during admin actions and server wrappers.
// Keep lightweight and non-blocking; avoids leaking secrets into logs.
function normalizeArgs(args: unknown[]) {
  // Returns { module, message, meta }
  if (!args || args.length === 0) {
    return { module: "app", message: "", meta: undefined };
  }

  if (args.length === 1) {
    return { module: "app", message: String(args[0]), meta: undefined };
  }

  if (args.length === 2) {
    const [a0, a1] = args;
    if (
      a1 &&
      typeof a1 === "object" &&
      ("stack" in (a1 as any) || "message" in (a1 as any))
    ) {
      // message, error
      return { module: "app", message: String(a0), meta: a1 };
    }
    // treat as module, message
    return { module: String(a0), message: String(a1), meta: undefined };
  }

  // 3+ args: module, message, meta...
  return {
    module: String(args[0]),
    message: String(args[1]),
    meta: args.slice(2),
  };
}

function output(
  level: string,
  moduleName: string,
  message: string,
  meta?: unknown,
) {
  try {
    const payload = {
      ts: new Date().toISOString(),
      level,
      module: moduleName,
      message,
      meta,
    };
    if (level === "debug") console.debug(JSON.stringify(payload));
    else if (level === "info") console.info(JSON.stringify(payload));
    else console.error(JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function debug(...args: unknown[]) {
  const { module, message, meta } = normalizeArgs(args);
  output("debug", module, message, meta);
}

export function info(...args: unknown[]) {
  const { module, message, meta } = normalizeArgs(args);
  output("info", module, message, meta);
}

export function warn(...args: unknown[]) {
  const { module, message, meta } = normalizeArgs(args);
  output("info", module, message, meta); // map warn -> info level
}

export function error(...args: unknown[]) {
  const { module, message, meta } = normalizeArgs(args);
  output("error", module, message, meta);
}

// Provide a convenience object for callers that import { logger } from '@/lib/logger'
export const logger = {
  debug,
  info,
  warn,
  error,
};
