# Traefik HTTPS/TLS Configuration

## Overview

Learn how to configure HTTPS with TLS certificates in Traefik.

## TLS Configuration

### Basic TLS Setup

```yaml
# traefik.yml
entryPoints:
  websecure:
    address: ":443"
    http:
      tls: {}
```

### TLS Options

```yaml
# dynamic/tls.yml
tls:
  options:
    default:
      minVersion: VersionTLS12
      cipherSuites:
        - TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
        - TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
```

## Self-Signed Certificates

### Generate Certificates

```bash
# Generate private key and certificate
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/C=US/ST=State/L=City/O=Organization"
```

### Using with Traefik

```yaml
# dynamic/tls.yml
tls:
  stores:
    default:
      defaultCertificate:
        certFile: /certs/cert.pem
        keyFile: /certs/key.pem
```

## Let's Encrypt (Automatic HTTPS)

```yaml
# traefik.yml
certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@example.com
      storage: /certs/acme.json
      httpChallenge:
        entryPoint: web
```

### Router Configuration

```yaml
http:
  routers:
    myapp:
      rule: "Host(`app.example.com`)"
      tls:
        certResolver: letsencrypt
      service: myapp
```

## Docker Labels for TLS

```yaml
services:
  app:
    image: myapp:latest
    labels:
      - "traefik.http.routers.app.rule=Host(`app.example.com`)"
      - "traefik.http.routers.app.tls=true"
      - "traefik.http.routers.app.tls.certResolver=letsencrypt"
```

## Force HTTPS Redirect

```yaml
http:
  middlewares:
    https-redirect:
      redirectScheme:
        scheme: https
        permanent: true

  routers:
    web:
      rule: "Host(`example.com`)"
      entryPoints:
        - web
      middlewares:
        - https-redirect
      service: dummy
```

## Complete Example

```yaml
# traefik.yml
api:
  dashboard: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"
    http:
      tls: {}

certificatesResolvers:
  letsencrypt:
    acme:
      email: admin@example.com
      storage: /certs/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
```

## See Also

- [Traefik Quickstart](./quickstart.md)
- [Traefik Docker Swarm](./docker-swarm.md)
- [Traefik Dashboard](./dashboard.md)
- [Traefik Middlewares](./middlewares.md)
