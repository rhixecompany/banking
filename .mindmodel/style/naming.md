# Naming Conventions

## Rules

- Server Actions: `dot.camelCase` — `auth.signin.ts`, `plaid.actions.ts`
- Components (React): `PascalCase` — `BankInfo.tsx`, `UserProfile.tsx`
- Utils/Hooks: `camelCase` — `formUrlQuery.ts`, `useMediaQuery.ts`
- Database Tables: `snake_case` — `users`, `user_profiles`, `transactions`
- DAL Files: `dot.camelCase` — `user.dal.ts`, `transaction.dal.ts`
- Zod Schemas: `camelCase` — `auth.schema.ts`, `transfer.schema.ts`
- Route Groups: `kebab-case` in parentheses — `(auth)`, `(root)`

## Examples

| Type          | Convention      | Example                |
| ------------- | --------------- | ---------------------- |
| Server Action | `dot.camelCase` | `auth.signin.ts`       |
| Component     | `PascalCase`    | `SignInForm.tsx`       |
| Hook          | `camelCase`     | `useAuth.ts`           |
| Util          | `camelCase`     | `formatCurrency.ts`    |
| Table         | `snake_case`    | `user_profiles`        |
| DAL Class     | `PascalCase`    | `class UserDal`        |
| DAL Instance  | `camelCase`     | `export const userDal` |
| Schema        | `camelCase`     | `signUpSchema`         |

## Anti-patterns

### Don't Use Wrong Casing

```typescript
// BAD: Mixed casing conventions
import { Register_User } from "@/actions/register_user"; // ❌
import { user_dal } from "@/dal/user_dal"; // ❌

// GOOD: Follow conventions
import { registerUser } from "@/actions/register"; // ✓
import { userDal } from "@/dal/user.dal"; // ✓
```
