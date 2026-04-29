# Palette

> **STRICT DEFAULT — DO NOT DEVIATE WITHOUT USER OVERRIDE.**
>
> Project plan sections use a **pale palette** that visually pairs with the architecture-diagram subgraph wrappers. The FigJam SECTION palette (`#CDF4D3`, `#C2E5FF`, `#DCCCFF`, `#FFE0C2`, etc.) is **too saturated** for project-plan boards — it clashes with the diagram colors that `generate_diagram` produces. Use the `ARCH_PALE` palette below instead.
>
> Two of these colors (`#EBFFEE` for green, `#F8F5FF` for violet) are pulled directly from `share/mermaid/src/mermaid_v2/diagrams/processors/architecture/constants.ts` — they are the section-wrapper fills the architecture layout uses for `client` and `service` subgraphs. The rest are observed from a canonical reference board.

All palette colors use **`hex/255` notation** — e.g. `{r: 0xEB/255, g: 0xFF/255, b: 0xEE/255}`. Rounded decimals render as "Custom" in FigJam.

Helper:

```js
const h = (r, g, b) => ({ r: r / 255, g: g / 255, b: b / 255 });
const CHARCOAL = h(0x1e, 0x1e, 0x1e);
const WHITE = h(0xff, 0xff, 0xff);
```

## ARCH_PALE — section background palette (THE canonical palette)

```js
const ARCH_PALE = {
  white: h(0xff, 0xff, 0xff), // gateway, external, diagram sections
  green: h(0xeb, 0xff, 0xee), // = architecture client section wrapper
  violet: h(0xf8, 0xf5, 0xff), // = architecture service section wrapper
  blueLite: h(0xf5, 0xfb, 0xff), // very pale blue (pairs with diagram datastore #BDE3FF)
  blue: h(0xdb, 0xf0, 0xff), // pale blue, slightly more saturated
  orange: h(0xff, 0xf7, 0xf0), // pale peach
  teal: h(0xf1, 0xfe, 0xfd), // very pale teal
  yellow: h(0xff, 0xfb, 0xf0), // very pale yellow
  pink: h(0xff, 0xee, 0xf8), // derived pale pink
  red: h(0xff, 0xee, 0xe8) // derived pale red/coral
};
```

## Architecture diagram node fills (DO NOT MODIFY)

These come from `CATEGORY_DEFAULT_STYLES` in the architecture constants. `generate_diagram` applies them automatically — never override.

```js
const ARCH_NODE_FILLS = {
  client: h(0xaf, 0xf4, 0xc6), // mint green (rounded rectangle)
  gateway: h(0xff, 0xff, 0xff), // white (square; diamond if labeled "Load Balancer" / "ALB" / "LB")
  service: h(0xe4, 0xcc, 0xff), // light purple (square)
  datastore: h(0xbd, 0xe3, 0xff), // light blue (cylinder / ENG_DATABASE)
  external: h(0xff, 0xff, 0xff), // white (PREDEFINED_PROCESS / 3D-stacked)
  async: h(0xbd, 0xe3, 0xff) // light blue (ENG_QUEUE / stadium shape)
};
```

Architecture **subgraph section wrappers** (only client and service get wrappers — gateway/datastore/external/async are bare shapes):

```js
const ARCH_SECTION_WRAPPERS = {
  client: h(0xeb, 0xff, 0xee), // = ARCH_PALE.green
  service: h(0xf8, 0xf5, 0xff) // = ARCH_PALE.violet
};
```

## Sticky palette

For sticky-column blocks (success metrics, risks, open questions). Stickies use a brighter palette than sections:

```js
const STICKY = {
  white: h(0xff, 0xff, 0xff),
  gray: h(0xe6, 0xe6, 0xe6),
  green: h(0xb3, 0xef, 0xbd),
  teal: h(0xb3, 0xf4, 0xef),
  blue: h(0xa8, 0xda, 0xff),
  violet: h(0xd3, 0xbd, 0xff),
  pink: h(0xff, 0xa8, 0xdb),
  red: h(0xff, 0xb8, 0xa8),
  orange: h(0xff, 0xd3, 0xa8),
  yellow: h(0xff, 0xe2, 0x99)
};
```

## Table header palette — STRICT: light fill + dark text + Bold font

