# Import Conventions

## Path Aliases

### Available Aliases

| Alias          | Target           |
| -------------- | ---------------- |
| `@/`           | `src/`           |
| `@/actions`    | `src/actions`    |
| `@/components` | `src/components` |
| `@/dal`        | `src/dal`        |
| `@/database`   | `src/database`   |
| `@/lib`        | `src/lib`        |
| `@/stores`     | `src/stores`     |
| `@/types`      | `src/types`      |

## Import Order

1. **External dependencies** (node_modules)
2. **Internal aliases** (`@/lib`, `@/dal`, etc.)
3. **Relative imports** (`./`, `../`)

```typescript
// Example: src/actions/register.ts
import bcrypt from "bcrypt"; // 1. External
import { z } from "zod"; // 1. External

import type { UserWithProfile } from "@/types/user"; // 2. Alias
import { userDal } from "@/dal"; // 2. Alias
import { auth } from "@/lib/auth"; // 2. Alias
import { signUpSchema } from "@/lib/validations/auth"; // 2. Alias
```

## Barrel Exports

### Use barrel exports for organized imports

```typescript
// src/dal/index.ts
export { userDal } from "./user.dal";
export { transactionDal } from "./transaction.dal";
export { walletDal } from "./wallet.dal";

// src/lib/schemas/index.ts
export * from "./auth.schema";
// Add additional schema exports here
```

### Store barrel exports

```typescript
// src/stores/index.ts
export { createUIStore, defaultUIState } from "./create-ui-store";
export type {
  ModalId,
  UIActions,
  UIState,
  UIStore
} from "./create-ui-store";
export {
  createTransferStore,
  defaultTransferState
} from "./create-transfer-store";
// ...
```

## Type Imports

### Use `import type` for type-only imports

```typescript
import type { Transaction } from "@/types/transaction";
import type { Wallet } from "@/types/wallet";
import type { UserWithProfile } from "@/types/user";
```

## Relative Imports

### Prefer aliases over relative paths when available

```typescript
// ✅ Good - using alias
import { userDal } from "@/dal";

// ❌ Avoid - deep relative path
import { userDal } from "../../../dal";
```
