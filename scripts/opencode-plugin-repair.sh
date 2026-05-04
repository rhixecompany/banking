#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(dirname "$(realpath "$0")")
REPO_ROOT=$(realpath "$SCRIPT_DIR/..")

PROJECT_OPENCODE_CONFIG=${PROJECT_OPENCODE_CONFIG:-"$REPO_ROOT/.opencode/opencode.json"}
PROJECT_TUI_CONFIG=${PROJECT_TUI_CONFIG:-"$REPO_ROOT/.opencode/tui.json"}
GLOBAL_CONFIG_DIR=${OPENCODE_CONFIG_DIR:-"$HOME/.config/opencode"}
GLOBAL_OPENCODE_CONFIG="$GLOBAL_CONFIG_DIR/opencode.json"
GLOBAL_TUI_CONFIG="$GLOBAL_CONFIG_DIR/tui.json"

CACHE_DIR=${OPENCODE_CACHE_DIR:-"$HOME/.cache/opencode"}
REPORT_DIR=${REPORT_DIR:-"$REPO_ROOT/.opencode/reports"}
VERIFY_SCRIPT="$SCRIPT_DIR/opencode-plugin-verify.sh"

APPLY=0
PRINT_LOGS=0
SKIP_REINSTALL=0
SKIP_VERIFY=0
DRY_RUN=1

OS=$(uname -s)
ARCH=$(uname -m)
NODE_VERSION=$(node -v)

usage() {
  cat <<'EOF'
Usage: bash scripts/opencode-plugin-repair.sh [--apply] [--print-logs] [--skip-reinstall] [--skip-verify]

Safe by default (dry-run):
- without --apply, prints the repair plan only
- with --apply, backs up changed configs, clears plugin runtime state, reinstalls plugins, and verifies the result

Config sources (in priority order):
- .opencode/opencode.json (project)
- .opencode/tui.json (project)
- ~/.config/opencode/opencode.json (global)
- ~/.config/opencode/tui.json (global)

OS Compatibility Checks:
- Detects OS type (Linux, Darwin, Win32)
- Detects architecture (x64, arm64)
- Skips incompatible plugins automatically
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

check_plugin_os_compatibility() {
  local plugin="$1"
  local compatible=1
  local reason=""

  case "$OS" in
    Linux)
      compatible=0
      ;;
    Darwin)
      compatible=0
      if [[ "$ARCH" == "arm64" ]]; then
        reason="ARM64 Mac detected - some npm packages may need Rosetta2"
      fi
      ;;
    MINGW*|MSYS*|CYGWIN*|Win32)
      if [[ "$plugin" == *"shell"* || "$plugin" == *"bash"* || "$plugin" == *"zsh"* ]]; then
        reason="Shell plugins may require WSL on Windows for full functionality"
      fi
      compatible=0
      ;;
    *)
      compatible=0
      ;;
  esac

  if [ $compatible -eq 0 ]; then
    echo "compatible:$reason"
  else
    echo "incompatible:$reason"
  fi
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --apply)
      APPLY=1
      DRY_RUN=0
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
require_command bun

log "System: OS=$OS, Arch=$ARCH, Node=$NODE_VERSION"

CONFIG_FOUND=""
for config in "$PROJECT_OPENCODE_CONFIG" "$PROJECT_TUI_CONFIG" "$GLOBAL_OPENCODE_CONFIG" "$GLOBAL_TUI_CONFIG"; do
  if [ -f "$config" ]; then
    CONFIG_FOUND="$config"
    break
  fi
done

[ -n "$CONFIG_FOUND" ] || fail "No project or global config found"
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
OS_COMPAT_REPORT="$REPORT_DIR/opencode-os-compat.json"

