#!/bin/bash

# Enhanced User Prompt Logger
# Logs comprehensive prompt events with metadata

set -euo pipefail

# Configuration
LOG_DIR="${LOG_DIR:-logs/opencode}"
LOG_FILE="${LOG_FILE:-$LOG_DIR/prompts.log}"
LOG_LEVEL="${LOG_LEVEL:-INFO}"
SKIP_LOGGING="${SKIP_LOGGING:-false}"

# Skip if logging disabled
if [[ "$SKIP_LOGGING" == "true" ]]; then
  echo "📝 Prompt logging disabled"
  exit 0
fi

# Ensure log directory exists
mkdir -p "$LOG_DIR"

# Read input from opencode (JSON)
INPUT=$(cat)
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID="${SESSION_ID:-unknown}"

# Build comprehensive prompt event
node -e "
const fs = require('fs');

const timestamp = process.argv[2];
const input = process.argv[3] || '{}';
const sessionId = process.env.SESSION_ID || 'unknown';
const logLevel = process.env.LOG_LEVEL || 'INFO';

let inputObj = {};
try {
  inputObj = JSON.parse(input);
} catch (e) {
  inputObj = { raw: input };
}

// Extract prompt text and calculate metrics
const promptText = inputObj.prompt || inputObj.text || inputObj.raw || '';
const promptLength = promptText.length;
const wordCount = promptText.split(/\\s+/).filter(w => w.length > 0).length;

// Detect prompt type
let promptType = 'general';
if (promptText.match(/^(create|add|build|implement)/i)) promptType = 'create';
else if (promptText.match(/^(fix|debug|repair)/i)) promptType = 'fix';
else if (promptText.match(/^(refactor|improve|optimize)/i)) promptType = 'refactor';
else if (promptText.match(/^(review|analyze|audit)/i)) promptType = 'review';
else if (promptText.match(/^(explain|what|how|why)/i)) promptType = 'query';

const event = {
  timestamp: timestamp,
  event: 'userPromptSubmitted',
  sessionId: sessionId,
  logLevel: logLevel,
  input: inputObj,
  metadata: {
    promptLength: promptLength,
    wordCount: wordCount,
    promptType: promptType,
    hasCode: promptText.includes(String.fromCharCode(96,96,96)) || promptText.includes('function') || promptText.includes('const ')
  }
};

const logFile = process.env.LOG_FILE || 'logs/opencode/prompts.log';
fs.appendFileSync(logFile, JSON.stringify(event) + '\n');

console.log('📝 Prompt logged: ' + promptType + ' (' + wordCount + ' words)');
" "$TIMESTAMP" "$INPUT"

exit 0