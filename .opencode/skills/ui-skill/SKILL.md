---
name: ui-skill
description: shadcn/ui component patterns and Tailwind CSS styling for the Banking app. Use when building forms, tables, dialogs, or UI components.
lastReviewed: 2026-04-29
applyTo: "app/**/*.{tsx,ts}"
platforms:
  - opencode
  - cursor
  - copilot
---

# UISkill - Banking UI Components

## Overview

This skill provides comprehensive guidance on shadcn/ui and Tailwind CSS patterns for the Banking project. It covers forms, tables, dialogs, loading states, and responsive design patterns.

## Multi-Agent Commands

### OpenCode
```bash
# Add UI component
npx shadcn@latest add button

# Add form component
npx shadcn@latest add form

# Add dialog
npx shadcn@latest add dialog
```

### Cursor
```
@ui-skill
```

### Copilot
```
/ui button form dialog
```

## Available Components

The Banking project uses shadcn/ui. Key components:

| Component | Use For                                  |
| --------- | ---------------------------------------- |
| Button    | Actions, form submissions                |
| Input     | Text fields, forms                       |
| Form      | Form handling with react-hook-form + zod |
| Dialog    | Modals, confirmations                    |
| Select    | Dropdowns                                |
| Table     | Data tables, transaction lists           |
| Card      | Dashboard widgets                        |
| Avatar    | User profile images                      |
| Progress  | Loading states                           |

## Key Patterns

### Form with shadcn

```typescript
// components/forms/transfer-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TransferSchema, type TransferInput } from "@/lib/schemas/transfer";

export function TransferForm() {
  const form = useForm<TransferInput>({
    resolver: zodResolver(transferSchema),
    defaultValues: { amount: 0 },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Transfer</Button>
      </form>
    </Form>
  );
}
```

### Data Table

```typescript
// components/transactions-table.tsx
"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export function TransactionsTable({ columns, data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Card Component

```typescript
// components/balance-card.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function BalanceCard({ balance, accountName }: BalanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{accountName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
      </CardContent>
    </Card>
  );
}
```

### Loading State (Suspense)

```typescript
// app/dashboard/page.tsx
import { Suspense } from "react";
import { BalanceCard } from "@/components/balance-card";
import { BalanceSkeleton } from "@/components/skeletons";

export default function DashboardPage() {
  return (
    <Suspense fallback={<BalanceSkeleton />}>
      <BalanceCard balance={1000} accountName="Checking" />
    </Suspense>
  );
}
```

## Advanced Patterns

### Dialog/Modal Pattern

```typescript
// components/dialogs/confirm-dialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Select/Dropdown Pattern

```typescript
// components/forms/currency-select.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const currencies = [
  { value: "USD", label: "US Dollar" },
  { value: "EUR", label: "Euro" },
  { value: "GBP", label: "British Pound" },
];

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CurrencySelect({
  value,
  onChange,
  placeholder = "Select currency",
}: CurrencySelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.value} value={currency.value}>
            {currency.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Avatar with Fallback

```typescript
// components/user-avatar.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function UserAvatar({ src, name, size = "md" }: UserAvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={src ?? undefined} alt={name ?? "User"} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
```

## Tailwind Patterns

### Responsive Design

```typescript
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Adapts: 1 col mobile, 2 col tablet, 3 col desktop */}
</div>
```

### Dark Mode

```typescript
// Uses next-themes for automatic dark mode
<div className="bg-background text-foreground">
  {/* Automatic dark mode support */}
</div>
```

### Semantic Colors

```typescript
// Use semantic tokens instead of raw colors
<div className="bg-primary text-primary-foreground" />
<div className="bg-secondary text-secondary-foreground" />
<div className="bg-muted text-muted-foreground" />
<div className="bg-destructive text-destructive-foreground" />
```

### Spacing

```typescript
// Use gap instead of space-x/y
<div className="flex flex-col gap-4">
  {/* gap-4 = space-y-4 for flex-col */}
</div>

<div className="flex gap-4">
  {/* gap-4 = space-x-4 for flex-row */}
</div>
```

## Validation

Run: `bun run lint:strict`

## Common Issues and Solutions

### 1. Component Not Found

**Problem**: Component import fails
**Solution**: Add via: `npx shadcn@latest add [component]`

### 2. Form State Errors

**Problem**: Not displaying validation errors
**Solution**: Use `form.formState.errors` for error display

```typescript
{form.formState.errors.amount && (
  <p className="text-sm text-destructive">
    {form.formState.errors.amount.message}
  </p>
)}
```

### 3. Loading States

**Problem**: Content flashes before data loads
**Solution**: Wrap async content in Suspense

```typescript
<Suspense fallback={<Skeleton />}>
  <DataComponent />
</Suspense>
```

### 4. Hydration Mismatch

**Problem**: Server/client HTML mismatch
**Solution**: Use dynamic imports or client-side rendering for components with random values

```typescript
import dynamic from "next/dynamic";

const ClientOnlyChart = dynamic(
  () => import("@/components/chart"),
  { ssr: false, loading: () => <Skeleton /> }
);
```

### 5. Tailwind Classes Not Applying

**Problem**: Custom styles not working
**Solution**: Check tailwind.config.ts includes content paths

```typescript
// tailwind.config.ts
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // ...
}
```

## Cross-References

- **shadcn-skill**: For detailed component usage and CLI commands
- **validation-skill**: For Zod schema patterns
- **server-action-skill**: For form submission handling
- **testing-skill**: For component testing patterns

## Validation Commands

```bash
# Type check
bun run type-check

# Lint strict
bun run lint:strict

# Format
bun run format
```

## Performance Tips

1. Use `useMemo` for expensive column definitions in tables
2. Lazy load non-critical components with `next/dynamic`
3. Use `Skeleton` for loading states instead of spinners
4. Implement virtual scrolling for large lists
5. Use `Image` component for optimized images