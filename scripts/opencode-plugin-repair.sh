#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(dirname "$(realpath "$0")")
REPO_ROOT=$(realpath "$SCRIPT_DIR/..")
PROJECT_CONFIG=${PROJECT_CONFIG:-"$REPO_ROOT/opencode.json"}
GLOBAL_CONFIG_DIR=${OPENCODE_CONFIG_DIR:-"$HOME/.config/opencode"}
CACHE_DIR=${OPENCODE_CACHE_DIR:-"$HOME/.cache/opencode"}
REPORT_DIR=${REPORT_DIR:-"$REPO_ROOT/.opencode/reports"}
VERIFY_SCRIPT="$SCRIPT_DIR/opencode-plugin-verify.sh"

APPLY=0
PRINT_LOGS=0
SKIP_REINSTALL=0
SKIP_VERIFY=0

usage() {
  cat <<'EOF'
Usage: bash scripts/opencode-plugin-repair.sh [--apply] [--print-logs] [--skip-reinstall] [--skip-verify]

Safe by default:
- without --apply, prints the repair plan only
- with --apply, backs up changed configs, clears plugin runtime state, reinstalls plugins, and verifies the result
EOF
}

log() {
  printf '[opencode-plugin-repair] %s\n' "$1"
}

fail() {
  printf '[opencode-plugin-repair] ERROR: %s\n' "$1" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "Missing required command: $1"
}

run_or_print() {
  if [ "$APPLY" -eq 1 ]; then
    "$@"
  else
    printf 'DRY-RUN: '
    printf '%q ' "$@"
    printf '\n'
  fi
}

print_dry_run_command() {
  printf 'DRY-RUN: '
  printf '%q ' "$@"
  printf '\n'
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --apply)
      APPLY=1
      ;;
    --print-logs)
      PRINT_LOGS=1
      ;;
    --skip-reinstall)
      SKIP_REINSTALL=1
      ;;
    --skip-verify)
      SKIP_VERIFY=1
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      fail "Unknown option: $1"
      ;;
  esac
  shift
done

require_command node
require_command opencode

[ -f "$PROJECT_CONFIG" ] || fail "Project config not found: $PROJECT_CONFIG"
mkdir -p "$REPORT_DIR"

TIMESTAMP=$(date +%Y%m%dT%H%M%S)
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

PROJECT_NEXT_JSON="$TMP_DIR/project-opencode.json"
PROJECT_PLUGIN_LIST="$TMP_DIR/project-plugins.txt"
PROJECT_PLUGIN_DIRS="$TMP_DIR/project-plugin-dirs.txt"
GLOBAL_PLUGIN_LIST="$TMP_DIR/global-plugins.txt"
GLOBAL_PLUGIN_DIRS="$TMP_DIR/global-plugin-dirs.txt"
NORMALIZE_REPORT="$REPORT_DIR/opencode-plugin-normalize.json"

node - "$PROJECT_CONFIG" "$PROJECT_NEXT_JSON" "$PROJECT_PLUGIN_LIST" "$PROJECT_PLUGIN_DIRS" "$NORMALIZE_REPORT" <<'NODE'
const fs = require('fs');

const [configPath, nextPath, pluginPath, dirPath, reportPath] = process.argv.slice(2);
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const originalPlugins = Array.isArray(config.plugin) ? config.plugin : [];

function pluginKey(spec) {
  if (typeof spec !== 'string') return String(spec);
  if (spec.startsWith('github:')) return spec;
  if (!spec.includes('@')) return spec;
  if (spec.startsWith('@')) {
    const slashIndex = spec.indexOf('/');
    const versionIndex = spec.indexOf('@', slashIndex + 1);
    return versionIndex === -1 ? spec : spec.slice(0, versionIndex);
  }
  return spec.slice(0, spec.lastIndexOf('@'));
}

function pluginDirName(spec) {
  const key = pluginKey(spec);
  if (key.startsWith('github:')) {
    return key.slice('github:'.length).split('/').pop();
  }
  return key.split('/').pop();
}

const dedupedReversed = [];
const seen = new Set();
for (let index = originalPlugins.length - 1; index >= 0; index -= 1) {
  const spec = originalPlugins[index];
  const key = pluginKey(spec);
  if (seen.has(key)) continue;
  seen.add(key);
  dedupedReversed.push(spec);
}

const dedupedPlugins = dedupedReversed.reverse();
const removedPlugins = originalPlugins.filter((spec, index) => {
  const key = pluginKey(spec);
  return dedupedPlugins.findIndex(item => pluginKey(item) === key) !== index;
});

const nextConfig = { ...config, plugin: dedupedPlugins };
fs.writeFileSync(nextPath, `${JSON.stringify(nextConfig, null, 2)}\n`);
fs.writeFileSync(pluginPath, `${dedupedPlugins.join('\n')}\n`);
fs.writeFileSync(dirPath, `${dedupedPlugins.map(pluginDirName).join('\n')}\n`);
fs.writeFileSync(reportPath, `${JSON.stringify({
  projectConfig: configPath,
  originalCount: originalPlugins.length,
  dedupedCount: dedupedPlugins.length,
  removedPlugins,
  changed: JSON.stringify(config) !== JSON.stringify(nextConfig)
}, null, 2)}\n`);
NODE

