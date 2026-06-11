import { z } from "zod";

// Minimal profile schema used across the app. Keep small and focused.
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
export const ProfileSchema = z.object({
  email: z.string().trim().email().meta({ description: "Email address" }),
  name: z.string().trim().min(1).meta({ description: "Full name" }),
});

// Schema for password-change inputs used by the Settings page
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
export const PasswordSchema = z.object({
  newPassword: z.string().trim().min(8).meta({ description: "New password" }),
  password: z.string().trim().min(1).meta({ description: "Current password" }),
});

// Comprehensive update profile schema used by the server-side updateProfile action.
// This intentionally includes optional fields so client forms may pass partial updates.
/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
export const UpdateProfileSchema = z.object({
  // Profile fields
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  email: z.string().trim().email().optional(),

  image: z.string().trim().optional(),
  // Basic user fields
  name: z.string().trim().min(1).optional(),
  newPassword: z.string().trim().optional(),
  // Password change helpers (optional)
  password: z.string().trim().optional(),
  phone: z.string().trim().optional(),

  postalCode: z.string().trim().optional(),
  state: z.string().trim().optional(),
});

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {Profile}
 */
export type Profile = z.infer<typeof ProfileSchema>;
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {PasswordForm}
 */
export type PasswordForm = z.infer<typeof PasswordSchema>;
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {UpdateProfile}
 */
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;
