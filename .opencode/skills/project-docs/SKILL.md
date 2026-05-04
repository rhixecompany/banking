---
name: project-docs
description: Generate complete documentation structures (README, ARCHITECTURE, USER_GUIDE, DEVELOPER_GUIDE, CONTRIBUTING) tailored to project type and audience. Detects project language (Python/Go), context (OpenSource/internal), and adapts templates accordingly. Use when: (1) creating docs for new projects, (2) auditing/restructuring existing docs, or (3) setting up docs for a repository before launch.
---

# Project Documentation Generator

Expert-driven documentation generation tailored to your project's actual needs—not a generic template dump.

## Philosophy: Documentation as Decision Support

**Documentation exists to answer questions, not to be complete.**

The best docs help readers make decisions: "How do I install this?" "Should I contribute?" "Why was this designed this way?" Weak docs waste time explaining how code works instead of why decisions were made.

Your job: **Generate docs that answer the specific questions YOUR users will ask.**

---

## Before You Generate ANY Docs, Ask Yourself

### Purpose Questions

- **Who READS this documentation?** (developers, end-users, ops, compliance, all?)
- **What DECISIONS do they need to make?** (install it? contribute to it? deploy it? understand architecture?)
- **What will be STALE in 3 months?** (setup instructions drift fastest; architecture changes slower)

### Scope Questions

- **Does this project need ALL 5 files?**
  - Microservices: Skip USER_GUIDE (developers only)
  - Internal tools: Skip CONTRIBUTING (private team)
  - CLIs: Keep README + USER_GUIDE, minimize ARCHITECTURE
  - Libraries: Prioritize ARCHITECTURE and examples, CONTRIBUTING optional
- **What's the MINIMUM viable doc set for this project?**

### Quality Questions

- **What CANNOT be wrong?** (security, deployment, configuration)
- **What CAN you leave TBD?** (examples, edge cases)
- **Who MAINTAINS these docs?** (single person? team? community?)

---

## Workflow

### Phase 1: Detect & Assess

**1. Context Detection:**

- **Language**: Scan for `go.mod`, `pyproject.toml`, `requirements.txt`, `setup.py`
- **Project type**: Check for `Dockerfile`, `terraform/`, `k8s/`, `mcp/` (AI agents), REST APIs
- **Existing docs**: Identify what already exists (avoid duplication, assess quality)
- **License**: Detect from LICENSE file or ask user
- **Context**: Determine if OpenSource or internal

**2. Ask Clarifying Questions** (one at a time):

- "What's the primary purpose of this project?"
- "Who's the main audience? (developers, ops, end-users, all)"
- "Is this OpenSource or internal?"
- "Are there company-specific tools to mention? (Jira, Slack, etc.)"

**Decision Gate:** Based on answers, determine which of the 5 files are REQUIRED vs. optional.

---

### Phase 2: Template Selection (MANDATORY)

**MANDATORY - READ ENTIRE FILE**: Before generating ANY docs, you MUST read [`references/template.md`](references/template.md) completely (~1600 lines).

**Do NOT load** unless:

- [ ] Context detected (Phase 1 complete)
- [ ] Questions answered (Phase 1 complete)
- [ ] Project type identified

**Conditional reading:**

- For **AI Agents**: Focus on "MCP architecture" and "tool integrations" sections
- For **Infrastructure**: Focus on "Deployment" and "DR plans" sections
- For **Internal projects**: SKIP all "OpenSource/Community" sections
- For **Minimal docs** (2-3 files): Only read core templates, skip variants

---

### Phase 3: File Generation (Strict Order)

Generate files in this order (order matters for readability):

1. **README.md** (most visible, sets expectations)
2. **ARCHITECTURE.md** (technical foundation for all other docs)
3. **DEVELOPER_GUIDE.md** (setup and contribution)
4. **USER_GUIDE.md** (end-user focused)
5. **CONTRIBUTING.md** (community guidelines) — _optional for internal projects_

**For each file:**

- Use template structure from `references/template.md`
- Include concrete, runnable examples (test them mentally)
- Reference other docs when needed (avoid duplication)
- Match project's actual structure and commands

---

## Project Type Detection (Decision Tree)

Determines which template variant to use:

1. Check for `Dockerfile` or `docker-compose.yml` → **Infrastructure/DevOps**
   - Generate: README + ARCHITECTURE + DEVELOPER_GUIDE (skip USER_GUIDE)
2. Check for `mcp/` or MCP-related files → **AI Agent**
   - Generate: README + ARCHITECTURE (MCP-focused) + DEVELOPER_GUIDE
3. Check for `/api` patterns, REST routes → **Microservice/Backend**
   - Generate: All 5 files, emphasize API docs in USER_GUIDE
4. Check for CLI patterns, `main.go`, `main.py` → **CLI Tool**
   - Generate: README (commands) + USER_GUIDE (examples) + DEVELOPER_GUIDE
5. Default → **General Software Project**
   - Generate: All 5 files with balanced content

---

## NEVER Do This (Expert Anti-Patterns)

- ❌ **NEVER write docs for "completeness"** — write docs that answer specific questions
- ❌ **NEVER explain code; explain INTENT** — "why is `const X = 5`?" not "what does `const` do?"
- ❌ **NEVER skip architectural trade-offs** — readers need to understand WHY decisions were made
- ❌ **NEVER assume readers understand your constraints** — write them explicitly
- ❌ **NEVER document only the happy path** — show error cases, edge cases, troubleshooting
- ❌ **NEVER keep outdated examples** — stale code is worse than no code; remove it
- ❌ **NEVER make DEVELOPER_GUIDE a tutorial** — it should be a reference with clear sections
- ❌ **NEVER duplicate setup instructions** — link with "see README §X" instead

---

## Edge Case Handling

### Monorepo Projects

**Detected by:** `packages/`, `services/`, or `modules/` directories

**Approach:**

1. Create root `docs/README.md` (brief overview, links to sub-projects)
2. Create `docs/ARCHITECTURE.md` (system-level diagram, how packages interact)
3. For each package: `packages/{name}/README.md` (package-specific docs)
4. Do NOT create separate DEVELOPER_GUIDE per package — merge into root

### Polyglot Projects (Python + Go + Node)

**Approach:**

1. README: Section per language with language-specific quick starts
2. DEVELOPER_GUIDE: Separate setup sections per language (clear headings)
3. Do NOT assume one setup process fits all languages

### Legacy Projects with Existing Partial Docs

**Assess first:**

- Read existing README, DEVELOPER_GUIDE
- Identify gaps (missing ARCHITECTURE? outdated setup?)
- Ask user: "Update existing docs" vs. "Generate from scratch"

### Projects that are Both Library AND CLI Tool

**Approach:**

1. README: Show library installation + CLI installation (separate sections)
2. USER_GUIDE: Split into "As a Library" and "As a CLI" sections
3. ARCHITECTURE: Explain both usage patterns

### High-Velocity Projects (Docs Go Stale Fast)

**Strategy:**

- Emphasize "see code for source of truth" in setup sections
- Add "Last Updated" dates to sections likely to drift
- Point to CI/test files as examples (code doesn't lie)
- Keep ARCHITECTURE high-level (less likely to change)

---

## Quality Standards

Every documentation file must:

- Have table of contents for files >200 lines
- Use proper code fences with language tags
- Include concrete, tested examples (or at least explain how to run them)
- Explain "why" decisions were made, not just "how"
- Use consistent terminology throughout
- Show at least ONE error case or troubleshooting example

---

## Output

Place all generated files in `docs/` and present them to user with brief summary of what each file covers.
