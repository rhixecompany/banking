import { cleanup } from "@testing-library/react";
import { config } from "dotenv";
import { resolve } from "path";
import { afterEach, vi } from "vitest";

config({ path: resolve(process.cwd(), ".env.local") });

afterEach(cleanup);

// Debug env removed after diagnostics

// Apply lightweight module mocks commonly used across unit tests. Tests
// that need the real implementation can always explicitly unmock.
vi.mock("@/components/ui/select", async () => {
  // When running under Vitest, resolve the test-double module file that
  // lives under tests/mocks/ui/select.tsx
  const mod = await import("./mocks/ui/select");
  return mod;
});

// Mock sonner globally for unit tests so modules that import it at module
// initialization receive the mocked toast object (prevents race conditions
// where a module imports sonner before a test-level mock is registered).
vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
