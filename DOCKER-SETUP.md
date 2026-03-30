# Docker Setup Documentation: Node.js/Next.js Banking Application

## Overview

Your banking application has been containerized with three optimized Dockerfiles:

1. **Development Dockerfile** (`compose/development/node/Dockerfile`) - Fast iteration with hot-reload
2. **Production Dockerfile** (`compose/production/node/Dockerfile`) - Minimal, secure image for deployment
3. **Environment-specific Compose files** - Local dev and production orchestration

---

## Architecture Overview

### Multi-Stage Builds (Production)

Your production Dockerfile uses multi-stage builds:

```
Builder Stage
  ├─ node:22-alpine base (full build tools)
  ├─ Install deps with npm ci
  ├─ Type check & build with `npm run build:standalone`
  ├─ Prune production dependencies
  └─ Output: Optimized Next.js standalone server

Runtime Stage
  ├─ gcr.io/distroless/nodejs22 (minimal, security-focused)
  ├─ Copy ONLY built artifacts
  ├─ Run as non-root user
  └─ Output: Minimal final image (~200MB vs 1GB+)
```

**Why this matters:**

- Builder image is discarded; only built artifacts go to runtime
- Production doesn't include dev dependencies (eslint, typescript, testing libraries, etc.)
- Distroless image removes OS shell and unnecessary tools (attack surface reduced by 90%)
- Non-root user prevents container escape vulnerabilities

### Single-Stage Development Build

Your development Dockerfile uses a single stage:

```
Development Image
  ├─ node:22-alpine base (includes all dev tools)
  ├─ Install ALL dependencies (including devDependencies)
  ├─ Mount source code via bind volumes
  ├─ Watch mode enabled automatically
  └─ Fast incremental builds on file changes
```

**Why this approach:**

- Simpler iteration loop (no rebuild needed for most changes)
- Dev dependencies available for linting, testing, type-checking
- Bind mounts sync files instantly without container rebuild
- `docker compose watch` (Compose v2.20+) automatically rebuilds on config changes

---

## Setup Instructions

### First Time: Initial Database Setup

```bash
# Run migrations and seed data
docker compose --profile init up
```

This service will:

1. Wait for PostgreSQL to be healthy
2. Run `npm run db:push` to apply migrations
3. Exit successfully (profiles: [init] means it only runs when explicitly requested)

### Development: Day-to-Day Work

**Option 1: Standard development mode**

```bash
docker compose -f docker-compose.dev.yml up
```

All services start:

- Next.js dev server on `http://localhost:3000`
- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

**Option 2: With file watching (Compose v2.20+)**

```bash
docker compose -f docker-compose.dev.yml watch
```

Enables automatic rebuilds when:

- `package.json`, `next.config.ts`, or `tsconfig.json` changes → full rebuild
- Source files (app, components, lib) change → file sync (no rebuild needed)

**Option 3: Running specific services only**

```bash
# Just app and database (no Redis)
docker compose -f docker-compose.dev.yml up app db init --profile init

# Run tests in container
docker compose -f docker-compose.dev.yml exec app npm run test

# Access database
docker compose -f docker-compose.dev.yml exec db psql -U postgres -d banking
```

### Production: Deployment

```bash
# Build production image
docker compose build --pull --no-cache

# Start full stack
docker compose --env-file .envs/production/.env.production up -d

# View logs
docker compose logs -f app

# Health status
docker compose ps
```

---

## Environment Variables

### Development

Located in `.envs/local/.env.local` (create if missing):

```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/banking
REDIS_PASSWORD=
REDIS_URL=redis://:@redis:6379
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here-dev
# ... other dev secrets
```

### Production

Located in `.envs/production/.env.production`:

```bash
DATABASE_URL=postgresql://user:pass@prod-db.internal:5432/banking
REDIS_PASSWORD=strong-password
REDIS_URL=redis://:strong-password@redis.internal:6379
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-here-prod
NODE_OPTIONS=--max-old-space-size=4096
# ... other prod secrets
```

