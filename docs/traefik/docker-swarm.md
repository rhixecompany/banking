# Traefik Docker Provider

> Source: https://doc.traefik.io/traefik/v3.3/providers/docker/

## Overview

Traefik uses Docker labels to dynamically configure routing. Attach labels to your containers and Traefik handles the rest.

## Configuration

### Basic Docker Provider Setup

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
    environment:
      - TRAEFIK_PROVIDERS_DOCKER=true

  app:
    image: myapp:latest
    labels:
      - "traefik.http.routers.app.rule=Host(`app.localhost`)"
      - "traefik.http.services.app.loadbalancer.server.port=3000"
```

## Key Labels

### Routing

| Label                                     | Description  |
| ----------------------------------------- | ------------ |
| `traefik.http.routers.<name>.rule`        | Routing rule |
| `traefik.http.routers.<name>.entrypoints` | Entry points |
| `traefik.http.routers.<name>.tls`         | Enable TLS   |

### Service

| Label | Description |
| --- | --- |
| `traefik.http.services.<name>.loadbalancer.server.port` | Backend port |
| `traefik.http.services.<name>.loadbalancer.server.scheme` | Backend scheme |

### Middleware

| Label | Description |
| --- | --- |
| `traefik.http.routers.<name>.middlewares` | Comma-separated middleware list |

## Port Detection

Traefik automatically detects ports:

- Single port: Uses that port
- Multiple ports: Uses the lowest port
- No port: Must specify manually via label

## Security Notes

> Accessing the Docker API without restriction is a security concern. Only trusted users should control the Docker daemon.

## Options

```yaml
labels:
  - "traefik.enable=true" # Enable/disable container
  - "traefik.docker.network=traefik-public" # Custom network
  - "traefik.http.routers.app.rule=Host(`app.example.com`)"
  - "traefik.http.services.app.loadbalancer.server.port=3000"
```

## See Also

- [Traefik Dashboard](./dashboard.md)
- [Traefik HTTPS/TLS](./https-tls.md)
- [Traefik Middlewares](./middlewares.md)
