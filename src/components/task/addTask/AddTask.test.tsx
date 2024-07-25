import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AddTask from "./AddTask";

// Mock the Button and Task components
vi.mock("../../ui/Button", () => ({
  default: ({
    children,
    onClick,
    className,
  }: React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
  }>) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

vi.mock("../Task", () => ({
  default: ({
    children,
    onClick,
    className,
  }: React.PropsWithChildren<{
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    className?: string;
  }>) => (
    <div onClick={onClick} className={className}>
      {children}
    </div>
  ),
}));

describe("AddTask", () => {
  const onAddMock = vi.fn();

  beforeEach(() => {
    onAddMock.mockClear();
  });

  it("renders in inactive state initially", () => {
    render(<AddTask onAdd={onAddMock} />);
    expect(screen.getByText("+ Add new task")).toBeInTheDocument();
  });

  it("becomes active when clicked", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    expect(
      screen.getByPlaceholderText("Enter task content...")
    ).toBeInTheDocument();
  });

  it("allows typing in the textarea", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    await userEvent.type(textarea, "New task");
    expect(textarea).toHaveValue("New task");
  });

  it("shows character count", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    await userEvent.type(textarea, "New task");
    expect(screen.getByText("8/120")).toBeInTheDocument();
  });

  it("limits input to MAX_CHARS", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    const longText = "a".repeat(150);
    await userEvent.type(textarea, longText);
    expect(textarea).toHaveValue("a".repeat(120));
  });

  it("calls onAdd when Add button is clicked", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    await userEvent.type(textarea, "New task");
    await userEvent.click(screen.getByText("Add"));
    expect(onAddMock).toHaveBeenCalledWith("New task");
  });

  it("calls onAdd when Enter is pressed", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    await userEvent.type(textarea, "New task{enter}");
    expect(onAddMock).toHaveBeenCalledWith("New task");
  });

  it("does not call onAdd when Shift+Enter is pressed", () => {
    render(<AddTask onAdd={onAddMock} />);
    fireEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    fireEvent.change(textarea, { target: { value: "New task" } });
    fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });
    expect(onAddMock).not.toHaveBeenCalled();
  });

  it("resets when Cancel is clicked", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    await userEvent.type(textarea, "New task");
    await userEvent.click(screen.getByText("Cancel"));
    expect(screen.getByText("+ Add new task")).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText("Enter task content...")
    ).not.toBeInTheDocument();
  });

  it("becomes inactive when blurred with empty content", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    fireEvent.blur(textarea);
    expect(screen.getByText("+ Add new task")).toBeInTheDocument();
  });

  it("stays active when blurred with non-empty content", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    await userEvent.type(textarea, "New task");
    fireEvent.blur(textarea);
    expect(textarea).toBeInTheDocument();
  });

  it("trims whitespace when adding a task", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    const textarea = screen.getByPlaceholderText("Enter task content...");
    await userEvent.type(textarea, "  New task  ");
    await userEvent.click(screen.getByText("Add"));
    expect(onAddMock).toHaveBeenCalledWith("New task");
  });

  it("does not add empty tasks", async () => {
    render(<AddTask onAdd={onAddMock} />);
    await userEvent.click(screen.getByText("+ Add new task"));
    await userEvent.click(screen.getByText("Add"));
    expect(onAddMock).not.toHaveBeenCalled();
  });
});
