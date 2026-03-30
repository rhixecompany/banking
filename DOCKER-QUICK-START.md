# Docker Quick Reference: Banking App

## One-Liners

### First Time Setup

```bash
docker compose --profile init up
```

### Development (Day-to-Day)

```bash
docker compose -f docker-compose.dev.yml watch
```

### View Logs

```bash
docker compose -f docker-compose.dev.yml logs -f app
```

### Connect to Database

```bash
docker compose -f docker-compose.dev.yml exec db psql -U postgres -d banking
```

### Run Tests

```bash
docker compose -f docker-compose.dev.yml exec app npm run test
```

### Production Deploy

```bash
docker compose build --pull --no-cache
docker compose --env-file .envs/production/.env.production up -d
docker compose ps
```

### Stop & Cleanup

```bash
docker compose down -v  # Remove everything including data
```

---

## File Structure

```
banking/
├── compose/
│   ├── development/
│   │   └── node/Dockerfile       ← Development image (this session)
│   ├── production/
│   │   └── node/Dockerfile       ← Production image (multi-stage)
│   └── local/
│       └── node/Dockerfile       ← Legacy local build
├── docker-compose.dev.yml        ← Development stack (this session)
├── docker-compose.yml            ← Production stack
├── docker-compose.local.yml      ← Legacy local stack
├── .dockerignore                 ← Files to exclude from build
└── DOCKER-SETUP.md              ← Full documentation (this session)
```

---

## Key Differences: Development vs Production

| Aspect | Development | Production |
| --- | --- | --- |
| **Base Image** | `node:22-alpine` | `distroless/nodejs22` |
| **Build Type** | Single-stage | Multi-stage |
| **Dependencies** | All (dev included) | Production only |
| **Size** | ~500MB | ~200MB |
| **Start Command** | `npm run dev` | `node server.js` |
| **Volume Mounts** | Bind mounts (source code) | No mounts (immutable) |
| **Hot Reload** | Yes (file sync + watch) | No (redeployment needed) |
| **User** | root | nonroot |
| **Security** | Development-focused | Production-hardened |

---

## Environment Variables

### Development

File: `.envs/local/.env.local`

```bash
DATABASE_URL=postgresql://postgres:postgres@db:5432/banking
REDIS_PASSWORD=
REDIS_URL=redis://:@redis:6379
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-not-secure
```

### Production

File: `.envs/production/.env.production`

```bash
DATABASE_URL=postgresql://prod_user:prod_pass@prod-db:5432/banking
REDIS_PASSWORD=strong-password-here
REDIS_URL=redis://:strong-password-here@redis:6379
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXTAUTH_SECRET=prod-secret-very-secure
NODE_OPTIONS=--max-old-space-size=4096
```

---

## Port Mapping

| Service     | Container Port | Host Port | URL                   |
| ----------- | -------------- | --------- | --------------------- |
| Next.js App | 3000           | 3000      | http://localhost:3000 |
| PostgreSQL  | 5432           | 5432      | localhost:5432        |
| Redis       | 6379           | 6379      | localhost:6379        |

---

## Debugging Commands

```bash
# Check if services are running and healthy
docker compose ps

# View full service logs
docker compose logs app

# View last 20 lines, following live
docker compose logs -f --tail=20 app

# Check specific service health
docker compose exec app wget -O- http://localhost:3000/api/health

# Rebuild without cache
docker compose build --no-cache

# Access app container shell
docker compose exec app sh

# Run command inside container
docker compose exec app npm run type-check

# See what's taking space
docker system df

# Clean up unused images/volumes
docker system prune -a
```

---

## Common Issues & Solutions

### Issue: "Port 3000 already in use"

```bash
# Change in docker-compose.dev.yml:
ports:
  - "3001:3000"  # Use 3001 instead
```

### Issue: "npm ci" fails in build

```bash
# Rebuild without cache
docker compose build --no-cache app
```

### Issue: "database connection refused"

```bash
# Wait for db to be healthy
docker compose ps  # Check STATUS column

# If not healthy, check db logs
docker compose logs db
```

### Issue: "Changes not reflecting in app"

```bash
# Ensure bind mounts are correct
docker compose config | grep volumes

# Restart with watch
docker compose -f docker-compose.dev.yml watch
```

### Issue: "node_modules corrupted"

```bash
# Use container version (anonymous volume)
# In Dockerfile: /app/node_modules
# In compose volumes: /app/node_modules (no host path)
```

---

## Performance Tips

1. **Use `docker compose watch`** for automatic rebuilds (v2.20+)

   ```bash
   docker compose -f docker-compose.dev.yml watch
   ```

2. **Don't mount node_modules** from host

   ```yaml
   volumes:
     - /app/node_modules # Anonymous volume - use container version
   ```

3. **Use layer caching**

   ```dockerfile
   # Copy deps early (changes less)
   COPY package.json package-lock.json ./
   RUN npm ci
   # Copy source late (changes frequently)
   COPY . .
   ```

4. **Enable BuildKit** for better caching
   ```bash
   export DOCKER_BUILDKIT=1
   docker compose build
   ```

---

## Compose File Locations

- **Development**: `docker-compose.dev.yml` (new - recommended)
- **Production**: `docker-compose.yml` (existing)
- **Legacy Local**: `docker-compose.local.yml` (deprecated)

### Using Specific File

```bash
# Use development stack
docker compose -f docker-compose.dev.yml up

# Use production stack (default)
docker compose up

# Use multiple files (override)
docker compose -f docker-compose.yml -f overrides.yml up
```

---

## Lifecycle Commands

```bash
# Start fresh with migrations
docker compose --profile init up

# Start in background (production)
docker compose up -d

# Pause (keeps data)
docker compose pause

# Resume
docker compose unpause

# Graceful shutdown (30s timeout)
docker compose down

# Force stop (immediate)
docker compose kill

# Remove everything including data
docker compose down -v

# Remove images too
docker compose down -v --rmi all
```

---

## Database Access

```bash
# PostgreSQL interactive shell
docker compose exec db psql -U postgres -d banking

# Run SQL query
docker compose exec db psql -U postgres -d banking -c "SELECT * FROM users LIMIT 1;"

# Backup database
docker compose exec db pg_dump -U postgres -d banking > backup.sql

# Restore from backup
docker compose exec -T db psql -U postgres -d banking < backup.sql

# Redis CLI
docker compose exec redis redis-cli

# Redis keys
docker compose exec redis redis-cli KEYS "*"

# Redis flush (delete all)
docker compose exec redis redis-cli FLUSHALL
```

---

## Health Check Status

The compose file monitors service health:

```bash
# Check status
docker compose ps

# Output shows:
# Up 5 seconds (health: starting)
# Up 1 minute (healthy)
# Up 2 minutes (unhealthy)
```

If unhealthy:

```bash
# Check logs
docker compose logs app
docker compose logs db

# Try restarting
docker compose restart app
```

---

## Image Management

```bash
# List images
docker images | grep banking

# Inspect image
docker compose images app

# Build specific image
docker compose build app

# Force rebuild without cache
docker compose build --no-cache app

# Push to registry (after login)
docker compose push

# Pull latest base images
docker compose pull
```

---

## See Also

- Full documentation: `DOCKER-SETUP.md`
- Docker Compose docs: https://docs.docker.com/compose/
- Next.js Docker guide: https://nextjs.org/docs/deployment/docker
