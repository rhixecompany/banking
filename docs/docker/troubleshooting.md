# Troubleshooting Guide

Common issues and solutions for Docker deployment.

## Container Won't Start

### Port Already in Use

```bash
# Check what's using the port
netstat -ano | findstr :3000

# Or
docker ps | grep 3000
```

**Solution:** Stop the other service or change the port in `docker-compose.yml`.

### Volume Permission Denied

```bash
# Fix volume permissions
sudo chown -R $USER:$USER .
docker compose down -v
docker compose up -d
```

### Image Build Fails

```bash
# Clear build cache
docker builder prune -a

# Rebuild
docker compose build --no-cache app
```

## Database Issues

### Database Connection Refused

```bash
# Check if PostgreSQL is running
docker compose ps db

# Check logs
docker compose logs db

# Verify connection from app
docker compose exec app nc -zv db 5432
```

**Solution:** Wait for db to be healthy, then restart app:

```bash
docker compose restart app
```

### Migration Failed

```bash
# View migration logs
docker compose --profile init logs

# Check DATABASE_URL format
# Should be: postgresql://user:password@host:5432/database
```

### Data Not Persisting

```bash
# Verify volumes exist
docker volume ls | grep banking

# Check volume mount
docker inspect banking-db | grep -A 10 Mounts
```

## Redis Issues

### Redis Connection Refused

```bash
# Check Redis status
docker compose ps redis

# Test connection
docker compose exec app nc -zv redis 6379

# Check password
docker compose exec redis redis-cli -a your-password ping
```

### Redis Memory Full

```bash
# Check memory usage
docker compose exec redis redis-cli info memory

# Flush if needed
docker compose exec redis redis-cli FLUSHALL
```

## Traefik Issues

### 502 Bad Gateway

```bash
# Check app is running
docker compose ps app

# Check app health
curl http://localhost:3000/api/health

# View Traefik logs
docker compose logs traefik | grep banking
```

### SSL Certificate Issues

```bash
# Check Let's Encrypt logs
docker compose logs traefik | grep -i acme

# Verify certs directory
ls -la compose/traefik/certs/

# Check permissions
chmod -R 755 compose/traefik/certs/
```

### Dashboard Not Loading

```bash
# Verify htpasswd exists
ls -la compose/traefik/auth/htpasswd

# Regenerate if needed
bash scripts/generate-htpasswd.sh admin new-password
```

## Monitoring Issues

### Prometheus Target Down

```bash
# Check Prometheus
docker compose ps prometheus

# Verify targets in Prometheus UI
# http://prometheus:9090/targets
```

### Grafana No Data

```bash
# Check datasource
docker compose logs grafana | grep -i datasource

# Verify Prometheus URL in datasource config
cat compose/prod/grafana/provisioning/datasources/datasources.yml
```

## Performance Issues

### Slow Build Times

```bash
# Use Docker build cache
docker compose build

# Clear unused cache
docker builder prune

# Multi-stage build is already optimized
```

### High Memory Usage

```bash
# Check container memory
docker stats

# Limit memory in compose file
services:
  app:
    deploy:
      resources:
        limits:
          memory: 2G
```

## Network Issues

### Services Can't Communicate

```bash
# Check networks
docker network ls | grep banking

# Inspect network
docker network inspect app-internal

# Verify service names in docker-compose.yml match
```

## Reset Everything

When all else fails:

```bash
# Stop all
docker compose down

# Remove volumes (DELETES DATA)
docker compose down -v

# Remove images (optional)
docker image prune -a

# Fresh start
docker compose up -d
docker compose --profile init up
```

## Get Help

```bash
# View all logs
docker compose logs > logs.txt

# Inspect service
docker compose inspect app

# Check resource usage
docker stats

# Share for debugging
docker compose config > docker-compose-merged.yml
```
