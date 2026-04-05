# Traefik Middlewares

> Source: https://doc.traefik.io/traefik/v3.3/middlewares/overview/

## Overview

Middlewares allow you to modify requests before they reach your services. Traefik includes many built-in middlewares.

## Common Middlewares

### Rate Limiting

```yaml
http:
  middlewares:
    rate-limit:
      rateLimit:
        average: 100
        burst: 50
        period: 10s
```

### Security Headers

```yaml
http:
  middlewares:
    security-headers:
      headers:
        stsSeconds: 31536000
        forceSTSHeader: true
        stsIncludeSubdomains: true
        stsPreload: true
        frameDeny: true
        contentTypeNosniff: true
        browserXssFilter: true
```

### Compression

```yaml
http:
  middlewares:
    compress:
      compress: {}
```

### IP Whitelist

```yaml
http:
  middlewares:
    whitelist:
      ipWhiteList:
        sourceRange:
          - "127.0.0.1/32"
          - "192.168.1.0/24"
```

### Redirect

```yaml
http:
  middlewares:
    redirect:
      redirectRegex:
        permanent: true
        regex: "^http://example.com/(.*)"
        replacement: "https://www.example.com/$1"
```

## Applying Middlewares

```yaml
http:
  routers:
    myapp:
      rule: "Host(`app.example.com`)"
      middlewares:
        - security-headers
        - compress
      service: myapp
```

## Middleware Chain

Apply multiple middlewares in order:

```yaml
http:
  routers:
    myapp:
      middlewares:
        - strip-prefix
        - compress
        - security-headers
```

## See Also

- [Traefik Docker Swarm](./docker-swarm.md)
- [Traefik Dashboard](./dashboard.md)
- [Traefik HTTPS/TLS](./https-tls.md)
