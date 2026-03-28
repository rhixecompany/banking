# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy dependency files first (leverages Docker layer caching)
COPY package.json package-lock.json ./

# Install dependencies
# Use cache mount to speed up repeated builds; omit optional deps in build
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps --ignore-scripts --omit=optional

# Copy source code
COPY . .

# Set build-time environment variables
# Only NEXT_PUBLIC_* vars are embedded in build; others must be runtime
ARG NODE_ENV=production
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000

ENV NODE_ENV=$NODE_ENV \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    DATABASE_URL="" \
    ENCRYPTION_KEY="" \
    NEXTAUTH_SECRET=""

# Run type check and build
RUN --mount=type=cache,target=/root/.npm \
    npm run prebuild && npm run build:standalone

# Production stage - distroless for minimal image size and attack surface
FROM gcr.io/distroless/nodejs22-debian12:nonroot

WORKDIR /app

# distroless images already run as nonroot (UID 65532)
# Explicitly set user for security
USER nonroot:nonroot

# Copy built application from builder with proper ownership
COPY --from=builder --chown=nonroot:nonroot /app/.next/standalone ./
COPY --from=builder --chown=nonroot:nonroot /app/.next/static ./.next/static
COPY --from=builder --chown=nonroot:nonroot /app/public ./public

# Set runtime environment (must be provided at runtime)
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    NODE_OPTIONS="--max-old-space-size=4096"

EXPOSE 3000

# Health check for orchestrators to detect unhealthy containers
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["/busybox/wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/api/health"]

ENTRYPOINT ["/nodejs/bin/node"]
CMD ["server.js"]
