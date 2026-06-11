# Spec: codebase-overhaul-v2

Scope: feature

# Codebase Overhaul Feature Spec

## Overview

Comprehensive codebase overhaul implementing Phase 0-5 from run-tasks.txt with consolidated tasks, documentation refresh, component/test/script enhancement, and MCP server management.

## Key Constraints

- Skip `./components/ui/` in all component work
- Bash/PowerShell scripts = orchestrators only; all logic in TypeScript
- Use ts-morph for AST-safe script operations
- All Server Actions return `{ ok: boolean; error?: string; ...payload }`
- Never import DB in `app/` or `components/`; use DAL helpers
- Use `app-config.ts` — never `process.env` directly
- `app/page.tsx` must remain public and static
- **NO typecheck/lint/tests until end of Phase 4**

## Phase 0: Documentation Refresh

### 0.1 Map Codebase to Docs

| Output File                 | Content                             |
| --------------------------- | ----------------------------------- |
| `docs/custom-components.md` | Component inventory (update)        |
| `docs/app-pages.md`         | Page inventory with routes (update) |
| `docs/test-context.md`      | Test inventory (update)             |
| `docs/scripts.md`           | Script inventory (update)           |

**Implementation:**

```typescript
// Script to scan and generate docs
// scripts/ts/docs/generate-docs.ts
interface DocEntry {
  path: string;
  type: "component" | "page" | "test" | "script";
  name: string;
  details: Record<string, unknown>;
}
```

### 0.2 Script Triage

**Catalog pattern:**

```typescript
interface ScriptEntry {
  path: string;
  type: "orchestrator" | "logic";
  purpose: string;
  dryRun: boolean;
  dependencies: string[];
}
```

---

## Phase 1: Component & Test Cleanup

### 1.1 Component Enhancement

**Target folders:** All in `components/` except `ui/`

```typescript
// Example: Ensure props are fully typed
interface Props {
  title: string;
  items: Array<{ id: string; name: string }>;
  onAction?: (id: string) => void;
}

// Add JSDoc/TSDoc
/**
 * Component description
 * @component
 * @example
 * <Component title="Hello" items={[]} />
 */
```

### 1.2 Test Enhancement

**Vitest (37 specs):** `tests/unit/**/*.test.ts` **Playwright (10 specs):** `tests/e2e/**/*.spec.ts`

```typescript
// Ensure deterministic auth in Playwright
import { seedUser } from "./helpers/auth";
await seedUser(page, "seed-user@example.com", "password123");

// Use mock Plaid
import { addMockPlaidInitScript } from "./helpers/plaid.mock";
await addMockPlaidInitScript(page);
```

---

## Phase 2: Route Analysis

### Analysis Order

1. `(auth)` — sign-in, sign-up
2. `(admin)` — admin dashboard
3. `(root)` — dashboard, wallets, transactions, transfer, settings
4. `app/page.tsx` — landing (must stay static)
5. `app/demo/` — demo pages

**For each route, document:**

- Route path
- Server wrapper component
- Auth requirement
- DAL usage
- Server Actions used

---

## Phase 3: Generic Layout Components

### Components to Create in `./components/layouts/`

| Component | Purpose | Key Props |
| --- | --- | --- |
| `generic-page-shell` | Reusable page container | `title`, `description`, `children`, `actions`, `loading` |
| `generic-data-table` | Type-safe table | `data: T[]`, `columns: Column<T>[]`, `onRowClick`, `pagination` |
| `generic-card` | Card with slots | `header`, `body`, `footer` |
| `generic-form` | Form with validation | `schema`, `onSubmit`, `defaultValues` |
| `generic-modal` | Accessible modal | `isOpen`, `onClose`, `title`, `children` |
| `generic-toast` | Toast notifications | `message`, `type`, `duration` |
| `generic-skeleton` | Loading skeleton | `variant`, `width`, `height` |
| `generic-empty-state` | Empty state | `title`, `description`, `action` |

**Example:**

```typescript
// components/layouts/generic-page-shell/index.tsx
interface GenericPageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
}

export function GenericPageShell({
  title,
  description,
  children,
  actions,
  loading
}: GenericPageShellProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {loading ? <GenericSkeleton /> : children}
    </div>
  );
}
```

---

## Phase 4: Script Enhancement

### 4.1 ts-morph Integration

```bash
bun add -D ts-morph
```

### 4.2 Shell Script Pattern (Before/After)

**Before (BAD):**

```bash
#!/bin/bash
# Logic in shell - BAD
for file in $(find . -name "*.ts"); do
  echo "Processing $file"
done
```

**After (GOOD):**

