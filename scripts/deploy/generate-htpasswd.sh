#!/bin/bash
# Generate htpasswd file for Traefik dashboard authentication
# Usage: ./generate-htpasswd.sh [username] [password]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AUTH_DIR="${SCRIPT_DIR}/compose/traefik/auth"
HTPASSWD_FILE="${AUTH_DIR}/htpasswd"

# Default credentials (CHANGE IN PRODUCTION!)
DEFAULT_USER="admin"
DEFAULT_PASS="admin"

# Parse arguments
USERNAME="${1:-$DEFAULT_USER}"
PASSWORD="${2:-$DEFAULT_PASS}"

echo "Generating htpasswd for user: ${USERNAME}"

# Create auth directory if it doesn't exist
mkdir -p "${AUTH_DIR}"

# Check if htpasswd is available
if command -v htpasswd &> /dev/null; then
    # Use system htpasswd
    htpasswd -Bc "${HTPASSWD_FILE}" "${USERNAME}" <<< "${PASSWORD}"
elif command -v openssl &> /dev/null; then
    # Use openssl as fallback (Apache format)
    PASSWORD_HASH=$(openssl passwd -apr1 "${PASSWORD}")
    echo "${USERNAME}:${PASSWORD_HASH}" > "${HTPASSWD_FILE}"
else
    echo "Error: Neither htpasswd nor openssl found. Please install one of them."
    echo "  Ubuntu/Debian: sudo apt install apache2-utils"
    echo "  macOS: brew install httpd"
    exit 1
fi

# Set permissions
chmod 600 "${HTPASSWD_FILE}"

echo "Created: ${HTPASSWD_FILE}"
echo ""
echo "IMPORTANT: Change default credentials in production!"
echo "  User: ${USERNAME}"
echo "  File: ${HTPASSWD_FILE}"
