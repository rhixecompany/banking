---
session: ses_2402
updated: 2026-04-24T14:20:02.285Z
---



# Session Summary

## Goal
Find and document all naming conventions used in the codebase including: file naming patterns (camelCase, kebab-case, PascalCase), function/variable naming, CSS/class naming, database table/column naming, and API endpoint naming. List patterns found with examples.

## Constraints & Preferences
- Follow the exact structure requested by user: list each category with examples
- Preserve exact file paths and identifiers when known
- Focus on terse bullets over paragraphs

## Progress

### Done
- [x] Searched codebase for .ts, .tsx, .css, database schema files
- [x] Read database/schema.ts - identified database naming patterns (snake_case)
- [x] Read DAL files (user.dal.ts, wallet.dal.ts, transaction.dal.ts) - identified class and method naming
- [x] Read actions files (user.actions.ts) - identified server action file naming
- [x] Read lib/utils.ts - identified utility function naming
- [x] Read app/globals.css - identified Tailwind CSS class naming convention
- [x] Executed grep for CSS class patterns - found 391 matches with kebab-case Tailwind classes

### In Progress
- [ ] Compiling full documentation of all naming convention categories with examples
- [ ] Documenting API endpoint naming patterns from Next.js app routes

### Blocked
- (none)

## Key Decisions
- **Database naming**: Used snake_case for tables (users, wallets, transactions) and columns (created_at, deleted_at) - follows PostgreSQL/Drizzle ORM conventions
- **TypeScript files**: Using kebab-case for action files (user.actions.ts), PascalCase for classes (UserDal), camelCase for methods
- **CSS classes**: Using kebab-case (Tailwind CSS utility classes like "mx-auto", "text-muted-foreground")

## Next Steps
1. Complete documentation of all categories with specific examples from code
2. Document Next.js route/endpoint naming (app/(root)/dashboard/page.tsx)
3. Provide organized output in requested format

## Critical Context
- **Database schema patterns found**:
  - Tables: `users`, `wallets`, `transactions`, `user_profiles`, `recipients` (snake_case)
  - Columns: `createdAt` maps to `created_at`, `deletedAt` maps to `deleted_at` (snake_case in DB, camelCase in code)
  - Enums: `user_role`, `transaction_status`, `transaction_type`, `transaction_channel`
  
- **TypeScript code patterns found**:
  - Action files: `user.actions.ts`, `wallet.actions.ts` (kebab-case)
  - DAL classes: `UserDal`, `WalletDal`, `TransactionDal` (PascalCase)
  - Methods: `findByEmail`, `findById`, `findByUserId` (camelCase)
  
- **CSS/Tailwind patterns found** (391 matches):
  - Classes: `mx-auto`, `flex`, `max-w-7xl`, `items-center`, `justify-between`, `gap-6`, `px-4`, `py-2`, `text-muted-foreground`, `sr-only` (kebab-case)

## File Operations
### Read
- `/root/banking/actions/user.actions.ts`
- `/root/banking/app/globals.css`
- `/root/banking/dal/transaction.dal.ts`
- `/root/banking/dal/user.dal.ts`
- `/root/banking/dal/wallet.dal.ts`
- `/root/banking/database/schema.ts`
- `/root/banking/lib/utils.ts`

### Modified
- (none)
