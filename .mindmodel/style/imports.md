# Imports

## Rules

- Use `@/` path alias for all internal imports (configured in `tsconfig.json`)
- Order imports: 1) External libraries, 2) Internal lib, 3) Types, 4) Components/DAL
- Use named exports for utilities, default exports for React components
- Never use barrel re-exports (`index.ts`) except for public API surface

## Examples

### Standard Import Order

```typescript
// External libraries first
import bcrypt from "bcrypt";
import { z } from "zod";
import { and, eq, isNull } from "drizzle-orm";

// Internal lib utilities
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { plaidClient } from "@/lib/plaid";

// Types
import type { UserWithProfile } from "@/types/user";

// Database
import { db } from "@/database/db";
import { users } from "@/database/schema";

// DAL
import { userDal } from "@/dal";

// Components
import { Button } from "@/components/ui/button";
```

## Anti-patterns

### Don't Use Relative Paths for Internal Code

```typescript
// BAD: Deep relative paths
import { Button } from "../../../../components/ui/button";

// GOOD: Use @/ alias
import { Button } from "@/components/ui/button";
```

### Don't Mix Import Styles

```typescript
// BAD: Mixing default and named imports inconsistently
import React, { useState } from "react";
import { userDal } from "@/dal/user-dal";

// GOOD: Consistent import style
import { useState } from "react";
import { userDal } from "@/dal/user.dal";
```
