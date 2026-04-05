# Deploy Banking App to Hostinger VPS

## Overview

This guide covers deploying the Banking app to a Hostinger KVM VPS using **Docker Swarm**. The application uses a containerized architecture with Traefik as a reverse proxy, PostgreSQL for data storage, Redis for caching/rate-limiting, and optional Prometheus + Grafana for monitoring.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Hostinger VPS                              │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                     Docker Swarm                         │    │
│  │                                                          │    │
│  │   ┌──────────┐   ┌──────────┐   ┌──────────────┐     │    │
│  │   │ Traefik  │◄──│ Banking  │   │  Prometheus  │     │    │
│  │   │  (HTTP/  │   │   App   │   │   + Grafana  │     │    │
│  │   │   HTTPS) │   │  x2 replicas             │     │    │
│  │   └──────────┘   └──────────┘   └──────────────┘     │    │
│  │        │              │                 │               │    │
│  │        ▼              ▼                 ▼               │    │
│  │   ┌─────────────────────────────────────────────┐      │    │
│  │   │              Overlay Networks               │      │    │
│  │   │   traefik-public  │  app-internal         │      │    │
│  │   └─────────────────────────────────────────────┘      │    │
│  │                                                      │    │
│  │   ┌──────────┐   ┌──────────┐                      │    │
│  │   │PostgreSQL│   │  Redis   │                      │    │
│  │   │ (stateful)│   │ (cache)  │                      │    │
│  │   └──────────┘   └──────────┘                      │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Included Services

| Service | Description | Replicas |
| --- | --- | --- |
| **Traefik** | Reverse proxy, SSL termination, routing | 1 |
| **Banking App** | Next.js 16 application | 2 |
| **PostgreSQL** | Primary database | 1 |
| **Redis** | Cache & rate limiting | 1 |
| **Prometheus** | Metrics collection | 1 |
| **Grafana** | Monitoring dashboard | 1 |
| **Node Exporter** | System metrics | Global |

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

### 1.4 Initialize Docker Swarm

```bash
# Initialize swarm with your VPS IP
docker swarm init --advertise-addr $(hostname -I | awk '{print $1}')

# Verify swarm is active
docker node ls
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

### 2.2 Copy Deployment Files

```bash
# Copy stack files to convenient location
cp -r stacks /opt/banking/
cp -r compose/production/traefik /opt/banking/compose/production/
cp -r scripts /opt/banking/

# Create certificates directory
mkdir -p /opt/banking/compose/production/traefik/certs
```

### 2.3 Create Directory Structure

```bash
mkdir -p /opt/banking/.envs/production
```

---

## Phase 3: Secrets Management

All sensitive values are stored as Docker Swarm secrets.

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

### 3.2 Create Docker Secrets

```bash
# Navigate to project directory
cd /opt/banking

# Create secrets (replace values with your generated/actual values)
echo "your-32-char-hex-encryption-key" | docker secret create banking_encryption_key -
echo "your-base64-nextauth-secret" | docker secret create banking_nextauth_secret -
echo "postgresql://postgres:password@postgres/banking" | docker secret create banking_database_url -
echo "your-plaid-client-id" | docker secret create banking_plaid_client_id -
echo "your-plaid-secret" | docker secret create banking_plaid_secret -
echo "your-dwolla-key" | docker secret create banking_dwolla_key -
echo "your-dwolla-secret" | docker secret create banking_dwolla_secret -
echo "your-github-oauth-id" | docker secret create banking_auth_github_id -
echo "your-github-oauth-secret" | docker secret create banking_auth_github_secret -
echo "your-google-oauth-id" | docker secret create banking_auth_google_id -
echo "your-google-oauth-secret" | docker secret create banking_auth_google_secret -
echo "redis://:your-redis-password@redis:6379" | docker secret create banking_redis_url -
echo "your-postgres-password" | docker secret create banking_postgres_password -

# Optional: SMTP secrets
echo "smtp.gmail.com" | docker secret create banking_smtp_host -
echo "587" | docker secret create banking_smtp_port -
echo "your-email@gmail.com" | docker secret create banking_smtp_user -
echo "your-app-password" | docker secret create banking_smtp_pass -

