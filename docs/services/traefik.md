# Traefik Reverse Proxy Guide

## What is Traefik?

Traefik is an open-source Application Proxy (3.3 billion downloads, 55k+ stars on GitHub). It receives requests on behalf of your system, identifies which components are responsible for handling them, and routes them securely.

## Core Concepts

### Entrypoints

Network entry points into Traefik. They define the port that will receive packets and whether to listen for TCP or UDP.

### Routers

In charge of connecting incoming requests to the services that can handle them. Routers may use middleware to update the request before forwarding.

### Services

Responsible for configuring how to reach the actual services that will handle the incoming requests.

### Providers

Infrastructure components - orchestrators, container engines, cloud providers, or key-value stores. Traefik queries provider APIs to find routing information.

## How Traefik Works

```text
[Internet] --> Traefik --> [Service A]
                  --> [Service B]
                  --> [Service C]
```

Traefik automatically discovers services and configures routing through Docker labels, eliminating manual configuration.

## Basic Docker Setup

### Traefik Configuration

```yaml
# docker-compose.yml
version: "3.8"
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`traefik.localhost`)"
      - "traefik.http.routers.dashboard.service=api@internal"
```

### Adding Services

```yaml
services:
  whoami:
    image: traefik/whoami
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.whoami.rule=Host(`whoami.localhost`)"
      - "traefik.http.routers.whoami.entrypoints=web"
```

## SSL with Let's Encrypt

### Production SSL Configuration

```yaml
version: "3.8"
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      # Let's Encrypt
      - "--certificatesresolvers.letsencrypt.acme.email=email@example.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      # Redirect HTTP to HTTPS
      - "--entrypoints.web.http.redirections.entrypoint.to=websecure"
      - "--entrypoints.web.http.redirections.entrypoint.scheme=https"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
```

### Wildcard Certificates (DNS Challenge)

```yaml
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--certificatesresolvers.letsencrypt.acme.dnschallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.dnschallenge.provider=cloudflare"
      - "--certificatesresolvers.letsencrypt.acme.email=email@example.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    environment:
      - CF_API_EMAIL=email@example.com
      - CF_API_KEY=your-api-key
```

## Load Balancing

### Multiple Replicas

```yaml
services:
  api:
    image: myapi:latest
    deploy:
      replicas: 3
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.example.com`)"
      - "traefik.http.services.api.loadbalancer.server.port=3000"
```

### Health Checks

```yaml
services:
  api:
    labels:
      - "traefik.enable=true"
      - "traefik.http.services.api.loadbalancer.healthcheck.path=/health"
      - "traefik.http.services.api.loadbalancer.healthcheck.interval=10s"
      - "traefik.http.services.api.loadbalancer.healthcheck.timeout=3s"
```

## Middleware

### Basic Authentication

```yaml
services:
  api:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.example.com`)"
      - "traefik.http.routers.api.middlewares=auth"
      # Generate: htpasswd -nb user password | sed -e s/\\$/\\$\\$/g
      - "traefik.http.middlewares.auth.basicauth.users=admin:$$apr1$$hashed..."
```

### Rate Limiting

```yaml
services:
  api:
    labels:
      - "traefik.http.routers.api.middlewares=ratelimit"
      - "traefik.http.middlewares.ratelimit.ratelimit.average=100"
      - "traefik.http.middlewares.ratelimit.ratelimit.burst=50"
```

### Security Headers

```yaml
services:
  app:
    labels:
      - "traefik.http.routers.app.middlewares=security-headers"
      - "traefik.http.middlewares.security-headers.headers.stsSeconds=31536000"
      - "traefik.http.middlewares.security-headers.headers.stsIncludeSubdomains=true"
      - "traefik.http.middlewares.security-headers.headers.contentTypeNosniff=true"
      - "traefik.http.middlewares.security-headers.headers.browserXssFilter=true"
```

### IP Whitelist

```yaml
services:
  admin:
    labels:
      - "traefik.http.routers.admin.middlewares=whitelist"
      - "traefik.http.middlewares.whitelist.ipwhitelist.sourcerange=192.168.1.0/24"
```

### Compression

```yaml
services:
  app:
    labels:
      - "traefik.http.routers.app.middlewares=compress"
      - "traefik.http.middlewares.compress.compress=true"
```

## Path-Based Routing

```yaml
services:
  api:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`example.com`) && PathPrefix(`/api`)"
      - "traefik.http.routers.api.middlewares=strip-api"
      - "traefik.http.middlewares.strip-api.stripprefix.prefixes=/api"
```

## Complete Production Example

```yaml
version: "3.8"
services:
  traefik:
    image: traefik:v3.0
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=traefik-public"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.email=admin@example.com"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--accesslog=true"
      - "--log.level=INFO"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - letsencrypt:/letsencrypt
    networks:
      - traefik-public

  api:
    image: myapi:latest
    networks:
      - traefik-public
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.api.rule=Host(`api.example.com`)"
      - "traefik.http.routers.api.entrypoints=websecure"
      - "traefik.http.routers.api.tls.certresolver=letsencrypt"
      - "traefik.http.services.api.loadbalancer.server.port=3000"

networks:
  traefik-public:
    external: true

volumes:
  letsencrypt:
```

## Quick Start Commands

### Kubernetes

Deploy Traefik using Helm - for Kubernetes environments

### Docker

Deploy Traefik using Docker - for containerized environments

### Installation

1. Ensure prerequisites: Docker (optionally Docker Compose) or Kubernetes with Helm 3 and kubectl
2. Choose deployment method
3. Install Traefik
4. Expose the dashboard
5. Deploy sample application
6. Configure basic routing

## Related Documentation in Project

- [Traefik Quickstart](../traefik/quickstart.md)
- [Traefik HTTPS/TLS](../traefik/https-tls.md)
- [Traefik Dashboard](../traefik/dashboard.md)
- [Traefik Middlewares](../traefik/middlewares.md)

---

_Sources: [Traefik Documentation](https://doc.traefik.io/traefik/), [Docker Traefik Reverse Proxy Guide](https://oneuptime.com/blog/post/2026-01-16-docker-traefik-reverse-proxy/view)_
