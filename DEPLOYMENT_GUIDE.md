# Banking — Deployment Guide

## Deployment Options

### 1. Vercel (Recommended)

```bash
# Install Vercel CLI
bun add --global vercel

# Deploy
vercel --prod
```

Environment variables must be configured in Vercel Dashboard:
- `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
- `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`
- `DWOLLA_KEY`, `DWOLLA_SECRET`, `DWOLLA_ENV`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

### 2. Docker

A Dockerfile is included for containerized deployment:

```bash
# Build image
docker build -t banking:latest .

# Run container
docker run -p 3000:3000 --env-file .env.production banking:latest
```

### 3. Standalone Next.js Build

```bash
bun run build:standalone
# Output in .next/standalone/
```

## Environment Configuration

### Production Variables

```env
DATABASE_URL=postgresql://user:***@production-host:5432/banking
NEXTAUTH_SECRET=<generated-secret>
NEXTAUTH_URL=https://your-domain.com
PLAID_ENV=production       # NOT sandbox
DWOLLA_ENV=production      # NOT sandbox
NODE_ENV=production
```

### Pre-Deployment Checklist

- [ ] Database migrations pushed (`bun run db:push`)
- [ ] Plaid switched to production environment
- [ ] Dwolla switched to production environment
- [ ] `NEXTAUTH_URL` set to production domain
- [ ] Rate limiting configured for production
- [ ] SSL/HTTPS enabled
- [ ] Database backups configured
- [ ] Monitoring tools active
- [ ] Secrets managed via env vars (not committed)

## CI/CD Pipeline

GitHub Actions workflow runs on push/PR:

1. **Lint & Type-Check**: ESLint + TypeScript
2. **Test**: Vitest + Playwright E2E
3. **Build**: Next.js production build
4. **Deploy**: Auto-deploy on main branch

## Post-Deployment

- Verify Plaid Link token generation
- Test ACH transfer flow with small amount
- Monitor rate limit thresholds
- Check error logging and reporting
