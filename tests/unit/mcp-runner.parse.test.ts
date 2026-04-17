import { describe, expect, it } from "vitest";
import {
  isValidToken,
  normalizeToken,
  parseDockerPsOutput,
  parseGatewayOutput,
} from "../../scripts/mcp-runner-lib";

describe("mcp-runner parsing", () => {
  it("normalizes tokens", () => {
    expect(normalizeToken("  Next DevTools MCP ")).toBe("next-devtools-mcp");
  });

  it("validates tokens and denylist", () => {
    expect(isValidToken("adding")).toBe(false);
    expect(isValidToken("next-devtools-mcp")).toBe(true);
    expect(isValidToken("Invalid Token!@#")).toBe(false);
  });

  it("parses gateway output with table-like lines", () => {
    const sample = `Enabled MCP Servers:\n - next-devtools-mcp\n - playwright\n`;
    const records = parseGatewayOutput(sample);
    const names = records.map((r) => r.name);
    expect(names).toContain("next-devtools-mcp");
    expect(names).toContain("playwright");
  });

  it("parses docker ps output", () => {
    const sample = "my_app\nnext-devtools-mcp\nplaywright";
    const records = parseDockerPsOutput(sample);
    const names = records.map((r) => r.name);
    expect(names).toContain("my_app");
    expect(names).toContain("next-devtools-mcp");
    expect(names).toContain("playwright");
  });
});
