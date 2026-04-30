---
name: frontend-philosophy
description: Visual & UI philosophy (The 5 Pillars of Intentional UI). Understand deeply to avoid "AI slop" and create distinctive, memorable interfaces.
lastReviewed: 2026-04-29
applyTo: "components/**, app/**"
platforms:
  - opencode
  - cursor
  - copilot
---

# Frontend Philosophy - The 5 Pillars of Intentional UI

## Overview

This skill establishes the visual and UI philosophy for the Banking project. It covers the 5 Pillars of Intentional UI to create distinctive, memorable interfaces that avoid "AI slop".

## Multi-Agent Commands

### OpenCode

```bash
# Check component patterns
grep -r "cn(" components/ --include="*.tsx"

# Verify semantic colors
grep -r "bg-" app/ --include="*.tsx" | head -20
```

### Cursor

```
@frontend-philosophy
Design a login form following intentional UI principles
```

### Copilot

```
/ui philosophy dashboard
```

## The 5 Pillars

### 1. Purpose-Driven Design

Every element must serve a clear purpose.

```typescript
// BAD - Decorative elements without purpose
<div className="flex items-center gap-2">
  <div className="w-8 h-8 bg-blue-500 rounded-full" />
  <span>Welcome</span>
</div>

// GOOD - Purpose-driven design
<Avatar
  src={user.avatar}
  fallback={user.initials}
  className="ring-2 ring-primary/20"
/>
```

### 2. Consistent Systems

Establish and follow consistent design patterns.

```typescript
// Consistent button usage
<Button variant="primary" size="sm">Confirm</Button>
<Button variant="secondary" size="sm">Cancel</Button>
<Button variant="ghost" size="sm">Learn more</Button>

// Consistent spacing
<div className="space-y-4">      // Vertical rhythm
<div className="gap-4">         // Grid gaps
<div className="p-4">           // Padding
```

### 3. Intentional Typography

Typography should guide attention and convey hierarchy.

```typescript
// Hierarchy through typography
<h1 className="text-3xl font-bold tracking-tight">
  Dashboard
</h1>
<p className="text-sm text-muted-foreground">
  Welcome back, {user.name}
</p>
<p className="text-xs text-muted">
  Last updated: {lastSync}
</p>
```

### 4. Purposeful Animation

Animations should enhance, not distract.

```typescript
// Subtle, purposeful animation
<motion.div
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
  <Card>{children}</Card>
</motion.div>

// Loading states
<Skeleton className="h-4 w-3/4" />
<Skeleton className="h-4 w-1/2" />
```

### 5. Accessible by Default

Accessibility is not an afterthought.

```typescript
// Proper semantic structure
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/dashboard">Dashboard</a></li>
    <li><a href="/wallets">Wallets</a></li>
  </ul>
</nav>

// Focus indicators
<Button className="focus-visible:ring-2 focus-visible:ring-offset-2">
  Submit
</Button>
```

## Semantic Color System

### Background Colors

```typescript
// Use semantic tokens, not hardcoded colors
bg - background; // Page background
bg - card; // Card background
bg - popover; // Popover background
bg - muted; // Muted/secondary background
bg - primary; // Primary brand color
```

### Text Colors

```typescript
// Semantic text colors
text - foreground; // Primary text
text - muted; // Secondary text
text - muted - foreground; // Muted text
text - destructive; // Error/destructive
text - success; // Success state
```

### Border Colors

```typescript
// Semantic borders
border; // Default border
border - input; // Input borders
border - ring; // Focus rings
border - destructive; // Error borders
```

## Banking-Specific Patterns

### Dashboard Layout

```typescript
// Purposeful dashboard structure
<div className="grid gap-6">
  {/* Key metrics - Purpose: Quick overview */}
  <section aria-labelledby="metrics-heading">
    <h2 id="metrics-heading" className="sr-only">Key Metrics</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <MetricCard
        label="Total Balance"
        value={formatCurrency(totalBalance)}
        trend={balanceTrend}
      />
      <MetricCard
        label="Pending"
        value={formatCurrency(pending)}
        status="pending"
      />
      <MetricCard
        label="This Month"
        value={formatCurrency(monthlySpend)}
        trend={spendTrend}
      />
    </div>
  </section>

  {/* Recent transactions - Purpose: Activity tracking */}
  <section aria-labelledby="transactions-heading">
    <h2 id="transactions-heading" className="text-lg font-semibold">
      Recent Transactions
    </h2>
    <TransactionList transactions={recentTransactions} />
  </section>
</div>
```