# Verify secrets created
docker secret ls
```

### 3.3 Environment Variables

Create `/opt/banking/.envs/production/.env.production`:

```env
# Application
NODE_ENV=production
PORT=3000

# Domain (replace with your domain or VPS IP)
DOMAIN=banking.yourdomain.com

# Registry
REGISTRY=ghcr.io
IMAGE_NAME=rhixecompany/banking
VERSION=latest

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_DB=banking

# Redis
REDIS_PASSWORD=your-redis-password

# Grafana
GRAFANA_PASSWORD=your-grafana-password
```

---

## Phase 4: Build & Push Docker Image

### 4.1 Build the Image

```bash
cd /opt/banking/banking

# Build the Docker image
docker build -t ghcr.io/rhixecompany/banking:latest \
  -f compose/production/node/Dockerfile .
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

## Phase 5: Deploy Stacks

### 5.1 Create Networks

```bash
# Create overlay networks
docker network create --driver overlay --attachable traefik-public
docker network create --driver overlay --attachable app-internal
```

### 5.2 Deploy Traefik (Reverse Proxy)

```bash
cd /opt/banking

docker stack deploy -c stacks/traefik.stack.yml traefik

# Verify
docker stack ps traefik
```

Wait for Traefik to be running, then continue.

### 5.3 Deploy Monitoring (Optional)

```bash
cd /opt/banking

# Set Grafana password
export GRAFANA_PASSWORD=your-grafana-password

docker stack deploy -c stacks/monitoring.stack.yml monitoring

# Verify
docker stack ps monitoring
```

### 5.4 Deploy Banking Application

```bash
cd /opt/banking

# Deploy the app stack
docker stack deploy -c stacks/app.stack.yml banking

# Verify all services are running
docker stack ps banking
```

### 5.5 Check Service Health

```bash
# View all stacks
docker stack ls

# View service status
docker service ls

# Check specific service logs
docker service logs banking_app

# Check health status
docker service inspect banking_app --pretty
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

   Edit `stacks/app.stack.yml` and update:

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
  -keyout /opt/banking/compose/production/traefik/certs/key.pem \
  -out /opt/banking/compose/production/traefik/certs/cert.pem \
  -subj "/C=US/ST=State/L=City/O=Banking/CN=YOUR_VPS_IP"

# Update app stack labels to use IP instead of domain
# Edit stacks/app.stack.yml and replace ${DOMAIN:-banking.example.com} with your VPS IP
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
docker service logs banking_app

# Follow logs in real-time
docker service logs -f banking_app

# View with timestamps
docker service logs -f --tail 100 banking_app
```

### 7.3 Access Services

| Service           | URL                                           |
| ----------------- | --------------------------------------------- |
| Banking App       | `https://banking.yourdomain.com`              |
| Traefik Dashboard | `https://traefik.banking.yourdomain.com`      |
| Grafana           | `https://grafana.banking.yourdomain.com:3001` |

### 7.4 Default Credentials

| Service | Username | Password                   |
| ------- | -------- | -------------------------- |
| Grafana | admin    | (GRAFANA_PASSWORD you set) |

---

## Phase 8: Maintenance

### 8.1 Update the Application

```bash
# Pull latest image
docker pull ghcr.io/rhixecompany/banking:latest

# Update the service
docker service update --image ghcr.io/rhixecompany/banking:latest banking_app

# Or use stack deploy (will update all services)
docker stack deploy -c stacks/app.stack.yml banking
```

### 8.2 Rollback

```bash
# Rollback to previous version
docker service rollback banking_app

# View service history
docker service history banking_app
```

### 8.3 Scaling

```bash
# Scale app replicas
docker service scale banking_app=3

# Scale back down
docker service scale banking_app=2
```

### 8.4 Useful Commands

```bash
# View all stacks
docker stack ls

# View services in a stack
docker stack services banking

# View all containers
docker ps

# View resource usage
docker stats

# View service details
docker service inspect banking_app

# Remove a stack
docker stack rm banking

# Remove all stacks
docker stack rm traefik banking monitoring
```

