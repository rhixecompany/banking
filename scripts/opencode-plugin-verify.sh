#!/usr/bin/env bash
# opencode-plugin-verify - Orchestrator that calls TypeScript implementation
#
# Enhanced to:
# - Use bunx opencode debug config for runtime config
# - Load project configs from multiple paths:
#   - .opencode/opencode.json (project)
#   - .opencode/tui.json (project)
#   - ~/.config/opencode/opencode.json (global)
#   - ~/.config/opencode/tui.json (global)
# - Read .opencode/report.json and docs/schema.template.md
# - Detect missing plugins, extra plugins, missing configurations, duplicates
set -euo pipefail

SCRIPT_DIR=$(dirname "$(realpath "$0")")
REPO_ROOT=$(realpath "$SCRIPT_DIR/..")

cd "$REPO_ROOT"
bunx tsx scripts/ts/opencode-plugin-verify.ts "$@"