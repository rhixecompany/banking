#!/usr/bin/env node

/**
 * Component Generator Script
 *
 * Generates new React component files for the banking system.
 * Creates Server Components by default, with 'use client' option.
 *
 * Usage: tsx scripts/generate/component.ts <componentName> [--client]
 * Example: tsx scripts/generate/component.ts user-card --client
 */

import fs from "fs";
import path from "path";
import readline from "readline";

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
 * @interface ComponentOptions
 * @typedef {ComponentOptions}
 */
interface ComponentOptions {
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  client: boolean;
  /**
   * Description placeholder
   *
   * @type {boolean}
   */
  withProps: boolean;
  /**
   * Description placeholder
   *
   * @type {?string}
   */
  folder?: string;
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
 * @returns {{ componentName: string; options: ComponentOptions }}
 */
function parseArgs(): { componentName: string; options: ComponentOptions } {
  const args = process.argv.slice(2);
  const options: ComponentOptions = {
    client: args.includes("--client"),
    withProps: true,
  };

  let componentName = "";

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--client") {
      options.client = true;
    } else if (arg === "--no-props") {
      options.withProps = false;
    } else if (arg === "--folder") {
      options.folder = args[i + 1];
      i++;
    } else if (!arg.startsWith("--")) {
      componentName = arg;
    }
  }

  return { componentName, options };
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
 * @param {ComponentOptions} options
 * @returns {string}
 */
function getComponentsDir(options: ComponentOptions): string {
  if (options.folder) {
    return path.join(COMPONENTS_DIR, options.folder);
  }
  return path.join(COMPONENTS_DIR, "ui");
}

/**
 * Description placeholder
 *
 * @param {string} componentName
 * @param {ComponentOptions} options
 * @returns {string}
 */
function generateComponentContent(
  componentName: string,
  options: ComponentOptions,
): string {
  const pascalName = toPascalCase(componentName);

  let content = "";

  if (options.client) {
    content += `"use client";

`;
  }

  content += `import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
`;

  if (options.withProps) {
    content += `
interface ${pascalName}Props {
  className?: string;
  children?: React.ReactNode;
}
`;
  }

  content += `
export function ${pascalName}(${options.withProps ? "props: " + pascalName + "Props" : ""}) {
  return (
    <div${options.withProps ? ' className={twMerge("base-classes", props.className)}' : ""}>
${options.withProps ? "      {props.children}" : "      // Component content"}
    </div>
  );
}
`;

  return content;
}

/**
 * Description placeholder
 *
 * @async
 * @param {string} componentName
 * @param {ComponentOptions} options
 * @returns {Promise<void>}
 */
async function generateComponent(
  componentName: string,
  options: ComponentOptions,
): Promise<void> {
  if (!componentName) {
    console.error("❌ Component name is required");
    process.exit(1);
  }

  const componentsDir = path.resolve(getComponentsDir(options));

  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }

  const fileName = `${componentName}.tsx`;
  const filePath = path.resolve(componentsDir, fileName);

  if (fs.existsSync(filePath)) {
    console.error(`❌ Component file already exists: ${filePath}`);
    process.exit(1);
  }

  const content = generateComponentContent(componentName, options);

  fs.writeFileSync(filePath, content);

  const relativePath = path.relative(process.cwd(), filePath);
  console.warn(`✅ Generated Component: ${relativePath}`);

  if (!options.client) {
    console.warn("   (Server Component - no 'use client' directive)");
  } else {
    console.warn("   (Client Component - includes 'use client' directive)");
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
    console.warn("🎨 Component Generator\n");

    const { componentName: parsedComponentName, options } = parseArgs();
    let componentName = parsedComponentName;

    if (!componentName) {
      componentName = await prompt("Enter component name (e.g., user-card): ");
    }

    if (!componentName.trim()) {
      console.error("❌ Component name is required");
      process.exit(1);
    }

    const isClient =
      options.client ||
      (await prompt("Client component? (y/N): ")).toLowerCase() === "y";
    options.client = isClient;

    const hasNoProps =
      !options.withProps ||
      (await prompt("Include props interface? (Y/n): ")).toLowerCase() === "n";
    options.withProps = !hasNoProps;

    await generateComponent(componentName, options);

    console.warn("\n🎉 Component generation complete!");
    console.warn("\nNext steps:");
    console.warn(`  1. Add your component styles`);
    console.warn(`  2. Import and use in your pages`);
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
