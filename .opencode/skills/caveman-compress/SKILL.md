---
name: caveman-compress
description: "Compress memory files into caveman-speak (~75% token reduction). Use when token limits, archiving sessions, or optimizing CLAUDE.md. Keywords: compress, token-optimization, memory-files, session-archive, caveman, terse."
---

# Caveman Compress

## Purpose

Compress natural language files (CLAUDE.md, session logs, todos, notes) into caveman-speak to reduce tokens ~75%. Preserves code blocks, URLs, file paths, markdown.

## Caveman Rules

**Drop:** articles (a/an/the), filler (just/really/basically), pleasantries (sure/certainly), hedging.

**Keep:** technical terms exact, code blocks, URLs.

**Pattern:** `[thing] [action] [reason].` not "Sure! I'd be happy to help..."

### Intensity Levels

| Level     | What                                                  |
| --------- | ----------------------------------------------------- |
| **lite**  | Remove filler, keep full sentences                    |
| **full**  | Drop articles, fragments OK                           |
| **ultra** | Abbreviations (DB/auth/req/res), one word when enough |

---

## Compression Rules (Expert)

### Rule 1: Article Removal

```
❌ the cat sat on the mat
✓ cat sat on mat
```

### Rule 2: Filler Elimination

```
❌ I just really basically think this is important
✓ this important
```

### Rule 3: Hedging Removal

```
❌ Perhaps/Maybe/You might want to consider
✓ (just state action)
```

### Rule 4: Pleasantry Elimination

```
❌ Sure/Certainly/Of course I'd be happy to
✓ (skip entirely)
```

### Rule 5: Active Voice

```
❌ The file should be written by the function
✓ function writes file
```

### Rule 6: Empty -ing Phrases

```
❌ This is regarding/We are taking into consideration
✓ regarding/considering (or cut)
```

---

## What NOT to Compress

**Keep unchanged:**

- Code blocks (```language ...)
- URLs (https://...)
- File paths (components/Button.tsx)
- Technical terms (API/database names)
- Version numbers (v1.2.3)
- Backtick inline (`createUser`)

---

## Anti-Patterns

- **NEVER** compress code blocks (breaks syntax)
- **NEVER** compress URLs (break links)
- **NEVER** compress paths (break imports)
- **NEVER** use ultra for first draft review
- **NEVER** skip backup (corrupts original)

---

## Validation Checklist

After compress, verify:

- [ ] No articles remaining ("the", "a", "an")
- [ ] No filler words
- [ ] Code blocks intact
- [ ] URLs intact
- [ ] File paths intact
- [ ] Backup created (.original.md)
