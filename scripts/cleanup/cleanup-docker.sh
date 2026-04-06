#!/bin/bash
# cleanup-docker.sh - Aggressive Docker cleanup
# Usage: ./scripts/cleanup/cleanup-docker.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Docker Aggressive Cleanup Script             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    exit 1
fi

# Show current Docker disk usage
show_disk_usage() {
    echo -e "${BLUE}Current Docker Disk Usage:${NC}"
    docker system df
    echo ""
}

# List items before cleanup
list_items() {
    echo -e "${BLUE}Listing items to be cleaned:${NC}"
    echo ""
    
    # Dangling images
    DANGLING=$(docker images -f "dangling=true" -q 2>/dev/null | wc -l)
    if [ "$DANGLING" -gt 0 ]; then
        echo -e "${YELLOW}Dangling images: $DANGLING${NC}"
        docker images -f "dangling=true"
    else
        echo "Dangling images: 0"
    fi
    echo ""
    
    # Stopped containers
    STOPPED=$(docker ps -a -f status=exited -q 2>/dev/null | wc -l)
    if [ "$STOPPED" -gt 0 ]; then
        echo -e "${YELLOW}Stopped containers: $STOPPED${NC}"
        docker ps -a -f status=exited
    else
        echo "Stopped containers: 0"
    fi
    echo ""
    
    # Unused networks
    UNUSED_NETWORKS=$(docker network ls -f dangling=true -q 2>/dev/null | wc -l)
    if [ "$UNUSED_NETWORKS" -gt 0 ]; then
        echo -e "${YELLOW}Unused networks: $UNUSED_NETWORKS${NC}"
        docker network ls -f dangling=true
    else
        echo "Unused networks: 0"
    fi
    echo ""
    
    # Unused images
    UNUSED_IMAGES=$(docker images -a --format '{{.Repository}}:{{.Tag}}' | grep -v '<none>' | tail -n +2 | wc -l)
    if [ "$UNUSED_IMAGES" -gt 0 ]; then
        echo -e "${YELLOW}Unused images: $UNUSED_IMAGES${NC}"
        docker images -a | grep -v REPOSITORY | tail -10
    else
        echo "Unused images: 0"
    fi
    echo ""
    
    # Build cache
    CACHE_SIZE=$(docker system df --format '{{.Size}}' 2>/dev/null | tail -1)
    echo -e "${YELLOW}Build cache size: $CACHE_SIZE${NC}"
    echo ""
}

# Aggressive cleanup
aggressive_cleanup() {
    echo -e "${GREEN}Starting aggressive cleanup...${NC}"
    echo ""
    
    echo -e "${YELLOW}Step 1: Removing dangling images...${NC}"
    docker image prune -f
    echo ""
    
    echo -e "${YELLOW}Step 2: Removing stopped containers...${NC}"
    docker container prune -f
    echo ""
    
    echo -e "${YELLOW}Step 3: Removing unused networks...${NC}"
    docker network prune -f
    echo ""
    
    echo -e "${YELLOW}Step 4: Removing unused images...${NC}"
    docker image prune -a -f
    echo ""
    
    echo -e "${YELLOW}Step 5: Removing build cache...${NC}"
    docker builder prune -af
    echo ""
}

# Volume cleanup (with confirmation)
volume_cleanup() {
    echo ""
    echo -e "${RED}⚠️  WARNING: Volume pruning will delete persistent data!${NC}"
    echo ""
    
    # List volumes
    echo -e "${BLUE}Current volumes:${NC}"
    docker volume ls
    echo ""
    
    VOLUME_COUNT=$(docker volume ls -q | wc -l)
    if [ "$VOLUME_COUNT" -gt 0 ]; then
        echo -e "Found $VOLUME_COUNT volume(s)."
        read -p "Delete ALL unused volumes? This will delete database data! (yes/no): " confirm
        
        if [ "$confirm" = "yes" ]; then
            echo -e "${YELLOW}Removing unused volumes...${NC}"
            docker volume prune -f
            echo -e "${GREEN}Volume cleanup complete${NC}"
        else
            echo "Volume cleanup skipped."
        fi
    else
        echo "No volumes to prune."
    fi
}

# Main
echo -e "${BLUE}Step 0: Current disk usage${NC}"
show_disk_usage

echo -e "${BLUE}Step 1: Listing items to be cleaned${NC}"
list_items

read -p "Proceed with aggressive Docker cleanup? (yes/no): " confirm
if [ "$confirm" = "yes" ]; then
    aggressive_cleanup
    
    echo -e "${BLUE}Disk usage after cleanup:${NC}"
    show_disk_usage
    
    volume_cleanup
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║              Docker Cleanup Complete!                    ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"
    echo ""
else
    echo "Cleanup cancelled."
    exit 0
fi
