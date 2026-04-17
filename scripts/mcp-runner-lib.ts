import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export type DiscoveryRecord = {
  name: string;
  discoveredVia: "gateway" | "docker";
  raw?: string;
  timestamp: string;
};

const TOKEN_REGEX = /^[a-z0-9._:-]+(?:[-_][a-z0-9._:-]+)*$/i;

const DEFAULT_DENYLIST = ["adding", "configuration", "start", "total", "those"];

export function normalizeToken(t: string): string {
  return t.trim().toLowerCase().replace(/\s+/g, "-");
}

export function isValidToken(
  t: string,
  denylist: string[] = DEFAULT_DENYLIST,
): boolean {
  const n = normalizeToken(t);
  if (!TOKEN_REGEX.test(n)) return false;
  for (const d of denylist) {
    if (n.toLowerCase() === d.toLowerCase()) return false;
  }
  return true;
}

export function parseGatewayOutput(output: string): DiscoveryRecord[] {
  // Heuristic: extract lines under an "Enabled MCP Servers" table or after a header
  const lines = output.split(/\r?\n/);
  const records: DiscoveryRecord[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Common adminbot table row might be like: " - next-devtools-mcp"
    const m = line.match(/^[\-\*\s]*([A-Za-z0-9_.:\- ]+)$/);
    if (!m) continue;
    const token = normalizeToken(m[1]);
    if (!isValidToken(token)) continue;
    records.push({
      name: token,
      discoveredVia: "gateway",
      raw: rawLine,
      timestamp: new Date().toISOString(),
    });
  }

  return records;
}

export function parseDockerPsOutput(output: string): DiscoveryRecord[] {
  const lines = output.split(/\r?\n/);
  const records: DiscoveryRecord[] = [];
  for (const rawLine of lines) {
    const name = rawLine.trim();
    if (!name) continue;
    // Docker container names often have slashes or suffixes; normalize
    const token = normalizeToken(
      name.replace(/^\/+/, "").replace(/[:\/]+/g, "-"),
    );
    if (!isValidToken(token)) continue;
    records.push({
      name: token,
      discoveredVia: "docker",
      raw: rawLine,
      timestamp: new Date().toISOString(),
    });
  }
  return records;
}

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

export function readCatalog(catalogPath: string) {
  const txt = fs.readFileSync(catalogPath, "utf8");
  const obj = JSON.parse(txt);
  return obj.mcpServers as string[];
}

export function writeCatalog(catalogPath: string, servers: string[]) {
  // Compatibility shim: use atomicWriteCatalog when available
  const tmpPath = `${catalogPath}.tmp.${Date.now()}`;
  const out = { generatedAt: new Date().toISOString(), mcpServers: servers };
  fs.writeFileSync(tmpPath, JSON.stringify(out, null, 2) + "\n", "utf8");
  const backup = atomicWriteCatalog(tmpPath, catalogPath);
  return backup;
}

export function atomicWriteCatalog(tmpPath: string, finalPath: string) {
  // Backup existing
  const backup = `${finalPath}.bak.${Date.now()}`;
  if (fs.existsSync(finalPath)) fs.copyFileSync(finalPath, backup);
  // Move tmp to final (atomic on most platforms)
  fs.renameSync(tmpPath, finalPath);
  return backup;
}

export function runValidations(
  commands: { name: string; cmd: string }[],
  opts?: { timeout?: number },
) {
  const results: Array<{ name: string; ok: boolean; output: string }> = [];
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

export function rollbackRestore(backupPath: string, finalPath: string) {
  if (!fs.existsSync(backupPath))
    throw new Error(`Backup not found: ${backupPath}`);
  // Make a safety copy of current finalPath
  const safety = `${finalPath}.pre-rollback.${Date.now()}`;
  if (fs.existsSync(finalPath)) fs.copyFileSync(finalPath, safety);
  fs.copyFileSync(backupPath, finalPath);
  return { restored: finalPath, safetyCopy: safety };
}

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
      } catch (e) {
        // ignore
      }
    }
  }
  return deleted;
}

// Minimal helper template generator
export function generateHelper(serverName: string, helpersDir: string) {
  const fileName = path.join(helpersDir, `${serverName}.ts`);
  const content = `// Generated helper for ${serverName}\n// GeneratedAt: ${new Date().toISOString()}\nexport const name = '${serverName}';\n`;
  if (!fs.existsSync(helpersDir)) fs.mkdirSync(helpersDir, { recursive: true });
  if (fs.existsSync(fileName)) {
    const existing = fs.readFileSync(fileName, "utf8");
    if (existing === content) return { written: false, path: fileName };
  }
  fs.writeFileSync(fileName, content, "utf8");
  return { written: true, path: fileName };
}

export function diffLists(oldList: string[], newList: string[]) {
  const oldSet = new Set(oldList);
  const newSet = new Set(newList);
  const added = newList.filter((s) => !oldSet.has(s));
  const removed = oldList.filter((s) => !newSet.has(s));
  return { added, removed };
}
