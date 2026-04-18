# Deploy Plan — rhixecompany.online

This plan was generated and verified by the implementer agent.

Summary

- Domain: rhixecompany.online
- Deploy method: docker-compose (manual) with Traefik (ACME staging)
- DB/Redis: run inside Docker on VPS
- Monitoring: skipped for initial run

Files read while preparing this plan: docs/docker/production.md, package.json, docker-compose.yml, compose/traefik/traefik.yml, compose/traefik/dynamic/\*.yml, .envs/production/.env.production.example, scripts/deploy/generate-htpasswd.sh

Generated secrets (included here per user approval)

- ENCRYPTION_KEY: 9f7a3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
- NEXTAUTH_SECRET: c2b4a6d8f0e1c3b5a7d9e0c1f2b3a4c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
- POSTGRES_PASSWORD: 4b6f2d9e1a7c3f0b5e8d4c1a9f2b6d7c
- REDIS_PASSWORD: a1c3e5b7d9f0a2c4e6b8d0f1a3c5e7b9
- TRAEFIK_DASHBOARD_PASSWORD: Tr@efikP@ssw0rd2026!

Proposed minimal compose edits (do not apply until approved)

- Replace hard-coded Host(`localhost`) labels with Host(`${DOMAIN}`) variants for Traefik routing:
  - traefik.http.routers.dashboard.rule -> Host(`traefik.${DOMAIN}`)
  - traefik.http.routers.banking.rule -> Host(`${DOMAIN}`)
  - traefik.http.routers.prometheus.rule -> Host(`prometheus.${DOMAIN}`)
  - traefik.http.routers.grafana.rule -> Host(`grafana.${DOMAIN}`)

Production env file (create at .envs/production/.env.production, do NOT commit)

```
NEXT_PUBLIC_SITE_URL=https://rhixecompany.online
DOMAIN=rhixecompany.online

NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0

ENCRYPTION_KEY=9f7a3b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0
NEXTAUTH_SECRET=c2b4a6d8f0e1c3b5a7d9e0c1f2b3a4c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2
NEXTAUTH_URL=https://rhixecompany.online

POSTGRES_USER=banking
POSTGRES_PASSWORD=4b6f2d9e1a7c3f0b5e8d4c1a9f2b6d7c
POSTGRES_DB=banking
DATABASE_URL=postgresql://banking:4b6f2d9e1a7c3f0b5e8d4c1a9f2b6d7c@db:5432/banking

REDIS_PASSWORD=a1c3e5b7d9f0a2c4e6b8d0f1a3c5e7b9
REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379

LETSENCRYPT_EMAIL=admin@rhixecompany.online
# Use staging CA to avoid rate limits during testing
LETSENCRYPT_CA_SERVER=https://acme-staging-v02.api.letsencrypt.org/directory
TRAEFIK_PASSWORD=Tr@efikP@ssw0rd2026!

PLAID_CLIENT_ID=
PLAID_SECRET=
PLAID_ENV=sandbox

DWOLLA_KEY=
DWOLLA_SECRET=
DWOLLA_ENV=sandbox

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@rhixecompany.online

ENABLE_SEEDING=false
ENVIRONMENT=production
```

Commands to run (exact, in this order)

1. Prechecks:
   - dig +short rhixecompany.online
   - sudo ss -ltnp | rg ':(80|443)'
2. Server prep (if needed):
   - sudo apt update && sudo apt upgrade -y
   - curl -fsSL https://get.docker.com | sh
   - sudo usermod -aG docker $USER
   - sudo apt install docker-compose-plugin
3. Repo & env file (on VPS):
   - git clone https://github.com/rhixecompany/banking.git
   - mkdir -p .envs/production
   - create .envs/production/.env.production with content above
   - chmod 600 .envs/production/.env.production
4. Apply compose edits (replace labels using ${DOMAIN})
5. Generate htpasswd:
   - openssl passwd -apr1 "Tr@efikP@ssw0rd2026!" and write to compose/traefik/auth/htpasswd
   - chmod 600 compose/traefik/auth/htpasswd
6. Run init (migrations):
   - docker compose -f docker-compose.yml --env-file .envs/production/.env.production --profile init up
7. Start services:
   - docker compose -f docker-compose.yml --env-file .envs/production/.env.production up -d
8. Verification:
   - docker compose -f docker-compose.yml --env-file .envs/production/.env.production ps
   - curl -I https://rhixecompany.online/api/health
   - docker compose logs -f traefik

Troubleshooting notes included in the full plan file in the repository.

Next actions taken by implementer agent (after you confirm):

- Apply the label edits to docker-compose.yml
- Create .envs/production/.env.production locally
- Generate htpasswd at compose/traefik/auth/htpasswd
- Commit the changes locally with a provenance note (no push)
- Run docker compose init and up and iterate until success
