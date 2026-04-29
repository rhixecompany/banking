#!/bin/bash

# Enhanced Session Start Logger
# Logs comprehensive session start events with full metadata

set -euo pipefail

# Configuration
LOG_DIR="${LOG_DIR:-logs/opencode}"
LOG_FILE="${LOG_FILE:-$LOG_DIR/session.log}"
LOG_LEVEL="${LOG_LEVEL:-INFO}"
SKIP_LOGGING="${SKIP_LOGGING:-false}"

# Skip if logging disabled
if [[ "$SKIP_LOGGING" == "true" ]]; then
  echo "📝 Session logging disabled"
  exit 0
fi

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Read input from opencode (JSON)
INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CWD=$(pwd)

# Extract session metadata if provided
SESSION_ID="${SESSION_ID:-$(date +%s)}"
MODEL="${MODEL:-unknown}"
AGENT_TYPE="${AGENT_TYPE:-opencode}"

# Build comprehensive session start event
node -e "
const fs = require('fs');
const path = require('path');

const timestamp = process.argv[2];
const cwd = process.argv[3];
const input = process.argv[4] || '{}';
const sessionId = process.env.SESSION_ID || 'session-' + Date.now();
const model = process.env.MODEL || 'unknown';
const agentType = process.env.AGENT_TYPE || 'opencode';
const logLevel = process.env.LOG_LEVEL || 'INFO';

let inputObj = {};
try {
  inputObj = JSON.parse(input);
} catch (e) {
  inputObj = { raw: input };
}

const event = {
  timestamp: timestamp,
  event: 'sessionStart',
  sessionId: sessionId,
  cwd: cwd,
  model: model,
  agentType: agentType,
  logLevel: logLevel,
  input: inputObj,
  metadata: {
    platform: process.platform,
    nodeVersion: process.version,
    workingDirectory: cwd,
    sessionStartTime: timestamp
  }
};

const logFile = process.env.LOG_FILE || 'logs/opencode/session.log';
fs.appendFileSync(logFile, JSON.stringify(event) + '\n');

console.log('📝 Session started: ' + sessionId);
" "$TIMESTAMP" "$CWD" "$INPUT"

exit 0