#!/bin/bash
# server-setup.sh - Bootstrap Docker on VPS

set -e

echo "=== Banking App Server Setup ==="
echo ""

echo "Step 1: Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "Docker installed successfully"
else
    echo "Docker already installed"
fi
echo ""

echo "Step 2: Verifying Docker Compose..."
if ! docker compose version &> /dev/null; then
    echo "Docker Compose v2 not found. Installing..."
    apt-get update && apt-get install -y docker-compose-v2
fi
echo "Docker Compose ready"
echo ""

echo "Step 3: Creating directory structure..."
mkdir -p /opt/banking/{compose/traefik/certs,compose/traefik/auth,.envs/production}
echo "Directories created"
echo ""

echo "=== Setup complete! ==="
echo ""
echo "Next steps:"
echo ""
echo "  Option A: Automated setup (recommended)"
echo "    curl -sSL https://raw.githubusercontent.com/rhixecompany/banking/main/scripts/server/vps-setup.sh | bash"
echo ""
echo "  Option B: Manual setup"
echo "    1. Clone repository: git clone https://github.com/rhixecompany/banking.git /opt/banking"
echo "    2. Generate environment: cd /opt/banking && ./scripts/docker/generate-env.sh"
echo "    3. Edit .envs/production/.env.production with your API keys"
echo "    4. Generate Traefik credentials: ./scripts/deploy/generate-htpasswd.sh"
echo "    5. Build and start: docker compose build && docker compose up -d"
echo ""
echo "Useful commands:"
echo "  docker compose ps         - View services"
echo "  docker compose logs -f    - View logs"
echo "  docker compose down       - Stop services"
echo ""
