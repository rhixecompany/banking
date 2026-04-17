#!/usr/bin/env node
/*
 * Verify the opencode.json exists and that agentIterationLimit is a small positive integer.
 * This is a lightweight verification script intended to be used by CI or contributors.
 */
import { readFileSync } from "fs";
import { join } from "path";

function fail(msg: string) {
  console.error(`ERROR: ${msg}`);
  process.exit(2);
}

try {
  const p = join(process.cwd(), "opencode.json");
  const raw = readFileSync(p, "utf8");
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  if (typeof parsed.agentIterationLimit !== "number") {
    fail("opencode.json must contain a numeric 'agentIterationLimit' property");
  }

  const val = parsed.agentIterationLimit as number;
  if (!Number.isInteger(val) || val <= 0 || val > 10) {
    fail(
      "'agentIterationLimit' must be an integer between 1 and 10 (inclusive). Recommended: 3",
    );
  }

  console.log(`opencode.json agentIterationLimit=${val} OK`);
  process.exit(0);
} catch (err: unknown) {
  const e = err as Error;
  console.error("Failed to verify opencode.json:", e.message);
  process.exit(2);
}
