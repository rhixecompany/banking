---
description: Deploy Banking app with Docker Compose to production server
status: in-progress
phase: 1
updated: 2026-04-24
---

# Docker Production Deploy

## Idea

Deploy the Banking application to a production server using Docker Compose with all features: Traefik reverse proxy, full monitoring stack (Prometheus/Grafana), PostgreSQL, Redis, and fresh secure secrets generation.

---

## Status: IN PROGRESS ← CURRENT

---

## Steps

- [x] 1.1 Research deployment requirements
- [x] 1.2 Check Docker availability
- [ ] 1.3 Generate fresh secure secrets ← CURRENT
- [ ] 1.4 Update environment file with domain/email
- [ ] 1.5 Generate htpasswd for Traefik
- [ ] 1.6 Build Docker image
- [ ] 1.7 Start infrastructure (db, redis)
- [ ] 1.8 Run database migrations
- [ ] 1.9 Start all services (Traefik + monitoring)
- [ ] 1.10 Verify deployment

---

## Commands Reference

```bash
# Generate secrets
npm run docker:env:generate

# Build
docker compose build

# Start infra first
docker compose up -d db redis

# Run migrations
docker compose --profile init up
docker compose --profile init down

# Start all with Traefik + monitoring
docker compose --profile traefik --profile monitoring up -d

# Verify
docker compose ps
curl http://localhost:3000/api/health
```

---

## Services Deployed

| Service | Image | Ports |
| ------- | ----- | ---- |
| app | banking-app (custom) | 3000 |
| db | postgres:17-alpine | 5432 |
| redis | redis:7-alpine | 6379 |
| traefik | traefik:v3.3 | 80, 443, 8080 |
| prometheus | prom/prometheus | 9090 |
| grafana | grafana/grafana | 3000 |
| postgres_exporter | prometheus/postgres_exporter | - |
| redis_exporter | oliver006/redis_exporter | - |

---

## Access Points (after deploy)

| Service | URL | Credentials |
| ------ | --- | ----------- |
| App | https://rhixecompany.online | - |
| Traefik Dashboard | https://traefik.rhixecompany.online | admin/<htpasswd> |
| Prometheus | https://prometheus.rhixecompany.online:9090 | - |
| Grafana | https://grafana.rhixecompany.online | admin/admin |

---

## Provenance

Research: docker-compose.yml, compose/dev/node/Dockerfile, app-config.ts, docs/docker/quickstart.md, scripts/ts/docker/generate-env.ts