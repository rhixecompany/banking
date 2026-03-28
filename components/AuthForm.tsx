"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { register } from "@/lib/actions/register";
import { authFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn as nextAuthSignIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CustomInput from "./CustomInput";
import MyLoader from "./MyLoader";

const AuthForm = ({ type }: { type: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user] = useState<null>(null); // Reserved for future OAuth flow
  const isSignIn = type === "sign-in";
  const router = useRouter();

  // Use unified schema
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isSignIn
      ? { email: "", password: "" }
      : {
          firstName: "",
          lastName: "",
          address1: "",
          city: "",
          state: "",
          postalCode: "",
          dateOfBirth: "",
          ssn: "",
          email: "",
          password: "",
        },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (!isSignIn) {
        // Call Server Action directly
        const result = await register(data);
        if (!result.ok) {
          toast.error(result.error || "Registration failed");
          setIsLoading(false);
          return;
        }
        toast.success("You have successfully signed up. Please sign in.");
        await router.push("/sign-in");
        router.refresh();
        return;
      }
      // Sign in with next-auth
      const result = await nextAuthSignIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("You have successfully signed in.");
        await router.push("/");
        router.refresh();
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An error occurred");
      }
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
          />
          <h1 className="font-ibm-plex-serif text-26 font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 font-semibold text-gray-900 lg:text-36">
            {user ? "Link Account" : type === "sign-in" ? "Sign In" : "Sign Up"}
          </h1>
          <p className="text-16 font-normal text-gray-600">
            {user
              ? "Link your account to get started"
              : "Please enter your details"}
          </p>
        </div>
      </header>
      {user ? (
        <div className="flex flex-col gap-4">
          {/* PlaidLink */}
          {/* {JSON.stringify(user, null, 2)} */}
        </div>
      ) : (
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
            <Link
              href={isSignIn ? "/sign-up" : "/sign-in"}
              className="form-link"
            >
              {isSignIn ? "Sign up" : "Sign in"}
            </Link>
          </footer>
        </>
      )}
    </section>
  );
};

// TODO: Add profile image upload, email/password update forms here as separate components or sections.
export default AuthForm;
