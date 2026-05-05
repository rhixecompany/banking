import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { signInSchema, signUpSchema } from "@/lib/schemas/auth.schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAuthFormSchema(type: "sign-in" | "sign-up") {
  return type === "sign-in" ? signInSchema : signUpSchema;
}

export function formatAmount(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    currency,
    style: "currency",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
