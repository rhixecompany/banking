# Docker Guide

## Quick Commands

```bash
# Start all services
docker compose up -d

# Start with monitoring
docker compose --profile monitoring up -d

# Run migrations
docker compose --profile init up

# View logs
docker compose logs -f app

# Stop services
docker compose down -v
```

---

## Prerequisites

- Docker Engine 24.0+
- Docker Compose v2.20+
- 4GB RAM (8GB recommended)

---

## Environment Setup

Create `.envs/local/.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENCRYPTION_KEY=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
DATABASE_URL=postgresql://postgres:postgres@db:5432/banking
REDIS_PASSWORD=your-secure-password
```

---

## Profiles

| Profile    | Services                      | Use Case       |
| ---------- | ----------------------------- | -------------- |
| default    | App + DB + Redis + Traefik    | Full stack     |
| local      | App + DB + Redis (no Traefik) | Development    |
| monitoring | + Prometheus + Grafana        | Observability  |
| init       | Migration runner              | Database setup |

---

## Development

```bash
# Start without Traefik (faster)
docker compose --profile local up -d

# Run migrations
docker compose --profile init up

# Access
# App: http://localhost:3000
# DB: localhost:5432 (user: postgres)
# Redis: localhost:6379
```

### Hot Reload

```bash
# Rebuild on changes
docker compose build app
docker compose up -d app
```

---

## Production

```bash
# Build and start with Traefik
docker compose --profile traefik up -d

# Access via HTTPS
# App: https://localhost
# Traefik Dashboard: https://traefik.localhost
```

---

## Troubleshooting

```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f app

# Enter container
docker compose exec app sh

# Reset everything
docker compose down -v
```

---

## Services

| Service    | Port   | Purpose             |
| ---------- | ------ | ------------------- |
| app        | 3000   | Next.js application |
| db         | 5432   | PostgreSQL          |
| redis      | 6379   | Cache               |
| traefik    | 80/443 | Reverse proxy       |
| prometheus | 9090   | Metrics             |
| grafana    | 3001   | Dashboards          |

---

## Resources

- [Quick Start](docker/quickstart.md)
- [Development](docker/development.md)
- [Production](docker/production.md)
- [Troubleshooting](docker/troubleshooting.md)
