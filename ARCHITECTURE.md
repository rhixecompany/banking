# Architecture & Deployment Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Production Deployment                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Docker Host / Server / Cloud Platform                   │   │
│  ├──────────────────────────────────────────────────────────┤   │
│  │                                                            │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │   │
│  │  │   banking    │  │  PostgreSQL  │  │    Redis     │   │   │
│  │  │   app:prod   │  │   17-alpine  │  │  7-alpine    │   │   │
│  │  ├──────────────┤  ├──────────────┤  ├──────────────┤   │   │
│  │  │ Port: 3000   │  │ Port: 5432   │  │ Port: 6379   │   │   │
│  │  │ User: nonroot│  │ User: postgres│  │ User: redis  │   │   │
│  │  │ Size: 250MB  │  │ Size: 150MB  │  │ Size: 60MB   │   │   │
│  │  │ HC: /health  │  │ HC: pg_ready │  │ HC: ping     │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │   │
│  │        │                 │                    │           │   │
│  │        └─────────────────┼────────────────────┘           │   │
│  │                          │                                │   │
│  │              app-network (bridge)                         │   │
│  │                          │                                │   │
│  └──────────────────────────┼────────────────────────────────┘   │
│                             │                                    │
│                             ↓                                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  External Load Balancer / Reverse Proxy                 │    │
│  │  (nginx / HAProxy / Cloud LB)                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│                             ↑                                    │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                              ↓
                    Internet / Users (port 80/443)
```

## Build Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│                    Source Code (Git)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
          ┌──────────────────────────────┐
          │  npm run type-check          │ (Type validation)
          │  npm run prebuild            │ (Clean build)
          └────────────┬─────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────┐
        │  docker build -t banking:prod    │
        └────────────┬─────────────────────┘
                     │
         ┌───────────┴──────────┬──────────────┐
         │                      │              │
    ┌────▼──────┐      ┌────────▼──┐   ┌──────▼────┐
    │  Builder   │      │ Production │   │ Push to   │
    │  Stage     │      │ Stage      │   │ Registry  │
    ├────────────┤      ├────────────┤   ├──────────┤
    │ Node 22    │      │ Distroless │   │ Docker   │
    │ Build deps │  →   │ Final img  │→  │ Hub/ECR  │
    │ 1.2GB      │      │ 250MB      │   │          │
    └────────────┘      └────────────┘   └──────────┘
         │                    │              │
         └────────────────────┴──────────────┘
                      │
                      ↓
        ┌──────────────────────────────┐
        │  docker compose up           │
        │  (Pull image + start)        │
        └──────────────┬───────────────┘
                       │
        ┌──────────────┴─────────────┐
        │                            │
    ┌───▼───┐  ┌────────┐  ┌──────▼──┐
    │  App  │  │Database│  │ Redis   │
    │ Ready │  │ Ready  │  │ Ready   │
    └───────┘  └────────┘  └─────────┘
```

## Deployment Workflow

```
START
  │
  ├─→ bash generate-env.sh
  │   └─→ Creates .env.production with random secrets
  │
  ├─→ Edit .env.production
  │   └─→ Set NEXT_PUBLIC_SITE_URL, API keys, etc.
  │
  ├─→ bash deploy.sh
  │   │
  │   ├─→ Verify Docker installed
  │   │
  │   ├─→ docker build -t banking:prod .
  │   │   └─→ Multistage build (builder → production)
  │   │
  │   ├─→ docker compose --profile init up
  │   │   └─→ Run migrations (npm run db:push)
  │   │
  │   ├─→ docker compose up -d
  │   │   ├─→ Start app container
  │   │   ├─→ Start postgres container
  │   │   └─→ Start redis container
  │   │
  │   ├─→ Wait for health checks
  │   │   ├─→ App: curl /api/health
  │   │   ├─→ DB: pg_isready
  │   │   └─→ Redis: redis-cli ping
  │   │
  │   └─→ Verify connectivity
  │       ├─→ DB connected ✓
  │       └─→ Redis connected ✓
  │
  └─→ READY FOR PRODUCTION ✓
```

## Environment Configuration Flow

