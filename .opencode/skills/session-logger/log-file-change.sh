#!/bin/bash

# File Change Logger
# Logs file modification events for audit and analysis

set -euo pipefail

# Configuration
LOG_DIR="${LOG_DIR:-logs/opencode}"
LOG_FILE="${LOG_FILE:-$LOG_DIR/files.log}"
LOG_LEVEL="${LOG_LEVEL:-INFO}"
SKIP_LOGGING="${SKIP_LOGGING:-false}"

# Skip if logging disabled
if [[ "$SKIP_LOGGING" == "true" ]]; then
  exit 0
fi

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Read input from opencode (JSON)
INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID="${SESSION_ID:-unknown}"

# Build file change event
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

const filePath = inputObj.path || inputObj.file || 'unknown';
const action = inputObj.action || inputObj.type || 'modified';
const linesChanged = inputObj.linesChanged || inputObj.lineCount || 0;

const event = {
  timestamp: timestamp,
  event: 'fileChange',
  sessionId: sessionId,
  filePath: filePath,
  action: action,
  input: inputObj,
  metadata: {
    linesChanged: linesChanged,
    isNew: action === 'created',
    isDeleted: action === 'deleted'
  }
};

const logFile = process.env.LOG_FILE || 'logs/opencode/files.log';
fs.appendFileSync(logFile, JSON.stringify(event) + '\n');
" "$TIMESTAMP" "$INPUT"

exit 0