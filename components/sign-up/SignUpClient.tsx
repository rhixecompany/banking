"use client";
import { zodResolver } from "@hookform/resolvers/zod";
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
const SignUpSchema = z.object({
  email: z.string().trim().email(),
  name: z.string().trim().min(1),
  password: z.string().trim().min(8),
});

/**
 * Description placeholder
 * @author Adminbot
 *
 * @typedef {SignUpValues}
 */
type SignUpValues = z.infer<typeof SignUpSchema>;

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
export default function SignUpClient({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const { formState, handleSubmit, register } = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
  });

  async function onSubmit(values: SignUpValues) {
    const res = await fetch("/api/auth/local-create", {
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
      method: "POST",
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
