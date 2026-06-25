# Folder Structure — Banking

```
Banking/
├── .claude/                    # Claude AI skills
├── .devcontainer/              # Dev container config
├── .github/                    # GitHub workflows
├── .husky/                     # Git hooks
├── .opencode/                  # OpenCode configuration
│   ├── instructions/           # Agent instructions
│   ├── reports/                # Validation reports
│   ├── registry.json           # Component registry
│   └── skills/                 # OpenCode skills
├── public/                     # Static assets
├── scripts/                    # Utility scripts
│   ├── generate/               # Code generators
│   ├── seed/                   # Database seeding
│   ├── ts/                     # TypeScript scripts
│   └── utils/                  # CI helper scripts
├── src/
│   ├── actions/                # Server Actions (dot.camelCase)
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Auth routes (signin, signup)
│   │   ├── (root)/             # Main app (dashboard, transactions)
│   │   ├── (admin)/            # Admin panel
│   │   └── api/                # API routes
│   ├── components/             # React components
│   │   └── ui/                 # shadcn/ui components
│   ├── dal/                    # Data Access Layer
│   ├── database/               # Drizzle schema & config
│   ├── lib/                    # Utilities (auth, plaid, dwolla)
│   ├── stores/                 # Zustand state stores
│   └── types/                  # TypeScript type definitions
├── .env.example                # Environment template
├── .eslint.config.mts          # ESLint configuration
├── .prettierrc.ts              # Prettier configuration
├── bun.lockb                   # Bun lock file
├── drizzle.config.ts           # Drizzle configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies & scripts
├── playwright.config.ts        # Playwright configuration
├── postcss.config.ts           # PostCSS configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vitest.config.ts            # Vitest configuration
└── AGENTS.md                   # Agent reference guide
```
