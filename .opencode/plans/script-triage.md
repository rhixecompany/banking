---
plan name: script-triage
plan description: Script Triage and Orchestrator Conversion
plan status: done
---

## Idea

Catalog and convert all shell scripts in scripts/ directory to orchestrator pattern - shell scripts only call TypeScript or CLI tools, move all logic to TS, clean up duplicates, update docs

## Implementation

- Survey all scripts in scripts/ directory - glob for _.sh, _.ps1, \*.bat files and categorize each as orchestrator (OK), has embedded logic, missing TS version, or duplicate
- Inventory all existing TypeScript scripts in scripts/ts/ and scripts/ root - map shell to corresponding TS versions
- Score each script by issue count (embedded logic > missing TS > duplicate > orchestrator OK)
- Create high-level categorization: Top-level entry points (.sh/.ps1/.bat in scripts/ root), Utility scripts (scripts/utils/), Deployment scripts (scripts/deploy/, scripts/docker/, scripts/server/)
- Convert scripts with embedded logic to orchestrators - move logic to new TypeScript file, shell just calls tsx/bunx or CLI
- For scripts missing TS version: create new TypeScript script that either wraps the shell or re-implements logic
- Clean up duplicate pairs: if .sh and .ps1 both exist and both are orchestrators, keep both for cross-platform; if one has logic and one doesn't, convert the logical one
- Update package.json scripts: change shell references (bash scripts/foo.sh) to TS references (bunx tsx scripts/ts/foo.ts)
- Update documentation: modify AGENTS.md to document orchestrator pattern requirement, create SCRIPTING_STANDARDS.md with conversion rules
- Update codemap.md: add scripts/ section documenting the orchestrator pattern and listing converted scripts
- Final verification: run all converted scripts to ensure they still work, check no regressions in package.json scripts

## Required Specs

<!-- SPECS_START -->

- enhance-pages-spec
- enhance-pages-v2
- root-tests
- script-triage-feature
<!-- SPECS_END -->
