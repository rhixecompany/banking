---
name: caveman-compress
description: >
  Compress natural language memory files (CLAUDE.md, session logs, preferences, notes) into caveman-speak format to reduce input tokens by ~75%. Preserves code blocks, URLs, file paths, and markdown structure. Use when: (1) approaching token limits in long conversations, (2) need to archive/compress session history, (3) optimizing CLAUDE.md for future sessions, (4) costs matter and token efficiency critical. Trigger: /caveman:compress <filepath> or "compress memory file". Creates human-readable backup as FILE.original.md.
---

# Caveman Compress

## Purpose

Compress natural language files (CLAUDE.md, session logs, todos, preferences) into caveman-speak to reduce input tokens by ~75% while preserving all technical substance. Essential when token efficiency is critical or approaching context limits. Compressed version overwrites original. Human-readable backup saved as `<filename>.original.md`.

## Trigger

**Command:** `/caveman:compress <filepath>`

**Scenarios:**

- User: "compress memory file" or "shrink CLAUDE.md"
- Token limit approaching in long conversation
- Before archiving session history
- When token costs are critical
- When context window is nearly full

**Not triggered if:**

- File already compressed
- File contains only code/technical content
- File is < 10KB (compression overhead not worth it)

## Process

1. Locate compression scripts: `caveman-compress/scripts/__main__.py` (check adjacent to this SKILL.md, or search repo).

2. Execute compression:

   ```bash
   cd caveman-compress && python3 -m scripts <absolute_filepath>
   ```

3. Pipeline:
   - **Detect**: File type validation (no token cost)
   - **Compress**: Claude compresses prose sections
   - **Validate**: Check structure preserved, code blocks intact, URLs preserved
   - **Error recovery**: Cherry-pick surgical fixes (see Error Handling below)
   - **Backup**: Original saved as `FILE.original.md`
   - **Verify**: Confirm backup exists before overwriting

4. Return result and token savings estimate to user

## Compression Rules

### Remove

- Articles: a, an, the
- Filler: just, really, basically, actually, simply, essentially, generally
- Pleasantries: "sure", "certainly", "of course", "happy to", "I'd recommend"
- Hedging: "it might be worth", "you could consider", "it would be good to"
- Redundant phrasing: "in order to" → "to", "make sure to" → "ensure", "the reason is because" → "because"
- Connective fluff: "however", "furthermore", "additionally", "in addition"

### Preserve EXACTLY (never modify)

- **Code blocks** (fenced ``` and indented) — one missing space breaks Python/YAML indentation
- **Inline code** (`backtick content`) — removing breaks technical references
- **URLs and links** (full URLs, markdown links) — shortening breaks reference chains
- **File paths** (`/src/components/...`, `./config.yaml`) — changing breaks navigation
- **Commands** (`npm install`, `git commit`, `docker build`) — exact syntax required for execution
- **Version numbers** (e.g., v16.2.4, Node 18.0.0) — essential for reproducibility and debugging
- **Technical terms** (library names, API names, protocols) — removing obscures dependencies
- **Proper nouns** (project names, people, companies) — changing confuses context
- **Comments in code** — they explain non-obvious logic
- **Environment variables** (`$HOME`, `NODE_ENV`) — changing breaks configurations
- **Dates and timestamps** — critical for understanding when decisions were made

### Preserve Structure

- All markdown headings (keep exact heading text, compress body below)
- Bullet point hierarchy (keep nesting level)
- Numbered lists (keep numbering)
- Tables (compress cell text, keep structure)
- Frontmatter/YAML headers in markdown files

### Compress

- Use short synonyms: "big" not "extensive", "fix" not "implement a solution for", "use" not "utilize"
- Fragments OK: "Run tests before commit" not "You should always run tests before committing"
- Drop "you should", "make sure to", "remember to" — just state the action
- Merge redundant bullets that say the same thing differently
- Keep one example where multiple examples show the same pattern

CRITICAL RULE: Anything inside `...` must be copied EXACTLY. Do not:

- remove comments
- remove spacing
- reorder lines
- shorten commands
- simplify anything

Inline code (`...`) must be preserved EXACTLY. Do not modify anything inside backticks.

If file contains code blocks:

- Treat code blocks as read-only regions
- Only compress text outside them
- Do not merge sections around code

## Error Handling

If validation fails:

| Error Type | Root Cause | Recovery |
| --- | --- | --- |
| **Truncated code block** | Claude removed closing ``` | Cherry-pick: restore closing ``` only, revalidate |
| **Broken URL** | Claude shortened/removed URL | Cherry-pick: restore full URL, revalidate |
| **Lost markdown header** | Claude collapsed # heading | Cherry-pick: restore header, compress body only |
| **Mangled YAML frontmatter** | Claude reformatted metadata | Cherry-pick: restore original YAML, recompress body only |
| **Removed version number** | Claude thought it was filler | Cherry-pick: restore version, revalidate |
| **Collapsed code indentation** | Claude joined multi-line code | Cherry-pick: restore exact original spacing |

**Cherry-pick recovery strategy:**

- Do NOT attempt second full compression
- Only restore the exact section that failed
- Revalidate output before returning
- Maximum 2 cherry-pick attempts per file

**If 2 cherry-picks fail:**

- Leave original file **untouched**
- Report: "Compression failed: [specific error]. Original preserved at [filepath]"
- Suggest: Manual compression or different approach
- Never partially overwrite original

## Pattern

Original:

> You should always make sure to run the test suite before pushing any changes to the main branch. This is important because it helps catch bugs early and prevents broken builds from being deployed to production.

Compressed:

> Run tests before push to main. Catch bugs early, prevent broken prod deploys.

Original:

> The application uses a microservices architecture with the following components. The API gateway handles all incoming requests and routes them to the appropriate service. The authentication service is responsible for managing user sessions and JWT tokens.

Compressed:

> Microservices architecture. API gateway route all requests to services. Auth service manage user sessions + JWT tokens.

## Boundaries

**Compress only:**

- `.md` files (Markdown)
- `.txt` files (plaintext)
- Extensionless prose files (CLAUDE.md, README, notes)

**NEVER touch:**

- `.py, .js, .ts, .jsx, .tsx` (source code)
- `.json, .yaml, .yml, .toml` (config)
- `.env, .lock` (environment/dependencies)
- `.css, .html, .xml, .sql, .sh` (markup/styles/scripts)

**Mixed content files:**

- Compress ONLY prose sections
- Preserve code blocks (see Error Handling above)
- Do not compress file metadata (YAML frontmatter)

**Backup safety:**

- Always create `FILE.original.md` backup BEFORE overwriting
- Never compress `FILE.original.md` itself
- Never delete backup until user confirms satisfaction

**When in doubt:**

- Leave section unchanged
- Ask user for permission before compressing
- Better to under-compress than corrupt
