---
name: canvas
description: >-
  A Cursor Canvas is a live React app that the user can open beside the chat. You MUST use a canvas when the agent produces a standalone analytical artifact — quantitative analyses, billing investigations, security audits, architecture reviews, data-heavy content, timelines, charts, tables, interactive explorations, repeatable tools, or any response that benefits from visual layout. Especially prefer a canvas when presenting results from MCP tools (Datadog, Databricks, Linear, Sentry, Slack, etc.) where the data is the deliverable — render it in a rich canvas rather than dumping it into a markdown table or code block.
metadata:
  surfaces:
    - cli
    - ide
    - chat
---

# Canvas - Interactive Visual Artifacts

Create rich, interactive visual artifacts using Cursor Canvas. This skill provides comprehensive guidance for building analytical artifacts, data visualizations, and interactive tools across all AI agent platforms (OpenCode, Cursor, GitHub Copilot).

## When to Use This Skill

- Creating quantitative analyses
- Building billing investigations
- Conducting security audits
- Architecture reviews
- Data-heavy content
- Timelines and charts
- Tables and interactive explorations
- Repeatable tools
- Presenting MCP tool results (Datadog, Sentry, Slack, etc.)

## Platform-Specific Considerations

### OpenCode

In OpenCode:
- Canvas files use `.canvas.tsx` extension
- Render as standalone React applications
- Can use data visualization libraries
- Support interactive components

### Cursor

In Cursor IDE:
- Use the Canvas feature for visual outputs
- Render charts and graphs
- Create interactive tables
- Build data exploration tools

### GitHub Copilot

In Copilot CLI or VS Code:
- Create VS Code webviews for visual output
- Use Dataframe visualization
- Build interactive notebooks

## 1. Canvas File Structure

### Basic Canvas Template

```tsx
// File: components/canvas/example.canvas.tsx

import { useMemo } from "react";

export default function ExampleCanvas() {
  // Your canvas implementation
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Example Canvas</h1>
    </div>
  );
}
```

### Canvas with Data

```tsx
// Canvas with analytical data
interface DataPoint {
  label: string;
  value: number;
  timestamp: string;
}

export default function DataCanvas() {
  const data: DataPoint[] = useMemo(() => [
    { label: "Q1", value: 100, timestamp: "2026-01" },
    { label: "Q2", value: 150, timestamp: "2026-02" },
    { label: "Q3", value: 200, timestamp: "2026-03" },
  ], []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Quarterly Analysis</h1>
      {/* Render data */}
    </div>
  );
}
```

## 2. When to Use Canvas

### Use Canvas For

| Scenario | Example | Why Canvas |
|----------|---------|------------|
| **Quantitative analysis** | Revenue breakdown by category | Visual hierarchy, charts |
| **Billing investigation** | Invoice line items | Tables with sorting |
| **Security audit** | Vulnerability report | Severity indicators |
| **Architecture review** | System diagram | Visual component tree |
| **Data-heavy content** | API response analysis | Interactive filtering |
| **Timeline** | Project milestones | Visual timeline |
| **Charts** | Performance metrics | Visual representation |
| **Interactive tools** | Query builder | Real-time interaction |
| **MCP results** | Datadog metrics | Rich visualization |

### Don't Use Canvas For

| Scenario | Use Instead |
|----------|-------------|
| Simple text response | Markdown |
| Code snippets | Code block |
| Quick status update | Chat message |
| Single metric | Inline text |

## 3. Canvas Components

### Data Tables

