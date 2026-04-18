# Development Guide

Local development setup with Docker Compose and hot-reload.

## Setup

### 1. Start Services (No Traefik)

For development without reverse proxy overhead:

```bash
# Start base services only
docker compose --env-file .envs/production/.env.production build;
docker compose --profile traefik --env-file .envs/production/.env.production up -d;
docker compose --env-file .envs/production/.env.production up -d;
docker compose --profile init --env-file .envs/production/.env.production up init --abort-on-container-exit;

# Wait for db to be ready
docker compose exec db pg_isready -U postgres
```

### 2. Generate htpasswd (Optional)

Only needed if you want Traefik dashboard:

```bash
bash scripts/generate-htpasswd.sh
```

### 3. Access Services

| Service    | URL                     | Notes           |
| ---------- | ----------------------- | --------------- |
| App        | <http://localhost:3000> | Direct access   |
| PostgreSQL | localhost:5432          | User: postgres  |
| Redis      | localhost:6379          | Password: redis |

## Hot Reload

### Option A: Rebuild on Changes

For simplicity, rebuild when files change:

```bash
# Watch for file changes
docker compose build app
docker compose up -d app
```

### Option B: Volume Mounts (More Memory)

Mount source directories for live editing:

```yaml
# In docker-compose.yml (local profile)
app:
  volumes:
    - ./app:/app/app
    - ./components:/app/components
    - ./lib:/app/lib
  develop:
    watch:
      - path: ./app
        action: rebuild
      - path: ./lib
        action: rebuild
```

## Database Operations

### Run Migrations

```bash
docker compose --profile init up
```

### Open psql

```bash
docker compose exec db psql -U postgres -d banking
```

### Reset Database

```bash
# Stop services
docker compose down

# Remove volumes
docker compose down -v

# Start fresh
docker compose --profile local up -d
docker compose --profile init up
```

## Redis Operations

### Connect to Redis CLI

```bash
docker compose exec redis redis-cli -a your-password
```

### Flush Database

```bash
docker compose exec redis redis-cli FLUSHALL
```

## Debugging

### View App Logs

```bash
docker compose logs -f app
```

### View All Logs

```bash
docker compose logs -f
```

### Check Service Status

```bash
docker compose ps
docker compose inspect app
```

### Enter Container

```bash
docker compose exec app sh
```

## Environment Variables

For development, create `.envs/local/.env.local`:

```env
NODE_ENV=development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:postgres@db:5432/banking
REDIS_URL=redis://:redis@redis:6379
NEXTAUTH_URL=http://localhost:3000
ENCRYPTION_KEY=your-32-char-key
NEXTAUTH_SECRET=your-secret
```

## Performance Tips

1. **Use local profile** - Skip Traefik for faster startup
2. **Don't mount node_modules** - Use container's node_modules
3. **Use .dockerignore** - Exclude unnecessary files
4. **Start fresh** - Periodically rebuild images

## Troubleshooting

See [Troubleshooting Guide](troubleshooting.md) for common issues.