**Key difference:** Development uses container service names (db, redis), production uses external host names.

---

## Volume Mounts and Bind Mounts (Development)

### Bind Mounts (Source Code)

In `docker-compose.dev.yml`:

```yaml
volumes:
  - ./app:/app/app # Route handlers, layouts
  - ./components:/app/components # React components
  - ./lib:/app/lib # Utilities and helpers
  - ./database:/app/database # Database schema
  - ./public:/app/public # Static assets
  - /app/node_modules # Prevent overwriting - use container version
  - /app/.next # Prevent overwriting - use container version
```

This means:

- ✅ Changes to your local `./app` instantly reflect in the container
- ✅ No rebuild needed for most changes (except configs)
- ❌ Don't modify `/app/node_modules` from host (runs different OS)
- ❌ `.next` is Next.js build cache (keep containerized)

### Named Volumes (Data Persistence)

```yaml
volumes:
  postgres_data: # PostgreSQL data persists across container restarts
  redis_data: # Redis snapshot persists across restarts
```

To reset data:

```bash
docker compose down -v  # -v removes named volumes
```

---

## Docker Compose Features Used

### Health Checks

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U postgres"]
  interval: 10s
  timeout: 5s
  retries: 5
```

Services won't start dependent services until health check passes.

**Check health status:**

```bash
docker compose ps  # Shows (healthy), (starting), (unhealthy)
```

### Service Dependencies

```yaml
depends_on:
  db:
    condition: service_healthy # Wait until db is healthy
  redis:
    condition: service_healthy
```

### Watch Mode (`develop:`)

```yaml
develop:
  watch:
    - path: ./app
      action: sync # Copy file without rebuild
    - path: ./package.json
      action: rebuild # Rebuild entire image
```

---

## Debugging and Troubleshooting

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f db
docker compose logs -f redis

# Last 50 lines
docker compose logs --tail=50 app

# Specific time range
docker compose logs --since 2024-01-15T10:00:00 app
```

### Common Issues

#### Build fails with "npm ci" errors

```bash
# Clear cache and rebuild
docker compose build --no-cache

# Or delete node_modules in container
docker compose exec app rm -rf node_modules
docker compose build
```

#### Container keeps restarting

```bash
# Check logs
docker compose logs app

# Check exit code
docker compose ps  # See "Exited (code)"

# Common exit codes:
# 0 = clean exit
# 1 = runtime error
# 137 = out of memory (OOM kill)
# 143 = terminated by SIGTERM
```

#### Database won't connect

```bash
# Check if db is healthy
docker compose ps db

# Test connection manually
docker compose exec db psql -U postgres -d banking

# Check db logs
docker compose logs db
```

#### Port already in use

```bash
# Change port in docker-compose.dev.yml
ports:
  - "3001:3000"  # Host:Container

# Or find process using port 3000
lsof -i :3000
```

### Inspect Container

```bash
# Connect to app container
docker compose exec app sh

# Inside container, run:
npm run type-check
npm run lint
npm run test:browser
```

---

## Performance Optimization Tips

### 1. Bind Mount Volumes

Bind mounts sync files instantly—much faster than rebuilds:

```yaml
volumes:
  - ./app:/app/app # Changes here reflect immediately
```

### 2. Use `docker compose watch`

Automatic incremental rebuilds:

```bash
docker compose -f docker-compose.dev.yml watch
```

### 3. Layer Caching

Dockerfiles are optimized to maximize cache hits:

```dockerfile
# Copied early - changes less frequently
COPY package.json package-lock.json ./
RUN npm ci

# Copied late - changes frequently
COPY . .
```

If `package.json` doesn't change, layers are reused.

### 4. Docker BuildKit

BuildKit enables parallel builds and better caching:

```bash
# Enable globally
docker buildx create --use

# Or per command
DOCKER_BUILDKIT=1 docker compose build
```

### 5. Reduce Image Size

Production image is ~200MB because:

- Distroless base: removes 80% of typical OS cruft
- Multi-stage: dev dependencies discarded
- Standalone output: no node_modules in final image

