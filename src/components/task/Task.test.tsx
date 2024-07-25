import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import Task from "./Task";

// Mock the FaTrash icon
vi.mock("react-icons/fa", () => ({
  FaTrash: () => <div data-testid="trash-icon">Trash Icon</div>,
}));

describe("Task", () => {
  it("renders children correctly", () => {
    render(<Task>Test Task</Task>);
    expect(screen.getByTestId("task-content")).toHaveTextContent("Test Task");
  });

  it("applies custom className to the container", () => {
    render(<Task className="custom-class">Test Task</Task>);
    expect(screen.getByTestId("task-container")).toHaveClass("custom-class");
  });

  it("renders delete button when onDelete prop is provided", () => {
    const onDelete = vi.fn();
    render(<Task onDelete={onDelete}>Test Task</Task>);
    expect(screen.getByTestId("delete-button")).toBeInTheDocument();
  });

  it("does not render delete button when onDelete prop is not provided", () => {
    render(<Task>Test Task</Task>);
    expect(screen.queryByTestId("delete-button")).not.toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    const onDelete = vi.fn();
    render(<Task onDelete={onDelete}>Test Task</Task>);
    fireEvent.click(screen.getByTestId("delete-button"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("stops event propagation when delete button is clicked", () => {
    const onDelete = vi.fn();
    const onClick = vi.fn();
    render(
      <Task onDelete={onDelete} onClick={onClick}>
        Test Task
      </Task>
    );
    fireEvent.click(screen.getByTestId("delete-button"));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("preserves whitespace in content", () => {
    const multilineText = `Line 1
    Line 2
    Line 3`;
    render(<Task>{multilineText}</Task>);
    expect(screen.getByTestId("task-content")).toHaveClass(
      "whitespace-pre-wrap"
    );
  });

  it("applies break-words class to content container", () => {
    render(<Task>Test Task</Task>);
    expect(screen.getByTestId("task-container").firstChild).toHaveClass(
      "break-words"
    );
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Task ref={ref}>Test Task</Task>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
