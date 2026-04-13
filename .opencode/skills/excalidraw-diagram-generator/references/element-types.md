# Excalidraw Element Types Guide

Detailed specifications for each Excalidraw element type with visual examples and use cases.

## Element Type Overview

| Type | Visual | Primary Use | Text Support |
| --- | --- | --- | --- |
| `rectangle` | □ | Boxes, containers, process steps | ✅ Yes |
| `ellipse` | ○ | Emphasis, terminals, states | ✅ Yes |
| `diamond` | ◇ | Decision points, choices | ✅ Yes |
| `arrow` | → | Directional flow, relationships | ❌ No (use separate text) |
| `line` | — | Connections, dividers | ❌ No |
| `text` | A | Labels, annotations, titles | ✅ (Its purpose) |

---

## Rectangle

**Best for:** Process steps, entities, data stores, components

### Properties

```typescript
{
  type: "rectangle",
  roundness: { type: 3 },  // Rounded corners
  text: "Step Name",       // Optional embedded text
  fontSize: 20,
  textAlign: "center",
  verticalAlign: "middle"
}
```

### Use Cases

| Scenario             | Configuration                               |
| -------------------- | ------------------------------------------- |
| **Process step**     | Green background (`#b2f2bb`), centered text |
| **Entity/Object**    | Blue background (`#a5d8ff`), medium size    |
| **System component** | Light color, descriptive text               |
| **Data store**       | Gray/white, database-like label             |

### Size Guidelines

| Content                  | Width     | Height    |
| ------------------------ | --------- | --------- |
| Single word              | 120-150px | 60-80px   |
| Short phrase (2-4 words) | 180-220px | 80-100px  |
| Sentence                 | 250-300px | 100-120px |

### Example

```json
{
  "backgroundColor": "#b2f2bb",
  "fontSize": 20,
  "height": 80,
  "roundness": { "type": 3 },
  "text": "Validate Input",
  "textAlign": "center",
  "type": "rectangle",
  "verticalAlign": "middle",
  "width": 200,
  "x": 100,
  "y": 100
}
```

---

## Ellipse

**Best for:** Start/end points, states, emphasis circles

### Properties

```typescript
{
  type: "ellipse",
  text: "Start",
  fontSize: 18,
  textAlign: "center",
  verticalAlign: "middle"
}
```

### Use Cases

| Scenario       | Configuration               |
| -------------- | --------------------------- |
| **Flow start** | Light green, "Start" text   |
| **Flow end**   | Light red, "End" text       |
| **State**      | Soft color, state name      |
| **Highlight**  | Bright color, emphasis text |

### Size Guidelines

For circular shapes, use `width === height`:

| Content     | Diameter  |
| ----------- | --------- |
| Icon/Symbol | 60-80px   |
| Short text  | 100-120px |
| Longer text | 150-180px |

### Example

```json
{
  "backgroundColor": "#d0f0c0",
  "fontSize": 18,
  "height": 120,
  "text": "Start",
  "textAlign": "center",
  "type": "ellipse",
  "verticalAlign": "middle",
  "width": 120,
  "x": 100,
  "y": 100
}
```

---

## Diamond

**Best for:** Decision points, conditional branches

### Properties

```typescript
{
  type: "diamond",
  text: "Valid?",
  fontSize: 18,
  textAlign: "center",
  verticalAlign": "middle"
}
```

### Use Cases

| Scenario            | Text Example           |
| ------------------- | ---------------------- |
| **Yes/No decision** | "Is Valid?", "Exists?" |
| **Multiple choice** | "Type?", "Status?"     |
| **Conditional**     | "Score > 50?"          |

### Size Guidelines

Diamonds need more space than rectangles for the same text:

| Content         | Width     | Height    |
| --------------- | --------- | --------- |
| Yes/No          | 120-140px | 120-140px |
| Short question  | 160-180px | 160-180px |
| Longer question | 200-220px | 200-220px |

### Example

```json
{
  "backgroundColor": "#ffe4a3",
  "fontSize": 18,
  "height": 150,
  "text": "Valid?",
  "textAlign": "center",
  "type": "diamond",
  "verticalAlign": "middle",
  "width": 150,
  "x": 100,
  "y": 100
}
```

---

## Arrow

**Best for:** Flow direction, relationships, dependencies

### Properties

```typescript
{
  type: "arrow",
  points: [[0, 0], [endX, endY]],  // Relative coordinates
  roundness: { type: 2 },          // Curved
  startBinding: null,              // Or { elementId, focus, gap }
  endBinding: null
}
```

### Arrow Directions

#### Horizontal (Left to Right)

```json
{
  "height": 0,
  "points": [
    [0, 0],
    [200, 0]
  ],
  "width": 200,
  "x": 100,
  "y": 150
}
```

#### Vertical (Top to Bottom)

```json
{
  "height": 150,
  "points": [
    [0, 0],
    [0, 150]
  ],
  "width": 0,
  "x": 200,
  "y": 100
}
```

#### Diagonal

```json
{
  "height": 150,
  "points": [
    [0, 0],
    [200, 150]
  ],
  "width": 200,
  "x": 100,
  "y": 100
}
```

### Arrow Styles

