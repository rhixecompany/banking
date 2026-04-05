# Secrets Management

This document lists all Docker Swarm secrets required for production deployment and how to create them.

## Prerequisites

Docker Swarm must be initialized:

```bash
docker swarm init --advertise-addr <YOUR_IP>
docker network create --driver overlay --attachable traefik-public
```

## Creating Secrets

Run these commands on your production server:

```bash
# Core secrets
echo "your-encryption-key-here" | docker secret create banking_encryption_key -
echo "your-nextauth-secret-here" | docker secret create banking_nextauth_secret -
echo "postgresql://user:pass@host:5432/db" | docker secret create banking_database_url -

# Plaid
echo "your-plaid-secret-here" | docker secret create banking_plaid_secret -

# Dwolla
echo "your-dwolla-secret-here" | docker secret create banking_dwolla_secret -

# OAuth (optional)
echo "your-github-secret" | docker secret create banking_github_secret -
echo "your-google-secret" | docker secret create banking_google_secret -

# SMTP (optional)
echo "your-smtp-password" | docker secret create banking_smtp_pass -

# Traefik dashboard (optional)
echo "admin:$(openssl passwd -apr1 'your-password')" | docker secret create traefik_dashboard_users -
```

## Verify Secrets

```bash
docker secret ls
```

## Using Secrets in Stacks

See `stacks/app.stack.yml` for the service definition with secrets:

```yaml
services:
  app:
    secrets:
      - banking_encryption_key
      - banking_nextauth_secret
      - banking_database_url
      # ... etc
    environment:
      ENCRYPTION_KEY_FILE: /run/secrets/banking_encryption_key
      # ...

secrets:
  banking_encryption_key:
    external: true
  # ...
```

## Entrypoint Script

The `scripts/read-secrets.sh` script loads `_FILE` variants:

```bash
#!/bin/sh
set -e

load_secret() {
  local name="$1"
  local file_var="${name}_FILE"
  eval local file_path="\${$file_var:-}"
  if [ -f "$file_path" ]; then
    export "$name=$(cat "$file_path")"
  fi
}

load_secret ENCRYPTION_KEY
load_secret NEXTAUTH_SECRET
load_secret DATABASE_URL
load_secret PLAID_SECRET
load_secret DWOLLA_SECRET
load_secret AUTH_GITHUB_SECRET
load_secret AUTH_GOOGLE_SECRET
load_secret SMTP_PASS

exec "$@"
```

## Rotating Secrets

```bash
# Remove old secret
docker secret rm banking_encryption_key

# Create new secret
echo "new-secret-value" | docker secret create banking_encryption_key -

# Restart services to pick up new secret
docker service update --force banking_app
```

## Security Notes

- Never commit secrets to version control
- Use different secrets for staging vs production
- Rotate secrets periodically (recommended: quarterly)
- Use strong, randomly generated values for encryption keys
