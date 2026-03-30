# Migration Summary: awesome-opencode to Banking

**Date:** 2026-03-30 **Source:** `C:\Users\Alexa\Desktop\SandBox\awesome-opencode` **Target:** `C:\Users\Alexa\Desktop\SandBox\Banking` **Branch:** `registry`

---

## Overview

This document summarizes the migration of plugins, agents, themes, and resources from the awesome-opencode repository to the Banking project. The migration includes registry data, build scripts, and new skills for banking application development.

---

## Migration Details

### Registry Statistics

| Category  | Count   |
| --------- | ------- |
| Agents    | 6       |
| Plugins   | 73      |
| Themes    | 4       |
| Projects  | 32      |
| Resources | 9       |
| **Total** | **124** |

---

## Skills Created

The following skills were created in the `skills/` directory for banking application development:

| Skill | File | Description |
| --- | --- | --- |
| AuthSkill | `skills/auth-skill/SILL.md` | NextAuth.js v4 patterns, session management, OAuth providers |
| DBSkill | `skills/db-skill/SKILL.md` | Drizzle ORM patterns, migrations, N+1 query prevention |
| PlaidSkill | `skills/plaid-skill/SKILL.md` | Bank account linking, transaction retrieval |
| DwollaSkill | `skills/dwolla-skill/SKILL.md` | ACH transfers, payment processing |
| ValidationSkill | `skills/validation-skill/SKILL.md` | Zod schema validation for forms |
| ServerActionSkill | `skills/server-action-skill/SKILL.md` | Server Actions, form handling, revalidation |
| UISkill | `skills/ui-skill/SKILL.md` | shadcn/ui components, Tailwind CSS |
| SecuritySkill | `skills/security-skill/SKILL.md` | Encryption, rate limiting, secure headers |
| TestingSkill | `skills/testing-skill/SKILL.md` | Vitest unit tests, Playwright E2E |
| DeploymentSkill | `skills/deployment-skill/SKILL.md` | Vercel, Docker, Railway deployment |

---

## Plugins Added

The following plugins were added to `data/plugins/`:

| Plugin | File | Description |
| --- | --- | --- |
| Banking | `data/plugins/banking.yaml` | Complete banking patterns - Auth, Plaid, Dwolla, Drizzle |
| Drizzle ORM | `data/plugins/drizzle-orm.yaml` | Database patterns for PostgreSQL |
| Security Best Practices | `data/plugins/security-best-practices.yaml` | Security patterns |
| Testing | `data/plugins/testing.yaml` | Testing patterns |

---

## Agents Added

The following agents were added to `data/agents/`:

| Agent | File | Description |
| --- | --- | --- |
| Banking Agent | `data/agents/banking-agent.yaml` | AI agent for banking development |

---

## Files Modified

### package.json

Added new scripts and dependencies:

```json
{
  "dependencies": {
    "ajv": "^8.17.1",
    "ajv-formats": "^3.0.1",
    "glob": "^11.0.0"
  },
  "scripts": {
    "registry:generate": "tsx scripts/generate-readme.ts",
    "registry:validate": "tsx scripts/validate.ts",
    "registry:export": "tsx scripts/export-json.ts --pretty --output dist/registry.json",
    "registry:build": "npm run registry:generate && npm run registry:export"
  }
}
```

### tsconfig.json

Added compiler options:

```json
{
  "allowSyntheticDefaultImports": true,
  "forceConsistentCasingInFileNames": true
}
```

---

## New Files Created

### Scripts

| File                          | Description                       |
| ----------------------------- | --------------------------------- |
| `scripts/generate-readme.ts`  | Generate README from YAML entries |
| `scripts/export-json.ts`      | Export registry as JSON           |
| `scripts/validate.ts`         | Validate YAML against schema      |
| `scripts/types/index.ts`      | TypeScript types                  |
| `scripts/utils/constants.ts`  | Shared constants                  |
| `scripts/utils/yaml.ts`       | YAML utilities                    |
| `scripts/utils/validation.ts` | Schema validation                 |
| `scripts/utils/template.ts`   | Template rendering                |

### Data

| File                    | Description                    |
| ----------------------- | ------------------------------ |
| `data/schema.json`      | JSON Schema for validation     |
| `data/agents/*.yaml`    | Agent definitions (5 files)    |
| `data/plugins/*.yaml`   | Plugin definitions (73 files)  |
| `data/themes/*.yaml`    | Theme definitions (4 files)    |
| `data/projects/*.yaml`  | Project definitions (32 files) |
| `data/resources/*.yaml` | Resource definitions (9 files) |
| `data/examples/*.yaml`  | Example definitions            |

### Output

| File                 | Description                           |
| -------------------- | ------------------------------------- |
| `dist/registry.json` | Generated registry JSON (124 entries) |
| `README.opencode.md` | Auto-generated README                 |
| `MARKETPLACE.md`     | Marketplace documentation             |

### Templates

| File                           | Description     |
| ------------------------------ | --------------- |
| `templates/README.template.md` | README template |

### GitHub Workflows

| File                                    | Description           |
| --------------------------------------- | --------------------- |
| `.github/workflows/validate-pr.yml`     | Validate YAML on PR   |
| `.github/workflows/generate-readme.yml` | Auto-generate on push |

---

## Usage

### Build Registry

```bash
npm run registry:build
```

This will:

1. Generate `README.opencode.md` from YAML entries
2. Export `dist/registry.json`

### Validate YAML

```bash
npm run registry:validate
```

### Add New Entry

1. Create YAML file in appropriate directory:
   - `data/agents/`
   - `data/plugins/`
   - `data/themes/`
   - `data/projects/`
   - `data/resources/`

2. Follow the schema in `data/schema.json`

3. Run `npm run registry:build` to regenerate

---

## Installation

### Recommended Plugins

```bash
# Project-level installation
mkdir -p .opencode

# Banking Plugin (recommended)
git clone https://github.com/awesome-opencode/opencode-banking.git .opencode/banking

# NextJS Dev Plugin
git clone https://github.com/awesome-opencode/opencode-nextjs-dev.git .opencode/nextjs-dev
```

---

## Example Prompts

### Authentication

- "Create auth flow with NextAuth.js"
- "Add OAuth with Google provider"

### Banking Features

- "Add Plaid Link for bank account connection"
- "Implement Dwolla ACH transfer"

### Database

- "Create user schema with accounts relation"
- "Write DAL query with JOIN"

### Security

- "Add encryption to sensitive field"
- "Configure rate limiting"

---

## Notes

- All new code follows TypeScript strict mode
- N+1 query prevention enforced in DAL
- All mutations via Server Actions
- Environment variables via `lib/env.ts`
- Zero TypeScript errors required
- Zero ESLint warnings required
