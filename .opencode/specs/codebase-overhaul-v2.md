# Codebase Overhaul v2 Specification

> **Linked to Plan:** `.opencode/plans/codebase-overhaul.md`

**Scope:** Comprehensive codebase modernization across 8 phases.

---

## Phase Specifications

### Phase 0: Documentation Refresh

| Task | Files | Success Criteria |
| --- | --- | --- |
| Update app-pages.md | docs/app-pages.md | All routes documented with wrappers |
| Update custom-components.md | docs/custom-components.md | All components (non-ui) listed |
| Update test-context.md | docs/test-context.md | 37 Vitest + 10 Playwright specs confirmed |
| Update scripts.md | docs/scripts.md | All scripts inventoried |

### Phase 1: Component & Test Cleanup

| Task | Files | Success Criteria |
| --- | --- | --- |
| Component enhancement | components/layouts/\*\* | No `any` types in props |
| Store/Hook audit | stores/**, hooks/** | Explicit return types, no env/DB imports |
| Vitest enhancement | tests/unit/\*_/_.test.ts | All imports valid |
| Playwright enhancement | tests/e2e/\*_/_.spec.ts | Auth/Plaid helpers standardized |

### Phase 2: Route Analysis

| Task | Files | Success Criteria |
| --- | --- | --- |
| Auth pages analysis | app/(auth)/\*\*/page.tsx | Documented with violations |
| Admin pages analysis | app/(admin)/\*\*/page.tsx | Documented with violations |
| Root pages analysis | app/(root)/\*\*/page.tsx | Documented with violations |
| Landing page analysis | app/page.tsx | CONFIRMED static (no auth/DB) |
| Demo pages analysis | app/demo/\*\*/page.tsx | Documented |

### Phase 3: Generic Components

| Component | Path | Success Criteria |
| --- | --- | --- |
| generic-page-shell | components/layouts/generic-page-shell/ | Props typed, JSDoc, tests pass |
| generic-data-table | components/layouts/generic-data-table/ | Generic T, sortable, pagination |
| generic-card | components/layouts/generic-card/ | Header/body/footer slots |
| generic-form | components/layouts/generic-form/ | react-hook-form integration |
| generic-modal | components/layouts/generic-modal/ | Radix UI, focus management |
| generic-toast | components/layouts/generic-toast/ | Sonner integration |
| generic-skeleton | components/layouts/generic-skeleton/ | Variants supported |
| generic-empty-state | components/layouts/generic-empty-state/ | Icon/title/desc/action slots |

### Phase 4: Script Enhancement

| Task                 | Success Criteria                  |
| -------------------- | --------------------------------- |
| Orchestrator pattern | Shell scripts call TS only        |
| --dry-run support    | All mutation scripts support flag |
| ts-morph usage       | AST operations use ts-morph       |

### Phase 5: Agent Documentation

| Task                | Success Criteria              |
| ------------------- | ----------------------------- |
| init-enhanced.md    | Created in commands/          |
| AGENTS.md canonical | Referenced as source of truth |

### Phase 6: MCP Servers

| Task           | Success Criteria            |
| -------------- | --------------------------- |
| mcp-runner.ts  | Enhanced with health checks |
| Docker catalog | Created                     |
| Custom MCP     | Functions implemented       |

### Phase 7: Agent Files

| Task               | Success Criteria  |
| ------------------ | ----------------- |
| Agent file audit   | All files triaged |
| Deprecated entries | Fixed or removed  |

### Phase 8: Validation

All must pass:

- `bun run format`
- `bun run type-check`
- `bun run lint:strict`
- `bun run verify:rules`
- `bun run test:browser`
- `bun run test:ui`

---

## Key Deliverables

1. **Documentation:** 4 updated docs (app-pages, custom-components, test-context, scripts)
2. **Components:** 8 new generic layout components
3. **Pages:** All pages analyzed and fixed for violations
4. **Scripts:** Orchestrator-only pattern, --dry-run support
5. **Agent Docs:** init-enhanced.md, canonical AGENTS.md
6. **MCP:** Enhanced mcp-runner.ts, Docker catalog, custom functions
7. **Agent Files:** All audited and fixed

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Phase 4 validation failure | High | Fix inline before proceeding |
| Component conflicts with ui/ | Medium | Skip ui/ per constraints |
| Test failures | Medium | Phase 1b focuses on fixes |

---

## Timeline (Estimated)

- Phase 0-2: Documentation & Analysis (2-3 hours)
- Phase 3: Implementation (3-4 hours)
- Phase 4-5: Enhancement (2-3 hours)
- Phase 6-7: MCP & Audit (2 hours)
- Phase 8: Validation (1 hour)

**Total:** ~11-14 hours
