#!/bin/bash
# deploy-checklist.sh - Production deployment checklist
# Usage: ./scripts/docker/deploy-checklist.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "=== Docker Production Readiness Checklist ==="
echo ""

# 1. Check if .env.production exists
if [ -f "${PROJECT_ROOT}/.envs/production/.env.production" ]; then
    echo "✓ .envs/production/.env.production found"
    # Check for placeholder values
    if grep -q "CHANGE_ME\|yourdomain" "${PROJECT_ROOT}/.envs/production/.env.production"; then
        echo "⚠ WARNING: Contains placeholders - replace before deploying"
    else
        echo "✓ .env.production appears to have real values"
    fi
else
    echo "✗ .envs/production/.env.production not found"
    echo "  Run: ./scripts/docker/generate-env.sh"
fi
echo ""

# 2. Check Dockerfile optimizations
echo "Checking Dockerfile optimizations..."
DOCKERFILE="${PROJECT_ROOT}/compose/dev/node/Dockerfile"
if grep -q "distroless" "${DOCKERFILE}"; then
    echo "✓ Using distroless base image"
fi
if grep -q "nonroot\|appuser" "${DOCKERFILE}" 2>/dev/null; then
    echo "✓ Non-root user configuration found"
fi
if grep -q "HEALTHCHECK" "${DOCKERFILE}"; then
    echo "✓ HEALTHCHECK defined"
fi
echo ""

# 3. Check docker-compose security options
echo "Checking docker-compose security options..."
if grep -q "no-new-privileges" "${PROJECT_ROOT}/docker-compose.yml"; then
    echo "✓ no-new-privileges security option enabled"
fi
if grep -q "env_file" "${PROJECT_ROOT}/docker-compose.yml"; then
    echo "✓ env_file configuration found"
fi
echo ""

# 4. Test health check endpoint
echo "Testing health check endpoint..."
if command -v curl &> /dev/null; then
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✓ Health check endpoint responsive"
    else
        echo "ℹ Health check not responding (app may not be running)"
    fi
else
    echo "ℹ curl not found - skipping health check test"
fi
echo ""

# 5. Docker image check
echo "Checking Docker image..."
if docker image inspect banking-app:latest > /dev/null 2>&1; then
    SIZE=$(docker image inspect banking-app:latest --format='{{.Size}}')
    SIZE_MB=$((SIZE / 1024 / 1024))
    echo "✓ Image size: ${SIZE_MB}MB"
else
    echo "ℹ banking-app:latest not found - build with: docker compose build"
fi
echo ""

# 6. Check Traefik auth
echo "Checking Traefik dashboard authentication..."
if [ -f "${PROJECT_ROOT}/compose/traefik/auth/htpasswd" ]; then
    echo "✓ htpasswd file exists"
else
    echo "⚠ htpasswd not found - run: ./scripts/deploy/generate-htpasswd.sh"
fi
echo ""

echo "=== Deployment Steps ==="
echo "1. Generate env file: ./scripts/docker/generate-env.sh"
echo "2. Edit .envs/production/.env.production with real values"
echo "3. Generate htpasswd: ./scripts/deploy/generate-htpasswd.sh"
echo "4. Build image: docker compose build"
echo "5. Run migrations: docker compose --profile init up"
echo "6. Stop migrations: docker compose --profile init down"
echo "7. Start app: docker compose up -d"
echo "8. Check health: curl http://localhost:3000/api/health"
echo "9. View logs: docker compose logs -f"
