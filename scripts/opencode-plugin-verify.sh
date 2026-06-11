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

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)

cd "$REPO_ROOT"
bunx tsx scripts/ts/opencode-plugin-verify.ts "$@"