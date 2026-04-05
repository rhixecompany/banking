# Build stage
FROM node:22.13.1-alpine AS builder

LABEL org.opencontainers.image.source="https://github.com/rhixecompany/banking" \
    org.opencontainers.image.description="Banking App - Next.js 16 with Drizzle ORM" \
    org.opencontainers.image.licenses="MIT"

WORKDIR /app

# Copy dependency files first (leverages Docker layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (including dev for build time)
# Use cache mount to speed up repeated builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

# Copy source code (filtered by .dockerignore)
COPY . .

# Set build-time environment variables
# Only NEXT_PUBLIC_* vars are embedded in build; others must be runtime
ARG NODE_ENV=production
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG ENCRYPTION_KEY=""
ARG NEXTAUTH_SECRET=""
ARG DWOLLA_BASE_URL=""
ARG DWOLLA_ENV="sandbox"

ENV NODE_ENV=$NODE_ENV \
    NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL \
    DATABASE_URL="" \
    ENCRYPTION_KEY=$ENCRYPTION_KEY \
    NEXTAUTH_SECRET=$NEXTAUTH_SECRET \
    DWOLLA_BASE_URL=$DWOLLA_BASE_URL \
    DWOLLA_ENV=$DWOLLA_ENV

# Run type check and build
RUN --mount=type=cache,target=/root/.npm \
    npm run prebuild && npm run build:standalone

# Clean up build artifacts before copying to runtime stage
RUN npm prune --production --legacy-peer-deps && \
    rm -rf .git .github docs tests playwright.config.ts vitest.config.ts

# Production stage - distroless for minimal image size and attack surface
FROM gcr.io/distroless/nodejs22-debian12:nonroot

WORKDIR /app

# distroless images already run as nonroot (UID 65532)
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

# HEALTHCHECK for production monitoring
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/api/health || exit 1

# Copy scripts for secret loading
COPY --from=builder --chown=nonroot:nonroot /app/scripts/ ./scripts/ 2>/dev/null || true

ENTRYPOINT ["/bin/sh", "-c"]
CMD ["if [ -f ./scripts/read-secrets.sh ]; then chmod +x ./scripts/read-secrets.sh && ./scripts/read-secrets.sh; fi && /nodejs/bin/node server.js"]
