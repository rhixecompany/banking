#!/bin/bash
# vps-setup.sh - Automated Banking App VPS Setup v1.4
# Usage: curl -sSL https://raw.githubusercontent.com/rhixecompany/banking/main/scripts/vps-setup.sh | bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
REPO_URL="https://github.com/rhixecompany/banking.git"
INSTALL_DIR="/opt/banking"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Banking App VPS Setup v1.2${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (sudo -i first)${NC}"
    exit 1
fi

SWARM_ADVERTISE_ADDR=$(hostname -I | awk '{print $1}')
echo -e "${YELLOW}Using IP address: ${SWARM_ADVERTISE_ADDR}${NC}"
echo ""

# Cleanup previous runs if any
echo -e "${YELLOW}Cleaning up any previous deployments...${NC}"
docker stack rm banking 2>/dev/null || true
docker stack rm traefik 2>/dev/null || true
sleep 5
docker swarm leave --force 2>/dev/null || true
rm -rf /opt/banking 2>/dev/null || true
echo -e "${GREEN}Cleanup complete${NC}"
echo ""

echo -e "${GREEN}Step 1: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo -e "${GREEN}Docker installed successfully${NC}"
else
    echo -e "${GREEN}Docker already installed${NC}"
fi
echo ""

echo -e "${GREEN}Step 2: Initializing Docker Swarm...${NC}"
if ! docker info &> /dev/null; then
    docker swarm init --advertise-addr "$SWARM_ADVERTISE_ADDR"
    echo -e "${GREEN}Docker Swarm initialized${NC}"
else
    echo -e "${GREEN}Already in Docker Swarm${NC}"
fi
echo ""

echo -e "${GREEN}Step 3: Creating overlay networks...${NC}"
docker network create --driver overlay --attachable traefik-public 2>/dev/null || true
docker network create --driver overlay --attachable app-internal 2>/dev/null || true
echo -e "${GREEN}Networks created${NC}"
echo ""

echo -e "${GREEN}Step 4: Cloning repository...${NC}"
cd /opt
rm -rf banking 2>/dev/null || true
git clone "$REPO_URL" banking
cd banking
echo -e "${GREEN}Repository cloned${NC}"
echo ""

# Setup directories
echo -e "${GREEN}Step 5: Setting up deployment files...${NC}"
mkdir -p "$INSTALL_DIR/compose/production/traefik/certs"
mkdir -p "$INSTALL_DIR/.envs/production"
echo -e "${GREEN}Deployment files ready${NC}"
echo ""

# Auto-generate secrets
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Auto-generating Secrets${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""

ENCRYPTION_KEY=$(openssl rand -hex 32)
echo -e "${GREEN}Generated ENCRYPTION_KEY${NC}"

NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}Generated NEXTAUTH_SECRET${NC}"

DATABASE_URL="postgresql://postgres:banking_secure_pass@postgres/banking"
echo -e "${GREEN}Using local PostgreSQL${NC}"

PLAID_CLIENT_ID="${PLAID_CLIENT_ID:-}"
PLAID_SECRET="${PLAID_SECRET:-}"
DWOLLA_KEY="${DWOLLA_KEY:-}"
DWOLLA_SECRET="${DWOLLA_SECRET:-}"

echo ""
echo -e "${GREEN}Step 6: Creating Docker secrets...${NC}"

create_secret() {
    local name="$1"
    local value="$2"
    if [ -n "$value" ]; then
        echo "$value" | docker secret create "${name}" - 2>/dev/null || true
    fi
}

create_secret "banking_encryption_key" "$ENCRYPTION_KEY"
create_secret "banking_nextauth_secret" "$NEXTAUTH_SECRET"
create_secret "banking_database_url" "$DATABASE_URL"
create_secret "banking_plaid_client_id" "$PLAID_CLIENT_ID"
create_secret "banking_plaid_secret" "$PLAID_SECRET"
create_secret "banking_dwolla_key" "$DWOLLA_KEY"
create_secret "banking_dwolla_secret" "$DWOLLA_SECRET"
create_secret "banking_postgres_password" "banking_secure_pass"

echo -e "${GREEN}Secrets created${NC}"
echo ""

# Environment file
echo -e "${GREEN}Step 7: Creating environment configuration...${NC}"
cat > "$INSTALL_DIR/.envs/production/.env.production" << 'EOF'
NODE_ENV=production
PORT=3000
DOMAIN=76.13.26.9
REGISTRY=ghcr.io
IMAGE_NAME=rhixecompany/banking
VERSION=latest
POSTGRES_USER=postgres
POSTGRES_DB=banking
POSTGRES_PASSWORD=banking_secure_pass
REDIS_PASSWORD=banking_redis_pass
GRAFANA_PASSWORD=admin123
EOF

echo -e "${GREEN}Environment file created${NC}"
echo ""

# Build or pull
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Build Option${NC}"
echo -e "${YELLOW}========================================${NC}"
echo "Note: Building locally takes 10-15 minutes"
echo ""
cd "$INSTALL_DIR"

echo -e "${GREEN}Building Docker image locally...${NC}"
echo -e "${YELLOW}This may take 10-15 minutes...${NC}"
docker build -t ghcr.io/rhixecompany/banking:latest \
    -f compose/production/node/Dockerfile .

echo ""

# Deploy stacks
echo -e "${GREEN}Step 8: Deploying Traefik stack...${NC}"
docker stack deploy -c stacks/traefik.stack.yml traefik
echo -e "${GREEN}Waiting for Traefik...${NC}"
sleep 10

echo -e "${GREEN}Step 9: Deploying Banking stack...${NC}"
docker stack deploy -c stacks/app.stack.yml banking
echo ""

echo -e "${GREEN}Step 10: Waiting for services...${NC}"
sleep 30

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Deployment Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

echo -e "${GREEN}Service Status:${NC}"
docker service ls
echo ""

echo -e "${GREEN}Stack Services:${NC}"
docker stack ps banking
echo ""

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Access Information${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo -e "Banking App: http://${SWARM_ADVERTISE_ADDR}"
echo -e "Banking App (HTTPS): https://${SWARM_ADVERTISE_ADDR}"
echo ""
echo -e "${YELLOW}Note: HTTPS uses self-signed certificate${NC}"
echo ""

echo -e "${GREEN}To view logs:${NC}"
echo "  docker service logs banking_app"
echo ""

echo -e "${GREEN}To update later:${NC}"
echo "  cd $INSTALL_DIR && git pull origin main"
echo "  docker build -t ghcr.io/rhixecompany/banking:latest -f compose/production/node/Dockerfile ."
echo "  docker service update --image ghcr.io/rhixecompany/banking:latest banking_app"
echo ""

# ========================================
# CLEANUP COMMANDS (run manually if needed)
# ========================================
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Cleanup Commands${NC}"
echo -e "${YELLOW}========================================${NC}"
echo ""
echo "To remove all stacks and start fresh:"
echo "  docker stack rm banking"
echo "  docker stack rm traefik"
echo "  sleep 10"
echo "  docker swarm leave --force"
echo "  rm -rf /opt/banking"
echo ""
echo "To remove specific stack:"
echo "  docker stack rm banking"
echo ""
echo "To view logs:"
echo "  docker service logs banking_app"
echo "  docker service logs traefik_traefik"
echo ""
echo "To restart services:"
echo "  docker service update --force banking_app"
echo ""
