"use server";
import { userDal } from "@/lib/dal";
import { hash } from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  address: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

export async function registerUser(input: unknown) {
  const parsed = RegisterSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message };
  }
  const { email, password, name, address } = parsed.data;

  const existing = await userDal.findByEmail(email);
  if (existing) {
    return { ok: false, error: "Email already registered" };
  }

  const hashed = await hash(password, 12);
  try {
    const user = await userDal.createWithProfile({
      email,
      password: hashed,
      name,
      profile: { address },
    });
    return { ok: true, user };
  } catch (e) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code?: string }).code === "23505"
    ) {
      return { ok: false, error: "Email already registered" };
    }
    return { ok: false, error: "Registration failed" };
  }
}

export { registerUser as register };
