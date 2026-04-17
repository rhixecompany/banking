#!/usr/bin/env node
import { XMLParser } from "fast-xml-parser";
import fs from "fs";
import path from "path";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {NormalizedReport}
 */
export interface NormalizedReport {
  framework: string;
  total: number;
  passed: number;
  failed: number;
  durationMs?: number;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} filePath
 * @returns {(NormalizedReport | null)}
 */
function parseVitestJson(filePath: string): NormalizedReport | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  const total = data.numTotalTests ?? 0;
  const passed = data.numPassedTests ?? 0;
  const failed = data.numFailedTests ?? 0;
  // Vitest report may include start and end timestamps; guard and compute duration safely
  const durationMs =
    typeof data.start === "number" && typeof data.end === "number"
      ? Math.abs(data.end - data.start)
      : undefined;

  return {
    durationMs,
    failed,
    framework: "vitest",
    passed,
    total,
  };
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} filePath
 * @returns {(NormalizedReport | null)}
 */
function parsePlaywrightJson(filePath: string): NormalizedReport | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  const data = JSON.parse(raw);
  const total =
    data?.suites?.reduce(
      (acc: number, s: any) => acc + (s?.tests?.length ?? 0),
      0,
    ) ?? 0;
  const passed =
    data?.suites?.reduce(
      (acc: number, s: any) =>
        acc + (s?.tests?.filter((t: any) => t.ok).length ?? 0),
      0,
    ) ?? 0;
  const failed = total - passed;
  return { failed, framework: "playwright-json", passed, total };
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} filePath
 * @returns {(NormalizedReport | null)}
 */
function parseJunitXml(filePath: string): NormalizedReport | null {
  const raw = fs.readFileSync(filePath, "utf-8");
  // Enable attribute parsing so numeric attributes like tests/failures are available
  const parser = new XMLParser({
    attributeNamePrefix: "@_",
    ignoreAttributes: false,
  });
  const data = parser.parse(raw);
  // Expecting testsuites/testsuite structure
  const suites = data.testsuites?.testsuite
    ? Array.isArray(data.testsuites.testsuite)
      ? data.testsuites.testsuite
      : [data.testsuites.testsuite]
    : [];
  let total = 0;
  let failures = 0;
  for (const s of suites) {
    // fast-xml-parser exposes attributes using the '@_' prefix by default.
    // Accept both attribute forms (tests / @_tests) for robustness.
    const testsAttr = (s.tests ?? (s as any)["@_tests"]) as unknown;
    const failuresAttr = (s.failures ?? (s as any)["@_failures"]) as unknown;
    const errorsAttr = (s.errors ?? (s as any)["@_errors"]) as unknown;
    total += Number(testsAttr ?? 0);
    failures += Number(failuresAttr ?? 0) + Number(errorsAttr ?? 0);
  }
  const passed = total - failures;
  return { failed: failures, framework: "junit", passed, total };
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} filePath
 * @returns {(NormalizedReport | null)}
 */
function detectAndParse(filePath: string): NormalizedReport | null {
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === ".json") {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (parsed?.numTotalTests !== undefined) return parseVitestJson(filePath);
      if (parsed?.suites !== undefined) return parsePlaywrightJson(filePath);
    }
    if (ext === ".xml") return parseJunitXml(filePath);
  } catch (err) {
    console.error("Failed to parse", filePath, err);
    return null;
  }
  return null;
}
export { detectAndParse, parseJunitXml, parsePlaywrightJson, parseVitestJson };

/**
 * Description placeholder
 * @author Adminbot
 */
function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const input = args[0] ?? "./reports";
  const abs = path.resolve(process.cwd(), input);
  if (!fs.existsSync(abs)) {
    console.error("Input path not found:", abs);
    process.exit(2);
  }

  const files: string[] = [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) files.push(abs);
  else {
    const entries = fs.readdirSync(abs);
    for (const e of entries) {
      if (e.endsWith(".json") || e.endsWith(".xml") || e.endsWith(".csv"))
        files.push(path.join(abs, e));
    }
  }

  const results: NormalizedReport[] = [];
  for (const f of files) {
    const r = detectAndParse(f);
    if (r) results.push(r);
  }

  if (dryRun) {
    console.log(
      JSON.stringify({ files: files.length, ok: true, results }, null, 2),
    );
    return;
  }

  // Write summary
  const out = { results };
  console.log(JSON.stringify(out, null, 2));
}

if (require.main === module) main();
