#!/bin/bash
# Production deployment checklist

echo "=== Docker Production Readiness Checklist ==="
echo ""

# 1. Check if .env.production exists
if [ -f .env.production ]; then
    echo "✓ .env.production found"
    # Check for placeholder values
    if grep -q "CHANGE_ME" .env.production; then
        echo "⚠ WARNING: .env.production contains CHANGE_ME placeholders - replace before deploying"
    else
        echo "✓ .env.production appears to have real values"
    fi
else
    echo "✗ .env.production not found - create from template"
fi
echo ""

# 2. Check Dockerfile optimizations
echo "Checking Dockerfile optimizations..."
if grep -q "distroless" Dockerfile; then
    echo "✓ Using distroless base image"
fi
if grep -q "nonroot" Dockerfile; then
    echo "✓ Running as nonroot user"
fi
if grep -q "HEALTHCHECK" Dockerfile; then
    echo "✓ HEALTHCHECK defined"
fi
echo ""

# 3. Check docker-compose security options
echo "Checking docker-compose security options..."
if grep -q "no-new-privileges" docker-compose.yml; then
    echo "✓ no-new-privileges security option enabled"
fi
if grep -q "env_file" docker-compose.yml; then
    echo "✓ env_file configuration found"
fi
echo ""

# 4. Test health check endpoint
echo "Testing health check endpoint (ensure app is running first)..."
if command -v curl &> /dev/null; then
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "✓ Health check endpoint responsive"
    else
        echo "ℹ Health check endpoint not responding (app may not be running or endpoint needs implementation)"
    fi
else
    echo "ℹ curl not found - skipping health check test"
fi
echo ""

# 5. Docker image size check
echo "Checking built image size..."
if docker image inspect banking:prod > /dev/null 2>&1; then
    SIZE=$(docker image inspect banking:prod --format='{{.Size}}')
    SIZE_MB=$((SIZE / 1024 / 1024))
    echo "✓ Image size: ${SIZE_MB}MB"
else
    echo "ℹ banking:prod image not found - build with: docker build -t banking:prod ."
fi
echo ""

echo "=== Deployment Steps ==="
echo "1. Fill in .env.production with real values"
echo "2. Generate secure secrets: openssl rand -base64 32"
echo "3. Build image: docker build -t banking:prod ."
echo "4. Run migrations: docker compose --profile init --env-file .env.production up"
echo "5. Start app: docker compose --env-file .env.production up -d"
echo "6. Check health: docker compose ps"
echo "7. View logs: docker compose logs -f app"
