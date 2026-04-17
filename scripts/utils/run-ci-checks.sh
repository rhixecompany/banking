#!/usr/bin/env bash

set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 [OPTIONS]

Options:
  --only=STEP1,STEP2     Run only the listed steps (comma-separated)
  --skip=STEP1,STEP2     Skip the listed steps (comma-separated)
  --report-dir=PATH      Write per-step reports to PATH (default: ./ci-reports/<timestamp>)
  -h, --help             Show this help message

Examples:
  $0
  $0 --only=format-check,type-check
  $0 --skip=test-ui,build --report-dir ./tmp/reports
EOF
}

# Default CLI-controlled variables
REPORT_DIR=""
declare -a ONLY_STEPS
declare -a SKIP_STEPS
CONTINUE_ON_FAIL=false

# Helper: trim whitespace (portable using awk)
trim() {
  local var="$*"
  echo "$var" | awk '{gsub(/^ +| +$/,"",$0); print $0}'
}

# Helper: split CSV into array (assigns to array name passed as $1)
split_csv_to_array() {
  local _out_var="$1";
  local csv="$2";
  local -a arr=();
  IFS=',' read -ra arr <<< "$csv"
  # trim each
  local -a trimmed=()
  for v in "${arr[@]}"; do
    # trim using parameter expansion (POSIX sh doesn't support this syntax but bash does)
    local tv="$v"
    # leading/trailing trim via awk-safe method
    tv="$(echo "$tv" | awk '{gsub(/^ +| +$/,"",$0); print $0}')"
    trimmed+=("$tv")
  done
  # assign to the requested variable name
  eval "${_out_var}=(\"${trimmed[@]}\")"
}

# Helper: check if value is in array
in_array() {
  local val="$1"; shift
  local arr=("$@")
  for e in "${arr[@]}"; do
    if [[ "$e" == "$val" ]]; then
      return 0
    fi
  done
  return 1
}

# Parse CLI args (support --key=value and --key value)
while [[ $# -gt 0 ]]; do
  case "$1" in
    --only=*)
      split_csv_to_array ONLY_STEPS "${1#--only=}"
      shift
      ;;
    --only)
      shift
      split_csv_to_array ONLY_STEPS "$1"
      shift
      ;;
    --skip=*)
      split_csv_to_array SKIP_STEPS "${1#--skip=}"
      shift
      ;;
    --skip)
      shift
      split_csv_to_array SKIP_STEPS "$1"
      shift
      ;;
    --report-dir=*)
      REPORT_DIR="${1#--report-dir=}"
      shift
      ;;
    --report-dir)
      shift
      REPORT_DIR="$1"
      shift
      ;;
    --continue-on-fail)
      CONTINUE_ON_FAIL=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      usage
      exit 1
      ;;
  esac
done

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

# Validate and apply --only / --skip filters and prepare REPORT_DIR
canonical_steps=("${STEPS[@]}")

if [[ -n "${ONLY_STEPS[*]:-}" && -n "${SKIP_STEPS[*]:-}" ]]; then
  echo "Cannot use --only and --skip together"
  exit 1
fi

if [[ -n "${ONLY_STEPS[*]:-}" ]]; then
  # validate and filter to keep only requested (preserve original order)
  declare -a filtered=()
  for cs in "${canonical_steps[@]}"; do
    if in_array "$cs" "${ONLY_STEPS[@]}"; then
      filtered+=("$cs")
    fi
  done
  # check unknowns
  for req in "${ONLY_STEPS[@]}"; do
    if ! in_array "$req" "${canonical_steps[@]}"; then
      echo "Unknown step in --only: $req"
      echo "Valid steps: ${canonical_steps[*]}"
      exit 1
    fi
  done
  STEPS=("${filtered[@]}")
elif [[ -n "${SKIP_STEPS[*]:-}" ]]; then
  # validate skip list
  for s in "${SKIP_STEPS[@]}"; do
    if ! in_array "$s" "${canonical_steps[@]}"; then
      echo "Unknown step in --skip: $s"
      echo "Valid steps: ${canonical_steps[*]}"
      exit 1
    fi
  done
  declare -a filtered=()
  for cs in "${canonical_steps[@]}"; do
    if ! in_array "$cs" "${SKIP_STEPS[@]}"; then
      filtered+=("$cs")
    fi
  done
  STEPS=("${filtered[@]}")
fi

if [[ ${#STEPS[@]} -eq 0 ]]; then
  echo "No steps to run after applying filters. Exiting."
  exit 1
fi

# Prepare REPORT_DIR
if [[ -z "$REPORT_DIR" ]]; then
  ts=$(date +"%Y%m%d-%H%M%S")
  REPORT_DIR="./ci-reports/$ts"
fi
mkdir -p "$REPORT_DIR"

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

  local report_path
  report_path="$REPORT_DIR/$report"

  echo "==> Running: $command"
  if bash -lc "$command" > "$report_path" 2>&1; then
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

  echo "Reports saved to: $REPORT_DIR"

  echo ""
  echo "==================== Summary ===================="
  for step in "${STEPS[@]}"; do
    local status="${RESULTS[$step]}"
    local report="${REPORTS[$step]}"
    local report_path="$REPORT_DIR/$report"
    printf "%-14s %-6s (%s)\n" "$step" "$status" "$report_path"
    if [[ "$status" == "FAIL" ]]; then
      failed_steps+=("$step")
    fi
  done
  echo "================================================"

  if [[ ${#failed_steps[@]} -gt 0 ]]; then
    echo "Failed steps: ${failed_steps[*]}"
    if [[ "$CONTINUE_ON_FAIL" == "true" ]]; then
      echo "Exiting 0 due to --continue-on-fail"
      exit 0
    fi
    exit 1
  fi

  echo "All steps passed."
}

main
