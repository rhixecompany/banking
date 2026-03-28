# Development to Production Migration Guide

## Before You Start

1. **Fix TypeScript errors**

   ```bash
   npm run type-check
   # Address errors in lib/env.ts
   ```

2. **Test locally**

   ```bash
   docker compose watch
   # Verify app runs with hot-reload
   ```

3. **Review secrets in .env-example**
   - Never commit real secrets to git
   - Always use .env.production for production

## Phase 1: Local Development (Your Current Setup)

**Current Configuration**:

- `docker compose watch` with hot-reload
- Development database (Postgres)
- Development Redis
- All services on localhost:3000

**Commands**:

```bash
# Start with hot-reload
docker compose watch

# Or traditional start
docker compose up

# Run migrations
docker compose run --rm app npm run db:push

# Access services
docker compose exec app sh
docker compose exec db psql -U postgres -d banking
docker compose exec redis redis-cli
```

**Logs**:

```bash
docker compose logs -f app
```

---

## Phase 2: Staging Deployment (Pre-Production Testing)

**Setup** (on staging server):

1. **Create staging environment file**

   ```bash
   cp .env-example .env.staging
   # Edit with staging values (same structure as production)
   ```

2. **Build staging image**

   ```bash
   docker build -t banking:staging .
   ```

3. **Deploy to staging**

   ```bash
   docker compose --env-file .env.staging up -d
   ```

4. **Run full test suite**

   ```bash
   docker compose exec app npm run test
   docker compose exec app npm run test:ui
   ```

5. **Performance testing**
   ```bash
   # Monitor resource usage
   docker stats
   ```

**Monitoring Staging**:

```bash
# Health checks
curl -v http://staging-server:3000/api/health

# Logs
docker compose logs -f app

# Database integrity
docker compose exec db psql -U postgres -d banking -c "\dt"
```

---

## Phase 3: Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing (npm run validate)
- [ ] Code reviewed and merged to main
- [ ] .env.production created with real secrets
- [ ] Database backups scheduled
- [ ] Monitoring/alerting configured
- [ ] Team trained on deployment procedures
- [ ] Rollback plan documented
- [ ] Health check endpoint implemented (/api/health)

### Deployment Steps

#### Step 1: Generate Production Secrets

```bash
bash generate-env.sh
# Review and verify .env.production
```

#### Step 2: Build Production Image

```bash
docker build -t banking:prod \
  --build-arg NEXT_PUBLIC_SITE_URL=https://yourdomain.com \
  .
```

#### Step 3: Run Pre-deployment Checks

```bash
bash deploy-checklist.sh
```

#### Step 4: Backup Current Data (if migrating from other system)

```bash
# If upgrading from existing deployment
docker compose exec db pg_dump -U postgres banking > backup_$(date +%Y%m%d_%H%M%S).sql
```

#### Step 5: Deploy Application

```bash
# Option A: Automated deployment (recommended)
bash deploy.sh

# Option B: Manual deployment
docker compose --env-file .env.production up -d
docker compose --profile init --env-file .env.production up
```

#### Step 6: Verify Deployment

```bash
# Check service status
docker compose ps

# Test health endpoint
curl -v http://localhost:3000/api/health

# Check logs
docker compose logs app

# Test functionality
curl http://localhost:3000
```

#### Step 7: Set Up Monitoring

- Configure APM integration (DataDog, New Relic, Sentry)
- Set up log aggregation
- Create dashboards
- Configure alerts for failures

---

## Phase 4: Ongoing Operations

### Daily Monitoring

```bash
# Check service health
docker compose ps

# Review error logs
docker compose logs --since 1h app | grep -i error

# Monitor performance
docker stats --no-stream
```

### Weekly Maintenance

```bash
# Review logs for patterns
docker compose logs app | head -1000

# Check disk usage
docker system df

# Verify backups
ls -lah backup_*.sql
```

### Monthly Operations

```bash
# Update dependencies
git pull origin main
docker build -t banking:prod .
docker compose down
docker compose --env-file .env.production up -d

# Verify migrations applied
docker compose exec db psql -U postgres -d banking -c "SELECT * FROM __drizzle_migrations__;"

# Review and rotate secrets (if needed)
# Generate new ENCRYPTION_KEY and NEXTAUTH_SECRET
bash generate-env.sh
# Update in vault/secrets manager
```

---

## Deployment Scenarios

### Scenario 1: Fresh Production Deployment (No Existing Data)

```bash
# 1. Build image
docker build -t banking:prod .

# 2. Start services (creates fresh database)
docker compose --profile init --env-file .env.production up

# 3. Verify
docker compose ps
curl http://localhost:3000/api/health
```

