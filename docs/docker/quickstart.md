# Quick Start Guide

Get the Banking app running with Docker in under 5 minutes.

## Prerequisites

- Docker Engine 24.0+
- Docker Compose v2.20+
- 4GB RAM

## Step 1: Clone and Setup

```bash
git clone https://github.com/rhixecompany/banking.git
cd banking
```

## Step 2: Environment File

Create `.envs/local/.env.local`:

```bash
# Core
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENCRYPTION_KEY=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:postgres@db:5432/banking

# Redis
REDIS_PASSWORD=your-secure-password

# Optional: Plaid (for bank linking)
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox

# Optional: Dwolla (for transfers)
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
```

## Step 3: Generate htpasswd for Traefik

```bash
# Linux/macOS
bash scripts/generate-htpasswd.sh admin your-password

# Windows (requires htpasswd or openssl)
.\scripts\generate-htpasswd.sh admin your-password
```

## Step 4: Start Services

```bash
# Start all services (app + db + redis + traefik)
docker compose up -d

# Or start with monitoring (prometheus + grafana)
docker compose --profile monitoring up -d
```

## Step 5: Initialize Database

```bash
# Run migrations
docker compose --profile init up

# Stop migration container
docker compose --profile init down
```

## Step 6: Verify

```bash
# Check services
docker compose ps

# Test health endpoint
curl http://localhost:3000/api/health
```

## Access Points

| Service | URL | Credentials |
| --- | --- | --- |
| App | http://localhost | - |
| Traefik Dashboard | https://traefik.localhost | admin/admin\* |
| Prometheus | http://prometheus.localhost:9090 | - |
| Grafana | https://grafana.localhost | admin/admin\* |

\*Change default credentials in production!

## Common Commands

```bash
# View logs
docker compose logs -f app

# Restart app
docker compose restart app

# Rebuild after code changes
docker compose build app
docker compose up -d app

# Stop services
docker compose down

# Full cleanup (removes data)
docker compose down -v
```

## Next Steps

- [Development Guide](development.md) - For iterative development
- [Production Guide](production.md) - For deployment
- [Troubleshooting](troubleshooting.md) - Common issues