### 8.5 Backup Database

```bash
# Create database backup
docker exec $(docker ps -q -f name=banking_db) pg_dump -U postgres banking > backup.sql

# Restore database
docker exec -i $(docker ps -q -f name=banking_db) psql -U postgres banking < backup.sql
```

---

## Troubleshooting

### Service Won't Start

```bash
# Check logs
docker service logs banking_app --no-trunc

# Check for secret issues
docker secret ls

# Inspect service
docker service inspect banking_app
```

### Database Connection Failed

```bash
# Check if database is running
docker service ls

# Check database logs
docker service logs banking_db

# Test connection
docker exec -it $(docker ps -q -f name=banking_db) psql -U postgres -c "SELECT 1"
```

### SSL Certificate Issues

```bash
# Check Traefik logs
docker service logs traefik_traefik

# List certificates
docker exec $(docker ps -q -f name=traefik) ls -la /certs/

# Force certificate regeneration
docker service update --force traefik_traefik
```

### Out of Memory

```bash
# Check memory usage
docker stats

# Reduce replicas
docker service scale banking_app=1
```

### Networking Issues

```bash
# List networks
docker network ls

# Inspect network
docker network inspect app-internal

# Verify containers can reach each other
docker exec -it $(docker ps -q -f name=banking_app) ping banking_db
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
docker service update --image ghcr.io/rhixecompany/banking:latest banking_app
```

### 4. secrets Rotation

```bash
# Update a secret
echo "new-secret-value" | docker secret create banking_nextauth_secret_v2 -

# Update service to use new secret
docker service update --secret-rm banking_nextauth_secret --secret-add source=banking_nextauth_secret_v2,target=banking_nextauth_secret banking_app
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

### Required Secrets

| Secret | Description | Example |
| --- | --- | --- |
| `encryption_key` | AES-256-GCM key | 32+ char hex string |
| `nextauth_secret` | Session signing key | Base64 string |
| `database_url` | PostgreSQL connection | `postgresql://user:pass@host/db` |
| `plaid_client_id` | Plaid API client ID | From plaid.com |
| `plaid_secret` | Plaid API secret | From plaid.com |
| `dwolla_key` | Dwolla API key | From dwolla.com |
| `dwolla_secret` | Dwolla API secret | From dwolla.com |
| `auth_github_id` | GitHub OAuth app ID | From GitHub |
| `auth_github_secret` | GitHub OAuth secret | From GitHub |
| `auth_google_id` | Google OAuth client ID | From Google Cloud |
| `auth_google_secret` | Google OAuth secret | From Google Cloud |
| `redis_url` | Redis connection | `redis://:pass@host:6379` |
| `postgres_password` | PostgreSQL password | Strong random string |

### Optional Secrets

| Secret      | Description          |
| ----------- | -------------------- |
| `smtp_host` | SMTP server hostname |
| `smtp_port` | SMTP port (587)      |
| `smtp_user` | SMTP username        |
| `smtp_pass` | SMTP password        |

---

## File Reference

### Key Deployment Files

| File | Purpose |
| --- | --- |
| `stacks/app.stack.yml` | Main application stack (app, PostgreSQL, Redis) |
| `stacks/traefik.stack.yml` | Traefik reverse proxy stack |
| `stacks/monitoring.stack.yml` | Prometheus + Grafana stack |
| `compose/production/node/Dockerfile` | Multi-stage Next.js build |
| `compose/production/traefik/traefik.yml` | Traefik static configuration |
| `compose/production/traefik/dynamic/middlewares.yml` | Rate limiting, security headers |
| `compose/production/traefik/dynamic/tls.yml` | TLS configuration |
| `scripts/server-setup.sh` | Docker Swarm bootstrap script |
| `scripts/read-secrets.sh` | Secret loading script |

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

- [Docker Swarm Documentation](https://docs.docker.com/engine/swarm/)
- [Traefik v3 Documentation](https://doc.traefik.io/traefik/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [Neon Database](https://neon.tech) (alternative to local PostgreSQL)