### Scenario 2: Migrate from Existing System

```bash
# 1. Export data from old system
pg_dump -U postgres olddb > migration.sql

# 2. Build new image
docker build -t banking:prod .

# 3. Start new system
docker compose --profile init --env-file .env.production up

# 4. Import migrated data
docker compose exec -T db psql -U postgres < migration.sql

# 5. Verify data integrity
docker compose exec db psql -U postgres -d banking -c "SELECT COUNT(*) FROM schema_table;"
```

### Scenario 3: Zero-Downtime Update

```bash
# 1. Build new image
docker build -t banking:prod .

# 2. Pull latest code
git pull origin main

# 3. Run migrations first (with new code)
docker compose exec app npm run db:push

# 4. Health check current app
curl http://localhost:3000/api/health

# 5. Restart app with new image
docker compose down
docker compose --env-file .env.production up -d

# 6. Wait for health checks to pass
sleep 10
curl http://localhost:3000/api/health

# 7. Monitor for 5-10 minutes
docker compose logs -f app
```

### Scenario 4: Rollback (If Deployment Fails)

```bash
# 1. Stop current containers
docker compose down

# 2. Switch to previous working image tag
docker tag banking:prod-backup banking:prod

# 3. Restart with previous version
docker compose --env-file .env.production up -d

# 4. Verify services
docker compose ps
curl http://localhost:3000/api/health

# 5. Check logs for the issue
docker compose logs app
```

---

## Environment Variables at Each Stage

### Development (.env)

```
NODE_ENV=development
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/banking
REDIS_URL=redis://localhost:6379
NEXT_PUBLIC_SITE_URL=http://localhost:3000
ENCRYPTION_KEY=dev-key-not-secure
NEXTAUTH_SECRET=dev-secret-not-secure
```

### Staging (.env.staging)

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:STAGING_PASSWORD@staging-db:5432/banking
REDIS_URL=redis://staging-redis:6379
NEXT_PUBLIC_SITE_URL=https://staging.yourdomain.com
ENCRYPTION_KEY=<32-char-random>
NEXTAUTH_SECRET=<32-char-random>
```

### Production (.env.production)

```
NODE_ENV=production
DATABASE_URL=postgresql://postgres:PROD_PASSWORD@prod-db-managed.aws.com:5432/banking
REDIS_URL=redis://:PROD_PASSWORD@prod-redis.aws.com:6379
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
ENCRYPTION_KEY=<32-char-random>
NEXTAUTH_SECRET=<32-char-random>
```

---

## Rollback Procedures

### Quick Rollback (< 2 minutes)

```bash
# If new deployment has critical issues
docker compose down
git checkout <previous-commit-hash>
docker build -t banking:prod .
docker compose --env-file .env.production up -d
```

### Database Rollback (if needed)

```bash
# Restore from backup (WARNING: this overwrites current data)
docker compose exec -T db psql -U postgres < backup_20240115_120000.sql
docker compose restart app
```

### DNS Rollback (if using multiple servers)

```bash
# Update DNS/load balancer to point to previous server
# Usually handled by platform (AWS Route53, GCP Cloud DNS, etc.)
```

---

## Communication

### Before Deployment

- [ ] Notify team on Slack/Teams
- [ ] Send planned deployment window to stakeholders
- [ ] Test rollback procedure
- [ ] Prepare rollback plan

### During Deployment

- [ ] Monitor logs in real-time
- [ ] Have rollback team on standby
- [ ] Check health endpoints every 30 seconds

### After Deployment

- [ ] Send success notification
- [ ] Monitor for next 1-2 hours
- [ ] Verify all critical features working
- [ ] Update deployment log/wiki

---

## Tips for Success

1. **Always have a rollback plan** - Know how to go back quickly
2. **Test in staging first** - Never deploy untested code to production
3. **Deploy during business hours** - When team is available
4. **Have backups** - Database, secrets, configurations
5. **Monitor continuously** - Set up alerts for failures
6. **Document everything** - Team and runbooks
7. **Take it slow** - Gradual rollout to a percentage of traffic (if possible)
8. **Celebrate wins** - Successful deployments are team efforts

---

## Useful Commands Reference

```bash
# Development
docker compose watch

# Staging
docker compose --env-file .env.staging up -d

# Production - Deploy
bash deploy.sh

# Production - Monitoring
docker compose ps
docker compose logs -f app
docker stats

# Production - Emergency
docker compose down                    # Stop all
docker compose --env-file .env.production up -d  # Restart
```

---

**Next**: Follow Phase 1-4 in order. Start with local development, progress through staging, then deploy to production.