```bash
#!/bin/bash
# Orchestrator only - GOOD
bunx tsx scripts/ts/utils/process-files.ts "$@"
```

### 4.3 Dry-Run Support

```typescript
// scripts/ts/utils/process-files.ts
import { Project } from "ts-morph";
import { parseArgs } from "util";

interface Options {
  dryRun: boolean;
  verbose: boolean;
}

export async function processFiles(args: string[]): Promise<void> {
  const options = parseArgs({
    options: {
      "dry-run": { type: "boolean", default: false },
      verbose: { type: "boolean", default: false }
    },
    args
  });

  const project = new Project({
    tsConfigFilePath: "./tsconfig.json"
  });

  if (options.values.dryRun) {
    console.log("[DRY RUN] Would process X files");
    return;
  }
  // Actual processing...
}
```

---

## Phase 5: Agent Documentation

### 5.1 init-enhanced.md

Location: `.opencode/commands/init-enhanced.md`

```markdown
---
category: initialization
description: Initialize enhanced agent documentation and rules
---

# Initialize Enhanced Agent Documentation

## Purpose

Update Agentic Documentation and Rules for the Banking app repository.

## When to Use

- User asks to "mine prior chats", "maintain AGENTS.md", or "run continual-learning loop"

## Process

1. Make AGENTS.md the Canonical Source
2. Standardize .opencode/commands/ and .opencode/specs/ locations
3. Rewrite overlapping instructions to prevent drift
```

### 5.2 Agent Files to Audit

- `.opencode/agent/eval-runner.md` - verify consistency with repo

---

## Phase 6: MCP Server Management

### 6.1 mcp-runner.ts Enhancement

```typescript
// scripts/mcp-runner.ts
interface MCPServer {
  name: string;
  type: "local" | "npx" | "docker";
  command: string;
  args?: string[];
}

export async function installMCPServer(
  config: MCPServer
): Promise<void> {
  // Implementation for installing MCP servers
}

export async function catalogServers(
  profile: string
): Promise<MCPServer[]> {
  // Run docker mcp gateway and parse output
}
```

### 6.2 Docker MCP Server Operations

**Commands to implement:**

- `mcp-find` — search for MCP servers
- `mcp-add` — add MCP server
- `mcp-remove` — remove MCP server
- `mcp-exec` — execute MCP command
- `mcp-config-set` — set configuration
- `mcp-create-profile` — create profile (adminbot)
- `mcp-activate-profile` — activate profile
- `code-mode` — toggle code mode
- `mcp-discover` — discover available servers

### 6.3 Servers to Remove (Local)

| Server                 | SHA       |
| ---------------------- | --------- |
| mcp/context7           | 1174e6... |
| mcp/fetch              | 302c62... |
| mcp/filesystem         | 35fcf0... |
| mcp/memory             | db0c2d... |
| mcp/next-devtools-mcp  | 3064e3... |
| mcp/playwright         | 64d024... |
| mcp/sequentialthinking | cd3174... |
| mcp/time               | 9c46a9... |
| mcp/youtube-transcript | b70b13... |

---

## Validation (After All Tasks)

```bash
bun run format && bun run type-check && bun run lint:strict && bun run verify:rules && bun run test:browser && bun run test:ui
```

---

## File References

| Path                                  | Purpose              |
| ------------------------------------- | -------------------- |
| `docs/custom-components.md`           | Component inventory  |
| `docs/app-pages.md`                   | Page inventory       |
| `docs/test-context.md`                | Test inventory       |
| `docs/scripts.md`                     | Script inventory     |
| `.opencode/commands/init-enhanced.md` | Agent initialization |
| `scripts/mcp-runner.ts`               | MCP server handler   |
| `.opencode/opencode.json`             | MCP server config    |
| `.opencode/agent/*.md`                | Agent documentation  |
| `components/layouts/`                 | Generic components   |

---

## Sub-Agent Assignments

| Phase      | Sub-Agent              | Purpose               |
| ---------- | ---------------------- | --------------------- |
| Phase 0    | explore                | Documentation mapping |
| Phase 1a   | refactoring-specialist | Component cleanup     |
| Phase 1b   | test-automator         | Test enhancement      |
| Phase 2    | nextjs-developer       | Route analysis        |
| Phase 3a   | frontend-design        | Generic components    |
| Phase 3b   | fullstack-developer    | Full modification     |
| Phase 4a   | tooling-engineer       | Script enhancement    |
| Phase 4b   | devops-engineer        | npm scripts           |
| Phase 5    | documentation-engineer | Agent docs            |
| Phase 6a-c | tooling-engineer       | MCP servers           |
| Phase 7    | documentation-engineer | Agent files audit     |
