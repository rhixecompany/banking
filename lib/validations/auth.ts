import { signInSchema, signUpSchema } from "@/lib/schemas/auth.schema";

export { signInSchema, signUpSchema };
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {SignInForm}
 */
export type SignInForm = import("zod").infer<typeof signInSchema>;
/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @typedef {SignUpForm}
 */
export type SignUpForm = import("zod").infer<typeof signUpSchema>;
