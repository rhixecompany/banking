// Provenance: batch2 convert-scripts
// TypeScript Node script — target ES2022 (no external deps)
import { promises as fs } from "fs";
import path from "path";

const DISABLED_EXTENSIONS = [
  "github.copilot-chat",
  "eamodio.gitlens",
  "ms-vscode-remote.remote-containers",
  "mhutchie.git-graph",
  "quicktype.quicktype",
  "redis.redis-for-vscode",
  "github.vscode-pull-request-github",
  "github.vscode-github-actions",
  "gruntfuggly.todo-tree",
];

function getSettingsPath(): string {
  const platform = process.platform;
  if (platform === "win32") {
    return path.join(
      process.env.APPDATA || "",
      "Code",
      "User",
      "settings.json",
    );
  }
  if (platform === "darwin") {
    return path.join(
      process.env.HOME || "",
      "Library",
      "Application Support",
      "Code",
      "User",
      "settings.json",
    );
  }
  // default to linux-style
  return path.join(
    process.env.HOME || "",
    ".config",
    "Code",
    "User",
    "settings.json",
  );
}

function isoTimestampForFilename(d: Date): string {
  // ISO-ish without characters invalid in filenames (remove colons)
  return d.toISOString().replace(/:/g, "").slice(0, 19);
}

async function readJsonFile(filePath: string): Promise<any> {
  try {
    const raw = await fs.readFile(filePath, { encoding: "utf8" });
    if (!raw.trim()) return {};
    try {
      return JSON.parse(raw);
    } catch (err) {
      // If parsing fails, return {} (spec says treat missing as {}) but preserve ability to back up original on apply
      return {};
    }
  } catch (err: any) {
    if (err && (err.code === "ENOENT" || err.code === "ENOTDIR")) {
      return {};
    }
    throw err;
  }
}

async function writeJsonFile(
  filePath: string,
  obj: any,
  makeBackup: boolean,
): Promise<void> {
  const dir = path.dirname(filePath);
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    // ignore
  }

  let hadExisting = false;
  try {
    await fs.access(filePath);
    hadExisting = true;
  } catch (_) {
    hadExisting = false;
  }

  if (hadExisting && makeBackup) {
    const timestamp = isoTimestampForFilename(new Date());
    const bakName = `${filePath}.bak.${timestamp}`;
    // copy original to backup
    await fs.copyFile(filePath, bakName);
  }

  const content = JSON.stringify(obj, null, 2) + "\n";
  await fs.writeFile(filePath, content, { encoding: "utf8" });
}

async function main(): Promise<number> {
  const args = process.argv.slice(2);
  const hasApply = args.includes("--apply");
  const hasDry = args.includes("--dry-run");

  // If neither specified, default to dry-run per spec
  const doApply = hasApply;
  const doDry = hasDry || !hasApply;

  const settingsPath = getSettingsPath();

  try {
    const before = await readJsonFile(settingsPath);

    // Ensure we have an object
    const beforeObj =
      typeof before === "object" && before !== null ? before : {};

    // Build after object (clone shallow)
    const afterObj: any = { ...beforeObj };
    // set the property
    afterObj["extensions.disabled"] = DISABLED_EXTENSIONS.slice();

    const changed =
      JSON.stringify(beforeObj, Object.keys(beforeObj).sort()) !==
      JSON.stringify(afterObj, Object.keys(afterObj).sort());

    const result = {
      path: settingsPath,
      changed,
      before: beforeObj,
      after: afterObj,
    };

    if (doDry) {
      // short human summary line
      console.log(`${settingsPath}: ${changed ? "would change" : "no change"}`);
      // then JSON
      console.log(JSON.stringify(result, null, 2));
      return 0;
    }

    // apply
    await writeJsonFile(settingsPath, afterObj, true);
    // Print same summary + JSON to stdout
    console.log(`${settingsPath}: ${changed ? "changed" : "no change"}`);
    console.log(JSON.stringify(result, null, 2));
    return 0;
  } catch (err: any) {
    // On error, print to stderr and exit non-zero when --apply; for dry-run this shouldn't occur normally
    console.error("Error:", err && err.message ? err.message : String(err));
    if (doApply) return 1;
    return 0;
  }
}

// Execute
main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error("Unhandled error:", err);
    process.exit(1);
  });
