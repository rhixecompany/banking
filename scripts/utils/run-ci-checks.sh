#!/usr/bin/env bash

set -euo pipefail

declare -a STEPS
declare -A COMMANDS
declare -A REPORTS
declare -A RESULTS

STEPS=(
  "format-check"
  "type-check"
  "lint-fix"
  "lint-strict"
  "build-debug"
  "test-browser"
  "test-ui"
  "build"
)

COMMANDS["format-check"]="npm run format:check"
COMMANDS["type-check"]="npm run type-check"
COMMANDS["lint-fix"]="npm run lint:fix"
COMMANDS["lint-strict"]="npm run lint:strict"
COMMANDS["build-debug"]="npm run build:debug"
COMMANDS["test-browser"]="npm run test:browser"
COMMANDS["test-ui"]="npm run test:ui"
COMMANDS["build"]="npm run build"

REPORTS["format-check"]="format-check-report.txt"
REPORTS["type-check"]="type-check-report.txt"
REPORTS["lint-fix"]="lint-fix-report.txt"
REPORTS["lint-strict"]="lint-strict-report.txt"
REPORTS["build-debug"]="build-debug-report.txt"
REPORTS["test-browser"]="test-browser-report.txt"
REPORTS["test-ui"]="test-ui-report.txt"
REPORTS["build"]="build-report.txt"

run_step() {
  local step="$1"
  local command="${COMMANDS[$step]}"
  local report="${REPORTS[$step]}"

  echo "==> Running: $command"
  if bash -lc "$command" > "$report" 2>&1; then
    RESULTS[$step]="PASS"
  else
    RESULTS[$step]="FAIL"
  fi
}

main() {
  local failed_steps=()

  for step in "${STEPS[@]}"; do
    run_step "$step"
  done

  echo ""
  echo "==================== Summary ===================="
  for step in "${STEPS[@]}"; do
    local status="${RESULTS[$step]}"
    local report="${REPORTS[$step]}"
    printf "%-14s %-6s (%s)\n" "$step" "$status" "$report"
    if [[ "$status" == "FAIL" ]]; then
      failed_steps+=("$step")
    fi
  done
  echo "================================================"

  if [[ ${#failed_steps[@]} -gt 0 ]]; then
    echo "Failed steps: ${failed_steps[*]}"
    exit 1
  fi

  echo "All steps passed."
}

main