```tsx
// Interactive data table
export function DataTable({ data, columns }: TableProps) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      return sortDirection === "asc"
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });
  }, [data, sortField, sortDirection]);

  return (
    <table className="w-full">
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              onClick={() => {
                if (sortField === col.key) {
                  setSortDirection(d => d === "asc" ? "desc" : "asc");
                } else {
                  setSortField(col.key);
                  setSortDirection("asc");
                }
              }}
              className="cursor-pointer"
            >
              {col.label}
              {sortField === col.key && (sortDirection === "asc" ? " ↑" : " ↓")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedData.map((row, i) => (
          <tr key={i}>
            {columns.map(col => (
              <td key={col.key}>{row[col.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Charts and Graphs

```tsx
// Bar chart component
export function BarChart({ data }: { data: ChartData[] }) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end gap-2 h-64">
      {data.map((item, i) => (
        <div key={i} className="flex-1 flex flex-col items-center">
          <div
            className="bg-blue-500 w-full"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="text-sm mt-2">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
```

### Timeline Component

```tsx
// Interactive timeline
interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: "milestone" | "task" | "issue";
}

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300" />
      {events.map((event, i) => (
        <div key={i} className="relative pl-8 pb-8">
          <div className={`absolute left-2 w-4 h-4 rounded-full ${
            event.type === "milestone" ? "bg-green-500" :
            event.type === "task" ? "bg-blue-500" : "bg-red-500"
          }`} />
          <div className="text-sm text-gray-500">{event.date}</div>
          <div className="font-semibold">{event.title}</div>
          <div className="text-gray-600">{event.description}</div>
        </div>
      ))}
    </div>
  );
}
```

### Metrics Dashboard

```tsx
// Metrics dashboard
interface Metric {
  label: string;
  value: number;
  change: number;
  unit?: string;
}

