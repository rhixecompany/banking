---
name: deployment-skill
description: Deployment patterns for Vercel, Railway, and Docker for the Banking app.
lastReviewed: 2026-04-29
applyTo: "deploy/**"
---

# Deployment Skill — Deployment Patterns

## Overview

This skill provides comprehensive deployment patterns for the Banking app across Vercel, Railway, and Docker platforms. It covers environment configuration, build optimization, and production best practices.

**This skill applies to:** Deploying the Banking app to any hosting platform.

## Multi-Agent Support

### OpenCode
```bash
# Build commands
bun run build          # Production build
bun run postbuild      # Sitemap generation

# Deployment platforms
vercel deploy          # Vercel deployment
railway deploy         # Railway deployment
docker-compose up -d  # Docker deployment

# Health checks
curl https://your-domain.com/api/health
```

### Cursor
```typescript
// Environment variables in deployment
// Vercel: Project Settings → Environment Variables
// Railway: Variables tab
// Docker: docker-compose.yml env section

// Required vars
DATABASE_URL="postgres://..."
ENCRYPTION_KEY="256-bit-hex-key"
NEXTAUTH_SECRET="min-32-char-secret"
NEXTAUTH_URL="https://your-domain.com"
```

### GitHub Copilot
```yaml
# Docker Compose configuration
# Copilot suggests optimized docker-compose.yml
```

## Vercel Deployment

### Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for better Docker compatibility
  output: "standalone",

  // Experimental features
  experimental: {
    // Optimize package optimization
    optimizePackageImports: ["@/components", "@/lib"]
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" }
        ]
      }
    ];
  }
};

export default nextConfig;
```

### Environment Variables (Vercel)

Required environment variables in Vercel Project Settings:

| Variable | Description | Required |
| --- | --- | :---: |
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `ENCRYPTION_KEY` | 256-bit hex key for encryption | Yes |
| `NEXTAUTH_SECRET` | Secret for JWT signing (min 32 chars) | Yes |
| `NEXTAUTH_URL` | Production URL (e.g., https://your-app.vercel.app) | Yes |
| `PLAID_CLIENT_ID` | Plaid API client ID | No |
| `PLAID_SECRET` | Plaid API secret | No |
| `PLAID_ENV` | sandbox/development/production | No |
| `DWOLLA_KEY` | Dwolla API key | No |
| `DWOLLA_SECRET` | Dwolla API secret | No |

### Vercel Deployment Steps

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Link project
vercel link

# 4. Deploy (preview)
vercel

# 5. Deploy (production)
vercel --prod

# 6. Set environment variables
vercel env add DATABASE_URL production
vercel env add ENCRYPTION_KEY production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXTAUTH_URL production
```

### Vercel with Git Integration

```bash
# Connect GitHub repo in Vercel dashboard
# Settings → Git → Connect GitHub

# Automatic deployments on push to main
# Preview deployments for PRs
```

## Railway Deployment

### Railway Configuration

```yaml
# railway.json
{
  "$schema": "https://railway.app/schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "bun run build",
    "startCommand": "bun run start"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Railway Environment Variables

Set in Railway dashboard → Variables tab:

```
DATABASE_URL=postgres://user:pass@host:5432/db
ENCRYPTION_KEY=256-bit-hex-key
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-app.up.railway.app
PLAID_ENV=sandbox
DWOLLA_ENV=sandbox
```

### Railway Database Setup

```bash
# 1. Create Railway project
railway init

# 2. Add PostgreSQL plugin
railway add plugin postgres

# 3. Get DATABASE_URL
railway variables | grep DATABASE_URL

# 4. Run migrations
railway run bun run db:push

# 5. Seed database (optional)
railway run bun run db:seed
```

### Railway CLI Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway deploy

# View logs
railway logs

# Open dashboard
railway open
```

## Docker Deployment

### Dockerfile

```dockerfile
# Dockerfile
FROM oven/bun:1-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN bunx prisma generate

# Build the application
RUN bun run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
      - PLAID_ENV=${PLAID_ENV:-sandbox}
      - DWOLLA_ENV=${DWOLLA_ENV:-sandbox}
    depends_on:
      - db
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-password}
      - POSTGRES_DB=${POSTGRES_DB:-banking}
    ports:
      - "5432:5432"
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### Environment File

```bash
# .env.production
# Database
DATABASE_URL="postgres://postgres:password@db:5432/banking"

# Security
ENCRYPTION_KEY="0000000000000000000000000000000000000000000000000000000000000000"
NEXTAUTH_SECRET="your-production-secret-min-32-characters-long"
NEXTAUTH_URL="https://your-domain.com"

# Plaid
PLAID_ENV=sandbox
# PLAID_CLIENT_ID and PLAID_SECRET if needed

# Dwolla
DWOLLA_ENV=sandbox
# DWOLLA_KEY and DWOLLA_SECRET if needed
```

### Docker Commands

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop
docker-compose down

# Rebuild
docker-compose build --no-cache

# Run migrations
docker-compose exec app bun run db:push

# Seed database
docker-compose exec app bun run db:seed
```

## Production Build Verification

### Pre-Deployment Checklist

```bash
# 1. Run type check
bun run type-check

# 2. Run lint strict
bun run lint:strict

# 3. Build production
bun run build

# 4. Verify build output
ls -la .next/standalone

# 5. Test locally (optional)
bun run start &
curl http://localhost:3000
# Kill the server
```

### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";
import { db } from "@/database/db";

export async function GET() {
  try {
    // Test database connection
    await db.select().from(users).limit(1);

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || "1.0.0"
    });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", error: "Database connection failed" },
      { status: 503 }
    );
  }
}
```

## Environment-Specific Configuration

### Development vs Production

```typescript
// lib/app-config.ts
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // ... other fields
});

// Different behavior based on environment
if (appConfig.nodeEnv === "production") {
  // Enable strict security headers
  // Disable detailed error messages
  // Enable logging to external service
}
```

### Database Connection Pooling

```typescript
// For production, configure connection pool
const poolConfig = {
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
};
```

## Troubleshooting

### Common Deployment Issues

| Issue | Cause | Solution |
| --- | --- | --- |
| Build fails | Missing dependencies | Run `bun install` before build |
| 502 Error | App not starting | Check `bun run start` output |
| Database connection failed | Wrong DATABASE_URL | Verify env var in dashboard |
| 401 Errors | Missing NEXTAUTH_SECRET | Set secret in environment |
| Static files 404 | Missing public folder | Check COPY commands in Dockerfile |

### Logs and Debugging

```bash
# Vercel
vercel logs your-app

# Railway
railway logs

# Docker
docker-compose logs app

# Docker with follow
docker-compose logs -f
```

## Validation

```bash
# Build verification
bun run build

# Production build check
bun run start &
sleep 5
curl -f http://localhost:3000/api/health || exit 1
# Kill server
```

## Cross-References

- **security-skill** — Environment and encryption patterns
- **db-skill** — Database schema and migrations
- **testing-skill** — Testing with production-like configs

## Multi-Agent Examples

### OpenCode: Deploy Commands
```bash
# Deploy to Vercel
vercel --prod

# Deploy to Railway
railway deploy

# Docker deployment
docker-compose up -d --build
```

### Cursor: Environment Setup
```typescript
// Cursor suggests environment configuration
// Set up environment variables for production deployment
```

### Copilot: Dockerfile Generation
```yaml
# Write comment for Dockerfile suggestions
# Create an optimized Dockerfile for Next.js app
```