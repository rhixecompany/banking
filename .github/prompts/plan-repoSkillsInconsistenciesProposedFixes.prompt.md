### Repo Skills: Inconsistencies & Proposed Fixes Catalog

---

#### 1. validation-skill

- **Inconsistencies:**
  - None found in frontmatter, usage, or examples.
  - **Action:** Double-check ESLint config for all referenced Zod rules.

#### 2. db-skill

- **Inconsistencies:**
  - None found; all table names and patterns match current schema.
  - **Action:** Confirm schema in `database/schema.ts` is up-to-date with doc.

#### 3. server-action-skill

- **Inconsistencies:**
  - None found; matches AGENTS.md and Next.js 16 patterns.
  - **Action:** Ensure all new Next.js 16 features (e.g., async headers/cookies) are referenced if used in Server Actions.

#### 4. ui-skill

- **Inconsistencies:**
  - None found; all referenced components and patterns are present.
  - **Action:** Confirm all shadcn/ui components listed are actually present in `components/ui`.

#### 5. testing-skill

- **Inconsistencies:**
  - None found; Playwright and Vitest usage is current.
  - **Action:** Add any missing Playwright/Vitest best practices if repo evolves.

#### 6. suspense-skill

- **Inconsistencies:**
  - None found; Suspense usage and error patterns are up-to-date.
  - **Action:** None.

#### 7. dwolla-skill

- **Inconsistencies:**
  - None found; all env vars and patterns match repo.
  - **Action:** Confirm all env vars are present in `app-config.ts`.

#### 8. security-skill

- **Inconsistencies:**
  - None found; env and encryption patterns are current.
  - **Action:** None.

#### 9. deployment-skill

- **Inconsistencies:**
  - None found; platform and env notes are up-to-date.
  - **Action:** None.

#### 10. session-logger

- **Inconsistencies:**
  - None found; install and usage instructions are clear.
  - **Action:** None.

#### 11. session-auto-commit

- **Inconsistencies:**
  - None found; install and usage instructions are clear.
  - **Action:** None.

#### 12. simplify

- **Inconsistencies:**
  - None found; principles and process are clear.
  - **Action:** None.

---

**Summary:** No major inconsistencies found in repo skills. Minor verification actions are recommended (ESLint config, schema, component presence, env var coverage). All skills are up-to-date, repo-specific, and reference canonical rules.

If you want, I can proceed to verify the minor action items or move on to the next phase (meta/external skills or implementation). Let me know your preference!
