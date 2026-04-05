#!/bin/bash
# vps-setup.sh - Automated Banking App VPS Setup v1.1
# Usage: curl -sSL https://raw.githubusercontent.com/rhixecompany/banking/main/scripts/vps-setup.sh | bash
#
# Or download and run locally:
# wget -O vps-setup.sh https://raw.githubusercontent.com/rhixecompany/banking/main/scripts/vps-setup.sh
# chmod +x vps-setup.sh
# ./vps-setup.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/rhixecompany/banking.git"
INSTALL_DIR="/opt/banking"
SWARM_ADVERTISE_ADDR=""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Banking App VPS Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}Please run as root (sudo -i first)${NC}"
    exit 1
fi

# Get IP address if not provided
if [ -z "$SWARM_ADVERTISE_ADDR" ]; then
    SWARM_ADVERTISE_ADDR=$(hostname -I | awk '{print $1}')
fi

echo -e "${YELLOW}Using IP address: ${SWARM_ADVERTISE_ADDR}${NC}"
echo ""

# Function to prompt for secret
prompt_secret() {
    local name="$1"
    local description="$2"
    local secret=""
    
    while [ -z "$secret" ]; do
        echo -n "Enter $description: "
        read -s secret
        echo ""
        if [ -z "$secret" ]; then
            echo -e "${RED}$name cannot be empty${NC}"
        fi
    done
    
    echo "$secret"
}

# Function to create secret
create_secret() {
    local name="$1"
    local value="$2"
    
    if [ -n "$value" ]; then
        echo "$value" | docker secret create "${name}" - 2>/dev/null || true
    fi
}

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
    if docker swarm inspect &> /dev/null; then
        echo -e "${GREEN}Already in Docker Swarm${NC}"
    else
        docker swarm init --advertise-addr "$SWARM_ADVERTISE_ADDR"
        echo -e "${GREEN}Docker Swarm initialized${NC}"
    fi
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

# Copy deployment files
echo -e "${GREEN}Step 5: Setting up deployment files...${NC}"
mkdir -p "$INSTALL_DIR/compose/production/traefik/certs"
mkdir -p "$INSTALL_DIR/.envs/production"

# Files are already in the cloned repo at /opt/banking, just ensure directories exist
# The stacks and compose files will be used directly from the repo
echo -e "${GREEN}Deployment files ready in ${INSTALL_DIR}${NC}"
echo ""

# Collect secrets
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Secret Configuration${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Enter your secrets below (input is hidden):${NC}"
echo ""

# Encryption key
echo -n "Enter ENCRYPTION_KEY (32+ char hex): "
read -s ENCRYPTION_KEY
echo ""
if [ -z "$ENCRYPTION_KEY" ]; then
    ENCRYPTION_KEY=$(openssl rand -hex 32)
    echo -e "${GREEN}Generated random encryption key${NC}"
fi

# NextAuth secret  
echo -n "Enter NEXTAUTH_SECRET: "
read -s NEXTAUTH_SECRET
echo ""
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}Generated random NextAuth secret${NC}"
fi

# Database URL (or use local PostgreSQL)
echo -n "Enter DATABASE_URL (or press Enter for local): "
read DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
    # Will use local PostgreSQL from stack
    DATABASE_URL="postgresql://postgres:banking_secure_pass@postgres/banking"
fi

# Plaid credentials
echo -n "Enter PLAID_CLIENT_ID: "
read PLAID_CLIENT_ID

echo -n "Enter PLAID_SECRET: "
read -s PLAID_SECRET
echo ""

# Dwolla credentials
echo -n "Enter DWOLLA_KEY: "
read DWOLLA_KEY

echo -n "Enter DWOLLA_SECRET: "
read -s DWOLLA_SECRET
echo ""

# OAuth (optional)
echo -n "Enter AUTH_GITHUB_ID (optional): "
read AUTH_GITHUB_ID

echo -n "Enter AUTH_GITHUB_SECRET (optional): "
read -s AUTH_GITHUB_SECRET
echo ""

