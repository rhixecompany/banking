# shadcn/ui — Introduction

Source: https://ui.shadcn.com/docs

## What is shadcn/ui?

shadcn/ui is a set of **beautifully-designed, accessible components** and a **code distribution platform**. It works with your favorite frameworks and AI models. Open Source. Open Code.

> **This is not a component library. It is how you build your component library.**

---

## Core Philosophy

Unlike traditional component libraries where you install a package and import components, shadcn/ui **gives you the actual component code**. You own it, you modify it, you extend it.

### 4 Core Principles

| Principle | Description |
| --- | --- |
| **Open Code** | The top layer of your component code is open for modification |
| **Composition** | Every component uses a common, composable interface — predictable for your team and AI |
| **Distribution** | Flat-file schema + CLI makes it easy to distribute components across projects |
| **Beautiful Defaults** | Carefully chosen default styles — great design out-of-the-box |

### AI-Ready

Open code means LLMs can read, understand, and improve your components. This is a first-class feature of shadcn/ui.

---

## Why Not a Traditional Library?

Traditional approach problems:

- Wrapping library components to customize them
- Writing workarounds to override styles
- Mixing components from libraries with incompatible APIs

shadcn/ui solution: You get the source, you edit it directly.

---

## Full Component List

shadcn/ui includes (as of current version):

**Layout & Structure**

- Accordion, Aspect Ratio, Card, Collapsible, Resizable, Scroll Area, Separator, Sheet, Sidebar, Tabs

**Form & Input**

- Button, Button Group, Calendar, Checkbox, Combobox, Command, Date Picker, Input, Input Group, Input OTP, Label, Native Select, Radio Group, Select, Slider, Switch, Textarea, Toggle, Toggle Group

**Overlay & Popup**

- Alert Dialog, Context Menu, Dialog, Drawer, Dropdown Menu, Hover Card, Menubar, Navigation Menu, Popover, Tooltip

**Feedback & Status**

- Alert, Badge, Progress, Skeleton, Sonner (toasts), Spinner

**Data Display**

- Avatar, Breadcrumb, Chart, Carousel, Data Table, Empty, Field, Item, Kbd, Pagination, Table, Typography

**Utility**

- Direction

---

## Installation

```bash
# Add a component
npx shadcn@latest add button

# Add multiple
npx shadcn@latest add card input label

# Initialize in a new project
npx shadcn@latest init
```

Configuration: `components.json` in project root.

---

## Usage in This Project

This Banking app uses shadcn/ui with Tailwind CSS v4. Components live in `components/ui/`.

```tsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
```

---

## Distribution System

shadcn/ui defines a **flat-file schema** for components and a **CLI** to distribute them:

- **Schema**: Defines components, dependencies, and properties
- **CLI**: Distributes and installs components across projects with cross-framework support

You can use the schema to:

- Distribute your own components to other projects
- Have AI generate new components based on existing schema

---

## Resources

- Docs: https://ui.shadcn.com/docs
- Components: https://ui.shadcn.com/docs/components
- Blocks: https://ui.shadcn.com/blocks
- Charts: https://ui.shadcn.com/charts
- GitHub: https://github.com/shadcn-ui/ui (111k stars)
- CLI reference: https://ui.shadcn.com/docs/cli
- Theming: https://ui.shadcn.com/docs/theming
- Dark mode: https://ui.shadcn.com/docs/dark-mode
- React Hook Form integration: https://ui.shadcn.com/docs/forms/react-hook-form
