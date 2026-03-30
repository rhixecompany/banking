# Production Deployment Guide

## Overview

This guide covers deploying the banking app with optimized Docker configuration for production.

## Pre-Deployment Checklist

### 1. Environment Configuration

Create `.env.production` with real values (canonical template is `.env.example`):

```bash
cp .env.example .env.production
# Edit .env.production with production values
```

Generate secure secrets:

```bash
# Generate 32-character base64 secrets for:
# - ENCRYPTION_KEY
# - NEXTAUTH_SECRET
openssl rand -base64 32
```

### 2. Secrets Management

**DO NOT commit `.env.production` to git**

Add to `.gitignore` (already done):

```
.env.production
.env*.local
```

For production, use:

- **Docker Swarm**: `docker secret` command
- **Kubernetes**: `kubectl create secret`
- **CI/CD**: Secrets in GitHub Actions / GitLab CI
- **Cloud Platforms**: Environment variables in the platform UI (AWS, GCP, Azure, Heroku)

### 3. Build Image

```bash
# Build with production optimizations
docker build -t banking:prod \
  --build-arg NEXT_PUBLIC_SITE_URL=https://yourdomain.com \
  .

# Verify image size (should be < 500MB with distroless)
docker images banking:prod
```

### 4. Initialize Database & Run Migrations

```bash
# Run migrations before starting the app
docker compose --profile init --env-file .env.production up

# Wait for migrations to complete, then stop
docker compose --profile init down
```

### 5. Start Application

```bash
# Start all services (app, db, redis)
docker compose --env-file .env.production up -d

# Verify services are running and healthy
docker compose ps
# All services should show STATUS: "Up (healthy)" or "Up"
```

### 6. Test Health Checks

> ⚠️ Required follow-ups before this passes:
>
> - Implement `/api/health` (see `app-api-health-route.ts.example`).
> - Update Dockerfile healthcheck command for distroless compatibility.

```bash
# View health check status
docker compose ps app

# Test health endpoint manually
curl -v http://localhost:3000/api/health

# View app logs
docker compose logs -f app

# View specific service logs
docker compose logs db
docker compose logs redis
```

## Production Operations

### Viewing Logs

```bash
# Follow app logs in real-time
docker compose logs -f app

# View last 100 lines
docker compose logs --tail 100 app

# View logs with timestamps
docker compose logs -t app
```

### Scaling (Docker Swarm only)

```bash
# Initialize Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml banking

# Scale app service
docker service scale banking_app=3

# Monitor
docker service ps banking_app
```

### Updating Application

```bash
# Pull latest code
git pull origin main

# Rebuild image
docker build -t banking:prod .

# Stop old container
docker compose down

# Start new container
docker compose --env-file .env.production up -d

# Verify health
docker compose ps
```

### Database Maintenance

```bash
# Backup database
docker compose exec db pg_dump -U postgres banking > backup.sql

# Restore from backup
docker compose exec -T db psql -U postgres banking < backup.sql

# View database shell
docker compose exec db psql -U postgres -d banking
```

### Redis Operations

```bash
# Access Redis CLI
docker compose exec redis redis-cli

# Check Redis info
docker compose exec redis redis-cli INFO

# Monitor commands
docker compose exec redis redis-cli MONITOR
```

## Security Hardening

✓ **Implemented:**

- Distroless base image (minimal attack surface)
- Nonroot user (UID 65532)
- Read-only filesystem (distroless)
- `no-new-privileges` security option
- Health checks for auto-restart
- Secret injection at runtime (not in image)
- Environment variables for configuration

### Additional Recommendations

1. **Network Security**
   - Use private networks (internal Docker networks)
   - Never expose Redis or Postgres publicly
   - Use firewall rules on the host

2. **Image Registry**
   - Store images in private Docker registry
   - Enable image scanning for vulnerabilities
   - Use `docker scout` for vulnerability analysis

   ```bash
   docker scout cves banking:prod
   ```

3. **Container Registry Authentication**
   - Use `docker login` or `~/.docker/config.json`
   - For Docker Hub: create personal access tokens

4. **Secrets Rotation**
   - Rotate ENCRYPTION_KEY and NEXTAUTH_SECRET periodically
   - Update database password (requires downtime)
   - Restart containers after secret updates

5. **Resource Limits** Add to `docker-compose.yml` services:

   ```yaml
   deploy:
     resources:
       limits:
         cpus: "1.0"
         memory: 1G
       reservations:
         cpus: "0.5"
         memory: 512M
   ```

6. **Log Aggregation**
   - Ship logs to centralized logging (ELK, Datadog, CloudWatch)
   - Configure log rotation to prevent disk fill

## Troubleshooting

### App Container Keeps Restarting

```bash
# Check logs
docker compose logs app

# Check health status
docker inspect $(docker compose ps -q app) | grep -A 5 '"Health"'

# Verify all dependencies are healthy
docker compose ps
```

### Database Connection Failed

```bash
# Check if db is healthy
docker compose ps db

# Test connection manually
docker compose exec app npm run db:push

# Check logs
docker compose logs db
```

### Out of Memory

```bash
# Check current usage
docker stats

# Add resource limits (see Security Hardening section)

# Increase NODE_OPTIONS if needed:
# Edit docker-compose.yml or .env.production
NODE_OPTIONS="--max-old-space-size=8192"
```

### Health Check Failing

1. Verify `/api/health` endpoint exists and is implemented
2. Check app logs: `docker compose logs app`
3. Test manually: `curl http://localhost:3000/api/health`
4. Increase `start_period` in docker-compose.yml if app startup is slow

## Deployment Platforms

### AWS ECS

```bash
# Push to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
docker tag banking:prod 123456789.dkr.ecr.us-east-1.amazonaws.com/banking:prod
docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/banking:prod
```

### Google Cloud Run

Not suitable for this app (requires managed database, no local containers).

### Kubernetes

Create `k8s-deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: banking-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: banking
  template:
    metadata:
      labels:
        app: banking
    spec:
      containers:
        - name: app
          image: banking:prod
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: "production"
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: banking-secrets
                  key: database-url
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: banking-service
spec:
  selector:
    app: banking
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
  type: LoadBalancer
```

Deploy with:

```bash
kubectl apply -f k8s-deployment.yaml
kubectl apply -f k8s-postgres.yaml
kubectl apply -f k8s-redis.yaml
```

## Monitoring & Observability

### Container Metrics

```bash
# Real-time stats
docker stats banking_app_1

# Historical metrics
# Use: Prometheus + Grafana, DataDog, New Relic
```

### Application Monitoring

- Integrate APM: DataDog, New Relic, Sentry
- Monitor build pipeline in Docker Build Cloud
- Set up alerts for health check failures

## Rollback Procedure

```bash
# If new version has issues, rollback to previous image
docker compose down
docker tag banking:prod-backup banking:prod
docker compose --env-file .env.production up -d

# Verify
docker compose ps
```

---

**Need help?** Check logs, run health check endpoint, and review service dependencies.
