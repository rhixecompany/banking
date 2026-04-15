import * as React from "react";

// Lightweight test-double for the Radix-based Select used in the app.
// This renders a native <select> with <option> children derived from
// <SelectItem> usages found in the component tree. It intentionally
// simplifies behavior for deterministic unit tests.

type SelectProps = {
  value?: string;
  onValueChange?: (v: string) => void;
  children?: React.ReactNode;
  className?: string;
  id?: string;
};

function isElement(x: any): x is React.ReactElement {
  return React.isValidElement(x);
}

function findItems(
  node: React.ReactNode,
): { value: string; label: React.ReactNode }[] {
  const out: { value: string; label: React.ReactNode }[] = [];

  function walk(n: React.ReactNode) {
    if (n == null) return;
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (!isElement(n)) return;
    // Check if this element is the test-double's SelectItem
    if (n.type === SelectItem) {
      const { value, children } = n.props as any;
      out.push({ value: String(value), label: children });
      return;
    }
    // Recurse into children
    walk((n.props as any)?.children);
  }

  walk(node);
  return out;
}

function findTriggerId(node: React.ReactNode): string | undefined {
  let found: string | undefined = undefined;

  function walk(n: React.ReactNode) {
    if (n == null) return;
    if (Array.isArray(n)) return n.forEach(walk);
    if (!isElement(n)) return;
    if (n.type === SelectTrigger) {
      found = (n.props as any)?.id;
      return;
    }
    walk((n.props as any)?.children);
  }

  walk(node);
  return found;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const items = findItems(children);
  const triggerId = findTriggerId(children);

  return (
    <select
      id={triggerId}
      value={value}
      onChange={(e) => onValueChange?.(e.target.value)}
      data-testid={triggerId ? `select-${triggerId}` : "select-root"}
    >
      {items.map((it) => (
        <option key={it.value} value={it.value} data-value={it.value}>
          {it.label}
        </option>
      ))}
    </select>
  );
}

export function SelectTrigger(props: any) {
  // Render nothing; Select test-double uses the trigger's id when present.
  return <span data-test-select-trigger id={props.id} />;
}

export function SelectContent({ children }: { children?: React.ReactNode }) {
  return <div data-test-select-content>{children}</div>;
}
SelectContent.displayName = "TestSelectContent";

export function SelectItem({
  value,
  children,
}: {
  value: string;
  children?: React.ReactNode;
}) {
  // This component is not intended to render by itself in the test DOM;
  // the Select root collects items and renders native options. We still
  // return null to avoid duplicate DOM nodes when used directly.
  return null as any;
}

export function SelectValue(_props: any) {
  return null as any;
}

export function SelectGroup(props: any) {
  return <div {...props} />;
}

export function SelectLabel(props: any) {
  return <label {...props} />;
}

export function SelectSeparator(props: any) {
  return <span {...props} />;
}

export function SelectScrollUpButton(props: any) {
  return <button type="button" {...props} />;
}

export function SelectScrollDownButton(props: any) {
  return <button type="button" {...props} />;
}

// End of test-double
