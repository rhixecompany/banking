#!/usr/bin/env bash
# Bash helper to diagnose git issues and optionally remove .git/index.lock
set -euo pipefail

echo "=== Git Diagnose & Fix ==="

if ! command -v git >/dev/null 2>&1; then
  echo "git not found in PATH. Please install git and retry."
  exit 0
fi

echo "git is available: $(git --version)"

echo "\n--- git status (porcelain) ---"
git status --porcelain || true

LOCK_PATH=".git/index.lock"
if [ -f "$LOCK_PATH" ]; then
  echo "\nFound $LOCK_PATH"
  read -r -p "Remove index.lock? (yes/no) " resp
  if [[ "$resp" == "yes" || "$resp" == "y" ]]; then
    # check for git processes
    if pgrep -f git >/dev/null 2>&1; then
      echo "Found running git processes. Please ensure no git commands are running and try again." >&2
    else
      if rm -f "$LOCK_PATH"; then
        echo "Removed index.lock"
      else
        echo "Failed to remove index.lock" >&2
      fi
    fi
  else
    echo "Skipping removal of index.lock"
  fi
else
  echo "No .git/index.lock present."
fi

echo "\nAttempting: git add -A"
if output=$(git add -A 2>&1); then
  echo "--- git add output ---"
  echo "$output"
  echo "git add succeeded."
  exit 0
else
  exit_code=$?
  echo "--- git add output ---"
  echo "$output"
  echo "git add failed with exit code $exit_code" >&2
  echo "Suggestion: check file permissions, .gitignore, or run 'git status' to inspect changes." >&2
  exit $exit_code
fi
