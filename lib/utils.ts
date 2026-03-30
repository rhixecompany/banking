import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
});

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

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

export const authFormSchema = (type: string): z.ZodType<unknown> => {
  return type === "sign-in" ? signInSchema : signUpSchema;
};

export function getAuthFormSchema(type: string) {
  return type === "sign-in" ? signInSchema : signUpSchema;
}

export function formatAmount(amount: number | string): string {
  const num = typeof amount === "string" ? Number.parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}
