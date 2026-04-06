# Docker Compose Overview

Docker Compose is used to define and run multi-container Docker applications.

## Why Docker Compose?

- **Multi-container apps**: Define all services in one YAML file
- **Easy sharing**: Share your environment with a single file
- **Quick reproduction**: Recreate identical environments
- **Development parity**: Same config from dev to production

## Key Concepts

### Services

Each service maps to a container:

```yaml
services:
  app: # Service name
    image: ... # Or build
    ports: # Port mappings
    volumes: # Persistent data
```

### Networks

Containers communicate via networks:

```yaml
networks:
  frontend:
  backend:
```

### Volumes

Persistent data survives container restarts:

```yaml
volumes:
  db_data: # Named volume
```

### Profiles

Conditional service inclusion:

```yaml
services:
  monitoring:
    profiles:
      - monitoring # Only starts with --profile monitoring
```

## Common Commands

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs
docker compose logs -f

# List services
docker compose ps

# Execute command in service
docker compose exec app sh

# Build images
docker compose build

# Scale services
docker compose up -d --scale app=3
```

## Environment Variables

### In docker-compose.yml

```yaml
services:
  app:
    environment:
      - NODE_ENV=production
      - DEBUG=false
```

### From .env file

```yaml
services:
  app:
    env_file:
      - .env
```

### Variable substitution

```yaml
services:
  app:
    image: myapp:${NODE_ENV:-development}
```

## Compose File Versions

| Version | Docker Engine | Features         |
| ------- | ------------- | ---------------- |
| 3.x     | 17.06+        | Current standard |
| 2.x     | 1.10+         | Legacy projects  |

## Profiles

Profiles allow conditional service inclusion:

```yaml
services:
  app:
    profiles:
      - default
  monitoring:
    profiles:
      - monitoring
  migration:
    profiles:
      - init
```

Start with specific profiles:

```bash
# Start default profile only
docker compose up -d

# Start with monitoring
docker compose --profile monitoring up -d

# Start migration
docker compose --profile init up
```

## Next Steps

- [Quick Start Guide](quickstart.md) - Start your first container
- [Development Guide](development.md) - Local development setup
- [Production Guide](production.md) - Production deployment
- [Reference](reference.md) - Complete command reference
