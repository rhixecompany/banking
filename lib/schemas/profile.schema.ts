import { z } from "zod";

// Centralized Zod schemas for Settings/Profile related forms and server actions.
// These schemas are shared by client wrappers and server actions to avoid drift.

export const ProfileSchema = z.object({
  address: z.string().trim().optional().describe("Street address"),
  city: z.string().trim().optional().describe("City"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .describe("Email address"),
  image: z
    .string()
    .trim()
    .url("Invalid image URL")
    .optional()
    .or(z.literal(""))
    .describe("Profile image URL or empty string"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional()
    .describe("Full name"),
  phone: z.string().trim().optional().describe("Phone number"),
  postalCode: z.string().trim().optional().describe("Postal/ZIP code"),
  state: z.string().trim().optional().describe("State"),
});

export const PasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(8, "New password must be at least 8 characters"),
    password: z.string().trim().min(8, "Current password is required"),
  })
  .refine((d) => d.newPassword !== d.password, {
    message: "New password must differ from current password",
    path: ["newPassword"],
  });

// Server-side UpdateProfileSchema reuses the same fields but retains meta() where used
export const UpdateProfileSchema = z.object({
  address: z.string().trim().optional().describe("Street address"),
  city: z.string().trim().optional().describe("City"),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .describe("Email address"),
  image: z.string().trim().optional().describe("Profile image URL"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional()
    .describe("Full name"),
  newPassword: z
    .string()
    .trim()
    .min(8, "New password must be at least 8 characters")
    .optional()
    .describe("New password"),
  password: z
    .string()
    .trim()
    .min(8, "Current password must be at least 8 characters")
    .optional()
    .describe("Current password"),
  phone: z.string().trim().optional().describe("Phone number"),
  postalCode: z.string().trim().optional().describe("Postal/ZIP code"),
  state: z.string().trim().optional().describe("State"),
});

export type ProfileFormData = z.infer<typeof ProfileSchema>;
export type PasswordFormData = z.infer<typeof PasswordSchema>;
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
