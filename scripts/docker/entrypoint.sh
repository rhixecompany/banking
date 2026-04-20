#!/bin/bash
set -euo pipefail

# Entrypoint for runtime build-and-run container
# Installs dependencies, runs the standalone Next build, and starts the server.

echo "[entrypoint] Installing dependencies (production)..."
# Ensure node_modules can be created by the app user; create and chown if needed
mkdir -p /app/node_modules /home/app/.npm
chown -R app:app /app/node_modules /home/app/.npm || true

# Install production dependencies
npm ci --production --legacy-peer-deps --no-audit --progress=false

echo "[entrypoint] Building Next.js standalone output..."
npm run build:standalone

echo "[entrypoint] Starting standalone server"
exec node server.js
