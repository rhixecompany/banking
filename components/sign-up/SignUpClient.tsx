// Provenance: read package.json, components/auth-form/*, dal/user.dal.ts — implement client sign-up flow (RHF + Zod). Draft only.
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

type SignUpValues = z.infer<typeof SignUpSchema>;

export default function SignUpClient({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { register, handleSubmit, formState } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
  });

  async function onSubmit(values: SignUpValues) {
    const res = await fetch("/api/auth/local-create", {
      method: "POST",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    }).then((r) => r.json());

    if (!res?.ok) {
      // keep UX consistent with sign-in client for testing
      alert(res?.error ?? "Sign-up failed");
      return;
    }

    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Name
        <Input {...register("name")} aria-label="name" />
      </label>
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
        Sign up
      </Button>
    </form>
  );
}
