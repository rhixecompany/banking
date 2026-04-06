# Deploy Banking App to Hostinger VPS

## Overview

This guide covers deploying the Banking app to a Hostinger KVM VPS using **Docker Compose**. The application uses a containerized architecture with Traefik as a reverse proxy, PostgreSQL for data storage, Redis for caching/rate-limiting, and optional Prometheus + Grafana for monitoring.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Hostinger VPS                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     Docker Compose                           │    │
│  │                                                          │    │
│  │   ┌──────────┐   ┌──────────┐   ┌──────────────┐     │    │
│  │   │ Traefik  │◄──│ Banking  │   │  Prometheus  │     │    │
│  │   │  (HTTP/  │   │   App   │   │   + Grafana  │     │    │
│  │   │   HTTPS) │   │         │   │              │     │    │
│  │   └──────────┘   └──────────┘   └──────────────┘     │    │
│  │        │              │                 │               │    │
│  │        ▼              ▼                 ▼               │    │
│  │   ┌─────────────────────────────────────────────┐      │    │
│  │   │              Bridge Networks                 │      │    │
│  │   │   traefik-public  │  app-internal         │      │    │
│  │   └─────────────────────────────────────────────┘      │    │
│  │                                                      │    │
│  │   ┌──────────┐   ┌──────────┐                      │    │
│  │   │PostgreSQL│   │  Redis   │                      │    │
│  │   │ (stateful)│   │ (cache)  │                      │    │
│  │   └──────────┘   └──────────┘                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Included Services

| Service         | Description                             |
| --------------- | --------------------------------------- |
| **Traefik**     | Reverse proxy, SSL termination, routing |
| **Banking App** | Next.js 16 application                  |
| **PostgreSQL**  | Primary database                        |
| **Redis**       | Cache & rate limiting                   |
| **Prometheus**  | Metrics collection                      |
| **Grafana**     | Monitoring dashboard                    |

---

## Prerequisites

- Hostinger KVM 2 plan (or higher - requires 4GB+ RAM for all services)
- GitHub repository with the banking app code
- Domain name with DNS access (optional, for HTTPS)
- Docker Hub or GitHub Container Registry account (for image hosting)

### Resource Requirements

| Resource | Minimum | Recommended |
| -------- | ------- | ----------- |
| RAM      | 4 GB    | 8 GB        |
| CPU      | 2 cores | 4 cores     |
| Storage  | 40 GB   | 80 GB       |

---

## Phase 1: VPS Initial Setup

### 1.1 Access Your VPS

1. Log in to Hostinger hPanel
2. Go to VPS → Your VPS plan
3. Click "SSH Access" to get credentials:
   - IP Address
   - Username (usually `root`)
   - Password

4. Connect via terminal:

```bash
ssh root@YOUR_VPS_IP
```

### 1.2 Update System Packages

```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com | sh

# Add current user to docker group
usermod -aG docker $USER

# Enable and start Docker
systemctl enable docker
systemctl start docker

# Verify installation
docker --version
docker compose version
```

### 1.4 Verify Docker Compose

Docker Compose v2 is included with Docker. Verify:

```bash
docker compose version
```

---

## Phase 2: Project Setup

### 2.1 Clone the Repository

```bash
# Create project directory
mkdir -p /opt/banking
cd /opt/banking

# Clone your repository
git clone https://github.com/rhixecompany/banking.git

cd banking
```

### 2.2 Create Directory Structure

```bash
mkdir -p /opt/banking/.envs/production
mkdir -p /opt/banking/compose/traefik/certs
mkdir -p /opt/banking/compose/traefik/auth
```

---

## Phase 3: Environment Configuration

All sensitive values are stored in the `.env` file.

### 3.1 Generate Required Secrets

```bash
# Generate encryption key (32+ characters)
openssl rand -hex 32

# Generate NextAuth secret
openssl rand -base64 32

# Generate random passwords
openssl rand -base64 24  # For PostgreSQL
openssl rand -base64 24  # For Redis
openssl rand -base64 24  # For Grafana
```

### 3.2 Create Environment File

Create `/opt/banking/.envs/production/.env`:

```env
# Application
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Domain (replace with your domain or VPS IP)
NEXT_PUBLIC_SITE_URL=https://banking.yourdomain.com

# Database
DATABASE_URL=postgresql://postgres:your-postgres-password@db:5432/banking
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_DB=banking

# Auth & Security (REQUIRED - 32+ characters)
ENCRYPTION_KEY=your-32-char-hex-encryption-key
NEXTAUTH_SECRET=your-base64-nextauth-secret
NEXTAUTH_URL=https://banking.yourdomain.com

# Redis
REDIS_URL=redis://:your-redis-password@redis:6379
REDIS_PASSWORD=your-redis-password

# Traefik/Let's Encrypt
LETSENCRYPT_EMAIL=admin@yourdomain.com

# Grafana
GRAFANA_PASSWORD=your-grafana-password

# Registry
REGISTRY=ghcr.io
IMAGE_NAME=rhixecompany/banking
VERSION=latest

# Optional: Plaid Integration
PLAID_CLIENT_ID=your-plaid-client-id
PLAID_SECRET=your-plaid-secret
PLAID_ENV=sandbox

# Optional: Dwolla Integration
DWOLLA_KEY=your-dwolla-key
DWOLLA_SECRET=your-dwolla-secret
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
```

