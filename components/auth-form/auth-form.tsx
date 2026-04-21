"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn as nextAuthSignIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import type { AuthFormProps } from "@/types";

// Accept register as a prop from the server wrapper to avoid importing
// the server action directly in this client component.
import MyLoader from "@/components/my-loader/my-loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getAuthFormSchema, signInSchema, signUpSchema } from "@/lib/utils";

/** Sign-in form data type inferred from signInSchema */
type SignInFormData = z.infer<typeof signInSchema>;
/** Sign-up form data type inferred from signUpSchema */
type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Returns default form values based on authentication mode.
 * Sign-in requires email and password; sign-up requires full user profile.
 *
 * @param isSignInFlag - Whether rendering sign-in form (true) or sign-up form (false)
 * @returns Default values object matching the appropriate form schema
 */
function getDefaultValues(
  isSignInFlag: boolean,
): Partial<SignInFormData & SignUpFormData> {
  if (isSignInFlag) {
    return { email: "", password: "" };
  }
  return {
    address1: "",
    city: "",
    dateOfBirth: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    postalCode: "",
    ssn: "",
    state: "",
  };
}

/**
 * AuthForm renders either a sign-in or sign-up form based on the type prop.
 * Handles user registration via server action and sign-in via NextAuth credentials.
 *
 * @description
 * This component provides complete authentication functionality with form validation.
 * For sign-up mode, it collects full user profile data including address and SSN.
 * For sign-in mode, it authenticates users via NextAuth credentials provider.
 * Form validation is handled by React Hook Form with Zod schemas.
 *
 * @example
 * ```tsx
 * // Sign-in form
 * <AuthForm type="sign-in" />
 *
 * // Sign-up form
 * <AuthForm type="sign-up" />
 * ```
 *
 * @param props - Component props
 * @param props.type - Form mode: "sign-in" for login, "sign-up" for registration
 * @returns Rendered authentication form
 */
const AuthForm = ({
  register,
  type,
  actionEndpoint,
}: {
  register?: (
    input: unknown,
  ) => Promise<{ ok: boolean; user?: unknown; error?: string }>;
  actionEndpoint?: string;
} & AuthFormProps): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);
  const isSignIn = type === "sign-in";
  const router = useRouter();

  const formSchema = getAuthFormSchema(type);
  const form = useForm<SignInFormData | SignUpFormData>({
    defaultValues: getDefaultValues(isSignIn),
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (
    formData: SignInFormData | SignUpFormData,
  ): Promise<void> => {
    // Validate runtime shape for register prop when in sign-up mode
    if (!isSignIn && register && typeof register !== "function") {
      toast.error("Registration action is invalid");
      return;
    }
    setIsLoading(true);
    try {
      if (!isSignIn) {
        // Prefer server action prop when provided (register)
        if (register && typeof register === "function") {
          const result = await register(formData as SignUpFormData);
          if (!result.ok) {
            toast.error(result.error ?? "Registration failed");
            return;
          }
          toast.success("You have successfully signed up. Please sign in.");
          await router.push("/sign-in");
          router.refresh();
          return;
        }

        // Fallback: call provided actionEndpoint (API route) if available
        if (actionEndpoint) {
          try {
            const resp = await fetch(actionEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });
            const result = await resp.json();
            if (!result.ok) {
              toast.error(result.error ?? "Registration failed");
              return;
            }
            toast.success("You have successfully signed up. Please sign in.");
            await router.push("/sign-in");
            router.refresh();
            return;
          } catch (err) {
            toast.error("Registration failed");
            return;
          }
        }

        toast.error("Registration action not available");
        return;
      }
      const signInData = formData as SignInFormData;
      const result = await nextAuthSignIn("credentials", {
        email: signInData.email,
        password: signInData.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("You have successfully signed in.");
        await router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="auth-form">
      <header className="flex flex-col gap-5 md:gap-8">
        <Link href="/" className="flex cursor-pointer items-center gap-1">
          <Image
            src="/icons/logo.svg"
            alt="Horizon logo"
            width={34}
            height={34}
            loading="eager"
            style={{ height: "auto", width: "auto" }}
          />
          <h1 className="font-serif text-26 font-bold text-black-1">Horizon</h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 font-semibold text-gray-900 lg:text-36">
            {isSignIn ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {"Please enter your details"}
          </p>
        </div>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {isSignIn ? (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Email</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your email"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Password</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your password"
                        type="password"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          ) : (
            <>
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>First Name</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your first name"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Last Name</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your last name"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Address</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your address"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>City</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your city"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>State</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your state"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Postal Code</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your postal code"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="YYYY-MM-DD"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ssn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>SSN</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Example: 1234"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Email</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your email"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Password</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Enter your password"
                        type="password"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor={field.name}>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="Confirm your password"
                        type="password"
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <div className="flex flex-col gap-4">
            <Button type="submit" disabled={isLoading} className="form-btn">
              {isLoading ? <MyLoader /> : isSignIn ? "Sign In" : "Sign Up"}
            </Button>
          </div>
        </form>
      </Form>
      <footer className="flex justify-center gap-1">
        <p className="text-14 font-normal text-gray-600">
          {isSignIn ? "Don't have an account?" : "Already have an account?"}
        </p>
        <Link href={isSignIn ? "/sign-up" : "/sign-in"} className="form-link">
          {isSignIn ? "Sign up" : "Sign in"}
        </Link>
      </footer>
    </section>
  );
};

export default AuthForm;
