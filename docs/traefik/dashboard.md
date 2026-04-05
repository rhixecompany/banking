# Traefik Dashboard

> Source: https://doc.traefik.io/traefik/v3.3/operations/dashboard/

## Overview

The Traefik dashboard shows current active routes and allows you to monitor your services.

## Accessing the Dashboard

The dashboard is available at `/dashboard/` (trailing slash required).

### Secure Mode (Recommended)

1. Enable the API in static configuration:

```yaml
# traefik.yml
api:
  dashboard: true
```

2. Create a router with security:

```yaml
# dynamic.yml
http:
  routers:
    dashboard:
      rule: "Host(`traefik.example.com`)"
      service: api@internal
      middlewares:
        - auth
      tls: {}

  middlewares:
    auth:
      basicAuth:
        users:
          - "admin:$apr1$H6uskkkW$IgXLP6ewTrQ05hsohYieKw/"
```

### Insecure Mode (Development Only)

```yaml
# traefik.yml
api:
  insecure: true
```

Access at: `http://localhost:8080/dashboard/`

## Custom Base Path

```yaml
api:
  basePath: /traefik
```

- API: `/traefik/api`
- Dashboard: `/traefik/dashboard`

## See Also

- [Traefik Docker Swarm](./docker-swarm.md)
- [Traefik HTTPS/TLS](./https-tls.md)
- [Traefik Middlewares](./middlewares.md)