node - "$GLOBAL_CONFIG_DIR/opencode.json" "$GLOBAL_PLUGIN_LIST" "$GLOBAL_PLUGIN_DIRS" <<'NODE'
const fs = require('fs');

const [configPath, pluginPath, dirPath] = process.argv.slice(2);
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(pluginPath, '');
  fs.writeFileSync(dirPath, '');
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const plugins = Array.isArray(config.plugin) ? [...new Set(config.plugin)] : [];

function pluginDirName(spec) {
  if (typeof spec !== 'string') return String(spec);
  if (spec.startsWith('github:')) {
    return spec.slice('github:'.length).split('/').pop();
  }
  let base = spec;
  if (spec.startsWith('@')) {
    const slashIndex = spec.indexOf('/');
    const versionIndex = spec.indexOf('@', slashIndex + 1);
    if (versionIndex !== -1) base = spec.slice(0, versionIndex);
  } else if (spec.includes('@')) {
    base = spec.slice(0, spec.lastIndexOf('@'));
  }
  return base.split('/').pop();
}

fs.writeFileSync(pluginPath, plugins.length > 0 ? `${plugins.join('\n')}\n` : '');
fs.writeFileSync(dirPath, plugins.length > 0 ? `${plugins.map(pluginDirName).join('\n')}\n` : '');
NODE

log "Normalization report: $NORMALIZE_REPORT"
cat "$NORMALIZE_REPORT"

if ! cmp -s "$PROJECT_CONFIG" "$PROJECT_NEXT_JSON"; then
  if [ "$APPLY" -eq 1 ]; then
    cp "$PROJECT_CONFIG" "$PROJECT_CONFIG.bak.$TIMESTAMP"
    cp "$PROJECT_NEXT_JSON" "$PROJECT_CONFIG"
    log "Updated $PROJECT_CONFIG and created backup $PROJECT_CONFIG.bak.$TIMESTAMP"
  else
    log "Project config will be rewritten with a deduplicated plugin list"
  fi
else
  log "Project plugin list is already deduplicated"
fi

log "Runtime cleanup targets"
printf ' - %s\n' "$GLOBAL_CONFIG_DIR/node_modules" "$GLOBAL_CONFIG_DIR/package-lock.json" "$CACHE_DIR/packages" "$CACHE_DIR/opencode-quota"

while IFS= read -r pluginDir; do
  [ -n "$pluginDir" ] || continue
  printf ' - %s\n' "$GLOBAL_CONFIG_DIR/$pluginDir" "$CACHE_DIR/$pluginDir"
done < "$PROJECT_PLUGIN_DIRS"

while IFS= read -r pluginDir; do
  [ -n "$pluginDir" ] || continue
  printf ' - %s\n' "$GLOBAL_CONFIG_DIR/$pluginDir" "$CACHE_DIR/$pluginDir"
done < "$GLOBAL_PLUGIN_DIRS"

run_or_print rm -rf "$GLOBAL_CONFIG_DIR/node_modules"
run_or_print rm -f "$GLOBAL_CONFIG_DIR/package-lock.json"
run_or_print rm -rf "$CACHE_DIR/packages"
run_or_print rm -rf "$CACHE_DIR/opencode-quota"

while IFS= read -r pluginDir; do
  [ -n "$pluginDir" ] || continue
  run_or_print rm -rf "$GLOBAL_CONFIG_DIR/$pluginDir"
  run_or_print rm -rf "$CACHE_DIR/$pluginDir"
done < "$PROJECT_PLUGIN_DIRS"

while IFS= read -r pluginDir; do
  [ -n "$pluginDir" ] || continue
  run_or_print rm -rf "$GLOBAL_CONFIG_DIR/$pluginDir"
  run_or_print rm -rf "$CACHE_DIR/$pluginDir"
done < "$GLOBAL_PLUGIN_DIRS"

if [ "$SKIP_REINSTALL" -eq 0 ]; then
  INSTALL_ARGS=(--force)
  if [ "$PRINT_LOGS" -eq 1 ]; then
    INSTALL_ARGS+=(--print-logs)
  fi

  while IFS= read -r plugin; do
    [ -n "$plugin" ] || continue
    log "Reinstalling global plugin: $plugin"
    if [ "$APPLY" -eq 1 ]; then
      opencode plugin "$plugin" --global "${INSTALL_ARGS[@]}"
    else
      print_dry_run_command opencode plugin "$plugin" --global "${INSTALL_ARGS[@]}"
    fi
  done < "$GLOBAL_PLUGIN_LIST"

  while IFS= read -r plugin; do
    [ -n "$plugin" ] || continue
    log "Reinstalling project plugin: $plugin"
    if [ "$APPLY" -eq 1 ]; then
      opencode plugin "$plugin" "${INSTALL_ARGS[@]}"
    else
      print_dry_run_command opencode plugin "$plugin" "${INSTALL_ARGS[@]}"
    fi
  done < "$PROJECT_PLUGIN_LIST"
else
  log "Skipping reinstall because --skip-reinstall was provided"
fi

if [ "$SKIP_VERIFY" -eq 0 ]; then
  if [ "$APPLY" -eq 1 ]; then
    "$VERIFY_SCRIPT"
  else
    log "DRY-RUN: verification would run via $VERIFY_SCRIPT"
  fi
else
  log "Skipping verification because --skip-verify was provided"
fi
