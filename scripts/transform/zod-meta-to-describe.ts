#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { Project, SyntaxKind } from "ts-morph";

// Simple codemod to replace zod .meta({ description: '...' }) usages
// with .describe('...') to satisfy zod/prefer-meta linting rules.
// Usage: node scripts/transform/zod-meta-to-describe.ts --dry-run
//        node scripts/transform/zod-meta-to-describe.ts --apply

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const args = process.argv.slice(2);
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const dryRun = args.includes("--dry-run") || !args.includes("--apply");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const filesArgIndex = args.indexOf("--files");
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {(string | undefined)}
 */
let filesArg: string | undefined;
if (filesArgIndex !== -1 && args.length > filesArgIndex + 1) {
  filesArg = args[filesArgIndex + 1];
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const project = new Project({
  tsConfigFilePath: path.join(process.cwd(), "tsconfig.json"),
});

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} filePath
 * @returns {{ filePath: string; sourceFile: any; }}
 */
function convertFile(filePath: string) {
  const sourceFile = project.getSourceFile(filePath);
  if (!sourceFile) return null;

  let changed = false;

  const callExpressions = sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression,
  );

  for (const call of callExpressions) {
    const expr = call.getExpression();

    // Look for property access expression ending with `.meta` e.g. z.string().min(1).meta({ description: '...' })
    if (expr.getKind() === SyntaxKind.PropertyAccessExpression) {
      const propAccess = expr.asKindOrThrow(
        SyntaxKind.PropertyAccessExpression,
      );
      const name = propAccess.getName();
      if (name !== "meta") continue;

      const callArgs = call.getArguments();
      if (callArgs.length !== 1) continue;

      const arg = callArgs[0];
      if (arg.getKind() !== SyntaxKind.ObjectLiteralExpression) continue;

      const obj = arg.asKindOrThrow(SyntaxKind.ObjectLiteralExpression);
      const descProp = obj.getProperty("description");
      if (!descProp) continue;

      // Try to find the initializer string literal
      // descProp can be a PropertyAssignment
      const initializer = (descProp as any).getInitializer?.();
      if (!initializer) continue;
      if (initializer.getKind() !== SyntaxKind.StringLiteral) continue;

      const text = initializer.getText();

      // Build replacement: take the left expression before `.meta` and append `.describe(<text>)`
      const leftExpr = propAccess.getExpression().getText();
      const newText = `${leftExpr}.describe(${text})`;

      // Replace the entire call expression with the new text
      call.replaceWithText(newText);
      changed = true;
    }
  }

  if (changed) {
    // return the modified sourceFile for either dry-run printing or writing
    return { filePath, sourceFile };
  }

  return null;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {unknown}
 */
async function findFiles() {
  // Scan src-like directories and actions/lib folders for ts/tsx files
  const glob = (await import("glob")) as any;
  const patterns: string[] = filesArg
    ? [filesArg]
    : [
        "actions/**/*.ts",
        "dal/**/*.ts",
        "lib/**/*.ts",
        "components/**/*.ts",
        "components/**/*.tsx",
      ];
  const files: string[] = [];
  for (const pattern of patterns) {
    const matches = glob.globSync(pattern, {
      absolute: true,
      cwd: process.cwd(),
    }) as string[];
    for (const m of matches) files.push(m);
  }
  return Array.from(new Set(files));
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @async
 * @returns {*}
 */
async function run() {
  const files = await findFiles();
  const results: { file: string; sourceFile: any }[] = [];

  for (const f of files) {
    try {
      const result = convertFile(f);
      if (result) results.push({ file: f, sourceFile: result.sourceFile });
    } catch {
      // ignore parse errors
    }
  }

  if (results.length === 0) {
    console.warn("No z.meta(...) -> .describe(...) transformations required");
    return;
  }

  console.warn(`Found ${results.length} files to update.`);

  for (const r of results) {
    const text = r.sourceFile.getFullText();
    if (dryRun) {
      console.warn(`--- DRY RUN: ${r.file} ---\n` + text.slice(0, 4000));
    } else {
      fs.writeFileSync(r.file, text, "utf8");
      console.warn(`Updated: ${r.file}`);
    }
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
