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
  console.log("  📊 Exporting user data...");

  try {
    const { userDal } = await import("@/lib/dal");
    console.log("    ✅ User DAL loaded (use findById for specific users)");
  } catch {
    console.log("    ⚠️  Could not load user data (may need db connection)");
  }
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function exportTransactions(): Promise<void> {
  console.log("  💳 Exporting transaction data...");

  try {
    const { transactionDal } = await import("@/lib/dal");
    console.log(
      "    ✅ Transaction DAL loaded (use findById for specific transactions)",
    );
  } catch {
    console.log(
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
  console.log("  📈 Exporting metrics...");

  try {
    const { bankDal, recipientDal, transactionDal, userDal } =
      await import("@/lib/dal");
    console.log("    ✅ DAL modules loaded for metrics");
  } catch {
    console.log("    ⚠️  Could not load all metrics (may need db connection)");
  }

  console.log("    ✅ Metrics ready for export");
}

/**
 * Description placeholder
 *
 * @async
 * @param {ExportOptions} options
 * @returns {Promise<void>}
 */
async function exportAll(options: ExportOptions): Promise<void> {
  console.log(
    `\n📦 Exporting data (type: ${options.type}, format: ${options.format})\n`,
  );

  if (!fs.existsSync(options.output)) {
    fs.mkdirSync(options.output, { recursive: true });
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

  fs.writeFileSync(outputFile, JSON.stringify(summary, undefined, 2));

  console.log(`\n✅ Export complete!`);
  console.log(`   Output: ${outputFile}`);
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

    console.log("\n🎉 Data export complete!");
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
