// Provenance: read package.json, components/auth-form/*, dal/user.dal.ts — implement client sign-in flow (RHF + Zod). Draft only.
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignInValues = z.infer<typeof SignInSchema>;

export default function SignInClient({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { register, handleSubmit, formState } = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
  });

  async function onSubmit(values: SignInValues) {
    const res = await fetch("/api/auth/local-validate", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json());

    if (!res?.ok) {
      // surface toast-friendly error for UI tests to assert
      alert(res?.error ?? "Sign-in failed");
      return;
    }

    await signIn("credentials", {
      redirect: true,
      email: values.email,
      password: values.password,
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