### Wallet Card Design

```typescript
// Card with clear hierarchy
<Card className="overflow-hidden">
  <CardHeader className="bg-gradient-to-r from-primary to-primary/80">
    <CardTitle className="text-white">
      {institutionName}
    </CardTitle>
    <CardDescription className="text-white/80">
      {accountType}
    </CardDescription>
  </CardHeader>
  <CardContent className="pt-6">
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-muted-foreground">Balance</span>
      <span className="text-2xl font-bold">
        {formatCurrency(balance)}
      </span>
    </div>
  </CardContent>
</Card>
```

### Transaction List

```typescript
// Clear transaction representation
<ListItem>
  <div className="flex items-center gap-4">
    <TransactionIcon type={type} />
    <div className="flex-1 min-w-0">
      <p className="font-medium truncate">{description}</p>
      <p className="text-sm text-muted">
        {formatDate(date)} • {category}
      </p>
    </div>
    <div className={cn(
      "font-medium",
      type === 'credit' ? "text-success" : "text-foreground"
    )}>
      {type === 'credit' ? '+' : '-'}
      {formatCurrency(amount)}
    </div>
  </div>
</ListItem>
```

## Avoiding AI Slop

### Warning Signs

1. **Generic gradients**: `bg-gradient-to-r from-blue-500 to-purple-500`
2. **Excessive shadows**: `shadow-xl shadow-lg shadow-2xl`
3. **Unnecessary animations**: `animate-pulse animate-bounce`
4. **Hardcoded colors**: `bg-[#123456]` instead of semantic tokens
5. **No hierarchy**: Same font size for headings and body

### Anti-Patterns

```typescript
// AI Slop - Generic and over-designed
<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 shadow-[0_0_40px_rgba(139,92,246,0.5)]">
  <h2 className="text-4xl font-extrabold text-white drop-shadow-lg">
    Welcome!
  </h2>
  <p className="mt-4 animate-pulse text-white/90">
    Loading your data...
  </p>
</div>

// Intentional UI - Purposeful and clean
<Card>
  <CardHeader>
    <CardTitle>Welcome back</CardTitle>
    <CardDescription>
      Your dashboard is ready
    </CardDescription>
  </CardHeader>
</Card>
```

### Best Practices

1. **Start with structure**: Build semantic HTML first
2. **Add hierarchy**: Use size, weight, color for importance
3. **Use semantic tokens**: Colors from design system
4. **Test accessibility**: Verify contrast and screen reader
5. **Iterate on purpose**: Each element must justify its existence

## Component Guidelines

### Button Usage

```typescript
// Primary - Main actions
<Button variant="primary">Continue</Button>

// Secondary - Alternative actions
<Button variant="secondary">Cancel</Button>

// Ghost - Subtle actions
<Button variant="ghost">Learn more</Button>

// Destructive - Dangerous actions
<Button variant="destructive">Delete</Button>
```

### Form Design

```typescript
// Clear labels and validation
<FormField
  label="Email address"
  error={errors.email}
  helperText="We'll never share your email"
>
  <Input
    type="email"
    placeholder="you@example.com"
  />
</FormField>
```

### Card Composition

```typescript
// Consistent card structure
<Card>
  <CardHeader>
    <CardTitle>{title}</CardTitle>
    <CardDescription>{description}</CardDescription>
  </CardHeader>
  <CardContent>
    {content}
  </CardContent>
  {footer && <CardFooter>{footer}</CardFooter>}
</Card>
```

## Cross-References

- **ui-skill**: Component implementation
- **shadcn**: Component library
- **validation-skill**: Form validation
- **code-philosophy**: Internal logic philosophy

## Validation Commands

```bash
# Check semantic tokens usage
grep -r "bg-background\|text-foreground" components/

# Verify accessibility
npx axe-cli http://localhost:3000

# Check contrast
npx @contrast/cli .
```

## Performance Tips

1. Use semantic HTML for better browser optimization
2. Lazy load images with next/image
3. Use CSS containment for complex components
4. Minimize re-renders with React.memo
