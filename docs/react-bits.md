# React Bits — Animated React Components

Source: https://github.com/DavidHDev/react-bits  
Website: https://reactbits.dev/

## Overview

React Bits is the largest collection of animated, interactive, and fully customizable React components for building memorable UIs. **110+ free components** across 4 categories:

- 💬 **Text Animations**
- 🌀 **Animations** (general UI animations)
- 🧩 **Components**
- 🖼️ **Backgrounds**

**37.4k GitHub stars** | MIT + Commons Clause license (free for personal and commercial use)

---

## Key Features

- **110+ components** — text animations, UI elements, and backgrounds
- **Minimal dependencies** — lightweight and tree-shakeable
- **Fully customizable** — tweak via props or edit source directly
- **4 variants per component** — JS-CSS, JS-TW, TS-CSS, TS-TW (TypeScript + Tailwind = TS-TW)
- **Copy-paste ready** — works with any modern React project

---

## Installation

React Bits supports both **shadcn CLI** and **jsrepo** for component installation:

```bash
# Add a component via shadcn CLI (use TS-TW variant for this project)
npx shadcn@latest add @react-bits/BlurText-TS-TW

# Example: Add SplitText component (TypeScript + Tailwind variant)
npx shadcn@latest add @react-bits/SplitText-TS-TW

# Example: Add Marquee component
npx shadcn@latest add @react-bits/Marquee-TS-TW
```

Each component page at https://reactbits.dev has copy-ready CLI commands.

You can also select your preferred tech stack and copy the source code manually.

---

## Component Variant Naming Convention

Each component comes in 4 variants:

| Variant | Stack |
| --- | --- |
| `{Name}-JS-CSS` | JavaScript + plain CSS |
| `{Name}-JS-TW` | JavaScript + Tailwind CSS |
| `{Name}-TS-CSS` | TypeScript + plain CSS |
| `{Name}-TS-TW` | TypeScript + Tailwind CSS (**use this for this project**) |

For this Banking project, always use the **TS-TW** variant.

---

## Creative Tools

React Bits also offers free creative tools at https://reactbits.dev/tools:

| Tool | What it does |
| --- | --- |
| **Background Studio** | Explore animated backgrounds, customize effects, export as video/image/code |
| **Shape Magic** | Create inner rounded corners between shapes, export as SVG/React/clip-path |
| **Texture Lab** | Apply 20+ effects (noise, dithering, ASCII) to images/videos, export high quality |

---

## Component Categories

### Text Animations

Animated text effects for headings, paragraphs, labels.

Examples: BlurText, SplitText, GradientText, ShinyText, TextPressure, ScrollReveal, CountUp, VariableProximity, ASCIIText, CipherText, DecryptedText, FuzzyText, GlitchText, etc.

### Backgrounds

Animated background components.

Examples: Aurora, Ballpit, Beams, Bubbles, Circular Particles, Cobweb, Crosshair, DotGrid, Dunes, etc.

### Animations

General animated UI elements.

Examples: Magnet, PixelTrail, RollingGallery, Spotlight, TiltedCard, etc.

### Components

Interactive UI components with built-in animations.

Examples: CircularGallery, Dock, DynamicIsland, ElasticSlider, FlowingMenu, InfiniteScroll, Marquee, PixelCard, StackedCards, etc.

---

## Usage Pattern (TS-TW Variant)

```tsx
// After installing with: npx shadcn@latest add @react-bits/BlurText-TS-TW
import BlurText from "@/components/ui/BlurText";

export function HeroSection() {
  return (
    <BlurText
      text="Banking Made Simple"
      delay={150}
      animateBy="words"
      direction="top"
      className="text-4xl font-bold"
    />
  );
}
```

---

## Official Ports

- Vue.js: https://vue-bits.dev/

---

## Documentation

- Full docs: https://reactbits.dev/
- Installation guide: https://reactbits.dev/get-started/installation
- Tools: https://reactbits.dev/tools
- Contributing: https://github.com/DavidHDev/react-bits/blob/main/CONTRIBUTING.md
