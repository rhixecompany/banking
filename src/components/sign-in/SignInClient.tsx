"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {*}
 */
const SignInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
});

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {SignInValues}
 */
type SignInValues = z.infer<typeof SignInSchema>;

/**
 * Description placeholder
 * @author Adminbot
 *
 * @export
 * @param {{
 *   onSuccess?: () => void;
 * }} param0
 * @param {() => void} param0.onSuccess
 * @returns {void; }) => ReactJSX.Element}
 */
export default function SignInClient({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { formState, handleSubmit, register } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
  });

  async function onSubmit(values: SignInValues) {
    const res = await fetch("/api/auth/local-validate", {
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).then((r) => r.json());

    if (!res?.ok) {
      // surface toast-friendly error for UI tests to assert
      alert(res?.error ?? "Sign-in failed");
      return;
    }

    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: true,
    });
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="signin-email">Email</label>
      <Input id="signin-email" {...register("email")} aria-label="email" />
      <label htmlFor="signin-password">Password</label>
      <Input
        id="signin-password"
        type="password"
        {...register("password")}
        aria-label="password"
      />
      <Button type="submit" disabled={formState.isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
