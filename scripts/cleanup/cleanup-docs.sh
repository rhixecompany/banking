#!/bin/bash
# cleanup-docs.sh - Documentation cleanup script
# Usage: ./scripts/cleanup/cleanup-docs.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Documentation Cleanup Script                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo ""

# Arrays to categorize files
declare -a CORE_KEEP=()
declare -a DOCKER_KEEP=()
declare -a INTEGRATION_KEEP=()
declare -a SWARM_DELETE=()
declare -a LEGACY_DELETE=()
declare -a ORPHANED_DELETE=()
declare -a OTHER_DELETE=()

# Scan markdown files
echo -e "${BLUE}Scanning documentation files...${NC}"
echo ""

# Find all .md files excluding node_modules, .cursor, .github, .opencode
while IFS= read -r file; do
    rel_path="${file#$PROJECT_ROOT/}"
    
    # Core files to keep
    if [[ "$rel_path" == "README.md" ]] || [[ "$rel_path" == "AGENTS.md" ]]; then
        CORE_KEEP+=("$rel_path")
        continue
    fi
    
    # Docker docs to keep
    if [[ "$rel_path" == docs/docker/* ]]; then
        DOCKER_KEEP+=("$rel_path")
        continue
    fi
    
    # Integration docs to keep (linked in docs/README.md)
    if [[ "$rel_path" == docs/plaid/* ]] || \
       [[ "$rel_path" == docs/services/plaid-api.md ]] || \
       [[ "$rel_path" == docs/services/dwolla-api.md ]] || \
       [[ "$rel_path" == docs/services/react-patterns.md ]] || \
       [[ "$rel_path" == docs/services/shadcn-studio.md ]] || \
       [[ "$rel_path" == docs/services/shadcn-ui.md ]] || \
       [[ "$rel_path" == docs/plaid-quickstart.md ]] || \
       [[ "$rel_path" == docs/plaid-link.md ]] || \
       [[ "$rel_path" == docs/plaid-transactions.md ]] || \
       [[ "$rel_path" == docs/plaid-auth.md ]] || \
       [[ "$rel_path" == docs/plaid-balance.md ]] || \
       [[ "$rel_path" == docs/dwolla-context.md ]] || \
       [[ "$rel_path" == docs/dwolla-send-money.md ]] || \
       [[ "$rel_path" == docs/dwolla-transfer-between-users.md ]] || \
       [[ "$rel_path" == docs/react-bits.md ]] || \
       [[ "$rel_path" == docs/shadcn-ui-intro.md ]] || \
       [[ "$rel_path" == docs/shadcn.md ]]; then
        INTEGRATION_KEEP+=("$rel_path")
        continue
    fi
    
    # Docker Swarm files to delete
    if [[ "$rel_path" == "docs/docker/swarm-overview.md" ]] || \
       [[ "$rel_path" == "docs/traefik/docker-swarm.md" ]]; then
        SWARM_DELETE+=("$rel_path")
        continue
    fi
    
    # Legacy deployment docs (superseded by docs/docker/)
    if [[ "$rel_path" == "00-DOCKER-START-HERE.md" ]] || \
       [[ "$rel_path" == "00-START-HERE.md" ]] || \
       [[ "$rel_path" == "DOCKER-COMMANDS.md" ]] || \
       [[ "$rel_path" == "DOCKER-CONFIG-SUMMARY.md" ]] || \
       [[ "$rel_path" == "DOCKER-DEPLOYMENT.md" ]] || \
       [[ "$rel_path" == "DOCKER-IMPLEMENTATION.md" ]] || \
       [[ "$rel_path" == "DOCKER-INDEX.md" ]] || \
       [[ "$rel_path" == "DOCKER-MANIFEST.md" ]] || \
       [[ "$rel_path" == "DOCKER-QUICK-START.md" ]] || \
       [[ "$rel_path" == "DOCKER-SETUP-CHECKLIST.md" ]] || \
       [[ "$rel_path" == "DOCKER-SETUP.md" ]] || \
       [[ "$rel_path" == "DOCKER-SUMMARY.md" ]] || \
       [[ "$rel_path" == "DOCKERFILE-EXPLANATION.md" ]] || \
       [[ "$rel_path" == "DEPLOYMENT-MIGRATION.md" ]] || \
       [[ "$rel_path" == "PRODUCTION-DEPLOYMENT.md" ]]; then
        LEGACY_DELETE+=("$rel_path")
        continue
    fi
    
    # Root-level redundant docs
    if [[ "$rel_path" == "INDEX.md" ]] || \
       [[ "$rel_path" == "QUICK-REFERENCE.md" ]] || \
       [[ "$rel_path" == "ARCHITECTURE.md" ]] || \
       [[ "$rel_path" == "SECURITY.md" ]] || \
       [[ "$rel_path" == "OPTIMIZATION-SUMMARY.md" ]] || \
       [[ "$rel_path" == "MARKETPLACE.md" ]] || \
       [[ "$rel_path" == "CONTRIBUTING.md" ]] || \
       [[ "$rel_path" == "SUPPORT.md" ]] || \
       [[ "$rel_path" == "setupTasks.md" ]] || \
       [[ "$rel_path" == "blocks.prompts.md" ]] || \
       [[ "$rel_path" == "README.opencode.md" ]]; then
        OTHER_DELETE+=("$rel_path")
        continue
    fi
    
    # Legacy traefik docs (superseded by compose/traefik/)
    if [[ "$rel_path" == docs/traefik/* ]]; then
        LEGACY_DELETE+=("$rel_path")
        continue
    fi
    
    # Reports to delete (old)
    if [[ "$rel_path" == docs/reports/* ]]; then
        OTHER_DELETE+=("$rel_path")
        continue
    fi
    
    # docs/ root level - check if linked
    if [[ "$rel_path" == docs/* ]] && [[ ! "$rel_path" == docs/README.md ]]; then
        # ESLint plugin docs - might be useful but redundant
        if [[ "$rel_path" == docs/eslint-plugin-*-context.md ]]; then
            OTHER_DELETE+=("$rel_path")
            continue
        fi
        # Keep all other docs/ files for now
        OTHER_DELETE+=("$rel_path")
        continue
    fi
    
done < <(find "$PROJECT_ROOT" -name "*.md" -not -path "*/node_modules/*" -not -path "*/.cursor/*" -not -path "*/.github/*" -not -path "*/.opencode/node_modules/*" -not -path "*/.opencode/*" -not -path "*/data/*" -type f 2>/dev/null)

# Display categorized files
echo -e "${GREEN}=== Documentation Scan Results ===${NC}"
echo ""

echo -e "${GREEN}Category A - Docker Docs (Keep): ${#DOCKER_KEEP[@]} files${NC}"
for f in "${DOCKER_KEEP[@]}"; do echo "  ✓ $f"; done
echo ""

echo -e "${GREEN}Category B - Integration Docs (Keep): ${#INTEGRATION_KEEP[@]} files${NC}"
for f in "${INTEGRATION_KEEP[@]}"; do echo "  ✓ $f"; done
echo ""

echo -e "${RED}Category C - Docker Swarm (Delete): ${#SWARM_DELETE[@]} files${NC}"
for f in "${SWARM_DELETE[@]}"; do echo "  ✗ $f"; done
echo ""

echo -e "${RED}Category D - Legacy Docker Docs (Delete): ${#LEGACY_DELETE[@]} files${NC}"
for f in "${LEGACY_DELETE[@]}"; do echo "  ✗ $f"; done
echo ""

echo -e "${RED}Category E - Other Root Docs (Review): ${#OTHER_DELETE[@]} files${NC}"
for f in "${OTHER_DELETE[@]}"; do echo "  ? $f"; done
echo ""

# Summary
TOTAL_DELETE=$((${#SWARM_DELETE[@]} + ${#LEGACY_DELETE[@]} + ${#OTHER_DELETE[@]}))
echo "═══════════════════════════════════════════════════════════"
echo -e "${BLUE}Summary:${NC}"
echo "  Files to keep: $((${#CORE_KEEP[@]} + ${#DOCKER_KEEP[@]} + ${#INTEGRATION_KEEP[@]}))"
echo -e "  Files to review/delete: ${RED}$TOTAL_DELETE${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""

# Confirmation
echo -e "${YELLOW}Actions available:${NC}"
echo "  1) Delete Docker Swarm files only"
echo "  2) Delete legacy Docker docs only"
echo "  3) Delete all identified files"
echo "  4) Delete specific categories"
echo "  5) Exit (no changes)"
echo ""

read -p "Select action [1-5]: " action

case $action in
    1)
        echo -e "${YELLOW}Deleting Docker Swarm files...${NC}"
        for f in "${SWARM_DELETE[@]}"; do
            rm -f "$PROJECT_ROOT/$f"
            echo "  Deleted: $f"
        done
        ;;
    2)
        echo -e "${YELLOW}Deleting legacy Docker docs...${NC}"
        for f in "${LEGACY_DELETE[@]}"; do
            rm -f "$PROJECT_ROOT/$f"
            echo "  Deleted: $f"
        done
        ;;
    3)
        read -p "Delete ALL identified files? This cannot be undone! (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            echo -e "${YELLOW}Deleting all files...${NC}"
            for f in "${SWARM_DELETE[@]}" "${LEGACY_DELETE[@]}" "${OTHER_DELETE[@]}"; do
                rm -f "$PROJECT_ROOT/$f"
                echo "  Deleted: $f"
            done
        else
            echo "Cancelled."
            exit 0
        fi
        ;;
    4)
        echo -e "${YELLOW}Select categories to delete:${NC}"
        echo "  a) Docker Swarm files"
        echo "  b) Legacy Docker docs"
        echo "  c) Other root docs"
        read -p "Enter letters (e.g., ab, ac): " categories
        ;;
    5)
        echo "Exiting without changes."
        exit 0
        ;;
    *)
        echo "Invalid option."
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}Cleanup complete!${NC}"
