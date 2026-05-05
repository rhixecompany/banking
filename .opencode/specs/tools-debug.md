# Spec: tools-debug

Scope: feature

# Feature Spec: OpenCode Tools Debug

## Goal

Stabilize OpenCode tool execution in this repo, with primary focus on the `compress` tool (context compaction), and ensure repo-defined tooling/plugins do not break or shadow core tools.

## Users / Personas

- Maintainer: needs reliable agent tooling locally and in CI.
- Agent/Contributor: needs predictable tool behavior and clear failure modes.
- Security reviewer: needs evidence that tooling does not leak secrets or bypass safety constraints.

## In Scope

- Reproduce and capture `compress` failures with exact error output and environment context (OpenCode version, plugin list, runtime config).
- Identify root cause category:
  - OpenCode runtime config/permissions/registration
  - Repo-defined tool shims/plugins under `.opencode/tools/*` or `.opencode/local-plugins/*`
  - Broken exports/types/wiring that prevent tool dispatch
  - Safety wrappers incorrectly blocking or mangling tool calls
- Apply minimal, targeted fixes to restore reliable behavior.
- Add a repeatable verification workflow (script/commands) that validates `compress` and other critical tools end-to-end.
- Security cleanup for tooling configuration:
  - Remove committed secrets or secret-like values from OpenCode config.
  - Ensure no tooling path writes secrets to logs/artifacts.

## Out of Scope

- Major refactors of unrelated application code.
- Broad redesign of the agent framework beyond what is required to make tools reliable.
- Adding new product features unrelated to tooling stability.

## Requirements

### Functional

- `compress` succeeds reliably when invoked manually and when auto-compaction triggers.
- Tool registration is deterministic: no accidental shadowing of core tools.
- Repo-defined wrappers/shims (if any) correctly forward args, preserve outputs, and fail with actionable error messages.

### Governance / Safety

- Tool governance is fail-closed on dangerous operations.
- Content filtering does not rely solely on naive substring checks; policies should be explicit (allowlist/blocklist) where feasible.
- Auditability:
  - Failures provide enough context to diagnose without exposing secrets.

### Reliability

- Verification workflow is runnable locally and in CI without interactive prompts.
- If a tool fails, the verification output points to the component at fault (core tool vs shim/plugin vs config).

## Acceptance Criteria

- A minimal reproduction for the previous `compress` failure exists and is documented (inputs + observed error).
- Root cause is identified and documented (location + mechanism).
- Fix is implemented such that:
  - `compress` works for the repro case and for at least one real-world compaction.
  - Other common tools (at minimum: `bash`, `read`, `grep`, `glob`) are unaffected.
- A verification workflow exists and passes on a clean checkout:
  - Tool/plugin verification script (existing or repaired) passes.
  - A small smoke check confirms tool dispatch and `compress` execution end-to-end.
- No secrets are committed in `.opencode/**` (or elsewhere) as a result of the work.

## Verification

- Run the repo’s existing tool/plugin verification script(s) (repair if failing).
- Run the new/extended smoke verification for:
  - `compress`
  - at least one other core tool
- If available, capture a rules report or CI-equivalent output to ensure no governance regressions.

## Notes

- Prefer smallest correct fix. If multiple fixes are possible, pick the one that reduces future ambiguity (clear registration, explicit policy, deterministic wiring).
