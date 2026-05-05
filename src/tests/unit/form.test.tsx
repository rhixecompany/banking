import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, vi } from "vitest";

import Form from "../../components/layouts/form/index";

describe("Form", () => {
  it("renders children", () => {
    render(
      <Form>
        <input name="test" />
      </Form>,
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("displays errors when provided", () => {
    render(
      <Form errors={{ field: "Invalid input" }}>
        <input name="test" />
      </Form>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid input");
  });

  it("calls onSubmit handler", async () => {
    const onSubmit = vi.fn();
    const user = userEvent.setup();

    render(
      <Form onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </Form>,
    );

    await user.click(screen.getByRole("button"));
    expect(onSubmit).toHaveBeenCalled();
  });

  it("applies className", () => {
    render(
      <Form className="custom-form">
        <input name="test" />
      </Form>,
    );
    const form = screen.getByRole("form");
    expect(form).toHaveClass("custom-form");
  });
});
