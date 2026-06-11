# Deployment Guide

Comprehensive guide for deploying the Banking application to various platforms.

---

## Docker Deployment

### Overview

The Banking app uses Docker Compose with multiple profiles to support different environments.

### Prerequisites

- Docker Engine 24.0+
- Docker Compose v2.20+
- 4GB RAM minimum (8GB recommended)

### Quick Commands

```bash
# Start all services
docker-compose up -d

# Start for local development
docker-compose --profile local up -d

# Build production image
docker-compose -f docker-compose.yml build app
```

### Docker Compose Services

| Service    | Description              |
| ---------- | ------------------------ |
| app        | Next.js application      |
| db         | PostgreSQL database      |
| redis      | Redis cache              |
| traefik    | Reverse proxy with HTTPS |
| prometheus | Metrics collection       |
| grafana    | Metrics dashboards       |

### Environment Variables

See `docs/env-vars.md` for full list.

> **Note:** See `docs/docker/` directory for detailed Docker guides (quickstart, development, production, troubleshooting).

---

## Platform Deployment

### Vercel (Recommended)

The fastest way to deploy Next.js applications.

**CLI Deployment:**

```bash
npm i -g vercel
vercel --prod
```

**Environment Variables:**

- `DATABASE_URL` — PostgreSQL connection string
- `NEXTAUTH_SECRET` — NextAuth secret
- `NEXTAUTH_URL` — Application URL

> **Note:** See `docs/deploy-to-vercel.md` and `docs/deploy-to-vercel-cli.md`.

---

### Railway

Railway offers automatic builds and persistent databases.

**Setup:**

1. Connect GitHub repository
2. Add environment variables
3. Deploy

**Environment Variables:**

- `DATABASE_URL` — PostgreSQL (auto-provisioned)
- `REDIS_URL` — Redis (auto-provisioned)
- `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`

> **Note:** See `docs/deploy-to-railway.md`.

---

### Hostinger VPS

For self-managed hosting with full control.

**Requirements:**

- Ubuntu 20.04+ VPS
- nginx for reverse proxy
- PostgreSQL 14+
- Node.js 18+

**Setup:**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo-url>
cd Banking
npm install
npm run build
```

> **Note:** See `docs/deploy-to-hostinger.md`.

---

## Environment Variables Reference

| Variable          | Description                  | Required |
| ----------------- | ---------------------------- | -------- |
| `DATABASE_URL`    | PostgreSQL connection string | Yes      |
| `NEXTAUTH_SECRET` | NextAuth session secret      | Yes      |
| `NEXTAUTH_URL`    | Application URL              | Yes      |
| `PLAID_CLIENT_ID` | Plaid API client ID          | Yes\*    |
| `PLAID_SECRET`    | Plaid API secret             | Yes\*    |
| `DWOLLA_KEY`      | Dwolla API key               | Yes\*    |
| `DWOLLA_SECRET`   | Dwolla API secret            | Yes\*    |
| `ENCRYPTION_KEY`  | Data encryption key (32 hex) | Yes      |
| `REDIS_URL`       | Redis connection string      | Yes      |

\*Required only if using Plaid/Dwolla features

---

## Security Checklist

- [ ] Set strong `NEXTAUTH_SECRET` (min 32 characters)
- [ ] Configure `ENCRYPTION_KEY` for data encryption
- [ ] Use HTTPS in production (Traefik handles this)
- [ ] Configure proper CORS settings
- [ ] Set up database backup strategy
- [ ] Configure rate limiting via Upstash Redis

---

_Consolidated from `docs/docker/`, `docs/deploy-to-vercel.md`, `docs/deploy-to-railway.md`, `docs/deploy-to-hostinger.md`_
