import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { signInSchema, signUpSchema } from "@/lib/schemas/auth.schema";

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
export { signInSchema };

/**
 * Description placeholder
 * @author [object Object]
 *
 * @type {*}
 */
export { signUpSchema };

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
