#!/bin/bash

# Quick reference for production Docker commands

## Prerequisites

- Use `.env.example` as the canonical template and generate `.env.production`.
- Implement `/api/health` (see `app-api-health-route.ts.example`).
- Update Dockerfile healthcheck command for distroless compatibility.

## Build & Push

# Build production image

docker build -t banking:prod --build-arg NEXT_PUBLIC_SITE_URL=https://yourdomain.com .

# Tag for registry (replace with your registry)

docker tag banking:prod myregistry/banking:prod docker push myregistry/banking:prod

## Deployment

# Initialize migrations (one-time setup)

docker compose --profile init --env-file .env.production up

# Start production app

docker compose --env-file .env.production up -d

# Stop app

docker compose down

# Restart app (reload environment)

docker compose --env-file .env.production restart

## Monitoring

# Check service status (all services should be "Up (healthy)")

docker compose ps

# View logs

docker compose logs -f app docker compose logs db docker compose logs redis

# View specific lines

docker compose logs --tail 50 app

# Health check details

docker inspect $(docker compose ps -q app) | grep -A 10 '"Health"'

# Real-time stats

docker stats

## Database Operations

# Access psql shell

docker compose exec db psql -U postgres -d banking

# Backup database

docker compose exec db pg*dump -U postgres banking > backup*$(date +%Y%m%d\_%H%M%S).sql

# Restore database

docker compose exec -T db psql -U postgres banking < backup.sql

# View database size

docker compose exec db psql -U postgres -d banking -c "SELECT pg_size_pretty(pg_database.datsize) FROM pg_database WHERE datname = 'banking';"

## Redis Operations

# Access Redis CLI

docker compose exec redis redis-cli

# Check Redis info (memory, connected_clients, etc)

docker compose exec redis redis-cli INFO

# Flush all data (WARNING: destructive)

docker compose exec redis redis-cli FLUSHALL

# Monitor Redis commands in real-time

docker compose exec redis redis-cli MONITOR

## Debugging

# Test health endpoint

curl -v http://localhost:3000/api/health

# Check specific service logs

docker compose logs --tail 100 app

# Inspect container details

docker inspect $(docker compose ps -q app)

# Interactive shell (distroless has no shell; use node REPL)

docker compose exec app /nodejs/bin/node

# Check network connectivity

docker compose exec app ping db docker compose exec app ping redis

## Cleanup

# Stop and remove all containers

docker compose down

# Remove volumes (WARNING: deletes data)

docker compose down -v

# Prune unused images/containers/networks

docker system prune -a --volumes

## Performance Optimization

# Check image size

docker image inspect banking:prod --format='{{.Size}}'

# Analyze layers

docker history banking:prod

# Scan for vulnerabilities

docker scout cves banking:prod

# Build with BuildKit cache optimization (already enabled in Dockerfile)

DOCKER_BUILDKIT=1 docker build -t banking:prod .
