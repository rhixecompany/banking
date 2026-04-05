# shadcn/ui Documentation

## Introduction

shadcn/ui is a set of beautifully-designed, accessible components and a code distribution platform. Works with your favorite frameworks and AI models. This is not a component library - it is how you build your component library.

## Philosophy

### Open Code

shadcn/ui hands you the actual component code. You have full control to customize and extend the components. Unlike traditional libraries where you override styles or wrap components, with shadcn/ui you simply edit the button code directly.

### Composition

Every component in shadcn/ui shares a common, composable interface. If a component does not exist, we bring it in, make it composable, and adjust its style to match and work with the rest of the design system.

### Distribution

shadcn/ui defines a schema for components and a CLI to distribute them:

- **Schema**: A flat-file structure that defines components, their dependencies, and properties
- **CLI**: A command-line tool to distribute and install components across projects

### Beautiful Defaults

Carefully chosen default styles so you get great design out-of-the-box. Components naturally fit with one another.

### AI-Ready

Open code for LLMs to read, understand, and improve. The design makes it easy for AI tools to work with your code.

## Installation

### Quick Start

```bash
npx shadcn@latest init
```

### Add Components

```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
```

## Components

Available components include:

- Accordion, Alert, Alert Dialog, Aspect Ratio, Avatar, Badge
- Breadcrumb, Button, Calendar, Card, Carousel, Chart
- Checkbox, Collapsible, Combobox, Command, Context Menu
- Data Table, Date Picker, Dialog, Direction, Drawer
- Dropdown Menu, Empty, Field, Hover Card, Input
- Label, Menubar, Navigation Menu, Pagination, Popover
- Progress, Radio Group, Resizable, Scroll Area, Select
- Separator, Sheet, Sidebar, Skeleton, Slider
- Switch, Table, Tabs, Textarea, Toast, Toggle
- Tooltip, Typography

## Theming

shadcn/ui uses CSS variables for theming. Edit `app/globals.css` to customize:

```css
@theme {
  --primary: hsl(var(--primary));
  --primary-foreground: hsl(var(--primary-foreground));
  --background: hsl(var(--background));
  --foreground: hsl(var(--foreground));
}
```

## CLI Commands

```bash
# Initialize
npx shadcn@latest init

# Add component
npx shadcn@latest add [component]

# Add all components
npx shadcn@latest add -a

# Update components
npx shadcn@latest update

# Remove component
npx shadcn@latest remove [component]
```

## Registry

shadcn/ui maintains a registry of components that can be used with the CLI. Components are defined in `registry/schema.ts` and built from the `components.json` file.

## Forms

shadcn/ui integrates with form libraries:

- React Hook Form with zod-resolver
- TanStack Form

## Related Documentation

- [shadcn Theming](../shadcn.md)
- [shadcn UI Intro](../shadcn-ui-intro.md)

---

_Source: https://ui.shadcn.com/docs_
