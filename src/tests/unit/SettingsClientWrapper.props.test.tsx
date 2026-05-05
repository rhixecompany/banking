import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";

import { SettingsClientWrapper } from "@/components/settings/settings-client-wrapper";

/**
 * Description placeholder
 * @author Adminbot
 *
 * @type {{ email: string; id: string; image: string; name: string; profile: { address: string; city: string; phone: string; postalCode: string; state: string; }; }}
 */
const mockUser = {
  email: "jane@example.com",
  id: "u1",
  image: "",
  name: "Jane Doe",
  profile: { address: "", city: "", phone: "", postalCode: "", state: "" },
};

test("calls provided updateProfile when submitting profile form", async () => {
  const updateProfile = vi.fn(async () => ({ ok: true }));
  render(
    <SettingsClientWrapper
      userWithProfile={mockUser as any}
      updateProfile={updateProfile}
    />,
  );

  // Change name field
  const nameInput = screen.getByPlaceholderText("Jane Doe");
  await userEvent.clear(nameInput);
  await userEvent.type(nameInput, "Jane X");

  const saveButton = screen.getByRole("button", { name: /save profile/i });
  await userEvent.click(saveButton);

  expect(updateProfile).toHaveBeenCalled();
});

test("shows error when updateProfile not provided", async () => {
  render(<SettingsClientWrapper userWithProfile={mockUser as any} />);
  const saveButton = screen.getByRole("button", { name: /save profile/i });
  await userEvent.click(saveButton);
  expect(await screen.findByText(/update action not available/i)).toBeDefined();
});
