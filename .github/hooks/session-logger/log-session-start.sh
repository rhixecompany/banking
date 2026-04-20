#!/bin/bash

# Log session start event

set -euo pipefail

# Skip if logging disabled
if [[ "${SKIP_LOGGING:-}" == "true" ]]; then
  exit 0
fi

# Read input from opencode
INPUT=$(cat)

# Create logs directory if it doesn't exist
mkdir -p logs/opencode

# Extract timestamp and session info
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CWD=$(pwd)

# Log session start (use jq for proper JSON encoding)
jq -Rn --arg timestamp "$TIMESTAMP" --arg cwd "$CWD" '{"timestamp":$timestamp,"event":"sessionStart","cwd":$cwd}' >> logs/opencode/session.log

echo "📝 Session logged"
exit 0
