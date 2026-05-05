import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import ConnectedAccount from "@/components/shadcn-studio/blocks/account-settings-01/content/connect-account";
import DangerZone from "@/components/shadcn-studio/blocks/account-settings-01/content/danger-zone";
import SocialUrl from "@/components/shadcn-studio/blocks/account-settings-01/content/social-url";

describe("DangerZone Component", () => {
  it("renders the danger zone section", () => {
    render(<DangerZone />);
    expect(screen.getByText("Danger Zone")).toBeInTheDocument();
  });

  it("renders the delete account card heading", () => {
    render(<DangerZone />);
    expect(screen.getByText("Delete account")).toBeInTheDocument();
  });

  it("renders a delete button", () => {
    render(<DangerZone />);
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons.length).toBeGreaterThan(0);
  });

  it("opens dialog when delete button is clicked", async () => {
    render(<DangerZone />);
    const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });

  it("renders learn more link with correct href", () => {
    render(<DangerZone />);
    const learnMoreLink = screen.getByRole("link", { name: /learn more/i });
    expect(learnMoreLink).toHaveAttribute("href", "/help/account-deletion");
  });

  it("renders cancel button in dialog", async () => {
    render(<DangerZone />);
    const deleteButton = screen.getAllByRole("button", { name: /delete/i })[0];
    fireEvent.click(deleteButton);

    const cancelButton = await screen.findByRole("button", { name: /cancel/i });
    expect(cancelButton).toBeInTheDocument();
  });
});

describe("SocialUrl Component", () => {
  it("renders social URLs section heading", () => {
    render(<SocialUrl />);
    expect(screen.getByText("Social URLs")).toBeInTheDocument();
  });

  it("renders section description", () => {
    render(<SocialUrl />);
    expect(screen.getByText("Manage your social URLs.")).toBeInTheDocument();
  });

  it("renders initial 3 input fields", () => {
    render(<SocialUrl />);
    const inputs = screen.getAllByPlaceholderText("Link to social profile");
    expect(inputs).toHaveLength(3);
  });

  it("allows typing in URL inputs", async () => {
    const user = userEvent.setup();
    render(<SocialUrl />);

    const inputs = screen.getAllByPlaceholderText("Link to social profile");
    await user.type(inputs[0], "https://twitter.com/user");
    expect((inputs[0] as HTMLInputElement).value).toBe(
      "https://twitter.com/user",
    );
  });

  it("adds new URL input when Add URL button is clicked", async () => {
    render(<SocialUrl />);
    let inputs = screen.getAllByPlaceholderText("Link to social profile");
    expect(inputs).toHaveLength(3);

    const addButton = screen.getByRole("button", { name: /add url/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      inputs = screen.getAllByPlaceholderText("Link to social profile");
      expect(inputs).toHaveLength(4);
    });
  });

  it("adds multiple URLs when Add URL clicked multiple times", async () => {
    render(<SocialUrl />);

    const addButton = screen.getByRole("button", { name: /add url/i });
    fireEvent.click(addButton);
    fireEvent.click(addButton);

    await waitFor(() => {
      const inputs = screen.getAllByPlaceholderText("Link to social profile");
      expect(inputs).toHaveLength(5);
    });
  });

  it("maintains independent state for each URL input", async () => {
    const user = userEvent.setup();
    render(<SocialUrl />);

    const inputs = screen.getAllByPlaceholderText("Link to social profile");
    await user.type(inputs[0], "https://twitter.com/user");
    await user.type(inputs[1], "https://github.com/user");

    expect((inputs[0] as HTMLInputElement).value).toBe(
      "https://twitter.com/user",
    );
    expect((inputs[1] as HTMLInputElement).value).toBe(
      "https://github.com/user",
    );
    expect((inputs[2] as HTMLInputElement).value).toBe("");
  });

  it("renders Save Changes button", () => {
    render(<SocialUrl />);
    expect(
      screen.getByRole("button", { name: /save changes/i }),
    ).toBeInTheDocument();
  });

  it("renders Add URL button", () => {
    render(<SocialUrl />);
    expect(
      screen.getByRole("button", { name: /add url/i }),
    ).toBeInTheDocument();
  });
});