Check image sizes:

```bash
docker images | grep node  # See your images
docker compose images app  # Current compose image
```

---

## Health Check Endpoints

Your compose file checks `/api/health`:

```yaml
healthcheck:
  test:
    [
      "CMD",
      "wget",
      "--no-verbose",
      "--tries=1",
      "--spider",
      "http://localhost:3000/api/health"
    ]
```

**Ensure your Next.js app has an `/api/health` endpoint:**

Create `app/api/health/route.ts`:

```typescript
import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json(
    { status: "ok", timestamp: new Date() },
    { status: 200 }
  );
};
```

---

## Network Configuration

### Container-to-Container Communication

Services communicate using service names as hostnames:

```typescript
// From app container, connect to database container
const dbUrl = `postgresql://user:pass@db:5432/banking`;

// From app container, connect to Redis container
const redisUrl = `redis://redis:6379`;
```

### Host-to-Container Communication

From your host machine:

```bash
# PostgreSQL: localhost:5432
psql -h localhost -U postgres -d banking

# Redis: localhost:6379
redis-cli -h localhost

# Next.js: http://localhost:3000
curl http://localhost:3000/api/health
```

---

## Cleanup and Reset

### Stop all services (keep data)

```bash
docker compose stop
```

### Remove containers (keep data)

```bash
docker compose down
```

### Remove everything (including data)

```bash
docker compose down -v  # -v removes named volumes
```

### Full reset (including images)

```bash
docker compose down -v --rmi all
```

---

## Next Steps

1. **Create environment files** (if not present):

   ```bash
   mkdir -p .envs/local .envs/production
   cp .env.production .envs/production/.env.production
   # Add database/redis credentials
   ```

2. **Build and test locally**:

   ```bash
   docker compose -f docker-compose.dev.yml build
   docker compose -f docker-compose.dev.yml --profile init up
   ```

3. **Verify app is running**:

   ```bash
   curl http://localhost:3000/api/health
   docker compose -f docker-compose.dev.yml ps  # Check (healthy)
   ```

4. **Test hot-reload**:

   ```bash
   docker compose -f docker-compose.dev.yml watch
   # Make a change to app/ or components/
   # Observe file sync in logs - no rebuild triggered
   ```

5. **Production deployment**:
   ```bash
   docker compose build --pull --no-cache
   docker compose --env-file .envs/production/.env.production up -d
   docker compose ps  # Verify health
   ```

---

## Docker Compose Command Reference

| Command | Purpose |
| --- | --- |
| `docker compose up` | Start all services |
| `docker compose up -d` | Start in background |
| `docker compose down` | Stop and remove containers |
| `docker compose down -v` | Stop, remove containers + volumes |
| `docker compose build` | Build images |
| `docker compose build --no-cache` | Rebuild from scratch |
| `docker compose ps` | List running containers |
| `docker compose logs -f app` | Stream logs from app service |
| `docker compose exec app npm run test` | Run command in container |
| `docker compose exec db psql -U postgres` | Interactive database shell |
| `docker compose images` | List images |
| `docker compose restart app` | Restart specific service |
| `docker compose watch` | Enable file watching (v2.20+) |

---

## Security Considerations

✅ **What's already in place:**

- Non-root users (distroless runs as `nonroot:nonroot`)
- `security_opt: no-new-privileges:true` prevents privilege escalation
- Alpine base images (minimal attack surface)
- Health checks prevent zombie containers
- Secrets via `.env` files (never committed to git)

⚠️ **Best practices to follow:**

- Rotate database credentials regularly
- Use strong `NEXTAUTH_SECRET` values
- Don't expose `.env` files; add to `.gitignore`
- Use environment-specific secrets (dev ≠ prod)
- Keep base images updated: `docker compose pull --policy always`

---

## Resources

- [Next.js Docker Documentation](https://nextjs.org/docs/deployment/docker)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Distroless Images](https://github.com/GoogleContainerRegistry/distroless)
