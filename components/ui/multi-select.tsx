"use client";

import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @interface MultiSelectContextType
 * @typedef {MultiSelectContextType}
 */
interface MultiSelectContextType {
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {boolean}
   */
  open: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(open: boolean) => void}
   */
  setOpen: (open: boolean) => void;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {Set<string>}
   */
  selectedValues: Set<string>;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(value: string) => void}
   */
  toggleValue: (value: string) => void;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {Map<string, ReactNode>}
   */
  items: Map<string, ReactNode>;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {boolean}
   */
  single: boolean;
  /**
   * Description placeholder
   * @author Adminbot
   *
   * @type {(value: string, label: ReactNode) => void}
   */
  onItemAdded: (value: string, label: ReactNode) => void;
}
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const MultiSelectContext = createContext<MultiSelectContextType | null>(null);

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {{
 *   children: ReactNode;
 *   values?: string[];
 *   defaultValues?: string[];
 *   onValuesChange?: (values: string[]) => void;
 *   single?: boolean;
 * }} param0
 * @param {ReactNode} param0.children
 * @param {{}} param0.defaultValues
 * @param {(values: {}) => void} param0.onValuesChange
 * @param {boolean} [param0.single=false]
 * @param {{}} param0.values
 * @returns {void; single?: boolean; }) => ReactJSX.Element}
 */
