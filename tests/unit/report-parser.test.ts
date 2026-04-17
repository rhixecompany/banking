import { detectAndParse } from "@/scripts/report-parser";
import path from "path";

describe("report-parser", () => {
  it("parses vitest json", () => {
    const p = path.resolve(
      process.cwd(),
      "tests/fixtures/reports/vitest.sample.json",
    );
    const r = detectAndParse(p);
    expect(r).not.toBeNull();
    expect(r?.framework).toBe("vitest");
    expect(r?.total).toBe(3);
    expect(r?.passed).toBe(2);
    expect(r?.failed).toBe(1);
    expect(typeof r?.durationMs).toBe("number");
  });

  it("parses playwright json", () => {
    const p = path.resolve(
      process.cwd(),
      "tests/fixtures/reports/playwright.sample.json",
    );
    const r = detectAndParse(p);
    expect(r).not.toBeNull();
    expect(r?.framework).toBe("playwright-json");
    expect(r?.total).toBe(2);
    expect(r?.passed).toBe(1);
    expect(r?.failed).toBe(1);
  });

  it("parses junit xml", () => {
    const p = path.resolve(
      process.cwd(),
      "tests/fixtures/reports/junit.sample.xml",
    );
    const r = detectAndParse(p);
    expect(r).not.toBeNull();
    expect(r?.framework).toBe("junit");
    expect(r?.total).toBe(2);
    expect(r?.failed).toBe(1);
  });
});
