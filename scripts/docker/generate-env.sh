#!/bin/bash
# generate-env.sh - Generate secure environment variables for production
# Usage: ./scripts/docker/generate-env.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

echo "=== Production Environment Generator ==="
echo ""

ENV_FILE="${PROJECT_ROOT}/.envs/production/.env.production"

# Check if file already exists
if [ -f "$ENV_FILE" ]; then
    read -p ".envs/production/.env.production exists. Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo "Generating secure secrets..."
echo ""

# Generate secrets
ENCRYPTION_KEY=$(openssl rand -hex 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
POSTGRES_PASSWORD=$(openssl rand -base64 16)
REDIS_PASSWORD=$(openssl rand -base64 16)

echo "Secrets generated:"
echo "  ENCRYPTION_KEY: ${ENCRYPTION_KEY:0:20}..."
echo "  NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:20}..."
echo "  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:0:20}..."
echo "  REDIS_PASSWORD: ${REDIS_PASSWORD:0:20}..."
echo ""

# Ensure directory exists
mkdir -p "${PROJECT_ROOT}/.envs/production"

# Generate .env.production
cat > "$ENV_FILE" << EOF
# Production Environment Variables
# Generated: $(date)

# Next.js Public Config
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Database (REQUIRED)
DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/banking
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
POSTGRES_DB=banking

# Auth & Security (REQUIRED - 32+ characters)
ENCRYPTION_KEY=${ENCRYPTION_KEY}
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

# Redis
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
REDIS_PASSWORD=${REDIS_PASSWORD}

# Node Environment
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

# Traefik/Let's Encrypt
LETSENCRYPT_EMAIL=admin@yourdomain.com
# For production certificates, uncomment below:
# LETSENCRYPT_CA_SERVER=https://acme-v02.api.letsencrypt.org/directory

# Plaid Integration (optional)
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
PLAID_BASE_URL=https://sandbox.plaid.com
PLAID_PRODUCTS=
PLAID_COUNTRY_CODES=

# Dwolla Integration (optional)
DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_ENV=sandbox
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com

# Email Configuration (optional)
# SMTP_HOST=
# SMTP_PORT=
# SMTP_USER=
# SMTP_PASS=
# SMTP_FROM=
EOF

echo "✓ .envs/production/.env.production generated"
echo ""
echo "⚠ IMPORTANT: Edit .envs/production/.env.production and set:"
echo "  1. NEXT_PUBLIC_SITE_URL=https://yourdomain.com (your production domain)"
echo "  2. LETSENCRYPT_EMAIL=your-email@domain.com"
echo "  3. Any integration keys (Plaid, Dwolla, etc.)"
echo ""
echo "🔒 SECURITY:"
echo "  - Never commit .env.production to git"
echo "  - Copy secrets to secure vault (1Password, HashiCorp Vault, AWS Secrets Manager)"
echo "  - Rotate secrets periodically"
