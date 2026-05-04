---
name: file-organizer
description: "Create effective file organization with decision trees for archive strategy, naming conventions, and active/archive boundaries. Use when: Downloads/Desktop is chaotic, you have duplicates, or your structure no longer matches how you search. Covers: when to archive vs delete, project structure that survives tool changes, organizing by discovery pattern (date/project/type), and avoiding common mistakes that lead to chaos."
---

# File Organizer

Organize files intelligently based on how you search, not how files exist.

## When to Use

- Your Downloads/Desktop is chaotic (can't find things)
- You have duplicate files taking space
- Your folder structure doesn't match how you actually search
- You're cleaning up before archiving old projects
- You want to establish organization that survives tool/tech changes

## Expert Thinking: Before You Organize

Ask yourself these questions—your answers determine structure:

### 1. What's Your Search Pattern?

Structure should **match how you search**, not impose a pattern:

- **"When did I create it?"** → Organize by **date**: `Year/Month/` or `Year/Project/`
- **"What project is this?"** → Organize by **project**: `Project/Type/` or `Client/Project/`
- **"What type is it?"** → Organize by **type**: `Documents/Images/Code/`
- **"Who is this for?"** → Organize by **client/org**: `Client/Project/Assets/`

Your pain (can't find files) means your structure doesn't match your search. Fix that first.

### 2. Active vs Archive Boundary

**The single biggest difference between organized and chaos** is a clear active/archive split.

**RULE**: Separate into two folders—never mix them.

```
Projects/
├── Active/       ← Current work (1–3 projects)
├── In-Progress/  ← Work in progress (multiple concurrent)
└── Archive/      ← 2024/, 2023/, older/ (stopped projects)
```

Without this boundary, every folder decision becomes ambiguous. "Should I keep this?" is unanswerable if Archive is mixed with Active.

### 3. When to Break Your Own Rules

High-activity projects can have complex internal structure. **Archive the structure when the project ends.**

Example:

- Active: `/Projects/Active/client-x-2024/design/assets/drafts/` (complex)
- Archived: `/Projects/Archive/2024/client-x/` (flatten it)

## NEVER Do These (Hard-Won Anti-Patterns)

1. **NEVER use "Misc/" or "To-Sort/" permanently** — These become gravity wells. Everything goes there. Folder becomes unsearchable. If it's miscellaneous, you haven't decided what it IS yet. Decide now.

2. **NEVER organize by tool/software** (Adobe/, Office/, VSCode/) — Tools change. In 2028, "Adobe/" is obsolete. Organize by what it IS (project, document type), not what created it.

3. **NEVER defer decisions** ("I'll sort this later") — Deferred decisions compound exponentially. 10 files unsorted today → 100 in a week → chaos. Decide WHEN you create/receive the file.

4. **NEVER mix naming conventions** (some "report.pdf", others "2024-01-15-report.pdf") — Breaks sorting and searching. Convert everything to one standard or separate by era (Current/ vs Archive/).

5. **NEVER delete without archiving first** — Especially creative work, projects, client deliverables. Archive first, delete after 6 months untouched. Resurrection is common.

6. **NEVER go deeper than 4–5 levels** — Beyond that, cognitive load explodes. Reorganize instead. Example: `/Projects/Active/client/type/phase/draft/` is too deep. Flatten to `/Projects/Active/client-project-phase/`.

7. **NEVER keep "version" folders** (v1/, v2/, v3-final/, v3-final-REAL/) — Use version control or date stamps instead. Signals you don't have a system.

## Domain-Specific Patterns

**Python Projects**:

```
project/
├── src/
├── tests/
├── docs/
└── Archive/ (old branches, old versions)
```

**Node/Web Projects**:

```
project/
├── app/
├── components/
├── public/
├── tests/
└── Archive/
```

**Freelance/Agency Work**:

```
Clients/
├── Active/
│   ├── client-name-2025/
│   └── client-name-2025/
└── Archive/
    ├── 2024/
    └── 2023/
```

**Monorepo Strategy**:

```
repo/
├── apps/
│   ├── web/
│   └── mobile/
├── packages/
└── Archive/ (old packages, deprecated apps)
```

## How to Execute (Choose Your Approach)

**Conservative**: Move slowly, confirm each decision, build confidence. Organize one folder at a time.

**Comprehensive**: Commit to full restructure. Archive everything old (>6 months). Start fresh. Takes time but clean break.

**Hybrid**: Organize active projects first. Archive old second. Decide edge cases as you go. Most practical.

Pick one that matches your tolerance for disruption. All are valid.

## Quick Commands

**Find duplicates by hash** (exact):

```bash
find . -type f -exec md5 {} \; | sort | uniq -d
```

**Find files by modification date**:

```bash
find . -type f -mtime -7  # Modified in last 7 days
find . -type f -mtime +180  # Not modified in 6 months (archive candidates)
```

**Archive old files**:

```bash
find . -type f -mtime +180 -exec mv {} Archive/ \;
```

## Key Principle

**Your organization is only as good as your active/archive boundary.** Everything else follows from that.

When in doubt: archive it. Revisit in 6 months. If untouched, delete.
