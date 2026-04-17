import fs from "fs";
import { join } from "path";
import { describe, expect, it } from "vitest";

import {
  atomicWriteCatalog,
  rollbackRestore,
  runValidations,
} from "../../scripts/mcp-runner-lib";

describe("mcp-runner verify and rollback helpers", () => {
  it("atomicWriteCatalog creates backup and moves file", () => {
    const tmp = join(__dirname, "../tmp/catalog.tmp.json");
    const final = join(__dirname, "../tmp/catalog.json");
    const backupPattern = `${final}.bak.`;
    if (!fs.existsSync(join(__dirname, "../tmp")))
      fs.mkdirSync(join(__dirname, "../tmp"), { recursive: true });
    fs.writeFileSync(tmp, JSON.stringify({ mcpServers: ["test"] }));
    if (fs.existsSync(final)) fs.unlinkSync(final);
    const backup = atomicWriteCatalog(tmp, final);

    expect(fs.existsSync(final)).toBe(true);
    expect(backup.startsWith(backupPattern)).toBe(true);
  });

  it("rollbackRestore restores backup and creates safety copy", () => {
    const final = join(__dirname, "../tmp/rollback-final.json");
    const backup = join(__dirname, "../tmp/rollback-backup.json");
    fs.writeFileSync(final, JSON.stringify({ mcpServers: ["orig"] }));
    fs.writeFileSync(backup, JSON.stringify({ mcpServers: ["restored"] }));
    const res = rollbackRestore(backup, final);

    expect(fs.existsSync(final)).toBe(true);
    const content = JSON.parse(fs.readFileSync(final, "utf8"));
    expect(content.mcpServers[0]).toBe("restored");
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(fs.existsSync(res.safetyCopy)).toBe(true);
  });

  it("runValidations returns structured results", () => {
    const cmds = [{ name: "echo", cmd: "node -v" }];
    const res = runValidations(cmds as any, { timeout: 2000 });
    expect(res.length).toBeGreaterThan(0);
    expect(res[0]).toHaveProperty("name");
    expect(res[0]).toHaveProperty("ok");
  });
});
