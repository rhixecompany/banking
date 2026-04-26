# Next.js Docker Images Guide

## Overview

A practical guide for building reliable Next.js Docker images in 2026. Covers standalone output, multi-stage builds, and production best practices.

## Mental Model

A Docker image is a read-only template with instructions that produce a container. When enabling output file tracing and standalone output, the build produces a self-contained server bundle at `.next/standalone`, plus a minimal `server.js` that can run without installing all node_modules.

This changes the Docker conversation from 'copy the entire workspace' to 'copy exactly what the build traced.'

## What Gets Copied

Standalone builds emit trace metadata alongside the .next output. The standalone folder is created based on that trace. The container must include:

- The traced server output
- Any static assets to serve from the container

The default standalone output does NOT include `public` or `.next/static` - these are expected to sit behind a CDN. Explicitly copy them when you want the container to serve assets.

## Base Image Choices in 2026

### Comparison Table

| Image Tag               | Size (MB) | High Vulns | Medium Vulns |
| ----------------------- | --------- | ---------- | ------------ |
| node:20.19.2 (bookworm) | 398       | 31         | 223          |
| node:20.19.2-slim       | 71.1      | 1          | 33           |
| node:20.19.5-alpine3.22 | 47.8      | 0          | 0            |

**Recommendation**: Use `node:20.19.2-slim` for production. It provides a 5.6x size reduction and removes 30 high-severity vulnerabilities, without the musl risk that comes with Alpine.

## Production Dockerfile

```dockerfile
# syntax=docker/dockerfile:1

FROM node:20.19.2-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM node:20.19.2-slim AS builder
WORKDIR /app
COPY --from=deps /app/nodemodules ./nodemodules
COPY . .
ENV NEXTTELEMETRYDISABLED=1
RUN npm run build

FROM node:20.19.2-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXTTELEMETRYDISABLED=1

# Copy the minimal standalone server
COPY --from=builder /app/.next/standalone ./

# Copy static assets that standalone does not include by default
COPY --from=builder /app/public ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

### Required next.config.js

```javascript
module.exports = {
  output: "standalone"
};
```

### .dockerignore

```text
node_modules
.next
.git
.DS_Store
npm-debug.log
.env
```

## Build and Run

```bash
docker build -t my-next-app:prod .
docker run --rm -p 3000:3000 my-next-app:prod
```

## Development Dockerfile

```dockerfile
FROM node:20.19.2-slim
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

### Docker Compose for Development

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## Common Mistakes

1. **Missing .next/standalone output**: Must set `output: 'standalone'` or folder won't exist
2. **Missing static assets**: Standalone doesn't copy public or .next/static - must copy manually
3. **Alpine + native modules**: Alpine uses musl, which can break native dependencies
4. **Bloated build context**: Without .dockerignore, Docker sends whole repo to builder
5. **Single-stage builds in production**: Use multi-stage builds to reduce final image size

## Performance Considerations

- **Build time**: Cache-friendly layer ordering. Place dependency installation before copying source
- **Cold start**: Smaller images pull faster, fewer dependencies reduce file I/O on startup
- **Image size**: Fewer files to ship, fewer packages to scan

## Edge Cases

1. Missing .next/standalone output - set `output: 'standalone'`
2. Missing static assets - manually copy public and .next/static
3. Alpine + native modules - use slim if you depend on native addons
4. Bloated build context - use .dockerignore
5. Single-stage builds - use multi-stage for production

## Production Checklist

- [ ] Runtime stage uses slim base image with only standalone output + static assets
- [ ] Build context is trimmed with .dockerignore
- [ ] Base image tags are pinned and rebuilt on a cadence
- [ ] Image has single process responsibility
- [ ] Run command explicitly maps service port (EXPOSE is documentation, not publish)

## When to Use Docker for Next.js

**Use Docker** when you need:

- SSR or API-heavy workloads
- Non-trivial native dependencies
- Team size where environment drift shows up as bugs

**Don't use Docker** when:

- Deployment target is fully managed edge/serverless
- Building tiny marketing sites where output is static and deployment is CDN push

---

_Source: [Next.js Docker Images: A Practical 2026 Guide for Reliable Deploys](https://thelinuxcode.com/nextjs-docker-images-a-practical-2026-guide-for-reliable-deploys/)_
