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

import CustomInput from "@/components/custom-input/custom-input";
import MyLoader from "@/components/my-loader/my-loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { register } from "@/lib/actions/register";
import { getAuthFormSchema, signInSchema, signUpSchema } from "@/lib/utils";

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

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

const AuthForm = ({ type }: AuthFormProps): JSX.Element => {
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
    setIsLoading(true);
    try {
      if (!isSignIn) {
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
          <h1 className="font-ibm-plex-serif text-26 font-bold text-black-1">
            Horizon
          </h1>
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
      <>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {!isSignIn && (
              <>
                <CustomInput
                  control={form.control}
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                />
                <CustomInput
                  control={form.control}
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                />
                <CustomInput
                  control={form.control}
                  name="address1"
                  label="Address"
                  placeholder="Enter your address"
                />
                <CustomInput
                  control={form.control}
                  name="city"
                  label="City"
                  placeholder="Enter your city"
                />
                <CustomInput
                  control={form.control}
                  name="state"
                  label="State"
                  placeholder="Enter your state"
                />
                <CustomInput
                  control={form.control}
                  name="postalCode"
                  label="Postal Code"
                  placeholder="Enter your postal code"
                />
                <CustomInput
                  control={form.control}
                  name="dateOfBirth"
                  label="Date of Birth"
                  placeholder="YYYY-MM-DD"
                />
                <CustomInput
                  control={form.control}
                  name="ssn"
                  label="SSN"
                  placeholder="Example: 1234"
                />
                <CustomInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />
                <CustomInput
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                />
                <CustomInput
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                />
              </>
            )}
            {isSignIn && (
              <>
                <CustomInput
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />
                <CustomInput
                  control={form.control}
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
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
      </>
    </section>
  );
};

export default AuthForm;
