# GitHub Actions Docker Setup Guide

This project includes comprehensive GitHub Actions workflows with Docker best practices.

## Workflows Overview

### 1. **CI (ci.yml)** — Continuous Integration

Runs on every push and PR to `main` and `develop`.

**Jobs:**

- **test** — Format check, type check, linting, unit tests
- **playwright** — E2E tests with database/Redis services
- **docker-build** — Builds Docker image and reports size

**Environment Variables Used:**

```bash
DATABASE_URL: postgresql://postgres:postgres@localhost:5432/banking_test
REDIS_URL: redis://localhost:6379
ENCRYPTION_KEY: 00000000000000000000000000000000 (test value)
NEXTAUTH_SECRET: 00000000000000000000000000000000 (test value)
```

---

### 2. **Docker Security (docker-security.yml)** — Vulnerability & Compliance

Runs on push/PR to `main`/`develop` + weekly schedule (Sunday 2am UTC).

**Jobs:**

- **scan-dependencies** — npm audit for high/critical vulnerabilities
- **build-and-scan** — Trivy container image scanning (uploads to GitHub Security tab)
- **analyze-image** — Image size and layer breakdown
- **dockerfile-lint** — Hadolint linting on Dockerfile

**Key Features:**

- ✅ Security scanning uploaded to GitHub Security tab
- ✅ Image size analysis in job summary
- ✅ Layer-by-layer breakdown

---

### 3. **Build & Push (build.yml)** — Registry Push

Runs on push to `main` branch or git tags.

**Registries:**

- GitHub Container Registry (`ghcr.io`)
- Docker Hub (optional, requires `DOCKER_USERNAME` + `DOCKER_PASSWORD` secrets)

**Tags Generated:**

- `latest` — on main branch
- `vX.Y.Z` — semantic versioning
- `develop` — on develop branch
- `<commit-sha>` — short commit SHA

---

### 4. **Deploy (deploy.yml)** — Deployment Pipeline

Runs after successful build/push.

**Environments:**

- **Staging** — auto-deploy from `develop` branch
- **Production** — manual approval required from `main` branch

**Features:**

- ✅ Image digest tracking
- ✅ Post-push Trivy scanning
- ✅ Environment-gated deployments

---

## Required Secrets

Add these to your GitHub repository settings (`Settings → Secrets and variables → Actions`):

### Docker Hub (Optional)

```
DOCKER_USERNAME        # Docker Hub username
DOCKER_PASSWORD        # Docker Hub token
```

### Deployment URLs

```
NEXT_PUBLIC_SITE_URL   # Build-time public URL
STAGING_URL            # Staging environment URL
PRODUCTION_URL         # Production environment URL
```

### Deployment (Add if needed)

```
DEPLOY_KEY             # SSH key for deployment
KUBE_CONFIG            # Kubernetes config (base64 encoded)
AWS_CREDENTIALS        # AWS access key/secret
```

---

## Docker Best Practices Included

### ✅ **Build Caching**

- GitHub Actions Cache backend (`cache-from: type=gha`, `cache-to: type=gha,mode=max`)
- npm cache layer (`RUN --mount=type=cache,target=/root/.npm`)
- Multi-stage builds (builder → runtime)

### ✅ **Security**

- Distroless base image (`gcr.io/distroless/nodejs22-debian12:nonroot`)
- Non-root user (UID 65532)
- Vulnerability scanning (Trivy)
- Dependency auditing (npm audit)

### ✅ **Image Optimization**

- Alpine base for builder stage
- `.dockerignore` to exclude unnecessary files
- Minimal final image size
- Layer inspection in CI output

### ✅ **Environment Handling**

- `NEXT_PUBLIC_*` build-time variables
- Runtime secrets passed via `.env` files
- Healthchecks configured in docker-compose

---

## Local Testing

### Build image locally with same caching:

```bash
docker build -f compose/dev/node/Dockerfile --target production \
  --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
  -t banking:local .
```

### Run with docker-compose:

```bash
docker compose --env-file .envs/production/.env.production up
```

### Check image size:

```bash
docker images banking:local --format "table {{.Repository}}\t{{.Size}}"
```

---

## Customization

### Add deployment script

Update `deploy.yml` with your deployment method:

```yaml
- name: Deploy to production
  run: ./scripts/deploy.sh production ${{ needs.build-push-production.outputs.image-tags }}
```

### Configure branch protections

In GitHub: `Settings → Branches → Branch protection rules` → Require status checks to pass (select all workflows)

### Slack notifications

Add to any workflow:

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Build ${{ job.status }}: ${{ github.repository }}"
      }
```

---

## Troubleshooting

### Build timeout

Increase timeout in `docker/build-push-action@v6`:

```yaml
- name: Build
  uses: docker/build-push-action@v6
  with:
    # ... existing config
    timeout: 3600
```

### Cache not working

Clear cache in GitHub UI: `Actions → All workflows → select workflow → 3-dot menu → Clear all caches`

### Image size too large

Check layers:

```bash
docker history banking:local --no-trunc --human
```

Optimize by moving heavy operations earlier in Dockerfile.

### Trivy scan failing

Review results at: `Security → Code scanning alerts → trivy`
