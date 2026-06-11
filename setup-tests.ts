import { afterAll, beforeAll, mock } from "bun:test";

// Mock a global fetch or external API behavior for all tests
mock.module("./api-client.ts", () => {
  return {
    fetchData: () => Promise.resolve({ data: "mocked test data" }),
  };
});

beforeAll(() => {
  console.log("🏁 Starting test suite execution...");
});

afterAll(() => {
  console.log("⏹️ Test suite execution finished.");
});
