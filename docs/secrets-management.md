# Secrets Management

This document describes how to manage secrets for the Banking application using Docker Compose.

## Environment File Method

The recommended approach is to use environment files (`.env` files) stored securely.

### Creating the Environment File

The `scripts/docker/generate-env.sh` script generates a secure `.envs/production/.env.production` file:

```bash
# Generate environment file
./scripts/docker/generate-env.sh

# Or with npm
npm run docker:env:generate
```

### Environment File Location

```text
.envs/production/.env.production  # Production secrets
.env.local                        # Development secrets
```

### Required Environment Variables

| Variable | Description | Example |
| --- | --- | --- |
| `ENCRYPTION_KEY` | AES-256-GCM encryption key | 64 hex characters |
| `NEXTAUTH_SECRET` | NextAuth session secret | 32+ random characters |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `PLAID_CLIENT_ID` | Plaid API client ID | From Plaid dashboard |
| `PLAID_SECRET` | Plaid API secret | From Plaid dashboard |
| `DWOLLA_KEY` | Dwolla API key | From Dwolla dashboard |
| `DWOLLA_SECRET` | Dwolla API secret | From Dwolla dashboard |

### Tooling / MCP Secrets

| Variable | Used by | Notes |
| --- | --- | --- |
| `APITOKEN` | `hostinger-api-mcp` (OpenCode MCP) | Set in your shell or `.env.local`; do not commit it in `.opencode/*.json` or reports |

## Security Best Practices

### 1. Keep Secrets Out of Version Control

The `.env` files are gitignored. Never commit them:

```bash
# Verify .env files are ignored
git check-ignore .env .env.local .envs/production/.env.production
```

### 2. Use Different Secrets per Environment

Never use the same secrets in staging and production:

```bash
# Staging
.envs/staging/.env.staging

# Production
.envs/production/.env.production
```

### 3. Generate Strong Secrets

Use random generators for encryption keys:

```bash
# Generate encryption key
openssl rand -hex 32

# Generate NextAuth secret
openssl rand -base64 32
```

### 4. Rotate Secrets Periodically

Update secrets regularly (recommended: quarterly):

1. Generate new secrets
2. Update environment file
3. Restart services: `docker compose restart`

## Using Docker Compose

### Starting with Environment File

```bash
# Use specific env file
docker compose --env-file .envs/production/.env.production up -d

# Or set in docker-compose.yml
docker compose up -d
```

### Checking Environment Variables

```bash
# View running service environment
docker compose exec app env | grep -E "^(ENCRYPTION|NEXTAUTH|DATABASE)"
```

### Updating Secrets

1. Edit the environment file
2. Restart services:

```bash
docker compose down
docker compose up -d
```

## Automated Setup

The `vps-setup.sh` script automatically generates secrets:

```bash
# Automated VPS setup (generates secrets)
curl -sSL https://raw.githubusercontent.com/rhixecompany/banking/main/scripts/server/vps-setup.sh | bash
```

This creates a `.envs/production/.env.production` file with:

- Random `ENCRYPTION_KEY` (64 hex characters)
- Random `NEXTAUTH_SECRET` (base64 encoded)
- Default database/Redis configuration

## Security Notes

- Never commit secrets to version control
- Use different secrets for staging vs production
- Rotate secrets periodically (recommended: quarterly)
- Use strong, randomly generated values for encryption keys
- Restrict access to environment files (chmod 600)
