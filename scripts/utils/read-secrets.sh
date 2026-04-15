#!/bin/bash
# read-secrets.sh - Load environment variables from Docker Compose .env file
# Usage: source scripts/utils/read-secrets.sh [env-file]
#        Or: ./scripts/utils/read-secrets.sh [env-file]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

ENV_FILE="${1:-${PROJECT_ROOT}/.envs/production/.env}"

# Dry-run support: honor --dry-run or DRY_RUN=true env
DRY_RUN=false
if [ "${1:-}" = "--dry-run" ] || [ "${DRY_RUN:-}" = "true" ] || [ "${DRY_RUN:-}" = "1" ]; then
  DRY_RUN=true
fi

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: Environment file not found: $ENV_FILE" >&2
    echo "Usage: $0 [.env-file]" >&2
    exit 1
fi

echo "=== Loading Environment Variables ==="
echo "Source: $ENV_FILE"
echo ""

if [ "$1" = "source" ] || [ -n "$BASH_SOURCE" ] && [ "${BASH_SOURCE[0]}" != "${0}" ]; then
    if [ "$DRY_RUN" = "true" ]; then
        echo "[dry-run] Would source environment file into current shell: $ENV_FILE"
        exit 0
    fi
    set -a
    source "$ENV_FILE"
    set +a
    echo "Variables loaded into current shell."
else
    if [ "$DRY_RUN" = "true" ]; then
        echo "[dry-run] Would export environment variables from: $ENV_FILE"
        while IFS='=' read -r key value || [ -n "$key" ]; do
            if [ -n "$key" ] && [[ ! "$key" =~ ^[[:space:]]*# ]] && [[ ! "$key" =~ ^[[:space:]]*$ ]]; then
                echo "  - $key"
            fi
        done < "$ENV_FILE"
        exit 0
    fi
    echo "=== Exporting to environment ==="
    while IFS='=' read -r key value || [ -n "$key" ]; do
        if [ -n "$key" ] && [[ ! "$key" =~ ^[[:space:]]*# ]] && [[ ! "$key" =~ ^[[:space:]]*$ ]]; then
            value=$(echo "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            if [[ ! "$value" =~ ^["'\''].*["'\'']$ ]]; then
                value=$(echo "$value" | sed 's/^["'\''"]//;s/["'\''"]$//')
            fi
            export "$key=$value"
            echo "  ✓ $key"
        fi
    done < "$ENV_FILE"
    echo ""
    echo "Environment variables exported to current shell."
    echo "Use: export \$(./scripts/utils/read-secrets.sh) to capture exports"
fi
