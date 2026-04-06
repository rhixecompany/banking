#!/bin/bash
# build.sh - Docker build automation script for Banking App
# Usage: ./scripts/build.sh [options]
#   --skip-migrations    Skip database migrations
#   --env-file FILE      Use specific env file (default: .envs/production/.env.production)
#   --help              Show this help message

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Default values
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".envs/production/.env.production"
SKIP_MIGRATIONS=false

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_step() {
    echo -e "${GREEN}[STEP]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Show help
show_help() {
    echo "Banking App - Docker Build Script"
    echo ""
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --skip-migrations    Skip database migrations"
    echo "  --env-file FILE      Use specific env file (default: .envs/production/.env.production)"
    echo "  --help              Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                          # Build with default settings"
    echo "  $0 --skip-migrations        # Build without running migrations"
    echo "  $0 --env-file .env.local    # Use local env file"
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-migrations)
            SKIP_MIGRATIONS=true
            shift
            ;;
        --env-file)
            ENV_FILE="$2"
            shift 2
            ;;
        --help|-h)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║  Banking App - Docker Build Script                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Verify prerequisites
log_step "Verifying prerequisites..."
echo "  Checking Docker..."
if ! command -v docker &> /dev/null; then
    log_error "Docker not found. Please install Docker."
    exit 1
fi
echo "  ✓ Docker $(docker --version)"

echo "  Checking Docker Compose..."
if ! docker compose version &> /dev/null; then
    log_error "Docker Compose not found. Please install Docker Compose."
    exit 1
fi
echo "  ✓ Docker Compose installed"
echo ""

# Step 2: Check/Generate environment file
log_step "Verifying environment configuration..."

# Check if env file exists
if [ ! -f "$ENV_FILE" ]; then
    log_warning "$ENV_FILE not found"
    echo "  Attempting to generate using generate-env.sh..."
    
    if [ -f "generate-env.sh" ]; then
        bash generate-env.sh
        log_success "Environment file generated"
    else
        log_error "generate-env.sh not found. Please create $ENV_FILE manually."
        exit 1
    fi
fi

# Check for placeholders that need auto-generation
log_step "Checking required secrets..."

# Load env file
set -a
source "$ENV_FILE" 2>/dev/null || true
set +a

# Generate secrets if missing (with warning)
MISSING_SECRETS=false

if [ -z "$ENCRYPTION_KEY" ] || [ "$ENCRYPTION_KEY" = "CHANGE_ME_TO_SECURE_32_CHAR_RANDOM_VALUE" ]; then
    log_warning "ENCRYPTION_KEY is missing or uses placeholder - auto-generating"
    export ENCRYPTION_KEY=$(openssl rand -hex 32 2>/dev/null || openssl rand -base64 32)
    MISSING_SECRETS=true
fi

if [ -z "$NEXTAUTH_SECRET" ] || [ "$NEXTAUTH_SECRET" = "CHANGE_ME_TO_SECURE_32_CHAR_RANDOM_VALUE" ]; then
    log_warning "NEXTAUTH_SECRET is missing or uses placeholder - auto-generating"
    export NEXTAUTH_SECRET=$(openssl rand -base64 32 2>/dev/null || openssl rand -hex 32)
    MISSING_SECRETS=true
fi

if [ -z "$DWOLLA_BASE_URL" ]; then
    log_warning "DWOLLA_BASE_URL not set - using default: https://api-sandbox.dwolla.com"
    export DWOLLA_BASE_URL="https://api-sandbox.dwolla.com"
fi

if [ -z "$DWOLLA_ENV" ]; then
    log_warning "DWOLLA_ENV not set - using default: sandbox"
    export DWOLLA_ENV="sandbox"
fi

if [ "$MISSING_SECRETS" = true ]; then
    log_warning "⚠️  Auto-generated secrets are FOR DEVELOPMENT/TESTING ONLY"
    log_warning "⚠️  For production, use real secrets in $ENV_FILE"
    echo ""
fi

echo "  ✓ Environment configured"
echo ""

# Step 3: Build Docker image
log_step "Building Docker image..."
echo "  Using: $COMPOSE_FILE"
echo "  Env:   $ENV_FILE"
echo ""

docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" build --no-cache

if [ $? -ne 0 ]; then
    log_error "Build failed. Check output above."
    exit 1
fi

# Get image info
IMAGE_SIZE=$(docker image inspect banking:prod --format='{{.Size}}' 2>/dev/null || echo "unknown")
IMAGE_SIZE_MB=$((IMAGE_SIZE / 1024 / 1024))
echo ""
log_success "Image built: banking:prod (${IMAGE_SIZE_MB}MB)"
echo ""

# Step 4: Run migrations (optional)
if [ "$SKIP_MIGRATIONS" = false ]; then
    log_step "Running database migrations..."
    echo "  Starting init service..."
    
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile init up
    
    if [ $? -ne 0 ]; then
        log_warning "Migration may have issues. Check logs above."
    else
        log_success "Migrations completed"
    fi
    
    echo ""
    log_step "Stopping migration containers..."
    docker compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" --profile init down --remove-orphans > /dev/null 2>&1 || true
    echo "  ✓ Done"
    echo ""
else
    log_info "Skipping migrations (--skip-migrations flag set)"
    echo ""
fi

# Step 5: Final status
log_success "Build complete!"
echo ""
echo "═════════════════════════════════════════════════════════"
echo "Next steps:"
echo "  • Start application:"
echo "    docker compose -f $COMPOSE_FILE --env-file $ENV_FILE up -d"
echo ""
echo "  • View logs:"
echo "    docker compose -f $COMPOSE_FILE --env-file $ENV_FILE logs -f app"
echo ""
echo "  • Check health:"
echo "    curl http://localhost:3000/api/health"
echo ""
echo "  • Stop application:"
echo "    docker compose -f $COMPOSE_FILE --env-file $ENV_FILE down"
echo ""
echo "  • Full cleanup (remove volumes):"
echo "    docker compose -f $COMPOSE_FILE --env-file $ENV_FILE down -v"
echo "═════════════════════════════════════════════════════════"
echo ""