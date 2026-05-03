# GitHub Copilot Instructions — DEPRECATED

**⚠️ This file is deprecated.** All guidance has been consolidated into **`AGENTS.md`** (single source of truth).

This file is kept for historical reference only. **Do not maintain or follow this file; use AGENTS.md instead.**

---

## Quick Links

- **Main guide:** [`AGENTS.md`](./AGENTS.md)
- **Code patterns:** AGENTS.md §3
- **Conventions & rules:** AGENTS.md §4
- **Testing:** AGENTS.md §5
- **Troubleshooting:** AGENTS.md §8
- **Agent behavior:** AGENTS.md §9

---

## Key Updates from Legacy Version

**Command corrections:**
- ❌ `npm install` → ✅ `bun install`
- ❌ `npm run dev` → ✅ `bun run dev`
- ❌ `npm run build` → ✅ `bun run build`
- All package manager references updated to Bun in AGENTS.md

**Architecture & patterns:**
- All exemplars consolidated (register.ts, DAL batching, env access, testing)
- Full troubleshooting guide (8 common mistakes)
- Agent behavior rules clarified

**Testing updates:**
- Vitest & Playwright configuration details included
- Port guard instructions (Windows & Unix)
- Network mocking patterns (MSW, E2E helpers)

---

## What Changed

This repository now uses **AGENTS.md** as the canonical reference for:
- ✅ All commands (Bun syntax)
- ✅ Architecture & tech stack
- ✅ Code patterns & exemplars
- ✅ Conventions & rules
- ✅ Testing guide
- ✅ Scripts & tooling
- ✅ Local development setup
- ✅ Troubleshooting
- ✅ Agent behavior & contribution guidelines
- ✅ CI/CD & deployment

**Old files** (kept for reference, not maintained):
- `architecture.md` → See AGENTS.md §2
- `coding-standards.md` → See AGENTS.md §4
- `folder-structure.md` → See AGENTS.md §2
- `exemplars.md` → See AGENTS.md §3
- `tech-stack.md` → See AGENTS.md §2
- `SCRIPTING_STANDARDS.md` → See AGENTS.md §6
- `CONTRIBUTING.md` → See AGENTS.md §7, §9

---

**Consolidated:** 2026-05-03  
**Source:** AGENTS.md v2.0
