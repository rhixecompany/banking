"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { authFormSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import CustomInput from "./CustomInput";
import MyLoader from "./MyLoader";
import { signIn, signUp } from "@/lib/actions/user.actions";
const AuthForm = ({ type }: { type: string }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isSignIn = type === "sign-in";
  const router = useRouter();

  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: isSignIn
      ? {
        email: "",
        password: "",
      }
      : {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address1: "",
        city: "",
        state: "",
        postalCode: "",
        dateOfBirth: "",
        ssn: "",
      },
  });

  // 2. Define a submit handler.
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Sign up with Appwrite & create plaid token

      if (!isSignIn) {
        const userData = {
          firstName: data.firstName!,
          lastName: data.lastName!,
          address1: data.address1!,
          city: data.city!,
          state: data.state!,
          postalCode: data.postalCode!,
          dateOfBirth: data.dateOfBirth!,
          ssn: data.ssn!,
          email: data.email,
          password: data.password,
        };

        const newUser = await signUp(userData);

        setUser(newUser);
        await toast.success(`You have successfully signed up.`);
        // router.push("/");

        // await toast.success("You submitted the following values", {
        //   description: (
        //     <pre >
        //       <code>
        //         {JSON.stringify(data, null, 2)}
        //       </code>
        //     </pre>
        //   ),
        // })
      }

      if (isSignIn) {
        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response) {
          toast.success(`You have successfully signed in.`);
          // toast.success("You submitted the following values", {
          //   description: (
          //     <>
          //       {JSON.stringify(response, null, 2)}
          //     </>
          //   ),
          // })
          router.push("/");
        }
        // await toast.success(`You have successfully signed in.`)

        // await toast.success("You submitted the following values", {
        //   description: (
        //     <>
        //       {JSON.stringify(data, null, 2)}
        //     </>
        //   ),
        // })
      }
    } catch (error) {
      await toast.error("You submitted the following values", {
        description: <>{JSON.stringify(error, null, 2)}</>,
      });
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
          <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
            Horizon
          </h1>
        </Link>
        <div className="flex flex-col gap-1 md:gap-3">
          <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
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
                  <div className="flex gap-4">
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
                      placeholder="Enter your first name"
                    />
                  </div>

                  <CustomInput
                    control={form.control}
                    name="address1"
                    label="Address"
                    placeholder="Enter your specific address"
                  />
                  <CustomInput
                    control={form.control}
                    name="city"
                    label="City"
                    placeholder="Enter your city"
                  />
                  <div className="flex gap-4">
                    <CustomInput
                      control={form.control}
                      name="state"
                      label="State"
                      placeholder="Example: NY"
                    />

                    <CustomInput
                      control={form.control}
                      name="postalCode"
                      label="Postal Code"
                      placeholder="Example: 11101"
                    />
                  </div>
                  <div className="flex gap-4">
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
                  </div>
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

export default AuthForm;
