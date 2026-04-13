# Scripts Patterns

LastReviewed: 2026-04-13

Purpose

- Standardize repository scripting patterns so scripts are safe for humans and agents (OpenCode).
- Enforce cross-platform TypeScript scripts for repo logic, require dry-run modes for destructive operations, and provide safe secrets handling.

Scope

- Applies to all files under scripts/\*\* (TypeScript, shell, PowerShell, and batch files).

Core Rules (enforced)

1. Prefer TypeScript
   - Scripts that run commands, mutate repository files, or implement business logic must be implemented in TypeScript under scripts/ (tsx / Node).
   - OS-specific .sh / .ps1 / .bat files are permitted only as thin wrappers that call the TypeScript implementation.

2. Dry-run required
   - Any script that writes files, mutates infrastructure, installs software, or would otherwise make irreversible changes must support a --dry-run flag.
   - In dry-run mode the script must print exactly what would change (file paths, actions). Nothing must be written or executed.

3. Non-interactive / CI-friendly
   - All scripts that prompt must provide non-interactive flags: --yes, --force, --no-prompt.
   - CI default should be non-destructive; only with an explicit environment variable (e.g., RUN_DESTRUCTIVE=true) are destructive steps allowed.

4. Secrets & env handling
   - Scripts must not print secret values to stdout/stderr.
   - TypeScript scripts should prefer using the app's validated env helper (lib/env.ts or app-config.ts) where possible.
   - Shell scripts that source .env files must document this in their header and include a "print-sample" mode that shows variable names and presence without values.

5. Documented usage
   - Every script must include a header block that documents: purpose, usage, flags, dry-run examples, and required env variables.
   - Update scripts/README.md when adding new scripts.

6. Generators & scaffolding
   - Generators (create files) must:
     - Validate inputs and not overwrite files without --force.
     - Support --dry-run that outputs file paths and a preview of file contents.
     - Offer --yes / --force for non-interactive CI use.

7. Validation contract
   - scripts/validate.ts is the canonical validation tool. CI must run npx tsx scripts/validate.ts --all (or npm run validate which calls it) as a blocking check.

Agent (OpenCode) rules

- Agents must prefer running TypeScript scripts: npx tsx scripts/<script>.ts --dry-run first.
- Agents must never run destructive scripts without explicit human approval; approve means the human sets RUN_DESTRUCTIVE=true and confirms.
- Agents should use scripts/validate.ts --all before proposing code mutations.

Migration guidance

- For legacy shell / ps1 / bat scripts that contain repo logic:
  1. Add a thin TypeScript wrapper that contains the logic.
  2. Make the OS-specific script call the wrapper.
  3. Add --dry-run and --yes flags to the TypeScript wrapper.

Enforcement & CI

- Add npx tsx scripts/validate.ts --all to npm run validate and CI validate job (blocking).
- Add a smoke job to CI that runs core scripts with --dry-run to detect syntax/runtime issues on PRs (optional next step).

Examples

- Dry-run generator: npx tsx scripts/generate/feature.ts user-profile --dry-run
- Non-interactive generator: npx tsx scripts/generate/feature.ts user-profile --yes
