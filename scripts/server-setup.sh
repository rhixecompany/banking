#!/bin/bash
# server-setup.sh - Bootstrap Docker Swarm on Hostinger VPS

set -e

echo "=== Banking App Server Setup ==="

echo "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    usermod -aG docker deploy
fi

echo "Initializing Docker Swarm..."
if ! docker info &> /dev/null; then
    SWARM_ADVERTISE_ADDR=$(hostname -I | awk '{print $1}')
    docker swarm init --advertise-addr "$SWARM_ADVERTISE_ADDR"
fi

echo "Creating overlay networks..."
docker network create --driver overlay --attachable traefik-public 2>/dev/null || true
docker network create --driver overlay --attachable app-internal 2>/dev/null || true

echo "Creating directory structure..."
mkdir -p /opt/banking/{stacks,compose/production/traefik/certs,scripts}
chown -R deploy:deploy /opt/banking 2>/dev/null || true

echo "=== Setup complete! ==="
echo "Next steps:"
echo "  1. Copy stack files to /opt/banking/stacks/"
echo "  2. Create Docker secrets: echo 'secret' | docker secret create banking_encryption_key -"
echo "  3. Deploy stacks: docker stack deploy -c stacks/traefik.stack.yml traefik"
echo "  4. Deploy app: docker stack deploy -c stacks/app.stack.yml banking"
