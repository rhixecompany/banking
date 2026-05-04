# Spec: lint-e2e-fix

Scope: feature

# Spec: lint-e2e-fix

## Goal

Get the full `bun run validate` chain (lint → type-check → verify:rules → build → unit tests → E2E) passing cleanly with zero errors and zero OOM crashes.

---

## Root Causes

### 1. Node.js OOM during lint / type-check

ESLint (with 30+ plugins, markdown processor, TypeScript project service) and `tsc` both hit the default V8 heap limit (~512 MB) on this machine.

**Fix:** Prefix affected scripts with `NODE_OPTIONS=--max-old-space-size=4096` in `package.json`:

- `lint`
- `lint:strict`
- `lint:fix`
- `lint:fix:all`
- `type-check`

---

### 2. ESLint parses markdown despite `globalIgnores`

`globalIgnores(["**/*.md"])` does NOT prevent later config blocks from re-including those files when they use an explicit `files: ["**/*.md"]` pattern. The `@eslint/markdown` processor block (lines 883–890) and the virtual-file rules block (lines 891–961) re-include all `.md` files, causing ESLint to parse hundreds of JSX/TS code snippets embedded in markdown as real source — producing ~199 parse errors.

**Fix:** Delete lines 882–961 from `eslint.config.mts` (the markdown processor block and virtual-file rules). The `globalIgnores(["**/*.md"])` entry at line 53 is sufficient to exclude all markdown from linting.

---

### 3. Conditional `expect` in test try/catch blocks

`vitest/no-conditional-expect` fires whenever `expect()` appears inside a `catch` block. Three instances remain:

| File | Lines | Fix |
| --- | --- | --- |
| `tests/unit/dal/transaction.dal.test.ts` | 97–103 | Remove try/catch; call `expect(result).toBeDefined()` and `expect(db.select).toHaveBeenCalled()` unconditionally |
| `tests/unit/dal/transaction.dal.test.ts` | 165–170 | Same — remove try/catch; keep `expect(result).toBeDefined()` |

---

### 4. `prefer-const` in settings-content test

`tests/unit/components/settings-content.test.tsx:257` declares `let removeGoogleBtn` but never reassigns it.

**Fix:** Change `let` → `const`.

---

## Validation Sequence (in order)

```
# 1. Fix package.json scripts (NODE_OPTIONS)
# 2. Fix eslint.config.mts (remove markdown processor blocks)
# 3. Fix test files (conditional expect, prefer-const)
# 4. Verify lint
bun run lint
# 5. Verify types
bun run type-check
# 6. Verify policy rules
bun run verify:rules
# 7. Unit tests
bun run test:browser
# 8. Free port 3000 (Windows PowerShell):
#    $pids = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
#    if ($pids) { $pids | ForEach-Object { Stop-Process -Id $_ -Force } }
# 9. E2E tests
bun run test:ui
# 10. Full suite
bun run validate
```

---

## Re: "Should I run bun run test:ui?"

**Yes.** Run it after lint + type-check + unit tests all pass. The `test:ui` script sets `PLAYWRIGHT_PREPARE_DB=true` which resets and reseeds the database automatically — so no manual DB setup is needed. Port 3000 must be free first.
