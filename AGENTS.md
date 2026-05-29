# AGENTS.md

## Project Overview

This file guides coding agents working in Banking/.

Primary stack signals detected:

- JavaScript/TypeScript toolchain (package.json)
- Python toolchain (requirements/pyproject)

Use repository evidence first (README, manifests, and scripts) and keep changes minimal and scoped.

## Setup Commands

Run from this project root:

`ash
bun install
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
`",
",


Common run/build entrypoint(s):

`ash
bun run start
`",
",


Run relevant checks before finalizing changes:

`ash
bun x tsc --noEmit
bun run lint:strict
bun run test
pytest
`",
",


- Follow local lint/format configuration files in this project.
- Avoid unrelated refactors.
- Update docs when commands or behavior changes.

## Security Considerations

- Never commit secrets, keys, or tokens.
- Validate and sanitize external inputs.
- Prefer least-privilege defaults for credentials and integrations.

## Pull Request Guidance

- Keep PR scope focused to one purpose.
- Include the exact commands run for verification.
- Add or update tests when behavior changes.

## Monorepo Notes

- This AGENTS.md applies to this project directory.
- If editing a nested path that has its own AGENTS.md, the nearest file takes precedence.

## Troubleshooting

- If commands fail, verify current directory is this project root.
- Reinstall dependencies and retry verification commands.
- Use README.md as the authoritative reference when command behavior differs.

