import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @interface DiscoveryRecord
 * @typedef {DiscoveryRecord}
 */
export interface DiscoveryRecord {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  name: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {("docker" | "gateway")}
   */
  discoveredVia: "docker" | "gateway";
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  raw?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {string}
   */
  timestamp: string;
}

// Validate tokens using an iterative check to avoid complex regexes that can
// be vulnerable to super-linear backtracking. This is intentionally simple
// and avoids nested quantifiers.
/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {string} s
 * @returns {boolean}
 */
function isAsciiTokenString(s: string) {
  if (!s || s.length === 0) return false;
  // must not start or end with separator
  const first = s.charAt(0);
  const last = s.charAt(s.length - 1);
  if (first === "-" || first === "_") return false;
  if (last === "-" || last === "_") return false;

  let prevWasSep = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s.charAt(i);
    const code = ch.charCodeAt(0);
    // allow a-z, A-Z, 0-9
    const isAlphaNum =
      (code >= 48 && code <= 57) ||
      (code >= 65 && code <= 90) ||
      (code >= 97 && code <= 122);
    const isAllowedPunct =
      ch === "." || ch === ":" || ch === "-" || ch === "_" || ch === "/";
    if (!isAlphaNum && !isAllowedPunct) return false;
    const isSep = ch === "-" || ch === "_";
    if (isSep && prevWasSep) return false; // no consecutive separators
    prevWasSep = isSep;
  }
  return true;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{}}
 */
const DEFAULT_DENYLIST = ["adding", "configuration", "start", "total", "those"];

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} t
 * @returns {string}
 */
export function normalizeToken(t: string): string {
  return t.trim().toLowerCase().replaceAll(/\s+/g, "-");
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} t
 * @param {string[]} [denylist=DEFAULT_DENYLIST]
 * @returns {boolean}
 */
export function isValidToken(
  t: string,
  denylist: string[] = DEFAULT_DENYLIST,
): boolean {
  const n = normalizeToken(t);
  if (!isAsciiTokenString(n)) return false;
  for (const d of denylist) {
    if (n.toLowerCase() === d.toLowerCase()) return false;
  }
  return true;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} output
 * @returns {DiscoveryRecord[]}
 */
export function parseGatewayOutput(output: string): DiscoveryRecord[] {
  // Heuristic: extract lines under an "Enabled MCP Servers" table or after a header
  const lines = output.split(/\r?\n/);
  const records: DiscoveryRecord[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Common adminbot table row might be like: " - next-devtools-mcp"
    // Use a simpler, safer regex that avoids overlapping quantifiers.
    // Match a contiguous token of allowed characters, trimming common leading markers
    const m = line.match(/[-*]?\s*([\w.:/-]+)/);
    if (!m) continue;
    const token = normalizeToken(m[1]);
    if (!isValidToken(token)) continue;
    records.push({
      discoveredVia: "gateway",
      name: token,
      raw: rawLine,
      timestamp: new Date().toISOString(),
    });
  }

  return records;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} output
 * @returns {DiscoveryRecord[]}
 */
export function parseDockerPsOutput(output: string): DiscoveryRecord[] {
  const lines = output.split(/\r?\n/);
  const records: DiscoveryRecord[] = [];
  for (const rawLine of lines) {
    const name = rawLine.trim();
    if (!name) continue;
    // Docker container names often have slashes or suffixes; normalize
    const token = normalizeToken(
      name.replace(/^\/+/, "").replaceAll(/[:/]+/g, "-"),
    );
    if (!isValidToken(token)) continue;
    records.push({
      discoveredVia: "docker",
      name: token,
      raw: rawLine,
      timestamp: new Date().toISOString(),
    });
  }
  return records;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string[]} existing
 * @param {DiscoveryRecord[]} discovered
 * @returns {*}
 */
export function mergeCatalog(
  existing: string[],
  discovered: DiscoveryRecord[],
) {
  const set = new Set(existing.map((s) => s.toLowerCase()));
  const merged = existing.slice();
  for (const d of discovered) {
    if (!set.has(d.name.toLowerCase())) {
      merged.push(d.name);
      set.add(d.name.toLowerCase());
    }
  }
  return merged;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} catalogPath
 * @returns {string[]}
 */
