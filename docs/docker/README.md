# Docker Documentation

This directory contains guides for running the Banking app with Docker and Docker Compose.

## Quick Navigation

| Guide | Description |
| --- | --- |
| [Quick Start](quickstart.md) | Get up and running in 5 minutes |
| [Development](development.md) | Local development with hot-reload |
| [Production](production.md) | Production deployment with Traefik |
| [Troubleshooting](troubleshooting.md) | Common issues and solutions |
| [Reference](reference.md) | Environment variables, ports, commands |

## Overview

The Banking app uses Docker Compose with multiple profiles to support different environments:

```text
docker-compose.yml
├── Profiles
│   ├── default     → App + DB + Redis + Traefik
│   ├── local       → App + DB + Redis (no Traefik)
│   ├── monitoring  → Prometheus + Grafana + Exporters
│   └── init        → Run database migrations
│
├── Services
│   ├── app         → Next.js application
│   ├── db          → PostgreSQL database
│   ├── redis       → Redis cache
│   ├── traefik     → Reverse proxy with HTTPS
│   ├── prometheus  → Metrics collection
│   └── grafana     → Metrics dashboards
│
└── Configuration
    ├── compose/traefik/     → Traefik config
    ├── compose/dev/         → Multi-stage Dockerfile
    └── compose/prod/        → Production configs
```

## Prerequisites

- Docker Engine 24.0+
- Docker Compose v2.20+
- 4GB RAM minimum (8GB recommended)

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
docker compose down

# Full cleanup (remove volumes)
docker compose down -v
```

## File Structure

```text
.
├── docker-compose.yml           # Main compose file
├── scripts/
│   ├── deploy.sh               # Production deployment script
│   └── generate-htpasswd.sh    # Traefik auth setup
├── compose/
│   ├── traefik/                # Traefik configuration
│   │   ├── traefik.yml         # Main config
│   │   ├── dynamic/            # Dynamic configs (TLS, middlewares)
│   │   ├── certs/              # TLS certificates
│   │   └── auth/               # Dashboard authentication
│   ├── dev/                    # Development Dockerfile
│   └── prod/                   # Production monitoring configs
└── docs/docker/                # This documentation
```

## Next Steps

1. [Quick Start Guide](quickstart.md) - Start here
2. [Development Guide](development.md) - For local development
3. [Production Guide](production.md) - For deployment
