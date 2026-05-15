import * as React from "react";

// Lightweight test-double for the Radix-based Select used in the app.
// This renders a native <select> with <option> children derived from
// <SelectItem> usages found in the component tree. It intentionally
// simplifies behavior for deterministic unit tests.

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface SelectProps
 * @typedef {SelectProps}
 */
interface SelectProps {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  value?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?(v: string) => void}
   */
  onValueChange?: (v: string) => void;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?React.ReactNode}
   */
  children?: React.ReactNode;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  className?: string;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {?string}
   */
  id?: string;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {*} x
 * @returns {x is React.ReactElement}
 */
function isElement(x: any): x is React.ReactElement {
  return React.isValidElement(x);
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ReactNode} node
 * @returns {{ value: string; label: React.ReactNode }[]}
 */
function findItems(
  node: React.ReactNode,
): { value: string; label: React.ReactNode }[] {
  const out: { value: string; label: React.ReactNode }[] = [];

  function walk(n: React.ReactNode) {
    if (n == undefined) return;
    if (Array.isArray(n)) {
      n.forEach(walk);
      return;
    }
    if (!isElement(n)) return;
    // Check if this element is the test-double's SelectItem
    if (n.type === SelectItem) {
      const { children, value } = n.props as any;
      out.push({ label: children, value: String(value) });
      return;
    }
    // Recurse into children
    walk((n.props as any)?.children);
  }

  walk(node);
  return out;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @param {React.ReactNode} node
 * @returns {(string | undefined)}
 */
function findTriggerId(node: React.ReactNode): string | undefined {
  let found: string | undefined = undefined;

  function walk(n: React.ReactNode) {
    if (n == undefined) return;
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

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {SelectProps} param0
 * @param {React.ReactNode} param0.children
 * @param {(v: string) => void} param0.onValueChange
 * @param {string} param0.value
 * @returns {ReactJSX.Element}
 */
export function Select({ children, onValueChange, value }: SelectProps) {
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

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {*} props
 * @returns {ReactJSX.Element}
 */
export function SelectTrigger(props: any) {
  // Render nothing; Select test-double uses the trigger's id when present.
  return <span data-test-select-trigger id={props.id} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {{ children?: React.ReactNode }} param0
 * @param {React.ReactNode} param0.children
 * @returns
 */
export function SelectContent({ children }: { children?: React.ReactNode }) {
  return <div data-test-select-content>{children}</div>;
}
SelectContent.displayName = "TestSelectContent";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {{
 *   value: string;
 *   children?: React.ReactNode;
 * }} param0
 * @param {React.ReactNode} param0.children
 * @param {string} param0.value
 * @returns {*}
 */
export function SelectItem({
  children,
  value,
}: {
  value: string;
  children?: React.ReactNode;
}) {
  // This component is not intended to render by itself in the test DOM;
  // the Select root collects items and renders native options. We still
  // return null to avoid duplicate DOM nodes when used directly.
  return null as any;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {*} _props
 * @returns {*}
 */
export function SelectValue(_props: any) {
  return null as any;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {*} props
 * @returns {ReactJSX.Element}
 */
export function SelectGroup(props: any) {
  return <div {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {*} props
 * @returns {ReactJSX.Element}
 */
export function SelectLabel(props: any) {
  return <label {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {*} props
 * @returns {ReactJSX.Element}
 */
export function SelectSeparator(props: any) {
  return <span {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {*} props
 * @returns {ReactJSX.Element}
 */
export function SelectScrollUpButton(props: any) {
  return <button type="button" {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {*} props
 * @returns {ReactJSX.Element}
 */
export function SelectScrollDownButton(props: any) {
  return <button type="button" {...props} />;
}

// End of test-double
