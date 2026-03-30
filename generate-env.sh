#!/bin/bash
# Generate secure environment variables for production

set -e

echo "=== Production Environment Generator ==="
echo ""

# Check if .env.production already exists
if [ -f ".env.production" ]; then
    read -p ".env.production exists. Overwrite? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 1
    fi
fi

echo "Generating secure secrets..."
echo ""

# Generate secrets
ENCRYPTION_KEY=$(openssl rand -base64 32)
NEXTAUTH_SECRET=$(openssl rand -base64 32)
POSTGRES_PASSWORD=$(openssl rand -base64 16)
REDIS_PASSWORD=$(openssl rand -base64 16)

echo "Secrets generated:"
echo "  ENCRYPTION_KEY: ${ENCRYPTION_KEY:0:20}..."
echo "  NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:0:20}..."
echo "  POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:0:20}..."
echo "  REDIS_PASSWORD: ${REDIS_PASSWORD:0:20}..."
echo ""

# Generate .env.production
cat > .env.production << EOF
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

# Plaid Integration (optional - set if using Plaid)
PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox
PLAID_BASE_URL=https://sandbox.plaid.com
PLAID_PRODUCTS=
PLAID_COUNTRY_CODES=

# Dwolla Integration (optional - set if using Dwolla)
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

echo "✓ .env.production generated"
echo ""
echo "⚠ IMPORTANT: Edit .env.production and set:"
echo "  1. NEXT_PUBLIC_SITE_URL=https://yourdomain.com (your production domain)"
echo "  2. Any integration keys (Plaid, Dwolla, etc.)"
echo ""
echo "🔒 SECURITY:"
echo "  - Never commit .env.production to git"
echo "  - Copy secrets to secure vault (1Password, HashiCorp Vault, AWS Secrets Manager)"
echo "  - Rotate secrets periodically"
echo ""
echo "Next: docker build -t banking:prod . && docker compose --env-file .env.production up -d"
