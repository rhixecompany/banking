import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { GenericCard } from "../../components/layouts/generic-card";
import { GenericDataTable } from "../../components/layouts/generic-data-table";
import { GenericEmptyState } from "../../components/layouts/generic-empty-state";
import { GenericForm } from "../../components/layouts/generic-form";
import { GenericModal } from "../../components/layouts/generic-modal";
import { GenericPageShell } from "../../components/layouts/generic-page-shell";
import { GenericSkeleton } from "../../components/layouts/generic-skeleton";
import { GenericToast } from "../../components/layouts/generic-toast";

describe("GenericPageShell", () => {
  it("renders title", () => {
    render(<GenericPageShell title="Test Title">Content</GenericPageShell>);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(
      <GenericPageShell title="Title" description="Test description">
        Content
      </GenericPageShell>,
    );
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(<GenericPageShell title="Title">Child Content</GenericPageShell>);
    expect(screen.getByText("Child Content")).toBeInTheDocument();
  });
});

describe("GenericCard", () => {
  it("renders header when provided", () => {
    render(
      <GenericCard header={<h3>Card Header</h3>}>
        <div>Content</div>
      </GenericCard>,
    );
    expect(screen.getByText("Card Header")).toBeInTheDocument();
  });

  it("renders children", () => {
    render(
      <GenericCard>
        <div>Card Content</div>
      </GenericCard>,
    );
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <GenericCard footer={<button>Action</button>}>
        <div>Content</div>
      </GenericCard>,
    );
    expect(screen.getByText("Action")).toBeInTheDocument();
  });
});

describe("GenericDataTable", () => {
  const columns = [
    { header: "Name", key: "name" as const },
    { header: "Amount", key: "amount" as const },
  ];

  const data = [
    { amount: "100", name: "Test 1" },
    { amount: "200", name: "Test 2" },
  ];

  it("renders column headers", () => {
    render(<GenericDataTable data={data} columns={columns} />);
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Amount")).toBeInTheDocument();
  });

  it("renders data rows", () => {
    render(<GenericDataTable data={data} columns={columns} />);
    expect(screen.getByText("Test 1")).toBeInTheDocument();
    expect(screen.getByText("Test 2")).toBeInTheDocument();
  });
});

describe("GenericEmptyState", () => {
  it("renders title", () => {
    render(<GenericEmptyState title="No data" />);
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders description when provided", () => {
    render(<GenericEmptyState title="Empty" description="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  it("renders action when provided", () => {
    render(
      <GenericEmptyState title="Empty" action={<button>Add Item</button>} />,
    );
    expect(screen.getByText("Add Item")).toBeInTheDocument();
  });
});

describe("GenericSkeleton", () => {
  it("renders with default dimensions", () => {
    const { container } = render(<GenericSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with custom width and height", () => {
    const { container } = render(<GenericSkeleton width={200} height={100} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe("GenericModal", () => {
  it("does not render when open is false", () => {
    render(
      <GenericModal open={false} onClose={vi.fn()} title="Modal">
        Content
      </GenericModal>,
    );
    expect(screen.queryByText("Modal")).not.toBeInTheDocument();
  });

  it("renders when open is true", () => {
    render(
      <GenericModal open onClose={vi.fn()} title="Modal Title">
        Content
      </GenericModal>,
    );
    expect(screen.getByText("Modal Title")).toBeInTheDocument();
  });
});

describe("GenericToast", () => {
  it("renders message", () => {
    render(<GenericToast message="Test message" />);
    expect(screen.getByText("Test message")).toBeInTheDocument();
  });

  it("renders different types", () => {
    const { rerender } = render(<GenericToast message="Error" type="error" />);
    expect(screen.getByText("Error")).toBeInTheDocument();

    rerender(<GenericToast message="Success" type="success" />);
    expect(screen.getByText("Success")).toBeInTheDocument();
  });
});

describe("GenericForm", () => {
  it("renders children", () => {
    const mockForm = {
      formState: { errors: {} },
      register: () => ({ onBlur: vi.fn(), onChange: vi.fn() }),
    } as unknown as import("react-hook-form").UseFormReturn<
      Record<string, unknown>
    >;

    render(
      <GenericForm form={mockForm} onSubmit={vi.fn()}>
        <input data-testid="form-input" />
      </GenericForm>,
    );
    expect(screen.getByTestId("form-input")).toBeInTheDocument();
  });
});
