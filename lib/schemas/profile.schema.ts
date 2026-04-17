import { z } from "zod";

// Centralized Zod schemas for Settings/Profile related forms and server actions.
// These schemas are shared by client wrappers and server actions to avoid drift.

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
export const ProfileSchema = z.object({
  address: z.string().trim().optional().meta({ description: "Street address" }),
  city: z.string().trim().optional().meta({ description: "City" }),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .meta({ description: "Email address" }),
  image: z
    .string()
    .trim()
    .url("Invalid image URL")
    .optional()
    .or(z.literal(""))
    .meta({ description: "Profile image URL or empty string" }),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional()
    .meta({ description: "Full name" }),
  phone: z.string().trim().optional().meta({ description: "Phone number" }),
  postalCode: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Postal/ZIP code" }),
  state: z.string().trim().optional().meta({ description: "State" }),
});

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
export const PasswordSchema = z
  .object({
    newPassword: z
      .string()
      .trim()
      .min(8, "New password must be at least 8 characters"),
    password: z.string().trim().min(8, "Current password is required"),
  })
  .refine((d) => d.newPassword !== d.password, {
    error: "New password must differ from current password",
    path: ["newPassword"],
  });

// Server-side UpdateProfileSchema reuses the same fields but retains meta() where used
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
export const UpdateProfileSchema = z.object({
  address: z.string().trim().optional().meta({ description: "Street address" }),
  city: z.string().trim().optional().meta({ description: "City" }),
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .optional()
    .meta({ description: "Email address" }),
  image: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Profile image URL" }),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .optional()
    .meta({ description: "Full name" }),
  newPassword: z
    .string()
    .trim()
    .min(8, "New password must be at least 8 characters")
    .optional()
    .meta({ description: "New password" }),
  password: z
    .string()
    .trim()
    .min(8, "Current password must be at least 8 characters")
    .optional()
    .meta({ description: "Current password" }),
  phone: z.string().trim().optional().meta({ description: "Phone number" }),
  postalCode: z
    .string()
    .trim()
    .optional()
    .meta({ description: "Postal/ZIP code" }),
  state: z.string().trim().optional().meta({ description: "State" }),
});

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {ProfileFormData}
 */
export type ProfileFormData = z.infer<typeof ProfileSchema>;
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {PasswordFormData}
 */
export type PasswordFormData = z.infer<typeof PasswordSchema>;
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {UpdateProfileInput}
 */
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;
