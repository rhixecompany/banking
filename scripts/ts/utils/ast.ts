#!/usr/bin/env ts-node
import path from "path";
import { IndentationText, Project, SourceFile } from "ts-morph";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @returns {*}
 */
export function createProject() {
  // Use repo tsconfig if available
  const tsconfigPath = path.join(process.cwd(), "tsconfig.json");
  const project = new Project({
    compilerOptions: { allowJs: true },
    manipulationSettings: { indentationText: IndentationText.TwoSpaces },
    tsConfigFilePath: tsconfigPath,
  });
  return project;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @async
 * @param {SourceFile} source
 * @param {?string} [timestamp]
 * @returns {*}
 */
export async function saveWithBackups(source: SourceFile, timestamp?: string) {
  timestamp = timestamp ?? new Date().toISOString().replaceAll(/[:.]/g, "-");
  const filePath = source.getFilePath();
  const content = source.getFullText();
  const backup = `${filePath}.bak.${timestamp}`;
  await source.getProject().getFileSystem().writeFile(backup, content);
  await source.save();
}
