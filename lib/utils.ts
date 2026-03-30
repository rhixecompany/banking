import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

/**
 * Description placeholder
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
 *
 * @type {*}
 */
export const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
});

/**
 * Description placeholder
 *
 * @type {*}
 */
export const signUpSchema = z
  .object({
    address1: z.string().trim().optional(),
    city: z.string().trim().optional(),
    confirmPassword: z.string().trim().min(8),
    dateOfBirth: z.string().trim().optional(),
    email: z.string().trim().email(),
    firstName: z.string().trim().min(2),
    lastName: z.string().trim().min(2),
    password: z.string().trim().min(8),
    postalCode: z.string().trim().optional(),
    ssn: z.string().trim().optional(),
    state: z.string().trim().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"],
  });

/**
 * Description placeholder
 *
 * @export
 * @typedef {SignInFormData}
 */
export type SignInFormData = z.infer<typeof signInSchema>;
/**
 * Description placeholder
 *
 * @export
 * @typedef {SignUpFormData}
 */
export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Description placeholder
 *
 * @param {string} type
 * @returns {z.ZodType<unknown>}
 */
export const authFormSchema = (type: string): z.ZodType<unknown> => {
  return type === "sign-in" ? signInSchema : signUpSchema;
};

/**
 * Description placeholder
 *
 * @export
 * @param {string} type
 * @returns {*}
 */
export function getAuthFormSchema(type: string) {
  return type === "sign-in" ? signInSchema : signUpSchema;
}

/**
 * Description placeholder
 *
 * @export
 * @param {(number | string)} amount
 * @returns {string}
 */
export function formatAmount(amount: number | string): string {
  const num = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(num);
}

/**
 * Description placeholder
 *
 * @export
 * @param {(Date | string)} date
 * @returns {string}
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
