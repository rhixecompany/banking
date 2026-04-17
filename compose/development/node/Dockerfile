# Development Dockerfile for Node.js/Next.js
# Optimized for fast iteration with hot-reload support
FROM node:22-alpine

WORKDIR /app

# Install build dependencies once
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev

# Copy dependency files
COPY package.json package-lock.json ./

# Install all dependencies including dev dependencies
# Use cache mount for faster repeated builds during development
RUN --mount=type=cache,target=/root/.npm \
    npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Set development environment variables
ENV NODE_ENV=development \
    NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

EXPOSE 3000

# Run Next.js dev server with watch mode
CMD ["npm", "run", "dev"]
