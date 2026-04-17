## Plan: Custom MCP Server Handler in mcp-runner.ts (with Clarified Policies)

**TL;DR:** Implement a handler in `scripts/mcp-runner.ts` to manage MCP server discovery, cataloging, helper generation, and cleanup for Opencode/Copilot/Cursor. The script will:

- Parse plain text output from `docker mcp gateway run --profile adminbot`
- Auto-add new Docker MCP servers to `.opencode/mcp_servers.json` (manual approval optional, but default is auto)
- Generate all possible helpers (and any optional ones) for each server, placing them in `scripts/` and overwriting with enhanced versions
- Update `opencode.json` with the full catalog
- Remove all MCP servers from Docker that are not in the catalog, and also remove cataloged servers not running
- Support a dry-run mode (not default) for previewing actions

---

**Steps**

### Phase 1: Discovery & Cataloging

1. **Run Docker Command:** Execute `docker mcp gateway run --profile adminbot` and parse the plain text output to list all running MCP servers.
2. **Read MCP Server Catalog:** Load `.opencode/mcp_servers.json` to get the list of known MCP servers.
3. **Cross-Reference Servers:**
   - Auto-add new Docker MCP servers to the catalog (manual approval optional, but default is auto).
   - Identify servers only in Docker, only in the catalog, and in both.

### Phase 2: Catalog & Helper Generation

4. **Catalog Servers:** For each server found, add/update its entry in an in-memory Catalog.
5. **Generate Helpers:** For each cataloged server, generate all possible helpers (connection, health check, types, etc.) and any optional helpers, placing them in `scripts/` and overwriting with enhanced versions.

### Phase 3: Update Configuration

6. **Update `opencode.json`:** Write all cataloged MCP servers into `opencode.json`, ensuring the configuration reflects the current Catalog.

### Phase 4: Cleanup & Enforcement

7. **Remove Stale Servers:** Remove all MCP servers from Docker that are not in the catalog, and also remove cataloged servers not running.
8. **Ensure Loading via `mcp-runner.ts`:** Confirm all cataloged MCP servers are loaded/managed exclusively via `scripts/mcp-runner.ts`.

### Phase 5: Dry-Run Support

9. **Dry-Run Mode:** Implement a dry-run mode (not default) to preview all actions without making changes.

---

**Relevant files**

- `scripts/mcp-runner.ts` — Main handler logic, Docker integration, cataloging, and helper generation
- `.opencode/mcp_servers.json` — Source of truth for known MCP servers (auto-updated)
- `opencode.json` — Updated with all cataloged MCP servers
- `scripts/` — Location for all generated helpers (overwritten with enhanced versions)

---

**Verification**

1. Run the script (with and without dry-run) and verify:
   - All MCP servers from Docker and the catalog are correctly cataloged and helpers are generated in `scripts/`.
   - `opencode.json` is updated with the correct list of MCP servers.
   - Stale servers are removed from Docker.
   - Only cataloged servers are managed via `mcp-runner.ts`.
2. Manual check: Compare Docker state and config files before/after.
3. Automated: Use dry-run mode to print intended actions for review.

---

**Decisions & Policies**

- Docker output is plain text; parsing logic will be robust.
- New Docker MCP servers are auto-added to the catalog by default.
- All helpers (and any optional ones) are generated in `scripts/` and always overwritten with enhanced versions.
- Both cataloged servers not running and Docker servers not in the catalog are removed from Docker.
- Dry-run mode is supported but not the default.

---

**Further Considerations**

1. If the plain text Docker output format changes, parsing logic may need updates.
2. Manual approval for catalog additions can be added as a future enhancement.
3. Helper generation can be extended as new server features are added.

---

If you have any further requirements or want to provide a sample Docker output for more precise parsing, let me know! Otherwise, this plan is ready for implementation.