```
┌─────────────────────────────────────────────────────────┐
│                 Environment Variables                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Development (.env)                             │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ NODE_ENV=development                           │   │
│  │ DATABASE_URL=postgresql://localhost            │   │
│  │ ENCRYPTION_KEY=dev-only-not-secure             │   │
│  │ NEXTAUTH_SECRET=dev-only-not-secure            │   │
│  │ NEXT_PUBLIC_SITE_URL=http://localhost:3000     │   │
│  └─────────────────────────────────────────────────┘   │
│           ↓ (npm run dev)                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Local Docker Compose                           │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ docker compose watch (hot-reload)              │   │
│  └─────────────────────────────────────────────────┘   │
│                     ↓                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Staging (.env.staging)                         │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ NODE_ENV=production                            │   │
│  │ DATABASE_URL=postgresql://staging-db:5432      │   │
│  │ ENCRYPTION_KEY=<32-char-random>                │   │
│  │ NEXTAUTH_SECRET=<32-char-random>               │   │
│  │ NEXT_PUBLIC_SITE_URL=https://staging.domain    │   │
│  └─────────────────────────────────────────────────┘   │
│           ↓ (docker compose up --env-file)             │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Production (.env.production)                   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ NODE_ENV=production                            │   │
│  │ DATABASE_URL=postgresql://prod-db:5432         │   │
│  │ ENCRYPTION_KEY=<secure-random>                 │   │
│  │ NEXTAUTH_SECRET=<secure-random>                │   │
│  │ NEXT_PUBLIC_SITE_URL=https://yourdomain.com    │   │
│  └─────────────────────────────────────────────────┘   │
│           ↓ (bash deploy.sh)                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Running Production Container                   │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ Secrets injected via env_file                  │   │
│  │ NO secrets in image itself                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Health Check Flow

```
┌────────────────────────────────────────────────┐
│  Docker Health Check (Every 30 seconds)        │
├────────────────────────────────────────────────┤
│                                                 │
│  START                                          │
│    │                                            │
│    ├─→ wget http://localhost:3000/api/health  │
│    │   (endpoint health check)                 │
│    │                                            │
│    ├─→ GET /api/health                        │
│    │   └─→ Checks:                             │
│    │       ├─→ App running? ✓                 │
│    │       ├─→ Database connected? ✓          │
│    │       └─→ Redis connected? ✓             │
│    │                                            │
│    └─→ Response Codes:                        │
│        ├─→ 200 OK = HEALTHY ✓                │
│        │   └─→ Container runs normally         │
│        │                                        │
│        └─→ 503 UNAVAILABLE = UNHEALTHY ✗    │
│            └─→ After 3 failures (90s):         │
│                Docker restarts container       │
│                                                 │
└────────────────────────────────────────────────┘
```

## Data Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTP(S)
       ↓
┌─────────────────────┐
│  Load Balancer      │
│  (nginx/HAProxy)    │
└──────┬──────────────┘
       │ Port 3000
       ↓
┌─────────────────────────────────────────────┐
│  Docker Container (banking:prod)            │
│  ├─ Node.js 22 (distroless)                 │
│  ├─ Next.js Application                     │
│  └─ Port: 3000                              │
└──────┬──────┬──────┬────────────────────────┘
       │      │      │
   SQL │      │      │ Cache
       │      │      │
┌──────▼─┐  ┌─┴──────▼───────┐
│PostgreSQL│ │ Redis Cache    │
│  DB     │ │ Session Store  │
│ 5432    │ │ Rate Limit     │
└─────────┘ └────────────────┘
```

## Security Layers

```
┌────────────────────────────────────────────────────────┐
│              Security Stack                            │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Layer 1: Base Image                                  │
│  ├─ Distroless: No shell, no package manager         │
│  ├─ Alpine variants: Minimal attack surface          │
│  └─ Result: 99% fewer vulnerabilities                │
│                                                        │
│  Layer 2: Container Isolation                        │
│  ├─ Nonroot user (UID 65532)                         │
│  ├─ Read-only filesystem                             │
│  ├─ no-new-privileges security option                │
│  └─ Result: Limited privilege escalation vectors     │
│                                                        │
│  Layer 3: Secrets Management                         │
│  ├─ No secrets in image                              │
│  ├─ Runtime environment injection                    │
│  ├─ env_file configuration                           │
│  └─ Result: Secrets never stored in layers           │
│                                                        │
│  Layer 4: Network Security                           │
│  ├─ Private Docker network                           │
│  ├─ Service-to-service communication only            │
│  ├─ Load balancer in front                           │
│  └─ Result: Only necessary ports exposed             │
│                                                        │
│  Layer 5: Monitoring & Response                      │
│  ├─ Health checks (every 30s)                        │
│  ├─ Automatic restart on failure                     │
│  ├─ Log aggregation                                  │
│  └─ Result: Fast detection and recovery              │
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Deployment Scenarios

```
SCENARIO 1: Fresh Deployment
  bash deploy.sh
    │
    ├─→ Build image
    ├─→ Create database
    ├─→ Run migrations
    ├─→ Start services
    └─→ READY ✓

SCENARIO 2: Update with Zero Downtime
  git pull
  docker build -t banking:prod .
  docker compose exec app npm run db:push  (migrations)
  docker compose down
  docker compose up -d
    │
    ├─→ Old container stops
    ├─→ New container starts
    ├─→ Health checks pass
    └─→ Traffic redirected ✓

SCENARIO 3: Rollback (If update fails)
  docker compose down
  git checkout <previous-commit>
  docker build -t banking:prod .
  docker compose up -d
    │
    ├─→ New container starts
    ├─→ Health checks pass
    └─→ Services restored ✓

SCENARIO 4: Scale (Docker Swarm)
  docker swarm init
  docker stack deploy -c docker-compose.yml banking
  docker service scale banking_app=3
    │
    ├─→ 3 replicas running
    ├─→ Load balanced
    └─→ Auto-restart on failure ✓
```

---

**Use these diagrams to understand the system architecture and deployment process.**
