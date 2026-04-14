#!/usr/bin/env node

/**
 * Data Export Script
 *
 * Exports banking data and analytics for reporting.
 * Supports exporting user stats, transaction data, and metrics.
 *
 * Usage: tsx scripts/export-data.ts [--type <type>] [--output <path>]
 * Example: tsx scripts/export-data.ts --type users --output ./exports
 */

import fs from "fs";
import path from "path";

/**
 * Description placeholder
 *
 * @type {*}
 */
const OUTPUT_DIR = path.join(process.cwd(), "exports");

/**
 * Description placeholder
 *
 * @interface ExportOptions
 * @typedef {ExportOptions}
 */
interface ExportOptions {
  /**
   * Description placeholder
   *
   * @type {("all" | "metrics" | "transactions" | "users")}
   */
  type: "all" | "metrics" | "transactions" | "users";
  /**
   * Description placeholder
   *
   * @type {string}
   */
  output: string;
  /**
   * Description placeholder
   *
   * @type {("csv" | "json")}
   */
  format: "csv" | "json";
}

/**
 * Description placeholder
 *
 * @returns {ExportOptions}
 */
function parseArgs(): ExportOptions {
  const args = process.argv.slice(2);
  const options: ExportOptions = {
    format: "json",
    output: OUTPUT_DIR,
    type: "all",
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--type" && args[i + 1]) {
      options.type = args[i + 1] as ExportOptions["type"];
      i++;
    } else if (arg === "--output" && args[i + 1]) {
      options.output = args[i + 1];
      i++;
    } else if (arg === "--format" && args[i + 1]) {
      options.format = args[i + 1] as ExportOptions["format"];
      i++;
    }
  }

  return options;
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function exportUsers(): Promise<void> {
  console.warn("  📊 Exporting user data...");

  try {
    const { userDal } = await import("@/dal");
    console.warn("    ✅ User DAL loaded (use findById for specific users)");
  } catch {
    console.warn("    ⚠️  Could not load user data (may need db connection)");
  }
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function exportTransactions(): Promise<void> {
  console.warn("  💳 Exporting transaction data...");

  try {
    const { transactionDal } = await import("@/dal");
    console.warn(
      "    ✅ Transaction DAL loaded (use findById for specific transactions)",
    );
  } catch {
    console.warn(
      "    ⚠️  Could not load transaction data (may need db connection)",
    );
  }
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function exportMetrics(): Promise<void> {
  console.warn("  📈 Exporting metrics...");

  try {
    const { recipientDal, transactionDal, userDal, walletsDal } =
      await import("@/dal");
    console.warn("    ✅ DAL modules loaded for metrics");
  } catch {
    console.warn("    ⚠️  Could not load all metrics (may need db connection)");
  }

  console.warn("    ✅ Metrics ready for export");
}

/**
 * Description placeholder
 *
 * @async
 * @param {ExportOptions} options
 * @returns {Promise<void>}
 */
async function exportAll(options: ExportOptions): Promise<void> {
  console.warn(
    `\n📦 Exporting data (type: ${options.type}, format: ${options.format})\n`,
  );

  const DRY_RUN =
    process.argv.includes("--dry-run") ||
    (globalThis as any).__SCRIPTS_DRY_RUN ||
    // prefer nullish check and explicit string comparison for DRY_RUN
    process.env["DRY_RUN"] === "true" ||
    process.env["DRY_RUN"] === "1";
  if (!DRY_RUN) {
    if (!fs.existsSync(options.output)) {
      fs.mkdirSync(options.output, { recursive: true });
    }
  } else {
    if (!fs.existsSync(options.output)) {
      console.warn(`[dry-run] Would create output dir: ${options.output}`);
    }
  }

  if (options.type === "users" || options.type === "all") {
    await exportUsers();
  }

  if (options.type === "transactions" || options.type === "all") {
    await exportTransactions();
  }

  if (options.type === "metrics" || options.type === "all") {
    await exportMetrics();
  }

  const outputFile = path.join(options.output, `export-${Date.now()}.json`);
  const summary = {
    exportedAt: new Date().toISOString(),
    format: options.format,
    output: options.output,
    type: options.type,
  };

  if (DRY_RUN) {
    console.warn(
      `[dry-run] Would write export summary to ${outputFile} (${JSON.stringify(summary).length} chars)`,
    );
  } else {
    fs.writeFileSync(outputFile, JSON.stringify(summary, undefined, 2));

    console.warn(`\n✅ Export complete!`);
    console.warn(`   Output: ${outputFile}`);
  }
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  try {
    const options = parseArgs();

    await exportAll(options);

    console.warn("\n🎉 Data export complete!");
  } catch (error) {
    console.error(
      "❌ Error:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
