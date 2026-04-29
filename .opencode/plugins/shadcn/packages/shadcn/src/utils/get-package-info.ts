import fs from "fs-extra";
import path from "path";
import { type PackageJson } from "type-fest";

export function getPackageInfo(
  cwd: string = "",
  shouldThrow: boolean = true,
): PackageJson | null {
  const packageJsonPath = path.join(cwd, "package.json");

  return fs.readJSONSync(packageJsonPath, {
    throws: shouldThrow,
  }) as PackageJson;
}
