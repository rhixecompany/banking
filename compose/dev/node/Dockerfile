# =============================================================================
# Banking Application - Multi-stage Dockerfile
# =============================================================================
# Build targets:
#   - docker build . -t banking:dev --target development  # Hot-reload dev
#   - docker build . -t banking:prod --target production   # Production runtime
#   - docker build . -t banking:builder --target builder  # Build stage only
# =============================================================================

# -----------------------------------------------------------------------------
# Stage: base - Shared setup for all stages
# -----------------------------------------------------------------------------
FROM node:22-bookworm AS base

WORKDIR /app

# Install common build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# -----------------------------------------------------------------------------
# Stage: builder - Production build with type-check
# -----------------------------------------------------------------------------
FROM base AS builder

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy application code
COPY . .

# Build arguments for environment-specific configuration
ARG NEXT_PUBLIC_SITE_URL=https://localhost

# Set build environment variables
ENV NODE_ENV=production \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Run type-check and build standalone output
RUN npm run type-check && npm run build:standalone

# -----------------------------------------------------------------------------
# Stage: production - Final production runtime image
# -----------------------------------------------------------------------------
FROM node:22-bookworm AS production

WORKDIR /app

# Install runtime dependencies only
RUN apt-get update && apt-get install -y --no-install-recommends \
    dumb-init curl \
    && rm -rf /var/lib/apt/lists/*

# Copy built application from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Create non-root user for better security
RUN groupadd -r appuser && useradd -r -g appuser appuser
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

# Use dumb-init to handle signals properly and prevent zombie processes
ENTRYPOINT ["/usr/sbin/dumb-init", "--"]
CMD ["node", "server.js"]

# -----------------------------------------------------------------------------
# Stage: development - Hot-reload development environment
# -----------------------------------------------------------------------------
FROM base AS development

WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install dependencies (dev dependencies included for hot-reload)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Development environment variables
ENV NODE_ENV=development \
    NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

EXPOSE 3000

# Run Next.js dev server with hot-reload
CMD ["npm", "run", "dev"]