| Style | `strokeStyle` | `strokeWidth` | Use Case |
| --- | --- | --- | --- |
| **Normal flow** | `"solid"` | 2 | Standard connections |
| **Optional/Weak** | `"dashed"` | 2 | Optional paths |
| **Important** | `"solid"` | 3-4 | Emphasized flow |
| **Dotted** | `"dotted"` | 2 | Indirect relationships |

### Adding Arrow Labels

Use separate text elements positioned near arrow midpoint:

```json
[
  {
    "type": "arrow",
    "id": "arrow1",
    "x": 100,
    "y": 150,
    "points": [
      [0, 0],
      [200, 0]
    ]
  },
  {
    "type": "text",
    "x": 180, // Near midpoint
    "y": 130, // Above arrow
    "text": "sends",
    "fontSize": 14
  }
]
```

---

## Line

**Best for:** Non-directional connections, dividers, borders

### Properties

```typescript
{
  type: "line",
  points: [[0, 0], [x2, y2], [x3, y3], ...],
  roundness: null  // Or { type: 2 } for curved
}
```

### Use Cases

| Scenario       | Configuration           |
| -------------- | ----------------------- |
| **Divider**    | Horizontal, thin stroke |
| **Border**     | Closed path (polygon)   |
| **Connection** | Multi-point path        |
| **Underline**  | Short horizontal line   |

### Multi-Point Line Example

```json
{
  "points": [
    [0, 0],
    [100, 50],
    [200, 0]
  ],
  "type": "line",
  "x": 100,
  "y": 100
}
```

---

## Text

**Best for:** Labels, titles, annotations, standalone text

### Properties

```typescript
{
  type: "text",
  text: "Label text",
  fontSize: 20,
  fontFamily: 1,        // 1=Virgil, 2=Helvetica, 3=Cascadia
  textAlign: "left",
  verticalAlign: "top"
}
```

### Font Sizes by Purpose

| Purpose            | Font Size |
| ------------------ | --------- |
| **Main title**     | 28-36     |
| **Section header** | 24-28     |
| **Element label**  | 18-22     |
| **Annotation**     | 14-16     |
| **Small note**     | 12-14     |

### Width/Height Calculation

```javascript
// Approximate width
const width = text.length * fontSize * 0.6;

// Approximate height (single line)
const height = fontSize * 1.2;

// Multi-line
const lines = text.split("\n").length;
const height = fontSize * 1.2 * lines;
```

### Text Positioning

| Position         | textAlign  | verticalAlign | Use Case       |
| ---------------- | ---------- | ------------- | -------------- |
| **Top-left**     | `"left"`   | `"top"`       | Default labels |
| **Centered**     | `"center"` | `"middle"`    | Titles         |
| **Bottom-right** | `"right"`  | `"bottom"`    | Footnotes      |

### Example: Title

```json
{
  "fontFamily": 2,
  "fontSize": 32,
  "height": 40,
  "text": "System Architecture",
  "textAlign": "center",
  "type": "text",
  "verticalAlign": "top",
  "width": 400,
  "x": 100,
  "y": 50
}
```

### Example: Annotation

```json
{
  "fontFamily": 1,
  "fontSize": 14,
  "height": 20,
  "text": "User input",
  "textAlign": "left",
  "type": "text",
  "verticalAlign": "top",
  "width": 100,
  "x": 150,
  "y": 200
}
```

---

## Combining Elements

### Pattern: Labeled Box

```json
[
  {
    "type": "rectangle",
    "id": "box1",
    "x": 100,
    "y": 100,
    "width": 200,
    "height": 100,
    "text": "Component",
    "textAlign": "center",
    "verticalAlign": "middle"
  }
]
```

### Pattern: Connected Boxes

```json
[
  {
    "type": "rectangle",
    "id": "box1",
    "x": 100,
    "y": 100,
    "width": 150,
    "height": 80,
    "text": "Step 1"
  },
  {
    "type": "arrow",
    "id": "arrow1",
    "x": 250,
    "y": 140,
    "points": [
      [0, 0],
      [100, 0]
    ]
  },
  {
    "type": "rectangle",
    "id": "box2",
    "x": 350,
    "y": 100,
    "width": 150,
    "height": 80,
    "text": "Step 2"
  }
]
```

### Pattern: Decision Tree

```json
[
  {
    "type": "diamond",
    "id": "decision",
    "x": 100,
    "y": 100,
    "width": 140,
    "height": 140,
    "text": "Valid?"
  },
  {
    "type": "arrow",
    "id": "yes-arrow",
    "x": 240,
    "y": 170,
    "points": [
      [0, 0],
      [60, 0]
    ]
  },
  {
    "type": "text",
    "id": "yes-label",
    "x": 250,
    "y": 150,
    "text": "Yes",
    "fontSize": 14
  },
  {
    "type": "rectangle",
    "id": "yes-box",
    "x": 300,
    "y": 140,
    "width": 120,
    "height": 60,
    "text": "Process"
  }
]
```

---

## Summary

| When you need...     | Use this element        |
| -------------------- | ----------------------- |
| Process box          | `rectangle` with text   |
| Decision point       | `diamond` with question |
| Flow direction       | `arrow`                 |
| Start/End            | `ellipse`               |
| Title/Header         | `text` (large font)     |
| Annotation           | `text` (small font)     |
| Non-directional link | `line`                  |
| Divider              | `line` (horizontal)     |
