# Production Guide

Production deployment with Traefik, HTTPS, and monitoring.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Internet                             │
└─────────────────────────┬───────────────────────────────┘
                          │
                    ┌─────▼─────┐
                    │  Traefik  │  :80, :443
                    └─────┬─────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐     ┌─────▼────┐   ┌──────▼──────┐
    │  App    │     │Prometheus│   │   Grafana   │
    │ :3000   │     │  :9090   │   │    :3000    │
    └────┬────┘     └─────┬────┘   └──────┬──────┘
         │                │                │
         └────────────────┴────────────────┘
                        │
              ┌─────────┴─────────┐
              │   app-internal    │
         ┌────▼────┐      ┌──────▼──────┐
         │   DB     │      │    Redis     │
         │ :5432    │      │    :6379     │
         └──────────┘      └─────────────┘
```

## Prerequisites

- Domain name pointed to server
- Docker Engine 24.0+
- Docker Compose v2.20+
- 4GB RAM minimum

## Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-v2
```

## Step 2: Prepare Files

```bash
# Clone repository
git clone https://github.com/rhixecompany/banking.git
cd banking

# Create production environment (copy from .env.example)
mkdir -p .envs/production
cp .env.example .envs/production/.env.production
```

## Step 3: Configure Environment

Edit `.envs/production/.env.production`:

```env
# Domain
DOMAIN=yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Security (generate with: openssl rand -hex 32)
ENCRYPTION_KEY=your-32-char-hex-key
NEXTAUTH_SECRET=your-32-char-secret

# Database
DATABASE_URL=postgresql://user:password@db:5432/banking
POSTGRES_USER=banking
POSTGRES_PASSWORD=secure-password
POSTGRES_DB=banking

# Redis
REDIS_PASSWORD=redis-password

# Let's Encrypt
LETSENCRYPT_EMAIL=admin@yourdomain.com
# For production certificates (optional):
# LETSENCRYPT_CA_SERVER=https://acme-v02.api.letsencrypt.org/directory

# Traefik Dashboard
TRAEFIK_PASSWORD=secure-dashboard-password

# API Keys (Plaid, Dwolla, etc.)
PLAID_CLIENT_ID=
PLAID_SECRET=
DWOLLA_KEY=
DWOLLA_SECRET=
```

## Step 4: Generate htpasswd

```bash
bash scripts/generate-htpasswd.sh admin your-dashboard-password
```

## Step 5: Deploy

```bash
# Using the deploy script
bash scripts/deploy.sh

# Or manual deployment - run migrations
docker compose -f docker-compose.yml \
    --env-file .envs/production/.env.production \
    --profile init up

# Start all services (after migrations complete)
docker compose -f docker-compose.yml \
    --env-file .envs/production/.env.production \
    up -d
```

## Step 6: Verify Deployment

```bash
# Check services
docker compose ps

# Test HTTPS
curl -I https://yourdomain.com/api/health

# Check logs
docker compose logs -f app

# View Traefik dashboard
# https://traefik.yourdomain.com
```

## Monitoring

Start monitoring stack:

```bash
docker compose --profile monitoring up -d
```

Access:

- Prometheus: https://prometheus.yourdomain.com
- Grafana: https://grafana.yourdomain.com

## Backup

### Database Backup

```bash
# Create backup
docker compose exec db pg_dump -U postgres banking > backup_$(date +%Y%m%d).sql

# Restore
cat backup_20240101.sql | docker compose exec -T db psql -U postgres banking
```

### Volume Backup

```bash
# Backup volumes
docker run --rm \
    -v banking-postgres_data:/data \
    -v $(pwd):/backup \
    alpine \
    tar czf /backup/postgres_backup.tar.gz /data
```

## Updates

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose -f docker-compose.yml \
    --env-file .envs/production/.env.production \
    build --no-cache app

docker compose -f docker-compose.yml \
    --env-file .envs/production/.env.production \
    up -d app
```

## Security Checklist

- [ ] Change all default passwords
- [ ] Use strong ENCRYPTION_KEY (32+ chars)
- [ ] Use strong NEXTAUTH_SECRET (32+ chars)
- [ ] Configure firewall (only 80, 443)
- [ ] Enable fail2ban
- [ ] Set up log rotation
- [ ] Regular backups
- [ ] Update Docker images regularly

## Troubleshooting

See [Troubleshooting Guide](troubleshooting.md) for common issues.
