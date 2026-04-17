# Docker Implementation Checklist

## ✅ Files Created

- [x] `compose/development/node/Dockerfile` - Development image with hot-reload
- [x] `docker-compose.dev.yml` - Development environment stack
- [x] `DOCKER-SETUP.md` - Comprehensive setup and reference guide
- [x] `DOCKERFILE-EXPLANATION.md` - Architecture decisions and deep dive
- [x] `DOCKER-QUICK-START.md` - Quick reference for common tasks
- [x] `.dockerignore` - Already exists and optimized

---

## 🚀 Getting Started

### Step 1: Prepare Environment Files

```bash
# Create directories if missing
mkdir -p .envs/local .envs/production

# Verify or create local environment
ls .envs/local/.env.local
# If missing, create with:
cat > .envs/local/.env.local <<EOF
DATABASE_URL=postgresql://postgres:postgres@db:5432/banking
REDIS_PASSWORD=
REDIS_URL=redis://:@redis:6379
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-key
EOF
```

### Step 2: Build Development Image

```bash
# First time (slower, ~5-10 min)
docker compose -f docker-compose.dev.yml build --no-cache

# Subsequent builds (faster, uses cache)
docker compose -f docker-compose.dev.yml build
```

**Expected output:**

```
[+] Building 10.5s (15/15) FINISHED
 => naming to docker.io/library/banking-app:latest
```

### Step 3: Run Database Migrations

```bash
# Initialize database and run migrations
docker compose -f docker-compose.dev.yml --profile init up

# Check if successful
docker compose -f docker-compose.dev.yml logs init
# Should see: "npm run db:push" completed successfully
```

### Step 4: Start Development Stack

```bash
# Option A: Standard mode
docker compose -f docker-compose.dev.yml up

# Option B: Background mode (recommended)
docker compose -f docker-compose.dev.yml up -d

# Option C: With file watching (Compose v2.20+)
docker compose -f docker-compose.dev.yml watch
```

### Step 5: Verify Stack is Running

```bash
# Check service status
docker compose -f docker-compose.dev.yml ps

# Expected output:
# NAME    SERVICE  STATUS    PORTS
# banking-app    UP (healthy)  0.0.0.0:3000->3000/tcp
# db     UP (healthy)  5432/tcp
# redis  UP (healthy)  6379/tcp

# Test health endpoint
curl http://localhost:3000/api/health
# Expected: { "status": "ok", "timestamp": "..." }
```

### Step 6: Test Hot-Reload (Optional)

```bash
# Terminal 1: Enable watch mode
docker compose -f docker-compose.dev.yml watch

# Terminal 2: Make a code change
echo "// Test change" >> app/page.tsx

# Terminal 1 should show:
# [sync] Syncing ./app/page.tsx to container
# ✔ File synced, app watching changes

# Browser automatically reloads thanks to Next.js HMR
```

---

## 🔧 Common Development Tasks

### View Application Logs

```bash
# All services
docker compose -f docker-compose.dev.yml logs -f

# Specific service
docker compose -f docker-compose.dev.yml logs -f app

# Last 50 lines
docker compose -f docker-compose.dev.yml logs --tail 50 app

# Since specific time
docker compose -f docker-compose.dev.yml logs --since 2024-01-15T10:00:00 app
```

### Access Container Shell

```bash
# Bash shell (not available in production distroless image)
docker compose -f docker-compose.dev.yml exec app sh

# Inside container:
npm run type-check
npm run lint
npm run test
exit  # Exit shell
```

### Database Access

```bash
# PostgreSQL interactive shell
docker compose -f docker-compose.dev.yml exec db psql -U postgres -d banking

# Inside psql:
\dt                           # List tables
SELECT * FROM users LIMIT 5;  # Run SQL query
\q                            # Quit

# Or run single command:
docker compose -f docker-compose.dev.yml exec db psql -U postgres -d banking -c "SELECT COUNT(*) FROM users;"

# Redis CLI
docker compose -f docker-compose.dev.yml exec redis redis-cli

# Inside redis:
KEYS *               # List all keys
GET user:1           # Get specific key
FLUSHALL             # Clear all data (destructive!)
EXIT                 # Quit
```

### Run Tests

```bash
# Vitest (browser)
docker compose -f docker-compose.dev.yml exec app npm run test:browser

# Playwright (E2E)
docker compose -f docker-compose.dev.yml exec app npm run test:ui

# All tests
docker compose -f docker-compose.dev.yml exec app npm run test
```

### Run Type Checking

```bash
docker compose -f docker-compose.dev.yml exec app npm run type-check
```

### Run Linter

```bash
# Check only
docker compose -f docker-compose.dev.yml exec app npm run lint

# Fix automatically
docker compose -f docker-compose.dev.yml exec app npm run lint:fix
```

### Rebuild Database Migrations

```bash
# Generate new migrations
docker compose -f docker-compose.dev.yml exec app npm run db:generate

# Push to database
docker compose -f docker-compose.dev.yml exec app npm run db:push

# Or reset completely
docker compose -f docker-compose.dev.yml exec app npm run db:reset
```

### Rebuild App Image

```bash
# Rebuild without cache (fresh dependencies)
docker compose -f docker-compose.dev.yml build --no-cache app

# Restart to use new image
docker compose -f docker-compose.dev.yml restart app
```

---

## 🛑 Stopping Services

### Graceful Shutdown (Keep Data)

```bash
# Stop all services
docker compose -f docker-compose.dev.yml stop

# Restart them later
docker compose -f docker-compose.dev.yml start

# Or start specific service
docker compose -f docker-compose.dev.yml start app
```

### Remove Containers (Keep Data)

```bash
docker compose -f docker-compose.dev.yml down
```