echo -n "Enter AUTH_GOOGLE_ID (optional): "
read AUTH_GOOGLE_ID

echo -n "Enter AUTH_GOOGLE_SECRET (optional): "
read -s AUTH_GOOGLE_SECRET
echo ""

echo ""

# Create secrets
echo -e "${GREEN}Step 6: Creating Docker secrets...${NC}"
create_secret "banking_encryption_key" "$ENCRYPTION_KEY"
create_secret "banking_nextauth_secret" "$NEXTAUTH_SECRET"
create_secret "banking_database_url" "$DATABASE_URL"
create_secret "banking_plaid_client_id" "$PLAID_CLIENT_ID"
create_secret "banking_plaid_secret" "$PLAID_SECRET"
create_secret "banking_dwolla_key" "$DWOLLA_KEY"
create_secret "banking_dwolla_secret" "$DWOLLA_SECRET"
create_secret "banking_auth_github_id" "$AUTH_GITHUB_ID"
create_secret "banking_auth_github_secret" "$AUTH_GITHUB_SECRET"
create_secret "banking_auth_google_id" "$AUTH_GOOGLE_ID"
create_secret "banking_auth_google_secret" "$AUTH_GOOGLE_SECRET"
create_secret "banking_postgres_password" "banking_secure_pass"

echo -e "${GREEN}Secrets created${NC}"
echo ""

# Create environment file
echo -e "${GREEN}Step 7: Creating environment configuration...${NC}"
cat > "$INSTALL_DIR/.envs/production/.env.production" << EOF
NODE_ENV=production
PORT=3000
DOMAIN=$SWARM_ADVERTISE_ADDR
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

# Ask if user wants to build locally or pull from registry
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Build Option${NC}"
echo -e "${YELLOW}========================================${NC}"
echo "Do you want to:"
echo "  1) Build Docker image locally (slower, no registry needed)"
echo "  2) Pull pre-built image from GitHub Container Registry (faster)"
echo ""
read -p "Choose (1/2): " BUILD_CHOICE

if [ "$BUILD_CHOICE" = "1" ]; then
    echo -e "${GREEN}Building Docker image locally...${NC}"
    echo -e "${YELLOW}This may take 10-15 minutes...${NC}"
    cd "$INSTALL_DIR/banking"
    docker build -t ghcr.io/rhixecompany/banking:latest \
        -f compose/production/node/Dockerfile .
    IMAGE_BUILT=true
else
    # Login to GHCR
    echo -e "${YELLOW}To pull from GHCR, you need to login${NC}"
    echo -n "Enter GitHub username: "
    read GHCR_USERNAME
    echo -n "Enter GitHub token (classic, with repo scope): "
    read -s GHCR_TOKEN
    echo ""
    
    echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin
    
    echo -e "${GREEN}Pulling image...${NC}"
    docker pull ghcr.io/rhixecompany/banking:latest
fi

echo ""

# Deploy stacks
echo -e "${GREEN}Step 8: Deploying Traefik stack...${NC}"
cd /opt/banking
docker stack deploy -c stacks/traefik.stack.yml traefik
echo -e "${GREEN}Waiting for Traefik to be ready...${NC}"
sleep 10
echo ""

echo -e "${GREEN}Step 9: Deploying Banking stack...${NC}"
docker stack deploy -c stacks/app.stack.yml banking
echo ""

# Wait for services
echo -e "${GREEN}Step 10: Waiting for services to start...${NC}"
sleep 30

# Show status
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
echo -e "${YELLOW}Browser will show security warning - click 'Advanced' to proceed${NC}"
echo ""

# Show logs command
echo -e "${GREEN}To view logs:${NC}"
echo "  docker service logs banking_app"
echo ""

# Show how to update
echo -e "${GREEN}To update the app later:${NC}"
echo "  cd $INSTALL_DIR/banking"
echo "  git pull origin main"
echo "  docker build -t ghcr.io/rhixecompany/banking:latest -f compose/production/node/Dockerfile ."
echo "  docker service update --image ghcr.io/rhixecompany/banking:latest banking_app"
echo ""