export function readCatalog(catalogPath: string) {
  const txt = fs.readFileSync(catalogPath, "utf8");
  const obj = JSON.parse(txt);
  return obj.mcpServers as string[];
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} catalogPath
 * @param {string[]} servers
 * @returns {string}
 */
export function writeCatalog(catalogPath: string, servers: string[]) {
  // Compatibility shim: use atomicWriteCatalog when available
  const tmpPath = `${catalogPath}.tmp.${Date.now()}`;
  const out = { generatedAt: new Date().toISOString(), mcpServers: servers };
  fs.writeFileSync(tmpPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  const backup = atomicWriteCatalog(tmpPath, catalogPath);
  return backup;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} tmpPath
 * @param {string} finalPath
 * @returns {string}
 */
export function atomicWriteCatalog(tmpPath: string, finalPath: string) {
  // Backup existing
  const backup = `${finalPath}.bak.${Date.now()}`;
  if (fs.existsSync(finalPath)) fs.copyFileSync(finalPath, backup);
  // Move tmp to final (atomic on most platforms)
  fs.renameSync(tmpPath, finalPath);
  return backup;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {{ name: string; cmd: string }[]} commands
 * @param {?{ timeout?: number }} [opts]
 * @returns {{}}
 */
export function runValidations(
  commands: { name: string; cmd: string }[],
  opts?: { timeout?: number },
) {
  const results: { name: string; ok: boolean; output: string }[] = [];
  for (const c of commands) {
    try {
      const out = execSync(c.cmd, {
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
        timeout: opts?.timeout ?? 120000,
      });
      results.push({
        name: c.name,
        ok: true,
        output: String(out).slice(0, 20000),
      });
    } catch (err: any) {
      const out = (err.stdout ?? err.message ?? String(err)).toString();
      results.push({ name: c.name, ok: false, output: out.slice(0, 20000) });
    }
  }
  return results;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} backupPath
 * @param {string} finalPath
 * @returns {{ restored: string; safetyCopy: string; }}
 */
export function rollbackRestore(backupPath: string, finalPath: string) {
  if (!fs.existsSync(backupPath))
    throw new Error(`Backup not found: ${backupPath}`);
  // Make a safety copy of current finalPath
  const safety = `${finalPath}.pre-rollback.${Date.now()}`;
  if (fs.existsSync(finalPath)) fs.copyFileSync(finalPath, safety);
  fs.copyFileSync(backupPath, finalPath);
  return { restored: finalPath, safetyCopy: safety };
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} dir
 * @param {number} olderThanDays
 * @returns {{}}
 */
export function pruneBackups(dir: string, olderThanDays: number) {
  const deleted: string[] = [];
  if (!fs.existsSync(dir)) return deleted;
  const files = fs.readdirSync(dir);
  const now = Date.now();
  const cutoff = now - olderThanDays * 24 * 60 * 60 * 1000;
  for (const f of files) {
    if (f.includes(".bak.")) {
      const full = path.join(dir, f);
      try {
        const stat = fs.statSync(full);
        if (stat.mtimeMs < cutoff) {
          fs.unlinkSync(full);
          deleted.push(full);
        }
      } catch {
        // ignore
      }
    }
  }
  return deleted;
}

// Minimal helper template generator
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string} serverName
 * @param {string} helpersDir
 * @returns {{ path: any; written: boolean; }}
 */
export function generateHelper(serverName: string, helpersDir: string) {
  const fileName = path.join(helpersDir, `${serverName}.ts`);
  const content = `// Generated helper for ${serverName}\n// GeneratedAt: ${new Date().toISOString()}\nexport const name = '${serverName}';\n`;
  if (!fs.existsSync(helpersDir)) fs.mkdirSync(helpersDir, { recursive: true });
  if (fs.existsSync(fileName)) {
    const existing = fs.readFileSync(fileName, "utf8");
    if (existing === content) return { path: fileName, written: false };
  }
  fs.writeFileSync(fileName, content, "utf8");
  return { path: fileName, written: true };
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {string[]} oldList
 * @param {string[]} newList
 * @returns {{ added: any; removed: any; }}
 */
export function diffLists(oldList: string[], newList: string[]) {
  const oldSet = new Set(oldList);
  const newSet = new Set(newList);
  const added = newList.filter((s) => !oldSet.has(s));
  const removed = oldList.filter((s) => !newSet.has(s));
  return { added, removed };
}