export function MultiSelect({
  children,
  defaultValues,
  onValuesChange,
  single = false,
  values,
}: {
  children: ReactNode;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  single?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [internalValues, setInternalValues] = useState(
    new Set<string>(values ?? defaultValues),
  );
  const selectedValues = values ? new Set(values) : internalValues;
  const [items, setItems] = useState<Map<string, ReactNode>>(new Map());

  function toggleValue(value: string) {
    const getNewSet = (prev: Set<string>) => {
      if (single) {
        return prev.has(value) ? new Set<string>() : new Set<string>([value]);
      }
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    };
    setInternalValues(getNewSet);
    onValuesChange?.([...getNewSet(selectedValues)]);
    if (single) setOpen(false);
  }

  const onItemAdded = useCallback((value: string, label: ReactNode) => {
    setItems((prev) => {
      if (prev.get(value) === label) return prev;
      return new Map(prev).set(value, label);
    });
  }, []);

  return (
    <MultiSelectContext
      value={{
        items,
        onItemAdded,
        open,
        selectedValues,
        setOpen,
        single,
        toggleValue,
      }}
    >
      <Popover open={open} onOpenChange={setOpen} modal={true}>
        {children}
      </Popover>
    </MultiSelectContext>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {({
 *   className?: string;
 *   children?: ReactNode;
 * } & ComponentPropsWithoutRef<typeof Button>)} param0
 * @param {*} param0.children
 * @param {*} param0.className
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
export function MultiSelectTrigger({
  children,
  className,
  ...props
}: {
  className?: string;
  children?: ReactNode;
} & ComponentPropsWithoutRef<typeof Button>) {
  const { open } = useMultiSelectContext();

  return (
    <PopoverTrigger asChild>
      <Button
        {...props}
        variant={props.variant ?? "outline"}
        role={props.role ?? "combobox"}
        aria-expanded={props["aria-expanded"] ?? open}
        className={cn(
          "flex h-auto min-h-9 w-fit items-center justify-between gap-2 overflow-hidden rounded-md border border-input bg-transparent px-3 py-1.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
          className,
        )}
      >
        {children}
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {({
 *   placeholder?: string;
 *   clickToRemove?: boolean;
 *   overflowBehavior?: "cutoff" | "wrap-when-open" | "wrap";
 * } & Omit<ComponentPropsWithoutRef<"div">, "children">)} param0
 * @param {*} param0.className
 * @param {*} [param0.clickToRemove=true]
 * @param {*} [param0.overflowBehavior="wrap-when-open"]
 * @param {*} param0.placeholder
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
export function MultiSelectValue({
  className,
  clickToRemove = true,
  overflowBehavior = "wrap-when-open",
  placeholder,
  ...props
}: {
  placeholder?: string;
  clickToRemove?: boolean;
  overflowBehavior?: "cutoff" | "wrap-when-open" | "wrap";
} & Omit<ComponentPropsWithoutRef<"div">, "children">) {
  const { items, open, selectedValues, single, toggleValue } =
    useMultiSelectContext();
  const [overflowAmount, setOverflowAmount] = useState(0);
  const valueRef = useRef<HTMLDivElement>(null);
  const overflowRef = useRef<HTMLDivElement>(null);

  const shouldWrap =
    overflowBehavior === "wrap" ||
    (overflowBehavior === "wrap-when-open" && open);

  const checkOverflow = useCallback(() => {
    if (valueRef.current === null) return;

    const containerElement = valueRef.current;
    const overflowElement = overflowRef.current;
    const items = containerElement.querySelectorAll<HTMLElement>(
      "[data-selected-item]",
    );

    if (overflowElement !== null) overflowElement.style.display = "none";
    for (const child of items) child.style.removeProperty("display");
    let amount = 0;
    for (let i = items.length - 1; i >= 0; i--) {
      const child = items[i];
      if (!child) continue;
      if (containerElement.scrollWidth <= containerElement.clientWidth) {
        break;
      }
      amount = items.length - i;
      child.style.display = "none";
      if (overflowElement !== null)
        overflowElement.style.removeProperty("display");
    }
    setOverflowAmount(amount);
  }, []);

  const handleResize = useCallback(
    (node: HTMLDivElement) => {
      valueRef.current = node;

      const mutationObserver = new MutationObserver(checkOverflow);
      const observer = new ResizeObserver(debounce(checkOverflow, 100));

      mutationObserver.observe(node, {
        attributeFilter: ["class", "style"],
        attributes: true,
        childList: true,
      });
      observer.observe(node);

      return () => {
        observer.disconnect();
        mutationObserver.disconnect();
        valueRef.current = null;
      };
    },
    [checkOverflow],
  );

  if (selectedValues.size === 0 && placeholder) {
    return (
      <span className="min-w-0 overflow-hidden font-normal text-muted-foreground">
        {placeholder}
      </span>
    );
  }

  if (single && selectedValues.size > 0) {
    return (
      <span className="min-w-0 overflow-hidden">
        {items.get([...selectedValues][0])}
      </span>
    );
  }

  return (
    <div
      {...props}
      ref={handleResize}
      className={cn(
        "flex w-full gap-1.5 overflow-hidden",
        shouldWrap && "h-full flex-wrap",
        className,
      )}
    >
      {[...selectedValues]
        .filter((value) => items.has(value))
        .map((value) => (
          <Badge
            variant="outline"
            data-selected-item
            className="group flex items-center gap-1"
            key={value}
            onClick={
              clickToRemove
                ? (e) => {
                    e.stopPropagation();
                    toggleValue(value);
                  }
                : undefined
            }
          >
            {items.get(value)}
            {clickToRemove && (
              <XIcon className="size-2 text-muted-foreground group-hover:text-destructive" />
            )}
          </Badge>
        ))}
      <Badge
        style={{
          display: overflowAmount > 0 && !shouldWrap ? "block" : "none",
        }}
        variant="outline"
        ref={overflowRef}
      >
        +{overflowAmount}
      </Badge>
    </div>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {({
 *   search?: { placeholder?: string; emptyMessage?: string } | boolean;
 *   children: ReactNode;
 * } & Omit<ComponentPropsWithoutRef<typeof Command>, "children">)} param0
 * @param {*} param0.children
 * @param {*} [param0.search=true]
 * @param {*} param0....props
 * @returns {*}
 */
export function MultiSelectContent({
  children,
  search = true,
  ...props
}: {
  search?: { placeholder?: string; emptyMessage?: string } | boolean;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<typeof Command>, "children">) {
  const canSearch = typeof search === "object" ? true : search;
  // When search is disabled, focus a hidden button via ref instead of using autoFocus.
  const hiddenFocusRef = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (!canSearch && hiddenFocusRef.current) {
      hiddenFocusRef.current.focus();
    }
  }, [canSearch]);

  return (
    <>
      <div style={{ display: "none" }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              placeholder={
                typeof search === "object" ? search.placeholder : undefined
              }
            />
          ) : (
            <button ref={hiddenFocusRef} className="sr-only" />
          )}
          <CommandList>
            {canSearch && (
              <CommandEmpty>
                {typeof search === "object" ? search.emptyMessage : undefined}
              </CommandEmpty>
            )}
            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {({
 *   badgeLabel?: ReactNode;
 *   value: string;
 * } & Omit<ComponentPropsWithoutRef<typeof CommandItem>, "value">)} param0
 * @param {*} param0.badgeLabel
 * @param {*} param0.children
 * @param {*} param0.onSelect
 * @param {*} param0.value
 * @param {*} param0....props
 * @returns {ReactJSX.Element}
 */
export function MultiSelectItem({
  badgeLabel,
  children,
  onSelect,
  value,
  ...props
}: {
  badgeLabel?: ReactNode;
  value: string;
} & Omit<ComponentPropsWithoutRef<typeof CommandItem>, "value">) {
  const { onItemAdded, selectedValues, toggleValue } = useMultiSelectContext();
  const isSelected = selectedValues.has(value);

  useEffect(() => {
    onItemAdded(value, badgeLabel ?? children);
  }, [value, children, onItemAdded, badgeLabel]);

  return (
    <CommandItem
      {...props}
      onSelect={() => {
        toggleValue(value);
        onSelect?.(value);
      }}
    >
      <CheckIcon
        className={cn("me-2 size-4", isSelected ? "opacity-100" : "opacity-0")}
      />
      {children}
    </CommandItem>
  );
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {ComponentPropsWithoutRef<typeof CommandGroup>} props
 * @returns {ReactJSX.Element}
 */
export function MultiSelectGroup(
  props: ComponentPropsWithoutRef<typeof CommandGroup>,
) {
  return <CommandGroup {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {ComponentPropsWithoutRef<typeof CommandSeparator>} props
 * @returns {ReactJSX.Element}
 */
export function MultiSelectSeparator(
  props: ComponentPropsWithoutRef<typeof CommandSeparator>,
) {
  return <CommandSeparator {...props} />;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @returns {*}
 */
function useMultiSelectContext() {
  const context = useContext(MultiSelectContext);
  if (context == null) {
    throw new Error(
      "useMultiSelectContext must be used within a MultiSelectContext",
    );
  }
  return context;
}

/**
 * Description placeholder
 * @author Adminbot
 *
 * @template {(...args: never[]) => void} T
 * @param {T} func
 * @param {number} wait
 * @returns {(...args: Parameters<T>) => void}
 */
function debounce<T extends (...args: never[]) => void>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: null | ReturnType<typeof setTimeout> = null;
  return function (this: unknown, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
