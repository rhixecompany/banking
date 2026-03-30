import { type ComponentProps } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Description placeholder
 *
 * @export
 * @param {Omit<ComponentProps<typeof Input>, "type" | "onChange" | "value"> & {
 *   onChange: (value: number | null) => void
 *   value: undefined | null | number
 * }} param0
 * @param {*} param0.onChange
 * @param {*} param0.value
 * @param {*} param0....props
 * @returns {*}
 */
export function NumberInput({
  onChange,
  value,
  ...props
}: {
  onChange: (value: null | number) => void;
  value: null | number | undefined;
} & Omit<ComponentProps<typeof Input>, "onChange" | "type" | "value">) {
  return (
    <Input
      {...props}
      onChange={(e) => {
        const number = e.target.valueAsNumber;
        onChange(Number.isNaN(number) ? null : number);
      }}
      value={value ?? ""}
      type="number"
    />
  );
}

/**
 * Description placeholder
 *
 * @export
 * @param {React.ComponentProps<typeof NumberInput>} param0
 * @param {React.ComponentProps<({ onChange, value, ...props }: any) => any>} param0.className
 * @param {React.ComponentProps<({ onChange, value, ...props }: any) => any>} param0....props
 * @returns {any>) => any}
 */
export function InputGroupNumberInput({
  className,
  ...props
}: React.ComponentProps<typeof NumberInput>) {
  return (
    <NumberInput
      data-slot="input-group-control"
      className={cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}
