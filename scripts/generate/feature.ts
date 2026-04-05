#!/usr/bin/env node

/**
 * Feature Scaffolding Generator Script
 *
 * Generates a complete feature with DAL, Server Action, and UI components.
 * Creates all the necessary files for a full-stack feature.
 *
 * Usage: tsx scripts/generate/feature.ts <featureName>
 * Example: tsx scripts/generate/feature.ts user-profile
 */

import fs from "fs";
import path from "path";
import readline from "readline";

/**
 * Description placeholder
 *
 * @type {*}
 */
const DAL_DIR = path.join(process.cwd(), "lib", "dal");
/**
 * Description placeholder
 *
 * @type {*}
 */
const ACTIONS_DIR = path.join(process.cwd(), "lib", "actions");
/**
 * Description placeholder
 *
 * @type {*}
 */
const COMPONENTS_DIR = path.join(process.cwd(), "components");

/**
 * Description placeholder
 *
 * @type {*}
 */
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Description placeholder
 *
 * @interface FeatureOptions
 * @typedef {FeatureOptions}
 */
interface FeatureOptions {
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  withCRUD: boolean;
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  withAuth: boolean;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  componentFolder: string;
}

/**
 * Description placeholder
 *
 * @param {string} question
 * @returns {Promise<string>}
 */
function prompt(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer));
  });
}

/**
 * Description placeholder
 *
 * @returns {{ featureName: string; options: FeatureOptions }}
 */
function parseArgs(): { featureName: string; options: FeatureOptions } {
  const args = process.argv.slice(2);
  const options: FeatureOptions = {
    componentFolder: "ui",
    withAuth: true,
    withCRUD: true,
  };

  let featureName = "";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--no-crud") {
      options.withCRUD = false;
    } else if (arg === "--no-auth") {
      options.withAuth = false;
    } else if (arg === "--folder" && args[i + 1]) {
      options.componentFolder = args[i + 1];
      i++;
    } else if (!arg.startsWith("--")) {
      featureName = arg;
    }
  }

  return { featureName, options };
}

/**
 * Description placeholder
 *
 * @param {string} str
 * @returns {string}
 */
