#!/bin/bash

# Tool Call Logger
# Logs tool execution events for audit and analysis

set -euo pipefail

# Configuration
LOG_DIR="${LOG_DIR:-logs/opencode}"
LOG_FILE="${LOG_FILE:-$LOG_DIR/tools.log}"
LOG_LEVEL="${LOG_LEVEL:-INFO}"
SKIP_LOGGING="${SKIP_LOGGING:-false}"

# Skip if logging disabled or not in detailed mode
if [[ "$SKIP_LOGGING" == "true" ]]; then
  exit 0
fi
if [[ "${LOG_LEVEL}" != "DEBUG" && "${LOG_LEVEL}" != "TRACE" ]]; then
  exit 0
fi

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Read input from opencode (JSON)
INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID="${SESSION_ID:-unknown}"

# Build tool call event
node -e "
const fs = require('fs');

const timestamp = process.argv[2];
const input = process.argv[3] || '{}';
const sessionId = process.env.SESSION_ID || 'unknown';

let inputObj = {};
try {
  inputObj = JSON.parse(input);
} catch (e) {
  inputObj = { raw: input };
}

const toolName = inputObj.tool || inputObj.name || 'unknown';
const args = inputObj.args || {};
const success = inputObj.success !== false;

const event = {
  timestamp: timestamp,
  event: 'toolCall',
  sessionId: sessionId,
  toolName: toolName,
  success: success,
  input: inputObj,
  metadata: {
    argsCount: Object.keys(args).length,
    hasFiles: !!inputObj.files,
    hasResult: !!inputObj.result
  }
};

const logFile = process.env.LOG_FILE || 'logs/opencode/tools.log';
fs.appendFileSync(logFile, JSON.stringify(event) + '\n');
" "$TIMESTAMP" "$INPUT"

exit 0