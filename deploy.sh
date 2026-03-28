#!/bin/bash
# Step-by-step production deployment workflow

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Banking App - Production Deployment Workflow         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging
log_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Verify prerequisites
log_step "Verifying prerequisites..."
echo "  Checking Docker..."
if ! command -v docker &> /dev/null; then
    log_error "Docker not found. Please install Docker."
    exit 1
fi
echo "  ✓ Docker $(docker --version)"

echo "  Checking Docker Compose..."
if ! command -v docker &> /dev/null || ! docker compose version &> /dev/null; then
    log_error "Docker Compose not found. Please install Docker Compose."
    exit 1
fi
echo "  ✓ Docker Compose installed"

echo "  Checking Git..."
if ! command -v git &> /dev/null; then
    log_warning "Git not found - skipping git checks"
else
    echo "  ✓ Git $(git --version)"
fi
echo ""

# Step 2: Verify .env.production
log_step "Verifying environment configuration..."
if [ ! -f ".env.production" ]; then
    log_warning ".env.production not found"
    echo "  Choose an option:"
    echo "    1) Generate new (with random secrets)"
    echo "    2) Copy from .env-example"
    read -p "  Enter choice (1-2): " choice
    
    case $choice in
        1)
            if [ -f "generate-env.sh" ]; then
                bash generate-env.sh
            else
                log_error "generate-env.sh not found"
                exit 1
            fi
            ;;
        2)
            cp .env-example .env.production
            log_warning "Replace placeholders in .env.production"
            exit 1
            ;;
        *)
            log_error "Invalid choice"
            exit 1
            ;;
    esac
fi

# Check for placeholders
if grep -q "CHANGE_ME\|yourdomain\|^PLAID_CLIENT_ID=$\|^DWOLLA_KEY=$" .env.production 2>/dev/null; then
    log_warning ".env.production contains placeholders or missing values"
    echo "  Please edit .env.production with real values:"
    echo "    - NEXT_PUBLIC_SITE_URL: your production domain"
    echo "    - API keys (if using): Plaid, Dwolla, email, etc."
    read -p "  Continue anyway? (y/n): " continue
    if [[ ! $continue =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo "  ✓ .env.production configured"
echo ""

# Step 3: Build image
log_step "Building Docker image..."
NEXT_PUBLIC_SITE_URL=$(grep "^NEXT_PUBLIC_SITE_URL=" .env.production | cut -d '=' -f2)
if [ -z "$NEXT_PUBLIC_SITE_URL" ]; then
    NEXT_PUBLIC_SITE_URL="http://localhost:3000"
    log_warning "NEXT_PUBLIC_SITE_URL not set, using default: $NEXT_PUBLIC_SITE_URL"
fi

docker build -t banking:prod \
    --build-arg NEXT_PUBLIC_SITE_URL="$NEXT_PUBLIC_SITE_URL" \
    . 2>&1 | tail -20

if [ $? -ne 0 ]; then
    log_error "Build failed. Check output above."
    exit 1
fi

# Get image size
IMAGE_SIZE=$(docker image inspect banking:prod --format='{{.Size}}')
IMAGE_SIZE_MB=$((IMAGE_SIZE / 1024 / 1024))
echo "  ✓ Image built: banking:prod (${IMAGE_SIZE_MB}MB)"
echo ""

# Step 4: Run migrations
log_step "Running database migrations..."
echo "  This may take a few minutes..."
docker compose --profile init --env-file .env.production up 2>&1 | grep -E "error|warning|success|created|migrat" || true

if [ $? -ne 0 ]; then
    log_warning "Migration may have issues. Continuing..."
fi

log_step "Stopping migration containers..."
docker compose --profile init down --remove-orphans > /dev/null 2>&1
echo "  ✓ Done"
echo ""

# Step 5: Start application
log_step "Starting application..."
docker compose --env-file .env.production up -d

# Wait for services to become healthy
echo "  Waiting for services to become healthy (this may take 30-60 seconds)..."
MAX_ATTEMPTS=60
ATTEMPT=0
UNHEALTHY=true

while [ $ATTEMPT -lt $MAX_ATTEMPTS ] && [ "$UNHEALTHY" = true ]; do
    ATTEMPT=$((ATTEMPT + 1))
    
    # Check if all services are at least "Up"
    STATUS=$(docker compose ps --format json 2>/dev/null)
    
    # Simple check: see if any service is in an error state
    if echo "$STATUS" | grep -q '"State":"exited"'; then
        sleep 2
        continue
    fi
    
    # Try health check
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        UNHEALTHY=false
        break
    fi
    
    if [ $((ATTEMPT % 10)) -eq 0 ]; then
        echo "    Attempt $ATTEMPT/$MAX_ATTEMPTS..."
    fi
    sleep 1
done

if [ "$UNHEALTHY" = true ]; then
    log_warning "Services not healthy yet. Checking status..."
    docker compose ps
else
    echo "  ✓ Services healthy"
fi
echo ""

# Step 6: Verify deployment
log_step "Verifying deployment..."
echo "  Service status:"
docker compose ps 2>/dev/null | tail -5

echo ""
echo "  Health check:"
if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "    ✓ App responding to health checks"
else
    log_warning "Health check not responding. App may still be starting."
fi

echo ""
echo "  Database connectivity:"
if docker compose exec -T db psql -U postgres -d banking -c "SELECT 1" > /dev/null 2>&1; then
    echo "    ✓ Database connected"
else
    log_error "Database connection failed"
fi

echo ""
echo "  Redis connectivity:"
if docker compose exec redis redis-cli ping > /dev/null 2>&1; then
    echo "    ✓ Redis connected"
else
    log_error "Redis connection failed"
fi

echo ""
log_step "✓ Deployment complete!"
echo ""
echo "═════════════════════════════════════════════════════════"
echo "Next steps:"
echo "  • View logs: docker compose logs -f app"
echo "  • Check health: curl http://localhost:3000/api/health"
echo "  • Stop app: docker compose down"
echo "  • Scale app: docker service scale (Docker Swarm only)"
echo ""
echo "Documentation:"
echo "  • Production guide: PRODUCTION-DEPLOYMENT.md"
echo "  • Quick reference: QUICK-REFERENCE.md"
echo "═════════════════════════════════════════════════════════"
