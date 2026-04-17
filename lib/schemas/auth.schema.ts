import { z } from "zod";

/**
 * Sign-in schema shared between client and server for authentication forms.
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
 * Sign-up schema shared between client and server for registration forms.
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
 * @author Adminbot
 *
 * @export
 * @typedef {SignInForm}
 */
export type SignInForm = z.infer<typeof signInSchema>;
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {SignUpForm}
 */
export type SignUpForm = z.infer<typeof signUpSchema>;