log "Loading configs from multiple sources:"
log "  - Project: $PROJECT_OPENCODE_CONFIG (exists: $([ -f "$PROJECT_OPENCODE_CONFIG" ] && echo yes || echo no))"
log "  - Project: $PROJECT_TUI_CONFIG (exists: $([ -f "$PROJECT_TUI_CONFIG" ] && echo yes || echo no))"
log "  - Global: $GLOBAL_OPENCODE_CONFIG (exists: $([ -f "$GLOBAL_OPENCODE_CONFIG" ] && echo yes || echo no))"
log "  - Global: $GLOBAL_TUI_CONFIG (exists: $([ -f "$GLOBAL_TUI_CONFIG" ] && echo yes || echo no))"

node - "$PROJECT_OPENCODE_CONFIG" "$PROJECT_TUI_CONFIG" "$GLOBAL_OPENCODE_CONFIG" "$GLOBAL_TUI_CONFIG" "$PROJECT_NEXT_JSON" "$PROJECT_PLUGIN_LIST" "$PROJECT_PLUGIN_DIRS" "$NORMALIZE_REPORT" <<'NODE'
const fs = require('fs');

const [opencodePath, tuiPath, globalOpencodePath, globalTuiPath, nextPath, pluginPath, dirPath, reportPath] = process.argv.slice(2);

