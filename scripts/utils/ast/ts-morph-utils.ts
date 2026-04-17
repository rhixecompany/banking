import { Project } from "ts-morph";

/**
 * Replace import module specifier in a TypeScript/TSX file using ts-morph.
 * Returns the new source text when dryRun=true, otherwise writes the file.
 */
export function replaceImportPath(
  filePath: string,
  fromModule: string,
  toModule: string,
  dryRun = true,
): string {
  const project = new Project({ tsConfigFilePath: "tsconfig.json" });
  const source = project.addSourceFileAtPathIfExists(filePath);
  if (!source) throw new Error(`file not found: ${filePath}`);
  source.getImportDeclarations().forEach((imp) => {
    if (imp.getModuleSpecifierValue() === fromModule) {
      imp.setModuleSpecifier(toModule);
    }
  });
  if (!dryRun) source.saveSync();
  return source.getFullText();
}

export default replaceImportPath;
