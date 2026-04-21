// Provenance: read package.json, components/auth-form/*, dal/user.dal.ts — implement client sign-in flow (RHF + Zod). Draft only.
"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SignInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
});

type SignInValues = z.infer<typeof SignInSchema>;

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
      <label>
        Email
        <Input {...register("email")} aria-label="email" />
      </label>
      <label>
        Password
        <Input
          type="password"
          {...register("password")}
          aria-label="password"
        />
      </label>
      <Button type="submit" disabled={formState.isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
