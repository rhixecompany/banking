#!/usr/bin/env node

/**
 * Server Action Generator Script
 *
 * Generates new Server Action files for the banking system.
 * Creates actions following the project's patterns (Zod validation, auth, revalidatePath).
 *
 * Usage: tsx scripts/generate/action.ts <actionName> [--type <type>]
 * Example: tsx scripts/generate/action.ts create-user --type create
 */

import fs from "fs";
import path from "path";
import readline from "readline";

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
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Description placeholder
 *
 * @typedef {ActionType}
 */
type ActionType = "create" | "delete" | "get" | "list" | "update";

/**
 * Description placeholder
 *
 * @interface ActionOptions
 * @typedef {ActionOptions}
 */
interface ActionOptions {
  /**
   * Description placeholder
   *
   * @type {ActionType}
   */
  type: ActionType;
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  withValidation: boolean;
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  withRelations: boolean;
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
 * @returns {{ actionName: string; options: ActionOptions }}
 */
function parseArgs(): { actionName: string; options: ActionOptions } {
  const args = process.argv.slice(2);
  const options: ActionOptions = {
    type: "create",
    withRelations: false,
    withValidation: true,
  };

  let actionName = "";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--type" && args[i + 1]) {
      options.type = args[i + 1] as ActionType;
      i++;
    } else if (arg === "--no-validation") {
      options.withValidation = false;
    } else if (arg === "--relations") {
      options.withRelations = true;
    } else if (!arg.startsWith("--")) {
      actionName = arg;
    }
  }

  return { actionName, options };
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
 * @param {string} actionName
 * @param {ActionOptions} options
 * @returns {string}
 */
function generateActionContent(
  actionName: string,
  options: ActionOptions,
): string {
  const pascalName = toPascalCase(actionName);
  const entityName = actionName.replace(
    /^(create|update|delete|get|list)-?/,
    "",
  );

  let content = `"use server";

import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
`;

  if (options.withValidation) {
    content += `
const ${pascalName}Schema = z.object({
  id: z.string().uuid().optional(),
`;
    if (options.type === "create" || options.type === "update") {
      content += `  // Add your fields here
  name: z.string().min(1),
  email: z.string().email().optional(),
`;
    }
    content += `});

type ${pascalName}Input = z.infer<typeof ${pascalName}Schema>;
`;
  }

  content += `
export async function ${pascalName}(data: ${options.withValidation ? pascalName + "Input" : "unknown"}) {
  const session = await auth();

  if (!session?.user?.id) {
    return { ok: false, error: "Unauthorized" };
  }

  try {
`;

  switch (options.type) {
    case "create":
      content += `    const validatedData = ${options.withValidation ? pascalName + "Schema.parse(data)" : "data as any"};

    // TODO: Add DAL call here
    // const result = await ${toCamelCase(entityName)}Dal.create(validatedData);

    revalidatePath("/");

    return { ok: true };`;
      break;

    case "update":
      content += `    const validatedData = ${options.withValidation ? pascalName + "Schema.parse(data)" : "data as any"};

    if (!validatedData.id) {
      return { ok: false, error: "ID is required" };
    }

    // TODO: Add DAL call here
    // const result = await ${toCamelCase(entityName)}Dal.update(validatedData.id, validatedData);

    revalidatePath("/");

    return { ok: true };`;
      break;

    case "delete":
      content += `    const { id } = data as { id: string };

    if (!id) {
      return { ok: false, error: "ID is required" };
    }

    // TODO: Add DAL call here
    // await ${toCamelCase(entityName)}Dal.delete(id);

    revalidatePath("/");

    return { ok: true };`;
      break;

    case "get":
      content += `    const { id } = data as { id: string };

    if (!id) {
      return { ok: false, error: "ID is required" };
    }

    // TODO: Add DAL call here
    // const result = await ${toCamelCase(entityName)}Dal.findById(id);

    return { ok: true, data: null };`;
      break;

    case "list":
      content += `    // TODO: Add DAL call here
    // const results = await ${toCamelCase(entityName)}Dal.findAll();

    return { ok: true, data: [] };`;
      break;
  }

  content += `
  } catch (error) {
    console.error("${pascalName} error:", error);
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
`;

  return content;
}

/**
 * Description placeholder
 *
 * @async
 * @param {string} actionName
 * @param {ActionOptions} options
 * @returns {Promise<void>}
 */
async function generateAction(
  actionName: string,
  options: ActionOptions,
): Promise<void> {
  if (!actionName) {
    console.error("❌ Action name is required");
    process.exit(1);
  }

  const fileName = `${actionName}.ts`;
  const filePath = path.join(ACTIONS_DIR, fileName);

  if (fs.existsSync(filePath)) {
    console.error(`❌ Action file already exists: ${filePath}`);
    process.exit(1);
  }

  const content = generateActionContent(actionName, options);

  fs.writeFileSync(filePath, content);

  console.log(`✅ Generated Server Action: ${filePath}`);
}

/**
 * Description placeholder
 *
 * @async
 * @returns {Promise<void>}
 */
async function main(): Promise<void> {
  try {
    console.log("⚡ Server Action Generator\n");

    let { actionName, options } = parseArgs();

    if (!actionName) {
      actionName = await prompt("Enter action name (e.g., create-user): ");
    }

    if (!actionName.trim()) {
      console.error("❌ Action name is required");
      process.exit(1);
    }

    const actionType = await prompt(
      `Action type (create/update/delete/get/list) [${options.type}]: `,
    );
    if (actionType.trim()) {
      options.type = actionType.trim() as ActionType;
    }

    await generateAction(actionName, options);

    console.log("\n🎉 Action generation complete!");
    console.log("\nNext steps:");
    console.log(`  1. Update the schema in ${actionName}.ts`);
    console.log(`  2. Add the DAL call`);
    console.log(`  3. Add proper types from database/schema.ts`);
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
