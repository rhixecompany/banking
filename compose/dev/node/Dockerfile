# =============================================================================
# Banking Application - Multi-stage Dockerfile (Production Optimized)
# =============================================================================
# Build targets:
#   - docker build . -t banking:dev --target development  # Hot-reload dev
#   - docker build . -t banking:prod --target production   # Production runtime
#   - docker build . -t banking:builder --target builder  # Build stage only
# =============================================================================

# Use build cache from buildkit for better layer reuse
# syntax=docker/dockerfile:1.4

ARG NODE_VERSION=22

# =============================================================================
# Stage: builder - Production build with dependencies cached
# =============================================================================
FROM node:${NODE_VERSION}-bookworm-slim AS builder

WORKDIR /app

ARG NEXT_PUBLIC_SITE_URL=https://localhost

ENV NODE_ENV=production \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (dev deps needed for build tools like rimraf, tsx, etc.)
# Skip lifecycle scripts (husky, etc.) to avoid errors in Docker
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps --ignore-scripts && \
    npm cache clean --force

# Copy application code
COPY . .

# Build standalone output and then remove dev dependencies
RUN npm run build:standalone && \
    npm prune --production --legacy-peer-deps

# =============================================================================
# Stage: production - Minimal runtime (alpine + only essentials)
# =============================================================================
FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /app

# Install minimal runtime dependencies (dumb-init for signal handling)
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001

# Copy only built application and production dependencies
COPY --from=builder --chown=appuser:appuser /app/.next/standalone ./
COPY --from=builder --chown=appuser:appuser /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appuser /app/public ./public
COPY --from=builder --chown=appuser:appuser /app/package.json ./
COPY --from=builder --chown=appuser:appuser /app/node_modules ./node_modules

USER appuser

ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]

# =============================================================================
# Stage: development - Hot-reload development environment
# =============================================================================
FROM node:${NODE_VERSION}-bookworm-slim AS development

WORKDIR /app

# Install dev dependencies in single layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (dev + production for dev environment)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps && \
    npm cache clean --force

# Copy source code
COPY . .

ENV NODE_ENV=development \
    NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

EXPOSE 3000

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "dev"]
