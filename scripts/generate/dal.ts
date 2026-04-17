#!/usr/bin/env node

/**
 * DAL (Data Access Layer) Generator Script
 *
 * Generates new DAL files for the banking system.
 * Creates CRUD operations following the project's DAL patterns.
 *
 * Usage: tsx scripts/generate/dal.ts <tableName> [--relations]
 * Example: tsx scripts/generate/dal.ts user --relations
 */

import fs from "fs";
import path from "path";
import readline from "readline";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const DAL_DIR = path.join(process.cwd(), "lib", "dal");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SCHEMA_PATH = path.join(process.cwd(), "database", "schema.ts");

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface DALOptions
 * @typedef {DALOptions}
 */
interface DALOptions {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {boolean}
   */
  relations: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {boolean}
   */
  timestamps: boolean;
}

/** Prompt user on stdin
 * @param {string} question
 * @returns {Promise<string>}
 */
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

/** Parse CLI args and return tableName + options */
function parseArgs(): { tableName: string; options: DALOptions } {
  const args = process.argv.slice(2);
  const options: DALOptions = {
    relations: args.includes("--relations"),
    timestamps: true,
  };

  const tableName = args.find((a) => !a.startsWith("--")) ?? "";

  return { options, tableName };
}

import io from "../utils/io";

// Use centralized IO helper which respects global dry-run flags
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} filePath
 * @param {string} content
 * @returns {*}
 */
function writeFile(filePath: string, content: string) {
  // Keep legacy semantics: use global __SCRIPTS_DRY_RUN as fallback
  const dryRun = (globalThis as any).__SCRIPTS_DRY_RUN ?? undefined;
  return io.writeFile(filePath, content, { dryRun });
}

/** Convert string to PascalCase */
function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/** Convert string to camelCase based on PascalCase result */
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/** Generate TypeScript DAL file content for a table */
function generateDALContent(tableName: string, options: DALOptions): string {
  const pascalName = toPascalCase(tableName);
  const camelName = toCamelCase(tableName);

  let content = `import { eq, and } from "drizzle-orm";

import { db } from "@/database/db";
import { ${camelName}, ${pascalName}Id } from "@/database/schema";

export class ${pascalName}Dal {
  async findById(id: ${pascalName}Id) {
    const [result] = await db
      .select()
      .from(${camelName})
      .where(eq(${camelName}.id, id))
      .limit(1);
    return result ?? null;
  }

  async findAll() {
    return db.select().from(${camelName});
  }

  async create(data: InsertType<typeof ${camelName}>) {
    const [result] = await db
      .insert(${camelName})
      .values(data)
      .returning();
    return result;
  }

  async update(id: ${pascalName}Id, data: UpdateType<typeof ${camelName}>) {
    const [result] = await db
      .update(${camelName})
      .set({ ...data, updatedAt: new Date() })
      .where(eq(${camelName}.id, id))
      .returning();
    return result;
  }

  async delete(id: ${pascalName}Id) {
    const [result] = await db
      .delete(${camelName})
      .where(eq(${camelName}.id, id))
      .returning();
    return result;
  }
`;

  if (options.relations) {
    content += `
  async findWithRelations(id: ${pascalName}Id) {
    const [result] = await db
      .select()
      .from(${camelName})
      .where(eq(${camelName}.id, id))
      .limit(1);
    return result;
  }
`;
  }

  content += `}

export const ${camelName}Dal = new ${pascalName}Dal();
`;

  return content;
}

/** Generate DAL file and update index */
async function generateDAL(
  tableName: string,
  options: DALOptions,
): Promise<void> {
  if (!tableName) {
    console.error("❌ Table name is required");
    process.exit(1);
  }

  const fileName = `${tableName}.dal.ts`;
  const filePath = path.resolve(DAL_DIR, fileName);

  if (fs.existsSync(filePath)) {
    console.error(`❌ DAL file already exists: ${filePath}`);
    process.exit(1);
  }

  const schemaExists = fs.existsSync(path.resolve(SCHEMA_PATH));
  if (!schemaExists) {
    console.warn(`⚠️  Database schema not found at ${SCHEMA_PATH}`);
    console.warn("   You may need to add the table to the schema manually");
  }

  const content = generateDALContent(tableName, options);

  await writeFile(filePath, content);

  if (typeof (globalThis as any).__SCRIPTS_DRY_RUN !== "undefined") {
    if (!(globalThis as any).__SCRIPTS_DRY_RUN) {
      console.warn(`✅ Generated DAL: ${filePath}`);
    } else {
      console.warn(`[dry-run] Would generate DAL: ${filePath}`);
    }
  } else {
    // Fallback behavior when global flag is not present
    console.warn(`✅ Generated DAL: ${filePath}`);
  }

  const indexPath = path.resolve(DAL_DIR, "index.ts");
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, "utf8");
    const exportLine = `export { ${toCamelCase(tableName)}Dal } from "./${tableName}.dal";`;

    if (!indexContent.includes(exportLine)) {
      indexContent = indexContent.replace(
        /(\nexport \{[^}]*\})$/,
        `\n  ${toCamelCase(tableName)}Dal,\n$1`,
      );
      indexContent = indexContent.replace(
        /export \{$/,
        `export {\n  ${toCamelCase(tableName)}Dal,`,
      );
      // Use centralized IO helper
      await io.writeFile(indexPath, indexContent, {
        dryRun: (globalThis as any).__SCRIPTS_DRY_RUN ?? undefined,
      });
      if (!(globalThis as any).__SCRIPTS_DRY_RUN) {
        console.warn(`✅ Updated DAL index: ${indexPath}`);
      } else {
        console.warn(`[dry-run] Would update DAL index: ${indexPath}`);
      }
    }
  }
}

/** Main entrypoint for DAL generator CLI */
async function main(): Promise<void> {
  try {
    console.warn("📦 DAL Generator\n");

    const { options: parsedOptions, tableName: parsedTableName } = parseArgs();
    let tableName = parsedTableName;
    const options = parsedOptions;

    if (!tableName) {
      tableName = await prompt("Enter table name (e.g., user, transaction): ");
    }

    if (!tableName.trim()) {
      console.error("❌ Table name is required");
      process.exit(1);
    }

    const addRelations =
      options.relations ||
      (await prompt("Include relations? (y/N): ")).toLowerCase() === "y";

    options.relations = addRelations;

    await generateDAL(tableName, options);

    console.warn("\n🎉 DAL generation complete!");
    console.warn("\nNext steps:");
    console.warn(`  1. Add table "${tableName}" to database/schema.ts`);
    console.warn(`  2. Run npm run db:generate to create types`);
    console.warn(`  3. Add any custom queries to ${tableName}.dal.ts`);
  } catch (error) {
    console.error(
      "❌ Error:",
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  } finally {
    rl.close();
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  void main();
}
