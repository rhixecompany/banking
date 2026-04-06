import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

/**
 * Props for the CustomInput component.
 *
 * @template T - Form field values type extending FieldValues
 */
interface CustomInputProps<T extends FieldValues = FieldValues> {
  /** React Hook Form control instance for form integration */
  control: Control<T>;
  /** Form field name (path to nested field) */
  name: FieldPath<T>;
  /** Label text displayed above the input */
  label: string;
  /** Placeholder text shown when input is empty */
  placeholder: string;
}

/**
 * CustomInput wraps a React Hook Form field with consistent styling.
 * Automatically handles password field type based on field name.
 * Integrates with shadcn/ui Form components for validation display.
 *
 * @description
 * A reusable form input component that integrates with React Hook Form.
 * Automatically applies password styling when the field name contains "password".
 * Displays validation errors from Zod schemas via the shadcn FormMessage component.
 *
 * @template T - Form field values type extending FieldValues
 * @see CustomInputProps
 */
const CustomInput = <T extends FieldValues>({
  control,
  label,
  name,
  placeholder,
}: CustomInputProps<T>): JSX.Element => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex w-full flex-col">
            <FormControl>
              <Input
                placeholder={placeholder}
                className="input-class"
                type={name === "password" ? "password" : "text"}
                value={field.value ?? ""}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />
            </FormControl>
            <FormMessage className="mt-2 form-message" />
          </div>
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
