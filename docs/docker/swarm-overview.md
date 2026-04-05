# Docker Swarm Overview

## Introduction

Docker Swarm is a container orchestration tool built into Docker Engine for managing a cluster of Docker nodes.

## Key Concepts

### Cluster Management

- Use Docker CLI to create a swarm, deploy services, and manage behavior
- Swarm mode is built into Docker Engine (not to be confused with Docker Classic Swarm)

### Decentralized Design

- No need to differentiate node roles at deployment time
- Engine handles specialization at runtime
- Single disk image can create entire swarm

### Declarative Service Model

- Define desired state of services in application stack
- Example: web frontend + message queue + database backend

### Scaling

- Declare number of tasks for each service
- Scale up/down automatically
- Manager adds/removes tasks to maintain desired state

### Desired State Reconciliation

- Manager monitors cluster state constantly
- Reconciles actual vs desired state
- Example: 10 replicas, 2 crash → manager creates 2 new replicas

### Service Discovery

- Manager assigns unique DNS name to each service
- Load balance running containers
- Query any container via embedded DNS

### Security

- TLS mutual authentication by default
- Encryption for all node communications
- Use self-signed or custom CA certificates

### Rolling Updates

- Apply updates incrementally
- Control delay between deployments
- Rollback capability

## Commands

```bash
# Initialize swarm
docker swarm init --advertise-addr <IP>

# Join worker to swarm
docker swarm join --token <TOKEN> <MANAGER-IP>:2377

# Create service
docker service create --name my-app --replicas 3 -p 80:80 nginx

# Scale service
docker service scale my-app=5

# List services
docker service ls

# Remove service
docker service rm my-app
```

## Next Steps

- See [Swarm Secrets](./secrets.md) for managing sensitive data
- See [Stack Deploy](./stack-deploy.md) for multi-service deployment
