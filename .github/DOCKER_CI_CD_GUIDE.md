# Docker GitHub Actions Setup Guide

## Overview

Your project includes enhanced GitHub Actions workflows optimized for Docker. Here's what's configured:

## Workflows

### 1. **build.yml** - Build and Push

- **Triggers**: Main branch pushes, tags, manual dispatch
- **Key Features**:
  - Docker Buildx multi-platform builder
  - GHA cache backend for faster rebuilds
  - Semantic versioning with tags
  - Pushes to GitHub Container Registry (ghcr.io)
  - Docker Hub optional (add `DOCKER_USERNAME`/`DOCKER_PASSWORD` secrets)

**Secrets Required**:

- `DOCKER_USERNAME` (optional, for Docker Hub)
- `DOCKER_PASSWORD` (optional, for Docker Hub)

**Usage**: Automatically triggered on main branch, or manually via "Run workflow"

---

### 2. **ci.yml** - Continuous Integration

- **Triggers**: Push to main/develop, PRs
- **Jobs**:
  - `test`: Unit tests with Vitest (Node services: PostgreSQL, Redis)
  - `playwright`: E2E tests with Playwright
  - `docker-build`: Validates Dockerfile builds

**Notes**:

- Services (PostgreSQL, Redis) run as Docker containers
- GHA cache speeds up subsequent builds
- Coverage reports upload to Codecov

---

### 3. **docker-compose.yml** - Docker Compose Validation

- **Triggers**: Changes to docker-compose.yml, Dockerfile
- **Jobs**:
  - `validate`: Syntax validation + Hadolint linting
  - `compose-test`: Full stack startup test with health checks

**What It Tests**:

- docker-compose.yml syntax
- Dockerfile quality (Hadolint)
- Multi-container orchestration
- Service health checks
- Database migrations (init service)

---

### 4. **docker-security-scan.yml** - Security Scanning

- **Triggers**: Main branch pushes, tags, daily at 2 AM UTC, PRs
- **Tools**:
  - **Trivy**: Vulnerability scanning (CRITICAL/HIGH severities)
  - **Docker Scout**: Advanced image analysis

**Reports**:

- SARIF format upload to GitHub Security tab
- Results visible in pull requests
- Daily scheduled runs for continuous monitoring

---

## Optimization Tips

### 1. Maximize Cache Effectiveness

Your Dockerfile already uses good practices:

- ✅ Caches node_modules layer
- ✅ Copies package files before source code
- ✅ Uses `--mount=type=cache` for npm

**In CI**: `cache-from: type=gha` + `cache-to: type=gha,mode=max` reuse cache across runs.

### 2. Reduce Build Time

- Dockerfile uses `distroless/nodejs22-debian12:nonroot` (minimal production image)
- Multi-stage build (builder → production) reduces final image size
- Alpine base for supporting services (PostgreSQL, Redis)

### 3. Add Credentials to Secrets

Go to **Settings → Secrets and Variables → Actions**:

| Secret            | Value               | Use Case           |
| ----------------- | ------------------- | ------------------ |
| `DOCKER_USERNAME` | Docker Hub username | Push to Docker Hub |
| `DOCKER_PASSWORD` | Docker Hub token    | Push to Docker Hub |
| `GITHUB_TOKEN`    | Auto-provided       | Push to ghcr.io    |

---

## Running Locally

### Build image with same cache strategy:

```bash
docker build -t banking:latest .
```

### Test entire stack:

```bash
docker-compose --profile init up
```

### Validate Dockerfile quality:

```bash
brew install hadolint  # or apt-get install hadolint
hadolint Dockerfile
```

### Scan for vulnerabilities:

```bash
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image banking:latest
```

---

## GitHub Actions Status & Debugging

### View workflow runs:

1. Go to **Actions** tab
2. Click workflow name
3. Click run to see logs

### Common Issues

| Issue                 | Solution                                  |
| --------------------- | ----------------------------------------- |
| Cache not working     | Check Docker Buildx version (v0.21.0+)    |
| Image push fails      | Verify secrets in Settings → Secrets      |
| docker-compose fails  | Check `.env.production` has required vars |
| Security scan timeout | Increase timeout or run on larger runner  |

---

## Next Steps

1. **Test locally first**:

   ```bash
   docker-compose build
   docker-compose up
   ```

2. **Verify secrets** are configured in GitHub

3. **Push to main** to trigger all workflows

4. **Monitor** the Actions tab for results

5. **Review security** reports in Security → Code scanning

---

## Advanced: Docker Build Cloud

For faster builds on large projects, consider Docker Build Cloud (paid):

- Shared builder infrastructure
- Faster builds across team
- Set up via `docker/setup-buildx-action` with `driver-options`

Learn more: https://docs.docker.com/build-cloud/
