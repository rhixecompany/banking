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

# Log session start using Node.js
node -e "
const fs = require('fs');
const input = process.argv[1] || '{}';
const ts = process.argv[2];
const cwd = process.argv[3];
try {
  fs.appendFileSync('logs/opencode/session.log', JSON.stringify({timestamp: ts, event: 'sessionStart', cwd: cwd, input: JSON.parse(input)}) + '\n');
} catch(e) {
  fs.appendFileSync('logs/opencode/session.log', JSON.stringify({timestamp: ts, event: 'sessionStart', cwd: cwd, input: {}}) + '\n');
}
" "$INPUT" "$TIMESTAMP" "$CWD"

echo "📝 Session logged"
exit 0