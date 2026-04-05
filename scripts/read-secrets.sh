#!/bin/sh
# read-secrets.sh - Load Docker Swarm secrets into environment variables
# Usage: Place this in your Docker image and use as entrypoint

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
load_secret PLAID_CLIENT_ID
load_secret PLAID_SECRET
load_secret DWOLLA_KEY
load_secret DWOLLA_SECRET
load_secret AUTH_GITHUB_ID
load_secret AUTH_GITHUB_SECRET
load_secret AUTH_GOOGLE_ID
load_secret AUTH_GOOGLE_SECRET
load_secret SMTP_HOST
load_secret SMTP_PORT
load_secret SMTP_USER
load_secret SMTP_PASS
load_secret REDIS_URL

exec "$@"
