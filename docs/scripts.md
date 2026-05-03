# Scripts Inventory

This document catalogs all executable scripts in the `scripts/` directory, their purpose, and usage patterns.

## Overview

Scripts follow the **thin wrapper pattern**: shell scripts (`*.sh`) are minimal orchestrators that call TypeScript implementations (`*.ts`). All business logic resides in TypeScript for cross-platform compatibility and testability.

## Script Structure

```
scripts/
├── *.sh                    # Thin wrappers (orchestrators only)
├── orchestrator.ts          # Main orchestration entrypoint
├── ts/                    # TypeScript implementations
│   ├── build.ts
│   ├── deploy/
│   ├── cleanup/
│   ├── docker/
│   ├── server/
│   └── ...
├── utils/                  # Shared utilities
├── seed/                  # Database seeding
├── db/                    # Database migrations
└── validate/             # Validation helpers
```

## Key Scripts

### Orchestration

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/orchestrator.sh` | Main task orchestrator | `./scripts/orchestrator.sh <task> [args]` |
| `scripts/plan-ensure.sh` | Plan validation | `./scripts/plan-ensure.sh <plan>` |

### Build & Deploy

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/ts/build.ts` | Build process | `bunx tsx scripts/ts/build.ts [--profile=<name>]` |
| `scripts/ts/deploy/deploy.ts` | Deployment | `bunx tsx scripts/ts/deploy/deploy.ts [--dry-run]` |

### Development

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/ts/run-ci-checks.ts` | CI checks | `bunx tsx scripts/ts/run-ci-checks.ts` |
| `scripts/verify-rules.ts` | Policy verification | `bun run verify:rules` |

### Database

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/seed/run.ts` | Seed database | `bun run db:seed [--dry-run]` |
| `scripts/db/apply-migrations.ts` | Apply migrations | `bun run db:push` |

### Utilities

| Script | Purpose |
|--------|---------|
| `scripts/utils/io.ts` | Centralized IO with dry-run support |
| `scripts/ts/utils/cli.ts` | CLI flag parsing |
| `scripts/utils/ast/ts-morph-utils.ts` | AST manipulation helpers |

## Dry-Run Mode

All destructive scripts support `--dry-run` (default) and `--apply` flags.

### Usage

```bash
# Preview changes (default)
bunx tsx scripts/some-mutation-script.ts

# Apply changes explicitly
bunx tsx scripts/some-mutation-script.ts --apply
```

### Environment Variables

- `DRY_RUN=1` - Force dry-run mode
- `__SCRIPTS_DRY_RUN` - Global dry-run flag (used by utilities)

### Centralized Helpers

```typescript
// scripts/utils/io.ts
import { isDryRun, writeFile, mkdirp, removeFile } from "./utils/io";

await writeFile("path/to/file.txt", "content");
// Logs "[dry-run] writeFile" when dry-run is enabled

// scripts/ts/utils/cli.ts
import { parseCli } from "./ts/utils/cli";

const cli = parseCli();
// cli.dryRun, cli.apply, cli.verbose, cli.help
```

## Shell Wrapper Pattern

All shell scripts follow this template:

```bash
#!/usr/bin/env bash
set -euo pipefail
SCRIPT_DIR=$(dirname "$(realpath "$0")")
REPO_ROOT=$(realpath "$SCRIPT_DIR/..")
cd "$REPO_ROOT"
bunx tsx scripts/ts/implementation.ts "$@"
```

## Provenance

Scripts include provenance comments for traceability:

```bash
# Provenance: batch5 convert-scripts
```

## Categories

- **build** - Build & compilation
- **deploy** - Deployment orchestration
- **maintenance** - Cleanup & fixes
- **docker** - Docker Compose utilities
- **server** - Server setup
- **seed** - Database seeding
- **db** - Database migrations
- **validate** - Validation helpers
- **transform** - Code transformations
- **codemod** - Codemod utilities

## Common Commands

```bash
# Run all CI checks
bun run validate

# Verify rules
bun run verify:rules

# Seed database
bun run db:seed

# Build
bun run build
```