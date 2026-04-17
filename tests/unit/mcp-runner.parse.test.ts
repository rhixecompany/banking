import { describe, expect, it } from "vitest";

import {
  checksum,
  generateHelperContent,
  parseDockerOutput,
} from "../../scripts/mcp-runner-lib";

describe("mcp-runner parser", () => {
  it("parses simple docker mcp output", () => {
    const sample = `next-devtools-mcp\nplaywright\nplaywright-mcp-server`;
    const parsed = parseDockerOutput(sample);
    expect(parsed).toEqual(
      ["next-devtools-mcp", "playwright", "playwright-mcp-server"].sort(),
    );
  });

  it("parses docker ps-like output", () => {
    const sample = `my-server\timage:latest\nanother-server\timage2:tag`;
    const parsed = parseDockerOutput(sample);
    expect(parsed).toEqual(["my-server", "another-server"].sort());
  });

  it("generates helper content and checksum changes", () => {
    const c = generateHelperContent(
      "test-server",
      ".opencode/mcp_servers.json",
    );
    expect(c).toContain("test-server");
    const sum = checksum(c);
    expect(typeof sum).toBe("string");
    expect(sum.length).toBeGreaterThan(0);
  });
});
