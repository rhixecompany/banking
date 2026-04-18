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

# Repo dependencies currently expect Node >= 22 (see npm EBADENGINE warnings).
# Keep default at 22; still overrideable at build time if needed.
ARG NODE_VERSION=22

# Use bookworm slim for compatibility (Alpine breaks node-gyp builds)
# Smaller than full bookworm, faster than Alpine for Node.js projects

# -----------------------------------------------------------------------------
# Stage: base - Shared build dependencies (Alpine)
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS base

WORKDIR /app

# Install build dependencies (Debian slim packages)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# Stage: builder - Production build with dependencies cached
# -----------------------------------------------------------------------------
FROM base AS builder

# Build arguments for non-secret configuration only.
# Runtime secrets MUST be provided at container runtime (env_file / environment),
# not as build args (which can leak into image layers).
ARG NEXT_PUBLIC_SITE_URL=https://localhost

# Set build environment variables (non-secret only)
ENV NODE_ENV=production \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Copy dependency files from context root (better cache layer)
COPY package.json package-lock.json ./

# Install dependencies with cache optimization
# Ensure devDependencies needed for build-time scripts (husky, type-check tools)
# are installed by disabling npm's production-only mode for this step.
RUN --mount=type=cache,target=/root/.npm \
    npm_config_production=false npm ci --legacy-peer-deps

# Copy application code from context root
COPY . .

# Run type-check and build standalone output
RUN npm run type-check && npm run build:standalone && \
    npm prune --production --legacy-peer-deps

# Alpine runtime image (minimal surface area)
FROM node:${NODE_VERSION}-bookworm-slim AS production

WORKDIR /app

# Install runtime dependencies and signal handler
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init curl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user with proper permissions
RUN useradd -m -u 1001 appuser

# Copy built application from builder stage with ownership
COPY --from=builder --chown=appuser:appuser /app/.next/standalone ./
COPY --from=builder --chown=appuser:appuser /app/.next/static ./.next/static
COPY --from=builder --chown=appuser:appuser /app/public ./public
COPY --from=builder --chown=appuser:appuser /app/package.json ./
COPY --from=builder --chown=appuser:appuser /app/node_modules ./node_modules

# Switch to non-root user
USER appuser

# Runtime configuration
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NODE_OPTIONS="--max-old-space-size=4096"

EXPOSE 3000

# Health check to monitor container status
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Use dumb-init to handle signals properly (PID 1, reaping zombies)
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "server.js"]

# -----------------------------------------------------------------------------
# Stage: development - Hot-reload development environment
# -----------------------------------------------------------------------------
FROM base AS development

# Clean up build dependencies from base layer
RUN apt-get remove -y python3 make g++ && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*

# Install dumb-init and curl for dev
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init curl \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files from context root
COPY package.json package-lock.json ./

# Install all dependencies (dev dependencies included for hot-reload/debugging)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

# Copy source code from context root
COPY . .

# Development environment variables
ENV NODE_ENV=development \
    NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

EXPOSE 3000

# Use dumb-init in dev too for proper signal handling
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["npm", "run", "dev"]
