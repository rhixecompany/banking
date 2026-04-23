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


# Log session start. Use Node.js to write JSON so the script does not depend on `jq`.
# This keeps the script portable on systems without `jq` (CI images, Windows devs).
node -e 'const fs=require("fs"); const [ts,cwd,input]=process.argv.slice(2); fs.appendFileSync("logs/opencode/session.log", JSON.stringify({timestamp:ts,event:"sessionStart",cwd:cwd,input:input})+"\n");' "$TIMESTAMP" "$CWD" "$INPUT"

echo "📝 Session logged"
exit 0
