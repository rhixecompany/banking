# GitHub Actions CI/CD

## Overview

This project uses GitHub Actions for continuous integration and deployment. The workflows are located in `.github/workflows/`.

## Available Workflows

### CI Workflow (ci.yml)

Runs on every push and pull request:

- TypeScript type checking
- ESLint linting
- Unit tests (Vitest)
- E2E tests (Playwright)

### Deploy Workflow (deploy.yml)

Deploys to staging and production on:

- Push to `main` branch
- Push tags (`v*`)
- Manual dispatch (workflow_dispatch)

### Docker Security (docker-security.yml)

Runs Trivy security scans on Docker images.

## Workflow Details

### CI Pipeline

```yaml
# Trigger on push/PR
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

### Build & Push

```yaml
- name: Build and push
  uses: docker/build-push-action@v6
  with:
    context: .
    file: ./compose/dev/node/Dockerfile
    target: production
    push: true
    provenance: true
    sbom: true
```

### Security Scanning

```yaml
- name: Run Trivy scan
  uses: aquasecurity/trivy-action@master
  with:
    severity: "CRITICAL,HIGH"
```

## Required Secrets

### For Deployment

| Secret                 | Description           |
| ---------------------- | --------------------- |
| `DEPLOY_HOST`          | VPS IP or hostname    |
| `DEPLOY_USER`          | SSH username          |
| `DEPLOY_SSH_KEY`       | Private SSH key (PEM) |
| `NEXT_PUBLIC_SITE_URL` | Production URL        |

### Optional

| Secret            | Description         |
| ----------------- | ------------------- |
| `STAGING_HOST`    | Staging server host |
| `STAGING_USER`    | Staging SSH user    |
| `STAGING_SSH_KEY` | Staging SSH key     |
| `DOCKER_USERNAME` | Docker Hub username |
| `DOCKER_PASSWORD` | Docker Hub password |

## Deployment Flow

```
git push
  ↓
CI (lint + typecheck + tests)
  ↓
Docker build + push to ghcr.io
  ↓
Trivy security scan
  ↓
Deploy to staging (auto on develop)
  ↓
Deploy to production (manual or on main)
```

## SSH Deploy Action

```yaml
- name: Deploy to production via SSH
  uses: appleboy/ssh-action@v1.2.0
  with:
    host: ${{ secrets.DEPLOY_HOST }}
    username: ${{ secrets.DEPLOY_USER }}
    key: ${{ secrets.DEPLOY_SSH_KEY }}
    script: |
      set -e
      cd /opt/banking
      docker compose pull
      docker compose up -d
```

## Docker Compose Deploy

The deployment uses Docker Compose:

```bash
docker compose pull
docker compose up -d
```

## Verifying Deployment

```bash
# Check service status
docker compose ps

# View logs
docker compose logs -f

# Restart if needed
docker compose restart
```

## Environment Configuration

### Staging Environment

- Trigger: Push to `develop` branch
- URL: From `STAGING_URL` secret

### Production Environment

- Trigger: Push to `main` branch or tags
- URL: From `PRODUCTION_URL` secret

## Troubleshooting

### Image Pull Failed

- Verify `ghcr.io` login is working
- Check image tag exists in registry

### SSH Connection Failed

- Verify `DEPLOY_SSH_KEY` is correct
- Ensure host is reachable

### Service Not Starting

- Check logs: `docker compose logs app`
- Verify compose file syntax: `docker compose config`

## See Also

- [Docker Configuration](../docker/README.md)
- [Secrets Management](../secrets-management.md)
- [Environment Variables](../env-vars.md)
