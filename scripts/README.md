# Scripts Documentation

Automation scripts for the Banking application. All scripts are available in three formats:

- **`.sh`** - Bash scripts (Linux/macOS/WSL)
- **`.ps1`** - PowerShell scripts (Windows)
- **`.bat`** - Batch scripts (Windows, runs PowerShell)

## Quick Reference

| Script | Purpose | Usage |
| --- | --- | --- |
| `docker/docker-quickstart` | Interactive Docker menu | Start/stop/build services |
| `docker/generate-env` | Generate `.env.production` | Create secure env file |
| `docker/deploy-checklist` | Pre-deployment checks | Verify readiness |
| `deploy/deploy` | Full deployment | Production deployment |
| `deploy/generate-htpasswd` | Traefik auth | Create dashboard credentials |
| `cleanup/cleanup-docker` | Docker cleanup | Prune images/containers/volumes |
| `cleanup/cleanup-docs` | Doc cleanup | Categorize and delete docs |
| `utils/build` | Docker build | Build images |
| `utils/run-ci-checks` | CI validation | Run tests/lint/type-check |
| `utils/fix-line-endings` | Git line endings | Normalize `.md` files |
| `utils/disable-extensions` | VS Code utilities | Disable heavy extensions |
| `utils/check-events` | Windows utilities | Check system events |
| `utils/check-events-detail` | Windows utilities | Detailed event checker |

## Docker Scripts

### docker-quickstart

Interactive menu for Docker operations.

```bash
# Bash
./scripts/docker/docker-quickstart.sh

# PowerShell
.\scripts\docker\docker-quickstart.ps1

# Batch
.\scripts\docker\docker-quickstart.bat
```

**Options:**

1. Start development (with Traefik)
2. Start local (direct ports)
3. Start with monitoring
4. Stop all containers
5. View logs
6. Build images
7. Run migrations
8. Clean up & restart
9. View status
10. Exit

---

### generate-env

Generates secure `.envs/production/.env.production` with random secrets.

```bash
# Bash
./scripts/docker/generate-env.sh

# PowerShell
.\scripts\docker\generate-env.ps1
```

**Output:** `.envs/production/.env.production`

---

### deploy-checklist

Checks if the project is ready for production deployment.

```bash
# Bash
./scripts/docker/deploy-checklist.sh

# PowerShell
.\scripts\docker\deploy-checklist.ps1
```

---

## Deploy Scripts

### deploy

Step-by-step production deployment with health checks.

```bash
# Bash
./scripts/deploy/deploy.sh

# PowerShell
.\scripts\deploy\deploy.ps1

# Batch
.\scripts\deploy\deploy.bat
```

**Steps:**

1. Verify prerequisites (Docker, Docker Compose)
2. Generate htpasswd for Traefik
3. Verify environment configuration
4. Build Docker image
5. Run database migrations
6. Start application
7. Verify deployment

---

### generate-htpasswd

Creates htpasswd file for Traefik dashboard authentication.

```bash
# Bash
./scripts/deploy/generate-htpasswd.sh [username] [password]

# PowerShell
.\scripts\deploy\generate-htpasswd.ps1 -Username admin -Password mypassword

# Batch
.\scripts\deploy\generate-htpasswd.bat
```

**Output:** `compose/traefik/auth/htpasswd`

---

## Server Scripts

### server-setup

Bootstrap Docker on a fresh server.

```bash
# Bash
./scripts/server/server-setup.sh

# PowerShell
.\scripts\server\server-setup.ps1

# Batch
.\scripts\server\server-setup.bat
```

---

### vps-setup

Automated VPS setup for Linux servers.

```bash
# Bash (curl installation)
curl -sSL https://raw.githubusercontent.com/rhixecompany/banking/main/scripts/server/vps-setup.sh | bash

# PowerShell
.\scripts\server\vps-setup.ps1 -Domain example.com -Email admin@example.com
```

---

### gen-certs

Generate self-signed TLS certificates for local development.

```bash
# Bash
./scripts/server/gen-certs.sh

# PowerShell
.\scripts\server\gen-certs.ps1

# Batch
.\scripts\server\gen-certs.bat
```

**Output:** `compose/traefik/certs/`

**Note:** Requires OpenSSL on Windows.

---

## Utility Scripts

### build

Docker build automation with optional migrations.

```bash
# Bash
./scripts/utils/build.sh

# PowerShell
.\scripts\utils\build.ps1

# Batch
.\scripts\utils\build.bat

# With options
./scripts/utils/build.sh --skip-migrations --env-file .env.local
```

**Options:**

- `--skip-migrations` - Skip database migrations
- `--env-file FILE` - Use specific env file

---

### run-ci-checks

Run all CI validation steps.

```bash
# Bash
./scripts/utils/run-ci-checks.sh

# PowerShell
.\scripts\utils\run-ci-checks.ps1

# Batch
.\scripts\utils\run-ci-checks.bat
```

**Steps:**

- format-check
- type-check
- lint
- build
- test-browser

---

### fix-line-endings

Normalize line endings in markdown files.

```bash
# Bash
./scripts/utils/fix-line-endings.sh

# PowerShell
.\scripts\utils\fix-line-endings.ps1

# Batch
.\scripts\utils\fix-line-endings.bat
```

---

### read-secrets

