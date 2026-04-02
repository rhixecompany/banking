---
name: "ui-validation"
description: "shadcn/UI components, Zod validation, and forms"
applyTo: "**/*.{ts,tsx}"
priority: 5
---

# UI & Validation Patterns - Banking Project

## shadcn/UI Components

Components are in `components/ui/`.

### Common Components

```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
```

### Form Pattern with Zod

```typescript
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0, "Amount must be positive")
});

type FormData = z.infer<typeof formSchema>;

export function PaymentForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: "",
      amount: 0
    }
  });

  async function onSubmit(data: FormData) {
    // Submit to server action
    const result = await createPayment(data);
    if (!result.ok) {
      form.setError("root", { message: result.error });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input {...form.register("email")} />
      {form.formState.errors.email && (
        <span>{form.formState.errors.email.message}</span>
      )}
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Zod Validation Patterns

### String Validations

```typescript
z.string().min(1);           // Required
z.string().max(100);          // Max length
z.string().email();            // Email format
z.string().url();              // URL format
z.enum(["a", "b", "c"]);      // Enum
```

### Number Validations

```typescript
z.number().min(0);             // Min value
z.number().max(100);            // Max value
z.number().int();              // Integer only
```

### Object Validations

```typescript
z.object({
  name: z.string().min(1),
  email: z.string().email()
});

// Optional fields
z.object({
  name: z.string().optional()
});

// With default
z.object({
  role: z.string().default("user")
});
```

### Arrays

```typescript
z.array(z.string()).min(1);    // Non-empty array
```

### Transforms

```typescript
z.string().transform(val => val.trim());
```

### Coercion

```typescript
z.coerce.string();   // Convert to string
z.coerce.number();    // Convert to number
z.coerce.boolean();   // Convert to boolean
z.coerce.date();      // Convert to Date
```

## Component Patterns

### Server Component with Client Form

```tsx
// Server Component
import { PaymentForm } from "./PaymentForm";

export default async function PaymentPage() {
  return (
    <div>
      <h1>Make Payment</h1>
      <PaymentForm />
    </div>
  );
}
```

```tsx
// Client Component
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPayment } from "@/lib/actions/payment.actions";

export function PaymentForm() {
  // ... form implementation
}
```

See: .opencode/skills/ui-skill/SKILL.md, .opencode/skills/validation-skill/SKILL.md

