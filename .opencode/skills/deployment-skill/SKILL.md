---
name: DeploymentSkill
description: Deployment patterns for the Banking app - Vercel, Docker, Railway, and CI/CD pipelines. Use when deploying the app or setting up automated deployments.
---

# DeploymentSkill - Banking Deployment Patterns

## Overview

This skill provides guidance on deployment patterns for the Banking project.

## Deployment Targets

### Vercel (Recommended)

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

**Environment Variables** (configure in Vercel dashboard):

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Your Vercel domain
- `PLAID_*` - Plaid API keys
- `DWOLLA_*` - Dwolla API keys
- `UPSTASH_*` - Redis for rate limiting

### Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Railway

```json
// railway.json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build",
    "startCommand": "npm run start"
  },
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Database Migrations on Deploy

**Never override the `build` script in `package.json`.** The project's `prebuild` hook already runs `clean && type-check` automatically. Overriding `build` with `npm run db:push && next build` would break the `prebuild` lifecycle.

Instead, run migrations as a **separate pre-deploy step** before the build:

```bash
# CI/CD pre-deploy step (run before npm run build)
npm run db:migrate
```

For Vercel, use the **"Build & Development Settings → Build Command"** override in the dashboard:

```
npm run db:migrate && npm run build
```

Or use a Vercel `vercel.json` build command:

```json
{
  "buildCommand": "npm run db:migrate && npm run build"
}
```

> Use `db:migrate` (runs pending migrations from files) rather than `db:push` (schema drift push — use only in development). In production, always use migration files.

## CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint:strict
      - run: npm run test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: "--prod"
```

## Environment-Specific Config

```typescript
// lib/env.ts already validates all env vars via Zod.
// Import from lib/env.ts — never use process.env directly.
import { env } from "@/lib/env";

// Use different logic based on environment
if (env.NODE_ENV === "production") {
  // Use connection pooling, Redis cache, etc.
}
```

## Health Checks

```typescript
// app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Check database
    // await db.query("SELECT 1");

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: "Unknown error"
      },
      { status: 503 }
    );
  }
}
```

## Validation

Run: `npm run build` before deploying

## Critical Rules

1. **Never commit secrets** - Use environment variables
2. **Test locally first** - Use `npm run build` and `npm run start`
3. **Database migrations** - Run `npm run db:migrate` as a separate pre-deploy step (never override the `build` script)
4. **Health endpoints** - Implement `/api/health`
5. **Static assets** - Use CDN for uploads in production
