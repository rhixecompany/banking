# opencode.json & tui.json changes

Date: 2026-04-14 02:58:18 UTC

Summary:

- Normalized `__originalKeys` placeholders removed from several permission blocks in `opencode.json`.
- Added `recent_files_limit` key to `tui.json` to make the UI more ergonomic by retaining a larger recent-files history.

Rationale:

- `__originalKeys` were internal placeholders causing noise in diffs; removal is non-breaking.
- `recent_files_limit` is a non-breaking UI preference stored locally.

Files changed:

- opencode.json
- tui.json
