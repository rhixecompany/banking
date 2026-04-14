#!/bin/bash

# Log session end event

set -euo pipefail

# Skip if logging disabled
if [[ "${SKIP_LOGGING:-}" == "true" ]]; then
  exit 0
fi

# Read input from opencode
INPUT=$(cat)

# Create logs directory if it doesn't exist
mkdir -p logs/opencode

# Extract timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Log session end
echo "{\"timestamp\":\"$TIMESTAMP\",\"event\":\"sessionEnd\"}" >> logs/opencode/session.log

echo "📝 Session end logged"
exit 0
