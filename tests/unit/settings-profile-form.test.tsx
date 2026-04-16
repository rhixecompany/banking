import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { expect, test, vi } from "vitest";

import SettingsProfileForm from "@/components/layouts/settings-profile-form";

function Wrapper({
  onSubmit = async () => undefined,
}: {
  onSubmit?: (d: any) => Promise<void>;
}) {
  const form = useForm({
    defaultValues: {
      address: "",
      city: "",
      email: "",
      image: "",
      name: "",
      phone: "",
      postalCode: "",
      state: "",
    },
  });
  return <SettingsProfileForm form={form} onSubmit={onSubmit} />;
}

test("renders profile form and submits", async () => {
  const handler = vi.fn(async () => undefined);
  render(<Wrapper onSubmit={handler} />);

  const name = screen.getByPlaceholderText("Jane Doe");
  fireEvent.change(name, { target: { value: "Alex" } });

  const email = screen.getByPlaceholderText("jane@example.com");
  fireEvent.change(email, { target: { value: "alex@example.com" } });

  const btn = screen.getByRole("button", { name: /save profile/i });
  fireEvent.click(btn);

  await waitFor(() => {
    expect(handler).toHaveBeenCalled();
  });
});