---

## Phase 4: Build & Push Docker Image

### 4.1 Build the Image

```bash
cd /opt/banking

# Build the Docker image
docker build -t ghcr.io/rhixecompany/banking:latest \
  -f compose/dev/node/Dockerfile --target production .
```

### 4.2 Push to Registry

**Option A: GitHub Container Registry (GHCR)**

```bash
# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin

# Push image
docker push ghcr.io/rhixecompany/banking:latest
```

**Option B: Docker Hub**

```bash
# Login to Docker Hub
docker login

# Tag image
docker tag ghcr.io/rhixecompany/banking:latest yourdockerhub/banking:latest

# Push image
docker push yourdockerhub/banking:latest
```

---

## Phase 5: Deploy Services

### 5.1 Generate Traefik htpasswd

```bash
# Create auth directory
mkdir -p /opt/banking/compose/traefik/auth

# Generate htpasswd (requires apache2-utils or htpasswd)
htpasswd -nb admin your-password | tee /opt/banking/compose/traefik/auth/htpasswd
```

### 5.2 Start Services

```bash
cd /opt/banking

# Start all services with Traefik
docker compose --env-file .envs/production/.env up -d

# Verify
docker compose ps
```

### 5.3 Start with Monitoring (Optional)

```bash
cd /opt/banking

# Start with monitoring profile
docker compose --env-file .envs/production/.env --profile monitoring up -d

# Verify
docker compose ps
```

### 5.4 Check Service Health

```bash
# View all services
docker compose ps

# Check specific service logs
docker compose logs -f app

# Check health status
curl http://localhost:3000/api/health
```

---

## Phase 6: DNS & HTTPS Configuration

### 6.1 With Domain (Recommended)

#### Option A: Cloudflare (Free SSL)