export function MetricsDashboard({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((metric, i) => (
        <div key={i} className="p-4 border rounded">
          <div className="text-gray-500 text-sm">{metric.label}</div>
          <div className="text-2xl font-bold">
            {metric.value}{metric.unit}
          </div>
          <div className={`text-sm ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {metric.change >= 0 ? "↑" : "↓"} {Math.abs(metric.change)}%
          </div>
        </div>
      ))}
    </div>
  );
}
```

## 4. Canvas Patterns

### Pattern 1: MCP Data Visualization

When receiving data from MCP tools (Datadog, Sentry, etc.), render as canvas:

```tsx
// Render MCP data as interactive canvas
export function MCPCanvas({ mcpData }) {
  // Transform MCP data to visualization
  const metrics = transformMetrics(mcpData);
  const alerts = transformAlerts(mcpData);

  return (
    <div className="space-y-6">
      <MetricsDashboard metrics={metrics} />
      <AlertList alerts={alerts} />
    </div>
  );
}
```

### Pattern 2: Interactive Explorer

Build data exploration tools:

```tsx
// Interactive data explorer
export function DataExplorer({ data }) {
  const [filters, setFilters] = useState<FilterState>({});
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const matchesSearch = !search || Object.values(row).some(v =>
        String(v).toLowerCase().includes(search.toLowerCase())
      );
      const matchesFilters = Object.entries(filters).every(([key, value]) =>
        !value || row[key] === value
      );
      return matchesSearch && matchesFilters;
    });
  }, [data, filters, search]);

  return (
    <div className="space-y-4">
      <SearchInput value={search} onChange={setSearch} />
      <FilterBar filters={filters} onChange={setFilters} />
      <DataTable data={filteredData} />
    </div>
  );
}
```

### Pattern 3: Comparison View

Show before/after or comparison data:

```tsx
// Comparison canvas
export function ComparisonCanvas({ before, after }) {
  const differences = useMemo(() => {
    return compareData(before, after);
  }, [before, after]);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h3 className="font-bold mb-2">Before</h3>
        <DataSummary data={before} />
      </div>
      <div>
        <h3 className="font-bold mb-2">After</h3>
        <DataSummary data={after} />
      </div>
      <div className="col-span-2">
        <h3 className="font-bold mb-2">Differences</h3>
        <DiffHighlight differences={differences} />
      </div>
    </div>
  );
}
```

## 5. Styling Guidelines

### Use Tailwind Classes

```tsx
// Consistent styling
<div className="p-4 border rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold mb-2">Title</h2>
  <p className="text-gray-600">Description</p>
</div>
```

### Color Coding

```tsx
// Status colors
const statusColors = {
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-800"
};
```

### Responsive Design

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards */}
</div>
```

## 6. Canvas Best Practices

### Do

- Use canvas for data-heavy, analytical content
- Make canvases interactive where possible
- Include clear titles and descriptions
- Use consistent styling with Tailwind
- Add filtering and sorting for large datasets

### Don't

- Use canvas for simple text responses
- Create overly complex single-page canvases
- Skip error handling for data transformations
- Forget to handle empty data states

## 7. Common Canvas Types

### Audit Canvas

```tsx
// Security audit results
export function SecurityAuditCanvas({ audit }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2>Security Audit: {audit.target}</h2>
        <Badge type={audit.severity}>{audit.severity}</Badge>
      </div>
      <FindingList findings={audit.findings} />
      <RecommendationList recommendations={audit.recommendations} />
    </div>
  );
}
```

### Billing Canvas

```tsx
// Billing investigation
export function BillingCanvas({ invoice }) {
  return (
    <div className="space-y-4">
      <MetricsDashboard metrics={invoice.summary} />
      <LineItems items={invoice.lineItems} />
      <DiscrepancyAlert discrepancies={invoice.discrepancies} />
    </div>
  );
}
```

### Architecture Canvas

```tsx
// Architecture review
export function ArchitectureCanvas({ architecture }) {
  return (
    <div className="space-y-4">
      <ComponentDiagram components={architecture.components} />
      <DataFlow flows={architecture.dataFlows} />
      <DependencyList dependencies={architecture.dependencies} />
    </div>
  );
}
```

## 8. Testing Canvas Components

```tsx
// Test canvas rendering
import { render, screen } from "@testing-library/react";

test("renders canvas title", () => {
  render(<ExampleCanvas />);
  expect(screen.getByText("Example Canvas")).toBeInTheDocument();
});

test("displays data correctly", () => {
  render(<DataTable data={testData} columns={testColumns} />);
  expect(screen.getByText("Row 1")).toBeInTheDocument();
});
```

## 9. Performance Considerations

### Memoization

```tsx
// Use useMemo for expensive computations
const processedData = useMemo(() => {
  return expensiveOperation(rawData);
}, [rawData]);

// Use useCallback for event handlers
const handleSort = useCallback((field: string) => {
  setSortField(field);
}, []);
```

### Virtualization

```tsx
// For large datasets, use virtualization
import { useVirtualizer } from "@tanstack/react-virtual";

const rowVirtualizer = useVirtualizer({
  count: data.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 35,
});
```

## 10. Troubleshooting

### Issue: Canvas not rendering

**Solution:**
1. Check file extension is `.canvas.tsx`
2. Verify React component is default export
3. Check for console errors

### Issue: Data not displaying

**Solution:**
1. Verify data structure matches component expectations
2. Check for null/undefined values
3. Add loading and empty states

### Issue: Performance issues

**Solution:**
1. Add memoization for expensive operations
2. Implement pagination for large datasets
3. Use virtualization for long lists

## Cross-Platform Implementation

### OpenCode Canvas

```typescript
// OpenCode: Create .canvas.tsx files
// Located in components/canvas/
// Use standard React patterns
```

### Cursor Canvas

```typescript
// Cursor: Use built-in Canvas feature
// Render from chat with /canvas command
// Or create .canvas.tsx files
```

### Copilot Visualization

```typescript
// Copilot: Use VS Code webviews
// Or Dataframe visualization
// Create custom webview for complex visuals
```

## Related Skills

- `code-review` - For reviewing canvas artifacts
- `ui-skill` - For UI component patterns
- `shadcn` - For component styling

## Notes

- Always use canvas for analytical artifacts
- Prefer rich visualization over markdown tables
- Make canvases interactive when possible
- Test with various data sizes