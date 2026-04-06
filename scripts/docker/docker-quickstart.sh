#!/bin/bash
# docker-quickstart.sh - Interactive Docker Quick Start for Banking Application
# Usage: ./scripts/docker/docker-quickstart.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_docker() {
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}Error: Docker is not installed${NC}"
        exit 1
    fi
}

show_menu() {
    echo -e "\n${GREEN}=== Banking Application Docker Quick Start ===${NC}"
    echo "1. Start development environment (with Traefik)"
    echo "2. Start local environment (no Traefik, direct ports)"
    echo "3. Start with monitoring (Prometheus + Grafana)"
    echo "4. Stop all containers"
    echo "5. View application logs"
    echo "6. Build images"
    echo "7. Run database migrations"
    echo "8. Clean up volumes & restart"
    echo "9. View services status"
    echo "10. Exit"
    echo ""
}

start_default() {
    echo -e "${YELLOW}Starting default environment (with Traefik)...${NC}"
    
    if [ ! -f "${PROJECT_ROOT}/.envs/local/.env.local" ]; then
        echo -e "${RED}Error: .envs/local/.env.local not found${NC}"
        echo "Please create .envs/local/.env.local file with required variables"
        return 1
    fi
    
    cd "${PROJECT_ROOT}"
    docker compose -f docker-compose.yml --env-file .envs/local/.env.local up -d
    echo -e "${GREEN}✓ Default environment started${NC}"
    echo "Application: http://localhost"
    echo "Traefik Dashboard: https://traefik.localhost"
}

start_local() {
    echo -e "${YELLOW}Starting local environment (no Traefik)...${NC}"
    
    if [ ! -f "${PROJECT_ROOT}/.envs/local/.env.local" ]; then
        echo -e "${RED}Error: .envs/local/.env.local not found${NC}"
        return 1
    fi
    
    cd "${PROJECT_ROOT}"
    docker compose --profile local --env-file .envs/local/.env.local up -d
    echo -e "${GREEN}✓ Local environment started${NC}"
    echo "Application: http://localhost:3000"
    echo "Database: localhost:5432"
    echo "Redis: localhost:6379"
}

start_monitoring() {
    echo -e "${YELLOW}Starting with monitoring stack...${NC}"
    
    if [ ! -f "${PROJECT_ROOT}/.envs/local/.env.local" ]; then
        echo -e "${RED}Error: .envs/local/.env.local not found${NC}"
        return 1
    fi
    
    cd "${PROJECT_ROOT}"
    docker compose --profile monitoring --env-file .envs/local/.env.local up -d
    echo -e "${GREEN}✓ Monitoring stack started${NC}"
    echo "Application: http://localhost"
    echo "Prometheus: http://prometheus.localhost:9090"
    echo "Grafana: https://grafana.localhost"
}

stop_all() {
    echo -e "${YELLOW}Stopping all containers...${NC}"
    cd "${PROJECT_ROOT}"
    docker compose down
    echo -e "${GREEN}✓ All containers stopped${NC}"
}

view_logs() {
    cd "${PROJECT_ROOT}"
    docker compose logs -f
}

build_images() {
    echo -e "${YELLOW}Building Docker images...${NC}"
    cd "${PROJECT_ROOT}"
    docker compose build
    echo -e "${GREEN}✓ Images built${NC}"
}

migrate_db() {
    echo -e "${YELLOW}Running database migrations...${NC}"
    cd "${PROJECT_ROOT}"
    docker compose --profile init --env-file .envs/local/.env.local up
    docker compose --profile init down
    echo -e "${GREEN}✓ Migrations completed${NC}"
}

cleanup() {
    read -p "This will remove all containers and volumes. Continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo "Cancelled"
        return 0
    fi
    
    cd "${PROJECT_ROOT}"
    docker compose down -v
    echo -e "${GREEN}✓ Cleanup completed${NC}"
}

show_status() {
    cd "${PROJECT_ROOT}"
    echo -e "\n${GREEN}Docker Containers:${NC}"
    docker compose ps
    
    echo -e "\n${GREEN}Docker Volumes:${NC}"
    docker volume ls | grep banking || echo "No banking volumes found"
}

main() {
    check_docker
    
    while true; do
        show_menu
        read -p "Select option [1-10]: " choice
        
        case $choice in
            1) start_default ;;
            2) start_local ;;
            3) start_monitoring ;;
            4) stop_all ;;
            5) view_logs ;;
            6) build_images ;;
            7) migrate_db ;;
            8) cleanup && start_default ;;
            9) show_status ;;
            10)
                echo "Goodbye!"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option${NC}"
                ;;
        esac
        
        read -p "Press Enter to continue..."
    done
}

main
