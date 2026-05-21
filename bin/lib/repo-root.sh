#!/bin/bash
# Common path utilities for scripts
# Source this file: source "$(dirname "$0")/../lib/repo-root.sh"

# Get the repository root directory (two levels up from this file)
get_repo_root() {
    local script_dir
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    cd "$script_dir/../.." && pwd
}

# Change to repository root
cd_to_repo_root() {
    local repo_root
    repo_root="$(get_repo_root)"
    if ! cd "$repo_root"; then
        echo "Failed to cd to repository root: $repo_root" >&2
        return 1
    fi
}
