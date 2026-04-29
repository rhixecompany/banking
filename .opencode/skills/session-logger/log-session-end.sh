#!/bin/bash

# Enhanced Session End Logger
# Logs comprehensive session end events with duration and summary

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

# Session ID and duration
SESSION_ID="${SESSION_ID:-$(date +%s)}"
SESSION_START="${SESSION_START:-}"

# Build comprehensive session end event
node -e "
const fs = require('fs');

const timestamp = process.argv[2];
const input = process.argv[3] || '{}';
const sessionId = process.env.SESSION_ID || 'unknown';
const sessionStart = process.env.SESSION_START || '';
const logLevel = process.env.LOG_LEVEL || 'INFO';

let inputObj = {};
try {
  inputObj = JSON.parse(input);
} catch (e) {
  inputObj = { raw: input };
}

// Calculate duration if session start is known
let duration = null;
if (sessionStart) {
  const start = new Date(sessionStart);
  const end = new Date(timestamp);
  duration = Math.round((end - start) / 1000); // seconds
}

const event = {
  timestamp: timestamp,
  event: 'sessionEnd',
  sessionId: sessionId,
  logLevel: logLevel,
  input: inputObj,
  metadata: {
    sessionDuration: duration,
    sessionEndTime: timestamp,
    exitCode: process.env.EXIT_CODE || 'success'
  }
};

const logFile = process.env.LOG_FILE || 'logs/opencode/session.log';
fs.appendFileSync(logFile, JSON.stringify(event) + '\n');

console.log('📝 Session ended: ' + sessionId + (duration ? ' (' + duration + 's)' : ''));
" "$TIMESTAMP" "$INPUT"

exit 0