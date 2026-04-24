---
name: ui-skill
description: shadcn/ui component patterns and Tailwind CSS styling for the Banking app. Use when building forms, tables, dialogs, or UI components.
lastReviewed: 2026-04-24
applyTo: "app/**/*.{tsx,ts}"
---

# UISkill - Banking UI Components

## Overview

This skill provides guidance on shadcn/ui and Tailwind CSS patterns for the Banking project.

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

## Validation

Run: `npm run lint:strict`

## Common Issues

1. **Component not found** - Add via: `npx shadcn@latest add [component]`
2. **Form state** - Use `form.formState.errors` for error display
3. **Loading states** - Always wrap async content in Suspense
