#!/usr/bin/env bash

# shellcheck disable=SC2155,SC2034,SC2086
set -euo pipefail

usage() {
  cat <<EOF
Usage: $0 [OPTIONS]

Options:
  --only=STEP1,STEP2     Run only the listed steps (comma-separated)
  --skip=STEP1,STEP2     Skip the listed steps (comma-separated)
  --report-dir=PATH      Write per-step reports to PATH (default: ./ci-reports/<timestamp>)
  --continue-on-fail     Continue running remaining steps and exit 0 at the end even if some steps fail
  -h, --help             Show this help message

Examples:
  $0
  $0 --only=format-check,type-check
  $0 --skip=test-ui,build --report-dir ./tmp/reports
  $0 --continue-on-fail
EOF
}

# Write the ci-summary.json incrementally so partial results are available
write_summary() {
  local summary_file="$REPORT_DIR/ci-summary.json"
  {
    echo "{"
    echo "  \"timestamp\": \"$ts\","
    echo "  \"report_dir\": \"$REPORT_DIR\","
    echo "  \"steps\": ["
    local first=true
    for step in "${STEPS[@]}"; do
      if [[ "$first" == true ]]; then
        first=false
      else
        echo ","
      fi
      local status="${RESULTS[$step]:-PENDING}"
      local report_path="$REPORT_DIR/${REPORTS[$step]}"
      local code="${EXIT_CODES[$step]:-null}"
      local fb="${FALLBACKS[$step]:-false}"
      local rep_escaped
      rep_escaped=$(printf '%s' "$report_path" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
      printf '    {"name":"%s","status":"%s","report":"%s","exit_code":%s,"fallback":%s}' "$step" "$status" "$rep_escaped" "$code" "$fb"
    done
    echo ""
    echo "  ]"
    echo "}"
  } > "$summary_file.tmp"
  mv "$summary_file.tmp" "$summary_file"
}

# Default CLI-controlled variables
REPORT_DIR=""
declare -a ONLY_STEPS
declare -a SKIP_STEPS
CONTINUE_ON_FAIL=false
# target file(s) (comma-separated or glob)
FILE_ARG=""
DRY_RUN=false

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
    --file=*)
      FILE_ARG="${1#--file=}"
      shift
      ;;
    --file)
      shift
      FILE_ARG="$1"
      shift
      ;;
    -f)
      shift
      FILE_ARG="$1"
      shift
      ;;
    --dry-run)
      DRY_RUN=true
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
declare -A EXIT_CODES
declare -A FALLBACKS

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
else
  # ensure we still have a timestamp for the run
  ts=$(date +"%Y%m%d-%H%M%S")
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
  # If FILE_ARG is provided and we have a targeted command for this step, prefer the targeted invocation
  # Targeted commands (use {path} placeholder)
  declare -A TARGETED
  TARGETED["format-check"]="prettier --config .prettierrc.ts --check {path}"
  TARGETED["format"]="prettier --config .prettierrc.ts --write {path}"
  TARGETED["format:markdown"]="npx markdownlint-cli2 -c .markdownlintrc.json {path}"
  TARGETED["lint-fix"]="eslint --config eslint.config.mts --fix {path}"
  TARGETED["lint-strict"]="eslint --config eslint.config.mts --max-warnings=0 {path}"
  TARGETED["test-browser"]="vitest --config=vitest.config.ts run {path}"
  TARGETED["test-ui"]="cross-env PLAYWRIGHT_PREPARE_DB=true playwright test {path} --project=chromium"
  TARGETED["type-check"]="tsc --noEmit --pretty {path}"

  # Determine command to run
  local run_cmd="$command"
  if [[ -n "$FILE_ARG" && -n "${TARGETED[$step]:-}" ]]; then
    # Prepare files array (split on comma) to pass to tool
    IFS=',' read -ra FILES <<< "$FILE_ARG"
    local file_args=()
    for f in "${FILES[@]}"; do
      file_args+=("$f")
    done

    # substitute placeholder using a NUL-separated temp file and xargs -0
    local tpl="${TARGETED[$step]}"
    # Remove the {path} placeholder to build the command that xargs will invoke
    local cmd_no_path
    cmd_no_path="${tpl//\{path\}/}"
    # create a temp file with NUL-separated entries for robust argument passing
    local tmpfile
    tmpfile=$(mktemp -t ci-files.XXXXXX) || tmpfile="/tmp/ci-files.$$"
    for fa in "${file_args[@]}"; do
      printf '%s\0' "$fa" >> "$tmpfile"
    done
    # Build run_cmd to use xargs -0 to invoke the tool safely; ensure temp file is removed after
    run_cmd="xargs -0 < \"$tmpfile\" -- $cmd_no_path; rv=$?; rm -f \"$tmpfile\"; exit $rv"
  else
    # no file arg or no targeted template: run normal command
    run_cmd="$command"
  fi

  # Helper: map step to primary tool name for detection
  declare -A TOOL
  TOOL["format-check"]="prettier"
  TOOL["format"]="prettier"
  TOOL["format:markdown"]="markdownlint-cli2"
  TOOL["lint-fix"]="eslint"
  TOOL["lint-strict"]="eslint"
  TOOL["test-browser"]="vitest"
  TOOL["test-ui"]="playwright"
  TOOL["type-check"]="tsc"

  # If targeted command requested, detect tool availability; else fallback to npm script
    local attempted_fallback=0
  if [[ -n "$FILE_ARG" && -n "${TARGETED[$step]:-}" ]]; then
    local toolname="${TOOL[$step]:-}"
    if ! command -v "$toolname" >/dev/null 2>&1; then
      # write fallback note to report and switch to npm run <script>
      echo "Tool $toolname not found on PATH; falling back to '${COMMANDS[$step]}'" > "$report_path"
      run_cmd="${COMMANDS[$step]}"
      attempted_fallback=1
    fi
  fi

   # Run the command and capture exit code so we can produce a machine-readable summary
   if [[ "${DRY_RUN}" == "true" ]]; then
     echo "[DRY-RUN] $run_cmd" > "$report_path"
     EXIT_CODES[$step]="null"
     RESULTS[$step]="DRY-RUN"
     if [[ $attempted_fallback -eq 1 ]]; then
       FALLBACKS[$step]="true"
     else
       FALLBACKS[$step]="false"
     fi
     # write incremental summary and return early
     write_summary
     return
   fi

   bash -lc "$run_cmd" >> "$report_path" 2>&1
   local exit_code=$?
   EXIT_CODES[$step]="$exit_code"
   if [[ $exit_code -eq 0 ]]; then
     RESULTS[$step]="PASS"
   else
     RESULTS[$step]="FAIL"
   fi
   if [[ $attempted_fallback -eq 1 ]]; then
     FALLBACKS[$step]="true"
   else
     FALLBACKS[$step]="false"
   fi

  # Special handling: if this was test-ui and FILE_ARG provided, try seed prep
  if [[ "$step" == "test-ui" && -n "$FILE_ARG" ]]; then
    if [[ -f "scripts/utils/ci-helpers/seed-prep.ts" || -f "scripts/utils/ci-helpers/seed-prep.js" ]]; then
      echo "\n==> Running seed prep for targeted Playwright run" >> "$report_path"
      if npm run ci:helpers:seed-prep >> "$report_path" 2>&1; then
        echo "Seed prep completed" >> "$report_path"
      else
        echo "Seed prep failed or was skipped" >> "$report_path"
      fi
    else
      echo "Seed prep helper not found; skipping DB prep" >> "$report_path"
    fi
  fi
}

main() {
  local failed_steps=()

  for step in "${STEPS[@]}"; do
    run_step "$step"
  done

  # Ensure final summary is written
  write_summary

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
