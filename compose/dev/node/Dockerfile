# syntax=docker/dockerfile:1.4
# =============================================================================
# Banking Application - Multi-stage Dockerfile (Optimized)
#
# Goal: reduce image size and layer count while preserving build correctness
# for native modules (bcrypt) and keeping the Next standalone build output.
# =============================================================================

ARG NODE_VERSION=22

# =============================================================================
# Stage: builder - install dependencies and produce standalone build
# =============================================================================
FROM node:${NODE_VERSION}-slim AS builder

ENV NODE_ENV=development
ARG DATABASE_URL
ARG ENCRYPTION_KEY
ARG NEXTAUTH_SECRET
ARG DEBUG_BUILD
# Expose build-time envs to the process during the Next build
ENV DATABASE_URL=${DATABASE_URL}
ENV ENCRYPTION_KEY=${ENCRYPTION_KEY}
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}

WORKDIR /app

# Copy dependency manifests and install all deps (dev + prod) for build
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    bun install --frozen-lockfile --legacy-peer-deps --no-audit --progress=false --ignore-scripts && \
    bun pm cache clean

# Copy source and build the standalone Next output
COPY . .
# Run safe, non-interactive repo scripts (if present) before building.
# Only executes scripts/utils/fix-line-endings.sh which is safe to run in-build.
RUN if [ -f ./scripts/utils/fix-line-endings.sh ]; then \
      chmod +x ./scripts/utils/fix-line-endings.sh && \
      ./scripts/utils/fix-line-endings.sh; \
    fi
 # Allow running the debug prerender build inside the builder when DEBUG_BUILD=true.
 # This is a temporary, reversible change used for reproducing prerender failures in CI-like builder
 # environments. Revert or remove DEBUG_BUILD usage after debugging is complete.
RUN if [ "${DEBUG_BUILD:-false}" = "true" ]; then \
      npm run build:debug; \
    else \
      npm run build:standalone; \
    fi

# Remove dev dependencies to shrink what we copy to the runtime image
RUN npm prune --production --legacy-peer-deps


# =============================================================================
# Stage: production - use slim (Debian) for native module compatibility
# =============================================================================
FROM node:${NODE_VERSION}-slim AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Create a non-root user to run the app
RUN groupadd -r app && useradd -r -g app app

WORKDIR /app

# Consolidated copy from builder to reduce layers while keeping file layout
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

ENV PORT=3000 \
    HOSTNAME=0.0.0.0

EXPOSE 3000

# Keep the same healthcheck semantics
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Ensure proper ownership
RUN chown -R app:app /app || true

USER app

# Start the standalone server
CMD ["node", "server.js"]


# =============================================================================
# Stage: development - full dev environment with dev dependencies
# =============================================================================
FROM node:${NODE_VERSION}-slim AS development

ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

# Install dev dependencies in the image for a complete dev experience
# Copy dependency manifests and install all dev deps for development image
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    bun install --frozen-lockfile --legacy-peer-deps --no-audit --progress=false --ignore-scripts && \
    bun pm cache clean

# Copy source code for hot-reload/dev
COPY . .

ENV NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

EXPOSE 3000

USER node

CMD ["npm", "run", "dev"]