Load environment variables from Docker Compose `.env` files.

```bash
# Bash
./scripts/utils/read-secrets.sh

# PowerShell
.\scripts\utils\read-secrets.ps1
```

---

## Cleanup Scripts

### cleanup-docker

Aggressive Docker cleanup with volume pruning.

```bash
# Bash
./scripts/cleanup/cleanup-docker.sh

# PowerShell
.\scripts\cleanup\cleanup-docker.ps1 -Aggressive

# Batch
.\scripts\cleanup\cleanup-docker.bat
```

**Options:**

- `-Aggressive` - Prune volumes (WARNING: deletes data)
- `-DryRun` - Preview what would be deleted

**Scope:** Stops containers, removes images, prunes networks, optionally prunes volumes.

---

### cleanup-docs

Categorize and optionally delete duplicate/legacy documentation files.

```bash
# Bash
./scripts/cleanup/cleanup-docs.sh

# PowerShell
.\scripts\cleanup\cleanup-docs.ps1 -DryRun

# Batch
.\scripts\cleanup\cleanup-docs.bat
```

**Options:**

- `-DryRun` - Preview files that would be deleted (read-only)
- `-AutoDelete` - Automatically delete confirmed categories (C, D)
- `-Interactive` - Interactive mode (default)

**Categories:**

- **A** - Docker docs (`docs/docker/*.md`) - **KEEP**
- **B** - Integration docs (`docs/plaid/`, `docs/services/`) - **KEEP**
- **C** - Docker Swarm docs - **DELETE**
- **D** - Legacy Docker docs - **DELETE**
- **E** - Other root docs - **REVIEW** (interactive confirmation)

---

## VS Code Utilities

### disable-extensions

Disables heavy VS Code extensions to improve performance.

```powershell
# PowerShell
.\scripts\utils\disable-extensions.ps1

# Batch
.\scripts\utils\disable-extensions.bat
```

**Disabled Extensions:**

- github.copilot-chat
- eamodio.gitlens
- ms-vscode-remote.remote-containers
- mhutchie.git-graph
- quicktype.quicktype
- redis.redis-for-vscode
- github.vscode-pull-request-github
- github.vscode-github-actions
- gruntfuggly.todo-tree

**Note:** Requires VS Code with settings.json accessible. Restart VS Code after running.

---

## Windows System Utilities

### check-events

Checks Windows System log for bugcheck and power-related events.

```powershell
# PowerShell
.\scripts\utils\check-events.ps1

# Batch
.\scripts\utils\check-events.bat
```

**Filters:**

- BugCheck events
- Kernel-Power events
- Power-Troubleshooter events
- WHEA-Logger events
- microsoft-windows-kernel events

---

### check-events-detail

Gets detailed power-related events with specific event IDs.

```powershell
# PowerShell
.\scripts\utils\check-events-detail.ps1

# Batch
.\scripts\utils\check-events-detail.bat
```

**Event IDs Checked:** 41, 42, 43, 1001, 1002, 1074, 1076

**Note:** Requires Administrator privileges for some event queries.

---

## Platform Support

| Script | Linux | macOS | Windows (PowerShell) | Windows (CMD) |
| --- | --- | --- | --- | --- |
| docker-quickstart | ✓ | ✓ | ✓ | ✓ |
| generate-env | ✓ | ✓ | ✓ | ✓ |
| deploy-checklist | ✓ | ✓ | ✓ | ✓ |
| deploy | ✓ | ✓ | ✓ | ✓ |
| generate-htpasswd | ✓ | ✓ | ✓ | ✓ |
| cleanup-docker | ✓ | ✓ | ✓ | ✓ |
| cleanup-docs | ✓ | ✓ | ✓ | ✓ |
| server-setup | ✓ | ✓ | ✓ | ✓ |
| vps-setup | ✓ | ✓ | ✓ | ✓ |
| gen-certs | ✓ | ✓ | ✓\* | ✓\* |
| build | ✓ | ✓ | ✓ | ✓ |
| run-ci-checks | ✓ | ✓ | ✓ | ✓ |
| fix-line-endings | ✓ | ✓ | ✓ | ✓ |
| read-secrets | ✓ | ✓ | ✓ | ✓ |
| disable-extensions | - | - | ✓ | ✓ |
| check-events | - | - | ✓ | ✓ |
| check-events-detail | - | - | ✓ | ✓ |

\*Requires OpenSSL installed \*\*Windows utilities only (no Linux/macOS support)

---

## Common Workflows

### Development Setup

```bash
# 1. Generate environment file
./scripts/docker/generate-env.sh

# 2. Edit with real values
nano .envs/production/.env.production

# 3. Generate Traefik htpasswd
./scripts/deploy/generate-htpasswd.sh

# 4. Start services
./scripts/docker/docker-quickstart.sh
# Select option 1 (start default)
```

### Production Deployment

```bash
# Full deployment
./scripts/deploy/deploy.sh

# Or step by step:
./scripts/docker/generate-env.sh
./scripts/deploy/generate-htpasswd.sh
./scripts/docker/deploy-checklist.sh
./scripts/utils/build.sh
docker compose --profile init up
docker compose up -d
```

### CI/Validation

```bash
# Run all checks
./scripts/utils/run-ci-checks.sh

# Or individual:
npm run type-check
npm run lint
npm run test:browser
```
