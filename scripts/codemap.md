# Scripts Codemap

## Overview

The `scripts/` directory contains build, deployment, utility, and tooling scripts.

## Directory Structure

```
scripts/
├── ts/                    # TypeScript entrypoints
│   ├── build.ts           # Build orchestration
│   ├── orchestrator.ts    # Main orchestrator
│   ├── deploy/
│   │   └── deploy-windows.ts
│   ├── docker/
│   │   └── deploy-checklist.ts
│   ├── cleanup/
│   │   ├── cleanup-docker.ts
│   │   └── cleanup-docs.ts
│   └── utils/
│       ├── check-events.ts
│       ├── disable-extensions.ts
│       └── run-ci-checks.ts
├── generate/              # Code generation
│   ├── action.ts
│   ├── component.ts
│   ├── dal.ts
│   └── feature.ts
├── seed/                  # Database seeding
│   └── run.ts
├── utils/
│   ├── check-events.ps1   # Orchestrator → ts/utils/check-events.ts
│   ├── disable-extensions.sh  # Orchestrator
│   ├── fix-line-endings.sh   # Utility (embedded shell)
│   ├── run-ci-checks.sh     # Orchestrator
│   └── read-secrets.sh      # Special: 'source' requirement
├── deploy/
│   ├── deploy.ps1         # Orchestrator → ts/deploy/deploy-windows.ts
│   ├── deploy.sh          # Orchestrator
│   └── generate-htpasswd.sh
├── cleanup/
│   └── cleanup-docker.sh  # Orchestrator → ts/cleanup/cleanup-docker.ts
├── docker/
│   ├── entrypoint.sh      # Docker entrypoint
│   ├── generate-env.sh    # Env generation
│   └── deploy-checklist.sh # Orchestrator
├── server/
│   ├── server-setup.sh    # Server setup
│   ├── vps-setup.sh       # VPS setup (embedded shell)
│   └── gen-certs.sh       # Certificate generation
├── opencode-plugin-verify.sh  # Orchestrator
├── verify-agents.sh       # Orchestrator
└── diagnose-and-fix-git.sh    # Utility (embedded git commands)
```

## Script Categories

### Orchestrators (call TS versions)

Scripts that delegate to TypeScript in `scripts/ts/`:

- `check-events.ps1` → `ts/utils/check-events.ts`
- `deploy.ps1` → `ts/deploy/deploy-windows.ts`
- `cleanup-docker.sh` → `ts/cleanup/cleanup-docker.ts`
- `opencode-plugin-verify.sh` → `ts/opencode-plugin-verify.ts`
- `run-ci-checks.sh` → `ts/run-ci-checks.ts`
- `deploy-checklist.sh` → `ts/docker/deploy-checklist.ts`

### Utilities (embedded shell)

These stay as shell scripts due to embedded shell logic:

- `fix-line-endings.sh` - uses find/sed
- `diagnose-and-fix-git.sh` - git diagnostics
- `delete-gone-branches.sh` - branch management
- `vps-setup.sh` - VPS installation
- `read-secrets.sh` - special 'source' requirement

### Already TypeScript

Scripts already in TypeScript:

- `generate/` - code generation scripts
- `seed/` - database seeding
- `verify-rules.ts` - policy enforcement
- All scripts in `ts/` directory

## Key Patterns

1. **Orchestrators**: Shell scripts in `scripts/` that call TS versions in `scripts/ts/`
2. **Utilities**: Shell scripts with embedded shell logic that can't be converted to TS
3. **Direct TS**: Scripts that don't need shell wrapper (generate, seed, verify-rules)

## Evidence

- AGENTS.md (build-and-scripts section)
- scripts/ directory structure
- package.json scripts block