describe("ConnectedAccount Component", () => {
  it("renders component heading", () => {
    render(<ConnectedAccount />);
    expect(screen.getByText("Connect Accounts")).toBeInTheDocument();
  });

  it("renders section description", () => {
    render(<ConnectedAccount />);
    expect(
      screen.getByText("Manage your connected accounts."),
    ).toBeInTheDocument();
  });

  it("renders initial connected accounts", () => {
    render(<ConnectedAccount />);
    expect(screen.getByText("Google")).toBeInTheDocument();
    expect(screen.getByText("Slack")).toBeInTheDocument();
  });

  it("renders account icons", () => {
    render(<ConnectedAccount />);
    expect(screen.getByAltText("Google")).toBeInTheDocument();
    expect(screen.getByAltText("Slack")).toBeInTheDocument();
  });

  it("renders Add App button", () => {
    render(<ConnectedAccount />);
    expect(
      screen.getByRole("button", { name: /add app/i }),
    ).toBeInTheDocument();
  });

  it("removes account when remove button clicked", async () => {
    render(<ConnectedAccount />);

    const removeButtons = screen.getAllByRole("button");
    const removeGoogleBtn = removeButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Google"),
    );

    if (removeGoogleBtn) {
      fireEvent.click(removeGoogleBtn);
      await waitFor(() => {
        expect(screen.queryByText("Google")).not.toBeInTheDocument();
      });
    }
  });

  it("opens dialog when Add App button clicked", async () => {
    render(<ConnectedAccount />);
    const addAppButton = screen.getByRole("button", { name: /add app/i });
    fireEvent.click(addAppButton);

    await waitFor(() => {
      expect(screen.getByText("Connect New App")).toBeInTheDocument();
    });
  });

  it("displays dialog description text", async () => {
    render(<ConnectedAccount />);
    const addAppButton = screen.getByRole("button", { name: /add app/i });
    fireEvent.click(addAppButton);

    await waitFor(() => {
      expect(
        screen.getByText(
          "Add a new integration by providing the details below.",
        ),
      ).toBeInTheDocument();
    });
  });

  it("renders helper text about integrations", () => {
    render(<ConnectedAccount />);
    expect(
      screen.getByText(
        /Connected accounts allow you to integrate with third-party services/,
      ),
    ).toBeInTheDocument();
  });

  it("renders initial two remove buttons for default accounts", () => {
    render(<ConnectedAccount />);
    const removeButtons = screen
      .getAllByRole("button")
      .filter((btn) => btn.getAttribute("aria-label")?.startsWith("Remove"));
    expect(removeButtons.length).toBeGreaterThanOrEqual(2);
  });

  it("disables Connect button when dialog first opens", async () => {
    render(<ConnectedAccount />);
    const addAppButton = screen.getByRole("button", { name: /add app/i });
    fireEvent.click(addAppButton);

    const connectButton = await screen.findByRole("button", {
      name: /connect/i,
    });
    expect(connectButton).toBeDisabled();
  });

  it("closes dialog when Cancel button clicked", async () => {
    render(<ConnectedAccount />);
    const addAppButton = screen.getByRole("button", { name: /add app/i });
    fireEvent.click(addAppButton);

    const cancelButton = await screen.findByRole("button", { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText("Connect New App")).not.toBeInTheDocument();
    });
  });

  it("removes multiple accounts independently", async () => {
    render(<ConnectedAccount />);

    // Remove Google
    let removeButtons = screen.getAllByRole("button");
    const removeGoogleBtn = removeButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Google"),
    );

    if (removeGoogleBtn) {
      fireEvent.click(removeGoogleBtn);
      await waitFor(() => {
        expect(screen.queryByText("Google")).not.toBeInTheDocument();
      });
    }

    // Remove Slack
    removeButtons = screen.getAllByRole("button");
    const removeSlackBtn = removeButtons.find((btn) =>
      btn.getAttribute("aria-label")?.includes("Slack"),
    );

    if (removeSlackBtn) {
      fireEvent.click(removeSlackBtn);
      await waitFor(() => {
        expect(screen.queryByText("Slack")).not.toBeInTheDocument();
      });
    }

    // Verify both gone
    expect(screen.queryByText("Google")).not.toBeInTheDocument();
    expect(screen.queryByText("Slack")).not.toBeInTheDocument();
  });
});