function loadConfig(path) {
  if (!fs.existsSync(path)) return null;
  try {
    const content = fs.readFileSync(path, 'utf-8').trim();
    if (!content) return null;
    const parsed = JSON.parse(content);
    if (!parsed || (Object.keys(parsed).length === 0)) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function extractPlugins(config) {
  if (!config || !config.plugin) return [];
  return Array.isArray(config.plugin) ? config.plugin.filter(p => typeof p === 'string') : [];
}

const projectOpencode = loadConfig(opencodePath);
const projectTui = loadConfig(tuiPath);
const globalOpencode = loadConfig(globalOpencodePath);
const globalTui = loadConfig(tuiPath);

const allPlugins = [
  ...extractPlugins(projectOpencode),
  ...extractPlugins(projectTui),
  ...extractPlugins(globalOpencode),
  ...extractPlugins(globalTui)
];

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
for (let index = allPlugins.length - 1; index >= 0; index -= 1) {
  const spec = allPlugins[index];
  const key = pluginKey(spec);
  if (seen.has(key)) continue;
  seen.add(key);
  dedupedReversed.push(spec);
}

const dedupedPlugins = dedupedReversed.reverse();
const removedPlugins = allPlugins.filter((spec, index) => {
  const key = pluginKey(spec);
  return dedupedPlugins.findIndex(item => pluginKey(item) === key) !== index;
});

let finalConfig = projectOpencode || {};
if (projectOpencode && projectOpencode.plugin) {
  finalConfig = { ...projectOpencode, plugin: dedupedPlugins };
} else if (!projectOpencode && globalOpencode) {
  finalConfig = { ...globalOpencode, plugin: dedupedPlugins };
}

fs.writeFileSync(nextPath, `${JSON.stringify(finalConfig, null, 2)}\n`);
fs.writeFileSync(pluginPath, `${dedupedPlugins.join('\n')}\n`);
fs.writeFileSync(dirPath, `${dedupedPlugins.map(pluginDirName).join('\n')}\n`);
fs.writeFileSync(reportPath, `${JSON.stringify({
  configSources: {
    projectOpencode: opencodePath,
    projectTui: tuiPath,
    globalOpencode: globalOpencodePath,
    globalTui: globalTuiPath
  },
  originalCount: allPlugins.length,
  dedupedCount: dedupedPlugins.length,
  removedPlugins,
  changed: JSON.stringify(projectOpencode) !== JSON.stringify(finalConfig)
}, null, 2)}\n`);
NODE

node - "$GLOBAL_OPENCODE_CONFIG" "$GLOBAL_PLUGIN_LIST" "$GLOBAL_PLUGIN_DIRS" <<'NODE'
const fs = require('fs');

const [configPath, pluginPath, dirPath] = process.argv.slice(2);
if (!fs.existsSync(configPath)) {
  fs.writeFileSync(pluginPath, '');
  fs.writeFileSync(dirPath, '');
  process.exit(0);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
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

if ! cmp -s "$PROJECT_OPENCODE_CONFIG" "$PROJECT_NEXT_JSON" 2>/dev/null; then
  if [ "$APPLY" -eq 1 ]; then
    cp "$PROJECT_OPENCODE_CONFIG" "$PROJECT_OPENCODE_CONFIG.bak.$TIMESTAMP" 2>/dev/null || true
    cp "$PROJECT_NEXT_JSON" "$PROJECT_OPENCODE_CONFIG"
    log "Updated $PROJECT_OPENCODE_CONFIG and created backup $PROJECT_OPENCODE_CONFIG.bak.$TIMESTAMP"
  else
    log "Project config will be rewritten with a deduplicated plugin list"
  fi
else
  log "Project plugin list is already deduplicated"
fi

log "OS Compatibility Check for System: $OS ($ARCH)"
os_compat_json="["
while IFS= read -r plugin; do
  [ -n "$plugin" ] || continue
  result=$(check_plugin_os_compatibility "$plugin")
  compatible=$(echo "$result" | cut -d: -f1)
  reason=$(echo "$result" | cut -d: -f2-)
  
  if [ "$compatible" == "incompatible" ]; then
    log "SKIP: $plugin - $reason"
    continue
  fi
  
  if [ -n "$reason" ]; then
    log "WARN: $plugin - $reason"
  fi
  
  os_compat_json="$os_compat_json{\"plugin\":\"$plugin\",\"compatible\":true,\"reason\":\"$reason\"},"
done < "$PROJECT_PLUGIN_LIST"

if [[ "$os_compat_json" == "[" ]]; then
  os_compat_json="[]"
else
  os_compat_json="${os_compat_json%,}]"
fi
echo "$os_compat_json" > "$OS_COMPAT_REPORT"
log "OS compatibility report: $OS_COMPAT_REPORT"

log "Runtime cleanup targets"
printf ' - %s\n' "$GLOBAL_CONFIG_DIR/node_modules" "$GLOBAL_CONFIG_DIR/package-lock.json" "$CACHE_DIR/packages" "$CACHE_DIR/opencode-quota"

while IFS= read -r pluginDir; do
  [ -n "$pluginDir" ] || continue
  result=$(check_plugin_os_compatibility "$pluginDir")
  compatible=$(echo "$result" | cut -d: -f1)
  if [ "$compatible" == "incompatible" ]; then
    log "Skipping cleanup for incompatible plugin: $pluginDir"
    continue
  fi
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
  result=$(check_plugin_os_compatibility "$pluginDir")
  compatible=$(echo "$result" | cut -d: -f1)
  if [ "$compatible" == "incompatible" ]; then
    continue
  fi
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
    result=$(check_plugin_os_compatibility "$plugin")
    compatible=$(echo "$result" | cut -d: -f1)
    if [ "$compatible" == "incompatible" ]; then
      log "SKIPPING incompatible plugin: $plugin"
      continue
    fi
    
    log "Reinstalling global plugin: $plugin"
    if [ "$APPLY" -eq 1 ]; then
      bunx opencode plugin "$plugin" --global "${INSTALL_ARGS[@]}" || log "Warning: Failed to reinstall $plugin"
    else
      print_dry_run_command bunx opencode plugin "$plugin" --global "${INSTALL_ARGS[@]}"
    fi
  done < "$GLOBAL_PLUGIN_LIST"

  while IFS= read -r plugin; do
    [ -n "$plugin" ] || continue
    result=$(check_plugin_os_compatibility "$plugin")
    compatible=$(echo "$result" | cut -d: -f1)
    if [ "$compatible" == "incompatible" ]; then
      log "SKIPPING incompatible plugin: $plugin"
      continue
    fi
    
    log "Reinstalling project plugin: $plugin"
    if [ "$APPLY" -eq 1 ]; then
      bunx opencode plugin "$plugin" "${INSTALL_ARGS[@]}" || log "Warning: Failed to reinstall $plugin"
    else
      print_dry_run_command bunx opencode plugin "$plugin" "${INSTALL_ARGS[@]}"
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