function toPascalCase(str: string): string {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/**
 * Description placeholder
 *
 * @param {string} str
 * @returns {string}
 */
function toCamelCase(str: string): string {
  const pascal = toPascalCase(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

/**
 * Description placeholder
 *
 * @param {string} str
 * @returns {string}
 */
function toKebabCase(str: string): string {
  return str
    .replaceAll(/([a-z])([A-Z])/g, "$1-$2")
    .replaceAll(/[\s_]+/g, "-")
    .toLowerCase();
}

/**
 * Description placeholder
 *
 * @param {string} featureName
 * @param {FeatureOptions} options
 */
function generateDAL(featureName: string, options: FeatureOptions): void {
  const pascalName = toPascalCase(featureName);
  const camelName = toCamelCase(featureName);
  const kebabName = toKebabCase(featureName);

  let content = `import { eq } from "drizzle-orm";

import { db } from "@/database/db";
import { ${camelName}Table, type ${pascalName}Id } from "@/database/schema";

`;

  content += `export class ${pascalName}Dal {\n`;

  if (options.withCRUD) {
    content += `  async findById(id: ${pascalName}Id) {
    const [result] = await db
      .select()
      .from(${camelName}Table)
      .where(eq(${camelName}Table.id, id))
      .limit(1);
    return result ?? null;
  }

  async findAll() {
    return db.select().from(${camelName}Table);
  }

  async create(data: InsertType<typeof ${camelName}Table>) {
    const [result] = await db
      .insert(${camelName}Table)
      .values(data)
      .returning();
    return result;
  }

  async update(id: ${pascalName}Id, data: UpdateType<typeof ${camelName}Table>) {
    const [result] = await db
      .update(${camelName}Table)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(${camelName}Table.id, id))
      .returning();
    return result;
  }

  async delete(id: ${pascalName}Id) {
    const [result] = await db
      .delete(${camelName}Table)
      .where(eq(${camelName}Table.id, id))
      .returning();
    return result;
  }
`;
  } else {
    content += `  async findById(id: ${pascalName}Id) {
    const [result] = await db
      .select()
      .from(${camelName}Table)
      .where(eq(${camelName}Table.id, id))
      .limit(1);
    return result ?? null;
  }

  async findAll() {
    return db.select().from(${camelName}Table);
  }
`;
  }

  content += `}

export const ${camelName}Dal = new ${pascalName}Dal();
`;

  const filePath = path.join(DAL_DIR, `${kebabName}.dal.ts`);
  fs.writeFileSync(filePath, content);
  console.warn(`  ✅ DAL: ${path.relative(process.cwd(), filePath)}`);
}

/**
 * Description placeholder
 *
 * @param {string} featureName
 * @param {FeatureOptions} options
 */
function generateAction(featureName: string, options: FeatureOptions): void {
  const pascalName = toPascalCase(featureName);
  const camelName = toCamelCase(featureName);
  const kebabName = toKebabCase(featureName);

  let content = `"use server";

`;

  if (options.withAuth) {
    content += `import { auth } from "@/lib/auth";
`;
  }

  content += `import { revalidatePath } from "next/cache";
import { z } from "zod";

import { ${camelName}Dal } from "@/lib/dal";

`;

  if (options.withCRUD) {
    content += `const ${pascalName}Schema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
});

type ${pascalName}Input = z.infer<typeof ${pascalName}Schema>;

export async function create${pascalName}(data: ${pascalName}Input) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    const validated = ${pascalName}Schema.parse(data);
    const result = await ${camelName}Dal.create({
      ...validated,
      userId: session.user.id,
    });
    revalidatePath("/");
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to create" };
  }
}

export async function update${pascalName}(data: ${pascalName}Input & { id: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    const validated = ${pascalName}Schema.parse(data);
    const result = await ${camelName}Dal.update(data.id, validated);
    revalidatePath("/");
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to update" };
  }
}

export async function delete${pascalName}(id: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
    await ${camelName}Dal.delete(id);
    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to delete" };
  }
}
`;
  } else {
    content += `export async function get${pascalName}(id: string) {
  try {
    const result = await ${camelName}Dal.findById(id);
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to fetch" };
  }
}

export async function list${pascalName}() {
  try {
    const results = await ${camelName}Dal.findAll();
    return { ok: true, data: results };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Failed to list" };
  }
}
`;
  }

  const filePath = path.resolve(ACTIONS_DIR, `${kebabName}.actions.ts`);
  fs.writeFileSync(filePath, content);
  console.warn(`  ✅ Action: ${path.relative(process.cwd(), filePath)}`);
}

/**
 * Description placeholder
 *
 * @param {string} featureName
 * @param {FeatureOptions} options
 */
function generateComponent(featureName: string, options: FeatureOptions): void {
  const pascalName = toPascalCase(featureName);
  const kebabName = toKebabCase(featureName);
  const folderPath = path.resolve(COMPONENTS_DIR, options.componentFolder);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  const content = `"use client";

import { useState } from "react";

interface ${pascalName}FormProps {
  onSuccess?: () => void;
}

export function ${pascalName}Form({ onSuccess }: ${pascalName}FormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      // TODO: Call your action here
      // await create${pascalName}(data);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
`;

  const filePath = path.resolve(folderPath, `${kebabName}-form.tsx`);
  fs.writeFileSync(filePath, content);
  console.warn(`  ✅ Component: ${path.relative(process.cwd(), filePath)}`);
}

/**
 * Description placeholder
 *
 * @async
 * @param {string} featureName
 * @param {FeatureOptions} options
 * @returns {Promise<void>}
 */
async function generateFeature(
  featureName: string,
  options: FeatureOptions,
): Promise<void> {
  if (!featureName) {
    console.error("❌ Feature name is required");
    process.exit(1);
  }

  console.warn(`\n📦 Generating feature: ${featureName}\n`);

  generateDAL(featureName, options);
  generateAction(featureName, options);
  generateComponent(featureName, options);

  console.warn(`\n✅ Feature "${featureName}" generated successfully!`);

  console.warn("\nNext steps:");
  console.warn(
    `  1. Add table "${toKebabCase(featureName)}" to database/schema.ts`,
  );
  console.warn(`  2. Run npm run db:generate to create types`);
  console.warn(`  3. Update the component with your form fields`);
  console.warn(`  4. Add the component to your pages`);
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  try {
    console.warn("🚀 Feature Scaffolding Generator\n");

    const { featureName: parsedFeatureName, options } = parseArgs();
    let featureName = parsedFeatureName;

    if (!featureName) {
      featureName = await prompt("Enter feature name (e.g., user-profile): ");
    }

    if (!featureName.trim()) {
      console.error("❌ Feature name is required");
      process.exit(1);
    }

    const withCRUD =
      options.withCRUD ||
      (await prompt("Include CRUD operations? (Y/n): ")).toLowerCase() !== "n";
    options.withCRUD = withCRUD;

    const withAuth =
      options.withAuth ||
      (await prompt("Include authentication? (Y/n): ")).toLowerCase() !== "n";
    options.withAuth = withAuth;

    const folder = await prompt(
      `Component folder [${options.componentFolder}]: `,
    );
    if (folder.trim()) {
      options.componentFolder = folder.trim();
    }

    await generateFeature(featureName, options);

    console.warn("\n🎉 Feature scaffolding complete!");
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
