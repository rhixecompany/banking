# UI Components

## Rules

- Use shadcn/ui base components from `src/components/ui/` when available
- Create composed components in feature folders — not in `ui/` (which is for base primitives)
- All interactive components must be `"use client"` — Server Components for layout/data display only
- Use CSS variables from `tailwind` config for colors, not hardcoded values
- Provide `aria-label` and `role` attributes for accessibility

## Examples

### Composed Component

```typescript
// src/components/banks/bank-info.tsx
"use client";
import { BankInfoCard } from "./BankInfoCard";
import { BankAccountList } from "./BankAccountList";
import { Button } from "@/components/ui/button";

interface BankInfoProps {
  banks: Bank[];
  onConnectBank?: () => void;
}

export function BankInfo({ banks, onConnectBank }: BankInfoProps) {
  return (
    <div className="space-y-4">
      <BankInfoCard banks={banks} />
      <BankAccountList banks={banks} />
      <Button onClick={onConnectBank}>
        Connect Bank Account
      </Button>
    </div>
  );
}
```

### Form Component with shadcn

```typescript
// src/components/sign-in/sign-in-form.tsx
"use client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export function SignInForm({ form, onSubmit }: Props) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Sign In</Button>
      </form>
    </Form>
  );
}
```

## Anti-patterns

### Don't Put Business Logic in UI Components

```typescript
// BAD: UI component doing DB operations
"use client";
export function BankList({ banks }: BankInfoProps) {
  async function connectBank() {
    const response = await fetch("/api/plaid/link-token"); // ❌
    // Business logic in client component
  }
}
```

### Don't Mix Layout and Interaction

```typescript
// BAD: Server component with useState
export default function Page() {
  const [count, setCount] = useState(0); // ❌ Can't use hooks in server
  return <div>{count}</div>;
}
```
