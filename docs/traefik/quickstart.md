# Traefik Quickstart

## Overview

Traefik is a modern reverse proxy and load balancer that supports multiple providers including Docker, Kubernetes, and AWS.

## Quick Start with Docker

```yaml
# docker-compose.yml
version: "3.8"

services:
  traefik:
    image: traefik:v3.3
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/etc/traefik/traefik.yml:ro
      - ./dynamic:/etc/traefik/dynamic:ro
    environment:
      - TRAEFIK_LOG_LEVEL=INFO

  whoami:
    image: traefik/whoami
    labels:
      - "traefik.http.routers.whoami.rule=Host(`whoami.localhost`)"
      - "traefik.http.services.whoami.loadbalancer.server.port=80"
```

## Basic Configuration

### Static Configuration (traefik.yml)

```yaml
api:
  dashboard: true

entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
  file:
    directory: /etc/traefik/dynamic
    watch: true
```

### Dynamic Configuration

```yaml
# dynamic/middlewares.yml
http:
  middlewares:
    redirect:
      redirectScheme:
        scheme: https
```

## Running Traefik

```bash
# Start Traefik
docker run -d -p 80:80 -p 443:443 -p 8080:8080 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  traefik:v3.3

# Access dashboard
# http://localhost:8080/dashboard/
```

## Key Concepts

| Concept      | Description                                  |
| ------------ | -------------------------------------------- |
| Providers    | Discover services (Docker, Kubernetes, etc.) |
| Routers      | Define how requests are routed               |
| Services     | Backend services                             |
| Middlewares  | Modify requests/responses                    |
| Entry Points | Network entry points (ports)                 |

## Next Steps

- [Traefik Docker Swarm](./docker-swarm.md)
- [Traefik Dashboard](./dashboard.md)
- [Traefik HTTPS/TLS](./https-tls.md)
- [Traefik Middlewares](./middlewares.md)
