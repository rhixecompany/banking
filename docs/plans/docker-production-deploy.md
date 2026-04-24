---
plan name: docker-production-deploy
plan description: Deploy Banking app with Docker Compose to production server
plan status: active
---

## Idea
Deploy the Banking application to a production server using Docker Compose with all features: Traefik reverse proxy, full monitoring stack (Prometheus/Grafana), PostgreSQL, Redis, and fresh secure secrets generation.

## Implementation
- 1. Generate fresh secure secrets: Run npm run docker:env:generate to create new .envs/production/.env.production with new ENCRYPTION_KEY, NEXTAUTH_SECRET, POSTGRES_PASSWORD, REDIS_PASSWORD
- 2. Update environment file: Edit .envs/production/.env.production with production DOMAIN (e.g., rhixecompany.online), NEXTAUTH_URL, LETSENCRYPT_EMAIL, and optional integrations (Plaid/Dwolla credentials if using real APIs)
- 3. Generate htpasswd for Traefik: Run scripts/generate-htpasswd.sh to create Traefik dashboard credentials (or verify existing htpasswd)
- 4. Build Docker image: Run docker compose build to build the banking-app image
- 5. Start infrastructure: Run docker compose up -d db redis to start database and cache services first
- 6. Run database migrations: Run docker compose --profile init up to apply schema migrations
- 7. Stop migration container: Run docker compose --profile init down
- 8. Start all services: Run docker compose --profile traefik --profile monitoring up -d to start app, Traefik, and monitoring stack
- 9. Verify deployment: Check docker compose ps, verify health endpoints, and test app accessibility

## Required Specs
<!-- SPECS_START -->
<!-- SPECS_END -->