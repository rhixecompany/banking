import { expect, test, vi } from "vitest";

// Mock next/navigation router used by the AuthForm component
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// Mock sonner toast to assert error messages
vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "sonner";

import AuthForm from "@/components/layouts/auth-form";

test("calls register prop when sign-up form submitted", async () => {
  const register = vi.fn(async () => ({ ok: true }));
  render(<AuthForm type="sign-up" register={register} />);

  // Fill required fields (simple smoke) and submit
  await userEvent.type(
    screen.getByPlaceholderText(/enter your first name/i),
    "Jane",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/enter your last name/i),
    "Doe",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/enter your email/i),
    "jane@example.com",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/enter your password/i),
    "password123",
  );

  const submit = screen.getByRole("button", { name: /sign up/i });
  await userEvent.click(submit);

  expect(register).toHaveBeenCalled();
});

test("shows error when register prop is missing", async () => {
  render(<AuthForm type="sign-up" />);

  // Fill required fields so form validation passes and submit handler runs
  await userEvent.type(
    screen.getByPlaceholderText(/enter your first name/i),
    "Jane",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/enter your last name/i),
    "Doe",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/enter your email/i),
    "jane@example.com",
  );
  await userEvent.type(
    screen.getByPlaceholderText(/enter your password/i),
    "password123",
  );

  const submit = screen.getByRole("button", { name: /sign up/i });
  await userEvent.click(submit);

  // The component calls toast.error when register prop is missing
  expect(toast.error).toHaveBeenCalledWith("Registration action not available");
});
