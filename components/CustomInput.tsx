import { Control, FieldPath, FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

/**
 * Description placeholder
 *
 * @interface CustomInputProps
 * @typedef {CustomInputProps}
 * @template {FieldValues} [T=FieldValues]
 */
interface CustomInputProps<T extends FieldValues = FieldValues> {
  /**
   * Description placeholder
   *
   * @type {Control<T>}
   */
  control: Control<T>;
  /**
   * Description placeholder
   *
   * @type {FieldPath<T>}
   */
  name: FieldPath<T>;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  label: string;
  /**
   * Description placeholder
   *
   * @type {string}
   */
  placeholder: string;
}

/**
 * Description placeholder
 *
 * @template {FieldValues} T
 * @param {CustomInputProps<T>} param0
 * @param {Control<T>} param0.control
 * @param {string} param0.label
 * @param {FieldPath<T>} param0.name
 * @param {string} param0.placeholder
 * @returns {JSX.Element}
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
