import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the DAL before importing the module under test. Use factory that
// defines mocks inside the factory to avoid TDZ issues with hoisted mocks.
vi.mock("@/dal", () => {
  const insertErrorMock = vi.fn().mockResolvedValue({});
  return {
    errorsDal: {
      insertError: insertErrorMock,
      getRecentErrors: vi.fn().mockResolvedValue([]),
      clearOldErrors: vi.fn().mockResolvedValue(undefined),
    },
  };
});

import { errorsDal } from "@/dal";
import { createErrorHandler, logError } from "@/lib/error-tracking";

describe("lib/error-tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("logError delegates to errorsDal.insertError with provided fields", async () => {
    await logError({
      message: "Test error",
      path: "/test",
      severity: "warning",
      stack: "stack-trace",
      userId: "user-1",
    });

    expect(errorsDal.insertError).toHaveBeenCalled();
    // errorsDal.insertError is a mocked function provided by our mock factory
    // vitest's global typings differ from Jest's. Cast to any to access mock
    // call information safely in a testing context.
    const calledArg = (errorsDal.insertError as any)?.mock?.calls?.[0]?.[0];
    expect(calledArg).toMatchObject({
      message: "Test error",
      path: "/test",
      severity: "warning",
      stack: "stack-trace",
      userId: "user-1",
    });
  });

  it("createErrorHandler captures error and delegates to logError via errorsDal", async () => {
    const handler = createErrorHandler("seed-user");
    const err = new Error("Boom");
    // call handler synchronously; it should trigger logError asynchronously
    handler(err, "/some-path");

    // wait a tick for the async void to run
    await new Promise((r) => setTimeout(r, 0));

    expect(errorsDal.insertError).toHaveBeenCalled();
    const calledArg2 = (errorsDal.insertError as any)?.mock?.calls?.[0]?.[0];
    expect(calledArg2).toMatchObject({
      message: "Boom",
      path: "/some-path",
      userId: "seed-user",
    });
  });
});