1. **Buy a domain** (~$2/year):
   - [Porkbun](https://porkbun.com)
   - [Namecheap](https://namecheap.com)

2. **Set up Cloudflare**:
   - Create Cloudflare account
   - Add your domain
   - Update nameservers at registrar

3. **Create DNS Records** in Cloudflare:

   ```
   Type: A
   Name: banking
   Value: YOUR_VPS_IP
   Proxy: Proxied (orange cloud)
   ```

4. **Update Traefik configuration**:

   Edit `compose/traefik/traefik.yml` and update the router rule:

   ```yaml
   labels:
     - "traefik.http.routers.banking.rule=Host(`banking.yourdomain.com`)"
   ```

#### Option B: Let's Encrypt (Automatic SSL)

Traefik v3 automatically requests Let's Encrypt certificates. Ensure your domain DNS is pointing to your VPS IP.

### 6.2 Without Domain (Self-Signed SSL)

If you don't have a domain, you can use a self-signed certificate:

```bash
# Generate self-signed certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /opt/banking/compose/traefik/certs/key.pem \
  -out /opt/banking/compose/traefik/certs/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Banking/CN=YOUR_VPS_IP"

# Update docker-compose.yml to use HTTP only (remove HTTPS labels)
```

---

## Phase 7: Verification

### 7.1 Check Service Endpoints

```bash
# Test health endpoint
curl http://localhost:3000/api/health

# If using domain
curl https://banking.yourdomain.com/api/health
```

### 7.2 View Logs

```bash
# All banking app logs
docker compose logs app

# Follow logs in real-time
docker compose logs -f app

# View with timestamps
docker compose logs -f --tail 100 app
```

### 7.3 Access Services

| Service | URL |
| --- | --- |
| Banking App | `http://your-vps-ip:3000` or `https://banking.yourdomain.com` |
| Traefik Dashboard | `http://your-vps-ip:8080` |
| Grafana | `http://your-vps-ip:3000/grafana` |

### 7.4 Default Credentials

| Service           | Username | Password           |
| ----------------- | -------- | ------------------ |
| Traefik Dashboard | admin    | (set during setup) |
| Grafana           | admin    | (set during setup) |

---

## Phase 8: Maintenance

### 8.1 Update the Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker compose --env-file .envs/production/.env build
docker compose --env-file .envs/production/.env up -d
```

### 8.2 Rollback

```bash
# View recent commits
git log --oneline -5

# Revert to previous version
git checkout <previous-commit-hash>
docker compose --env-file .envs/production/.env build
docker compose --env-file .envs/production/.env up -d
```

### 8.3 Restart Services

```bash
# Restart all services
docker compose --env-file .envs/production/.env restart

# Restart specific service
docker compose --env-file .envs/production/.env restart app
```

### 8.4 Backup Database

```bash
# Create database backup
docker compose exec db pg_dump -U postgres banking > backup.sql

# Restore database
docker compose exec -T db psql -U postgres banking < backup.sql
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker compose logs app --no-trunc

# Check service status
docker compose ps

# Restart services
docker compose --env-file .envs/production/.env restart
```

### Database Connection Failed

```bash
# Check if database is running
docker compose ps db

# Check database logs
docker compose logs db

# Test connection
docker compose exec db psql -U postgres -c "SELECT 1"
```

### SSL Certificate Issues

```bash
# Check Traefik logs
docker compose logs traefik

# List certificates
docker compose exec traefik ls -la /certs/

# Force certificate regeneration
docker compose restart traefik
```

### Out of Memory

```bash
# Check memory usage
docker stats

# Check memory limits in compose file
docker compose config
```

### Networking Issues

```bash
# List networks
docker network ls

# Inspect network
docker network inspect app-internal

# Verify containers can reach each other
docker exec -it banking-app-1 ping banking-db
```

---

## Security Recommendations

### 1. Firewall Configuration

```bash
# Allow only SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 2. Secure Docker Socket

The Traefik container needs access to the Docker socket. For production, consider using Docker Socket Proxy.

### 3. Regular Updates

```bash
# Update Docker
apt update && apt upgrade docker.io

# Update images regularly
docker pull ghcr.io/rhixecompany/banking:latest
docker compose --env-file .envs/production/.env pull
docker compose --env-file .envs/production/.env up -d
```

### 4. Secrets Rotation

```bash
# Edit the .env file with new values
nano /opt/banking/.envs/production/.env

# Restart services to apply
docker compose --env-file .envs/production/.env up -d
```

---

## Cost Summary

| Service           | Cost            |
| ----------------- | --------------- |
| Hostinger KVM 2   | $9.99/month     |
| Domain (optional) | ~$2/year        |
| **Total**         | **$9.99/month** |

---

## Environment Variables Reference

### Required Variables

| Variable | Description | Example |
| --- | --- | --- |
| `ENCRYPTION_KEY` | AES-256-GCM key | 32+ char hex string |
| `NEXTAUTH_SECRET` | Session signing key | Base64 string |
| `DATABASE_URL` | PostgreSQL connection | `postgresql://user:pass@host/db` |
| `POSTGRES_PASSWORD` | PostgreSQL password | Strong random string |
| `REDIS_PASSWORD` | Redis password | Strong random string |

### Optional Variables

| Variable             | Description          |
| -------------------- | -------------------- |
| `PLAID_CLIENT_ID`    | Plaid API client ID  |
| `PLAID_SECRET`       | Plaid API secret     |
| `DWOLLA_KEY`         | Dwolla API key       |
| `DWOLLA_SECRET`      | Dwolla API secret    |
| `AUTH_GITHUB_ID`     | GitHub OAuth app ID  |
| `AUTH_GITHUB_SECRET` | GitHub OAuth secret  |
| `SMTP_HOST`          | SMTP server hostname |
| `SMTP_PORT`          | SMTP port (587)      |
| `SMTP_USER`          | SMTP username        |
| `SMTP_PASS`          | SMTP password        |

---

## File Reference

### Key Deployment Files

| File | Purpose |
| --- | --- |
| `docker-compose.yml` | Main compose file with all services |
| `compose/dev/node/Dockerfile` | Multi-stage Next.js build |
| `compose/traefik/` | Traefik configuration |
| `scripts/vps-setup.sh` | Automated VPS setup script |
| `scripts/server-setup.sh` | Docker bootstrap script |
| `.envs/production/.env` | Production environment variables |

---

## Next Steps

1. **Configure OAuth Providers**:
   - GitHub: https://github.com/settings/developers
   - Google: https://console.cloud.google.com

2. **Set up Plaid Sandbox**:
   - Sign up at https://plaid.com
   - Create sandbox environment
   - Get API keys

3. **Set up Dwolla Sandbox**:
   - Sign up at https://dwolla.com
   - Create sandbox account
   - Get API keys

4. **Configure Webhooks** (for production):
   - Plaid: Add webhook URL
   - Dwolla: Add webhook URL

---

## Useful Links

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Traefik v3 Documentation](https://doc.traefik.io/traefik/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Neon Database](https://neon.tech) (alternative to local PostgreSQL)
