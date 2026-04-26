#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR=$(dirname "$(realpath "$0")")
REPO_ROOT=$(realpath "$SCRIPT_DIR/..")
PROJECT_CONFIG=${PROJECT_CONFIG:-"$REPO_ROOT/aiconfig.json"}
REPORT_DIR=${REPORT_DIR:-"$REPO_ROOT/.opencode/reports"}

log() {
  printf '[opencode-plugin-verify] %s\n' "$1"
}

fail() {
  printf '[opencode-plugin-verify] ERROR: %s\n' "$1" >&2
  exit 1
}

command -v node >/dev/null 2>&1 || fail 'Missing required command: node'
command -v opencode >/dev/null 2>&1 || fail 'Missing required command: opencode'

[ -f "$PROJECT_CONFIG" ] || fail "Project config not found: $PROJECT_CONFIG"
mkdir -p "$REPORT_DIR"

RAW_REPORT="$REPORT_DIR/opencode-debug-config.raw.txt"
RUNTIME_REPORT="$REPORT_DIR/opencode-debug-config.runtime.json"
VERIFY_REPORT="$REPORT_DIR/opencode-plugin-verify.json"

log "Running opencode debug config"
opencode debug config > "$RAW_REPORT"

node - "$RAW_REPORT" "$RUNTIME_REPORT" <<'NODE'
const fs = require('fs');

const [rawPath, runtimePath] = process.argv.slice(2);
const raw = fs.readFileSync(rawPath, 'utf8');
const start = raw.indexOf('{');
if (start === -1) {
  throw new Error(`Could not locate JSON payload in ${rawPath}`);
}
const runtimeConfig = JSON.parse(raw.slice(start));
fs.writeFileSync(runtimePath, `${JSON.stringify(runtimeConfig, null, 2)}\n`);
NODE

node - "$PROJECT_CONFIG" "$RUNTIME_REPORT" "$VERIFY_REPORT" <<'NODE'
const fs = require('fs');

const [projectPath, runtimePath, reportPath] = process.argv.slice(2);
const projectConfig = JSON.parse(fs.readFileSync(projectPath, 'utf8'));
const runtimeConfig = JSON.parse(fs.readFileSync(runtimePath, 'utf8'));

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

function dedupe(plugins) {
  const dedupedReversed = [];
  const seen = new Set();
  for (let index = plugins.length - 1; index >= 0; index -= 1) {
    const spec = plugins[index];
    const key = pluginKey(spec);
    if (seen.has(key)) continue;
    seen.add(key);
    dedupedReversed.push(spec);
  }
  return dedupedReversed.reverse();
}

function duplicateKeys(plugins) {
  const counts = new Map();
  for (const plugin of plugins) {
    const key = pluginKey(plugin);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()].filter(([, count]) => count > 1).map(([key]) => key);
}

const expected = dedupe(Array.isArray(projectConfig.plugin) ? projectConfig.plugin : []);
const runtime = dedupe(Array.isArray(runtimeConfig.plugin) ? runtimeConfig.plugin : []);
const missing = expected.filter(plugin => !runtime.includes(plugin));
const extras = runtime.filter(plugin => !expected.includes(plugin));
const projectDuplicates = duplicateKeys(Array.isArray(projectConfig.plugin) ? projectConfig.plugin : []);
const runtimeDuplicates = duplicateKeys(Array.isArray(runtimeConfig.plugin) ? runtimeConfig.plugin : []);
const ok = missing.length === 0 && projectDuplicates.length === 0 && runtimeDuplicates.length === 0;

const summary = {
  ok,
  projectConfig: projectPath,
  runtimeConfig: runtimePath,
  expectedCount: expected.length,
  runtimeCount: runtime.length,
  missing,
  extras,
  projectDuplicates,
  runtimeDuplicates
};

fs.writeFileSync(reportPath, `${JSON.stringify(summary, null, 2)}\n`);

console.log(`Verification summary written to ${reportPath}`);
console.log(JSON.stringify(summary, null, 2));

if (!ok) {
  process.exit(1);
}
NODE

log "Verification passed"
log "Raw debug output: $RAW_REPORT"
log "Normalized runtime config: $RUNTIME_REPORT"
log "Verification report: $VERIFY_REPORT"
