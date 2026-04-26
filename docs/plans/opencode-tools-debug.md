---
plan name: opencode-tools-debug
plan description: Stabilize agent tooling stack
plan status: active
---

## Idea

Debug and fix the OpenCode `compress` tool (context compaction) and audit/repair any other OpenCode tool implementations in this repo that can interfere with tool execution (notably custom `.opencode/tools/*` shims/plugins). Focus on evidence-driven diagnosis: reproduce failures, capture exact errors, identify whether failure is in OpenCode runtime config/permissions, local plugin wiring, or the custom tool implementations. Deliver working tools plus a verification workflow (script or commands) to prevent regressions. Also address any discovered unsafe or secret-leaking configuration related to MCP/tooling.

## Implementation

- Reproduce the `compress` failure in a controlled way (manual tool invocation and/or auto-compaction), capturing the exact error output, stack trace, and OpenCode version/plugin list context.
- Trace where `compress` is registered and executed in this workspace (runtime config `.opencode/reports/opencode-debug-config.runtime.json`, `.opencode/opencode.json`, local plugins) to determine whether the failure is permission/configuration, registration, or runtime implementation.
- Audit repo-defined OpenCode tools/plugins (`.opencode/tools/*`, `.opencode/local-plugins/*`) for correctness: ensure wrappers actually execute intended operations, enforce safety policies consistently, and do not shadow or break core tools like `bash`/`compress`.
- Implement minimal fixes for the root causes found (e.g., correct tool registration, remove broken shims, tighten safety checks beyond naive substring matches, fix plugin exports/types), keeping changes small and targeted.
- Add/extend a verification workflow: run existing `scripts/opencode-plugin-verify.sh` (and repair script if applicable) and add a small repeatable check to confirm `compress` and other OpenCode tools function end-to-end in this repo.
- Security follow-up: remove/relocate any hardcoded secrets discovered in OpenCode config (e.g., inlined MCP environment tokens) to an appropriate secrets mechanism, and verify no secret material remains committed.

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
- enhance-pages-v2
- root-tests
- tools-debug
<!-- SPECS_END -->
