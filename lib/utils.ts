import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {...ClassValue[]} inputs
 * @returns {string}
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {number} amount
 * @returns {string}
 */
export function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(amount);
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .meta({ description: "User email" }),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .meta({ description: "User password" }),
});

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
export const signUpSchema = z
  .object({
    address1: z.string().trim().optional().meta({ description: "Address" }),
    city: z.string().trim().optional().meta({ description: "City" }),
    confirmPassword: z
      .string()
      .trim()
      .optional()
      .meta({ description: "Confirm password" }),
    dateOfBirth: z
      .string()
      .trim()
      .optional()
      .meta({ description: "Date of birth" }),
    email: z
      .string()
      .trim()
      .email("Invalid email address")
      .meta({ description: "Email" }),
    firstName: z
      .string()
      .trim()
      .min(2, "First name must be at least 2 characters")
      .meta({ description: "First name" }),
    lastName: z
      .string()
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .meta({ description: "Last name" }),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .meta({ description: "Password" }),
    postalCode: z
      .string()
      .trim()
      .optional()
      .meta({ description: "Postal code" }),
    ssn: z.string().trim().optional().meta({ description: "SSN" }),
    state: z.string().trim().optional().meta({ description: "State" }),
  })
  .refine(
    (data) => !data.confirmPassword || data.confirmPassword === data.password,
    {
      error: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

/**
 * Description placeholder
 * @author [object Object]
 *
 * @export
 * @param {("sign-in" | "sign-up")} type
 * @returns {(typeof signInSchema | typeof signUpSchema)}
 */
export function getAuthFormSchema(
  type: "sign-in" | "sign-up",
): typeof signInSchema | typeof signUpSchema {
  return type === "sign-in" ? signInSchema : signUpSchema;
}