> **The reference board uses a TWO-TONE per-section palette: section background = ARCH_PALE (very pale), table header = matching FigJam SECTION palette (mid-tone, same hue), table cell text = `#1E1E1E` charcoal.** Do NOT use dark fills with white text — that pattern is for FigJam's standalone tables, not for project-plan boards. The pale-on-pale two-tone is what makes the board feel cohesive.

```js
const TABLE_HEADER = {
  // Header row uses the FigJam SECTION palette — same hue as parent section, slightly more saturated
  lightGray: { fill: h(0xd9, 0xd9, 0xd9), text: CHARCOAL },
  lightGreen: { fill: h(0xcd, 0xf4, 0xd3), text: CHARCOAL },
  lightTeal: { fill: h(0xc6, 0xfa, 0xf6), text: CHARCOAL },
  lightBlue: { fill: h(0xc2, 0xe5, 0xff), text: CHARCOAL },
  lightViolet: { fill: h(0xdc, 0xcc, 0xff), text: CHARCOAL },
  lightPink: { fill: h(0xff, 0xc2, 0xec), text: CHARCOAL },
  lightRed: { fill: h(0xff, 0xcd, 0xc2), text: CHARCOAL },
  lightOrange: { fill: h(0xff, 0xe0, 0xc2), text: CHARCOAL },
  lightYellow: { fill: h(0xff, 0xec, 0xbd), text: CHARCOAL }
};
```

**Both header AND body cells use `Inter Bold` (NOT Medium).** Header text stays dark; body cell fill stays white (default).

## Section → default ARCH_PALE color (slug-based mapping)

```js
const SECTION_COLOR_BY_SLUG = {
  motivation: ARCH_PALE.violet, // ideation/intro — pairs with service
  context: ARCH_PALE.white,
  goals: ARCH_PALE.green, // north star — pairs with client
  approach: ARCH_PALE.green,
  alternatives: ARCH_PALE.yellow, // caution / "considered"
  designDecisions: ARCH_PALE.blue, // structured decisions — pairs with datastore
  dependencies: ARCH_PALE.orange, // warnings / external dependencies
  implementation: ARCH_PALE.violet, // active work — pairs with service
  milestones: ARCH_PALE.blue, // time/sequencing
  rollout: ARCH_PALE.orange, // launches / staged
  risks: ARCH_PALE.pink, // hazards
  diagram: ARCH_PALE.white // right-column diagram sections
};
```

## Section → matching table header (STRICT mapping)

When a section contains a table, the table header uses the FigJam SECTION palette color **matching the parent section's hue**.

```js
const TABLE_HEADER_BY_SECTION = {
  motivation: TABLE_HEADER.lightViolet,
  context: TABLE_HEADER.lightGray,
  goals: TABLE_HEADER.lightGreen,
  approach: TABLE_HEADER.lightGreen,
  alternatives: TABLE_HEADER.lightYellow,
  designDecisions: TABLE_HEADER.lightBlue,
  dependencies: TABLE_HEADER.lightOrange,
  implementation: TABLE_HEADER.lightViolet,
  milestones: TABLE_HEADER.lightBlue,
  rollout: TABLE_HEADER.lightOrange,
  risks: TABLE_HEADER.lightPink
};
```

**Two-tone effect:** section bg = ARCH_PALE.X (very pale X-hue), table header = TABLE_HEADER.lightX (mid-tone X-hue), body cells white. This creates a coherent layered look across each section.

## Text colors

Body text inside any pale section is `CHARCOAL` (`#1E1E1E`). White text on dark table headers and saturated stickies. Never use a colored text fill.

## What NOT to use (and why)

| Wrong palette | Why not |
| --- | --- |
| `#CDF4D3` (FigJam lightGreen) | Too saturated. Mismatches diagram client wrapper `#EBFFEE`. |
| `#C2E5FF` (FigJam lightBlue) | Too saturated. Visual jump next to diagram subgraphs. |
| `#DCCCFF` (FigJam lightViolet) | Too saturated. Mismatches diagram service wrapper `#F8F5FF`. |
| `#FFE0C2` (FigJam lightOrange) | Too saturated. Use `#FFF7F0` instead. |
| `#FFC2EC` (FigJam lightPink) | Too saturated. Use `#FFEEF8`. |

If a user explicitly asks for the saturated FigJam palette, override per-section. **Otherwise, ARCH_PALE is mandatory.**
