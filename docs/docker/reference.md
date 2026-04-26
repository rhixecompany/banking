# Docker Reference

Environment variables, ports, commands, and file structure.

## Environment Variables

### Core Variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Yes | `http://localhost:3000` | Public site URL |
| `NODE_ENV` | Yes | production | Runtime environment |
| `PORT` | No | 3000 | App port |
| `HOSTNAME` | No | 0.0.0.0 | Bind address |

### Security

| Variable          | Required | Description                      |
| ----------------- | -------- | -------------------------------- |
| `ENCRYPTION_KEY`  | Yes      | 32+ char hex key for AES-256-GCM |
| `NEXTAUTH_SECRET` | Yes      | Session signing secret           |
| `NEXTAUTH_URL`    | No       | Canonical URL for callbacks      |

### Database

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `POSTGRES_USER` | No | postgres | Database user |
| `POSTGRES_PASSWORD` | No | postgres | Database password |
| `POSTGRES_DB` | No | banking | Database name |

### Redis

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `REDIS_PASSWORD` | No | redis | Redis password |
| `REDIS_URL` | No | redis://:redis@redis:6379 | Redis connection URL |

### Plaid (Optional)

| Variable          | Required | Description           |
| ----------------- | -------- | --------------------- |
| `PLAID_CLIENT_ID` | No       | Plaid API client ID   |
| `PLAID_SECRET`    | No       | Plaid API secret      |
| `PLAID_ENV`       | No       | sandbox or production |

### Dwolla (Optional)

<!-- markdownlint-disable MD060 -->

| Variable          | Required | Description                      |
| ----------------- | -------- | -------------------------------- |
| `DWOLLA_KEY`      | No       | Dwolla API key                   |
| `DWOLLA_SECRET`   | No       | Dwolla API secret                |
| `DWOLLA_BASE_URL` | No       | `https://api-sandbox.dwolla.com` |

<!-- markdownlint-enable MD060 -->

### Traefik/Let's Encrypt

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `LETSENCRYPT_EMAIL` | No | admin@localhost | Certificate email |
| `LETSENCRYPT_CA_SERVER` | No | staging | Use production CA for live certs |
| `TRAEFIK_PASSWORD` | No | admin | Dashboard password |
| `DOMAIN` | No | localhost | Production domain |

### Monitoring

| Variable           | Required | Default | Description            |
| ------------------ | -------- | ------- | ---------------------- |
| `GRAFANA_PASSWORD` | No       | admin   | Grafana admin password |

## Ports

| Service           | Internal | External | Protocol   |
| ----------------- | -------- | -------- | ---------- |
| App               | 3000     | 3000\*   | HTTP/HTTPS |
| Traefik           | 80, 443  | 80, 443  | HTTP/HTTPS |
| Traefik Dashboard | 8080     | 8080\*   | HTTP       |
| PostgreSQL        | 5432     | 5432\*   | TCP        |
| Redis             | 6379     | 6379\*   | TCP        |
| Prometheus        | 9090     | 9090\*   | HTTP       |
| Grafana           | 3000     | 3000\*   | HTTP       |

\*Only exposed if configured in ports section

## Commands

### Start/Stop

```bash
# Start all services (default profile)
docker compose up -d

# Start with monitoring
docker compose --profile monitoring up -d

# Start without Traefik
docker compose --profile local up -d

# Stop services
docker compose down

# Stop and remove volumes
docker compose down -v
```

### Migrations

```bash
# Run migrations
docker compose --profile init up

# Stop migration container
docker compose --profile init down
```

### Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f db
docker compose logs -f traefik

# Last 100 lines
docker compose logs --tail 100 app
```

### Database

```bash
# Open psql
docker compose exec db psql -U postgres -d banking

# Run SQL file
cat file.sql | docker compose exec -T db psql -U postgres -d banking

# Backup
docker compose exec db pg_dump -U postgres banking > backup.sql
```

### Redis

```bash
# Connect CLI
docker compose exec redis redis-cli -a password

# Flush database
docker compose exec redis redis-cli FLUSHALL
```

### Build

```bash
# Build all
docker compose build

# Build specific service
docker compose build app

# Build without cache
docker compose build --no-cache app
```

### Inspect

```bash
# List containers
docker compose ps

# Inspect service
docker compose inspect app

# Resource usage
docker stats

# Network inspection
docker network inspect app-internal
```

## File Structure

```text
.
├── docker-compose.yml           # Main compose file
│
├── scripts/
│   ├── deploy.sh               # Production deployment
│   └── generate-htpasswd.sh    # Traefik dashboard auth
│
├── compose/
│   ├── traefik/                # Traefik configuration
│   │   ├── traefik.yml         # Main config
│   │   ├── dynamic/
│   │   │   ├── tls.yml         # TLS settings
│   │   │   └── middlewares.yml # Security headers, etc.
│   │   ├── certs/              # TLS certificates (provide your own)
│   │   └── auth/               # Dashboard htpasswd
│   │
│   ├── dev/
│   │   └── node/Dockerfile     # Multi-stage build (targets: development, production)
│   │
│   └── prod/                    # Production configs
│       ├── prometheus/
│       │   ├── prometheus.yml
│       │   └── rules/
│       │       └── app-alerts.yml
│       └── grafana/
│           └── provisioning/
│               ├── dashboards/
│               │   └── dashboards.yml
│               └── datasources/
│                   └── datasources.yml
│
├── .envs/
│   ├── local/
│   │   └── .env.local          # Local development
│   └── production/
│       └── .env.production     # Production secrets
│
└── docs/docker/                # This documentation
```

## Docker Compose Profiles

| Profile | Services | Use Case |
| --- | --- | --- |
| default | app, db, redis, traefik | Full stack with proxy |
| local | app, db, redis | Development without Traefik |
| monitoring | prometheus, grafana, exporters | Add monitoring to default |
| init | init | One-time database migrations |

## Health Check Endpoints

<!-- markdownlint-disable MD060 -->

| Service    | Endpoint                           | Expected |
| ---------- | ---------------------------------- | -------- |
| App        | `http://localhost:3000/api/health` | HTTP 200 |
| Traefik    | `http://localhost:8080/ping`       | Pong     |
| PostgreSQL | `pg_isready`                       | Ready    |
| Redis      | `redis-cli ping`                   | PONG     |
| Prometheus | `http://localhost:9090/-/healthy`  | HTTP 200 |

<!-- markdownlint-enable MD060 -->

## Resource Limits (Production)

| Service | CPU     | Memory |
| ------- | ------- | ------ |
| app     | 2 cores | 2GB    |
| db      | 1 core  | 1GB    |
| redis   | 500m    | 512MB  |
| traefik | 500m    | 256MB  |