### Full Cleanup (Remove Everything)

```bash
# Remove containers, volumes, networks
docker compose -f docker-compose.dev.yml down -v

# Also remove images
docker compose -f docker-compose.dev.yml down -v --rmi all
```

---

## 🏗️ Production Deployment

### Build Production Image

```bash
# Pull latest base images
docker compose build --pull

# Build without cache
docker compose build --no-cache

# Tag image for registry
docker tag banking-app:latest your-registry/banking-app:1.0.0
```

### Deploy to Production

```bash
# Start with production environment file
docker compose --env-file .envs/production/.env.production up -d

# Verify health
docker compose ps

# View logs
docker compose logs -f app

# Scale app service (if using swarm/orchestrator)
docker compose up -d --scale app=3
```

### Monitoring Production

```bash
# Check service status
docker compose ps

# View container resource usage
docker stats

# Check disk usage
docker system df

# View error logs
docker compose logs -n 100 app

# Drain logs to file
docker compose logs app > logs.txt
```

---

## 🧹 Cleanup Operations

### Remove Dangling Images

```bash
docker image prune -a
```

### Remove Unused Volumes

```bash
docker volume prune
```

### Remove Unused Networks

```bash
docker network prune
```

### Full System Cleanup

```bash
docker system prune -a --volumes
```

---

## 📊 Troubleshooting Checklist

### Build Fails

- [ ] Check `npm ci` errors in logs
- [ ] Clear Docker cache: `docker compose build --no-cache`
- [ ] Check disk space: `docker system df`
- [ ] Verify `package-lock.json` integrity

### Container Won't Start

- [ ] Check logs: `docker compose logs app`
- [ ] Verify health check: `docker compose ps`
- [ ] Check ports not in use: `netstat -an | grep 3000`
- [ ] Check dependencies ready: `docker compose ps db redis`

### Slow Builds

- [ ] Enable BuildKit: `export DOCKER_BUILDKIT=1`
- [ ] Use layer caching (don't use `--no-cache` unnecessarily)
- [ ] Use `docker compose watch` (rebuilds only changed layers)

### Database Connection Fails

- [ ] Check PostgreSQL health: `docker compose ps db`
- [ ] Verify credentials in `.env` files
- [ ] Test connection: `docker compose exec db psql -U postgres`
- [ ] Check network: `docker network inspect <network-name>`

### Node Modules Corrupted

- [ ] Problem: Windows/Mac host binaries in container
- [ ] Solution: Use anonymous volume: `volumes: - /app/node_modules`
- [ ] Rebuild: `docker compose down -v && docker compose build`

### Port Conflicts

- [ ] Find process using port: `netstat -ano | grep 3000`
- [ ] Change port in compose: `ports: ["3001:3000"]`
- [ ] Or kill process: `lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9`

---

## 📋 Maintenance Tasks

### Weekly

- [ ] Pull latest base images: `docker compose pull`
- [ ] Update dependencies: `npm update` (local, then `npm ci` in container)
- [ ] Check for security vulnerabilities: `npm audit`

### Monthly

- [ ] Clean up dangling resources: `docker system prune -a`
- [ ] Review logs for errors
- [ ] Test disaster recovery (restore from database backup)

### Quarterly

- [ ] Update major dependencies: `npm-check-updates -i`
- [ ] Update Node.js base image: `node:22 → node:24` (when available)
- [ ] Security audit of Dockerfile and compose file

---

## ✨ Best Practices Summary

✅ **DO:**

- Use `docker compose watch` for development
- Use `docker compose --profile init up` for initial setup
- Mount only source code (not node_modules)
- Use health checks in compose
- Set `restart: unless-stopped` in production
- Use named volumes for data persistence
- Separate `.env` files for dev/prod

❌ **DON'T:**

- Use `docker run` for production (use compose or orchestrator)
- Mount node_modules from host (use anonymous volumes)
- Skip health checks
- Commit `.env` files to git
- Use `latest` tag in production (use semver tags)
- Modify running containers (recreate with compose instead)

---

## 📚 Additional Resources

- **Full Docker Setup Guide:** `DOCKER-SETUP.md`
- **Architecture Explanation:** `DOCKERFILE-EXPLANATION.md`
- **Quick Reference:** `DOCKER-QUICK-START.md`
- **Docker Docs:** https://docs.docker.com/
- **Compose Reference:** https://docs.docker.com/compose/compose-file/
- **Next.js Docker:** https://nextjs.org/docs/deployment/docker

---

## 🎯 Success Criteria

Verify your setup is complete:

- [ ] Development image builds successfully: `docker compose -f docker-compose.dev.yml build`
- [ ] Database migrations run: `docker compose -f docker-compose.dev.yml --profile init up`
- [ ] App starts and is healthy: `docker compose -f docker-compose.dev.yml up`
- [ ] Health endpoint works: `curl http://localhost:3000/api/health`
- [ ] Hot-reload works: `docker compose -f docker-compose.dev.yml watch` + file change
- [ ] Production image builds: `docker compose build`
- [ ] Production image is smaller: Compare `docker images` output (~200MB vs ~500MB)
- [ ] Can access database: `docker compose -f docker-compose.dev.yml exec db psql -U postgres`

---

## 🆘 Support

If issues arise:

1. **Check logs:** `docker compose logs -f <service>`
2. **Review documentation:** `DOCKER-SETUP.md` → "Debugging" section
3. **Common issues:** `DOCKER-QUICK-START.md` → "Common Issues & Solutions"
4. **Architecture questions:** `DOCKERFILE-EXPLANATION.md`

---

**Last Updated:** 2024 **Docker Version:** 23.0+ (BuildKit enabled by default) **Compose Version:** 2.20+ (recommended for watch mode)
