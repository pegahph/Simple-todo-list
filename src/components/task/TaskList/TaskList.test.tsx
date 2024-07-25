import {
    DraggableProvided,
    DroppableProvided,
    DroppableStateSnapshot,
} from "@hello-pangea/dnd";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { TaskStateDisplayText } from "../../../enums";
import TaskList from "./TaskList";

vi.mock("@hello-pangea/dnd", () => ({
  Droppable: ({
    children,
  }: {
    children: (
      provided: DroppableProvided,
      snapshot: DroppableStateSnapshot
    ) => React.ReactNode;
  }) =>
    children(
      {
        draggableProps: {
          style: {},
        },
        innerRef: () => {},
        placeholder: null,
      } as unknown as DroppableProvided,
      { isDraggingOver: false } as DroppableStateSnapshot
    ),
  Draggable: ({
    children,
  }: {
    children: (provided: DraggableProvided) => React.ReactNode;
  }) =>
    children({
      draggableProps: {
        style: {},
      },
      dragHandleProps: null,
      innerRef: () => {},
    } as unknown as DraggableProvided),
}));

vi.mock("../../emptySection/EmptySection", () => ({
  default: () => <div data-testid="empty-section">Empty Section</div>,
}));

vi.mock("../addTask/AddTask", () => ({
  default: ({ onAdd }: { onAdd: (content: string) => void }) => (
    <button onClick={() => onAdd("New Task")}>Add Task</button>
  ),
}));

vi.mock("../Task", () => ({
  default: React.forwardRef<
    HTMLDivElement,
    { children: React.ReactNode; onDelete: () => void }
  >(({ children, onDelete }, ref) => (
    <div ref={ref}>
      {children}
      <button onClick={onDelete}>Delete</button>
    </div>
  )),
}));

describe("TaskList", () => {
  const mockTasks: Task[] = [
    { id: "1", content: "Task 1", state: "todo" },
    { id: "2", content: "Task 2", state: "todo" },
  ];

  const mockOnAddTask = vi.fn();
  const mockOnTaskDelete = vi.fn();

  it("renders the correct title", () => {
    render(
      <TaskList
        type="todo"
        tasks={[]}
        onAddTask={mockOnAddTask}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    expect(screen.getByText(TaskStateDisplayText.todo)).toBeInTheDocument();
  });

  it("renders tasks when provided", () => {
    render(
      <TaskList
        type="todo"
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  it("renders EmptySection when no tasks and type is not todo", () => {
    render(
      <TaskList
        type="inprogress"
        tasks={[]}
        onAddTask={mockOnAddTask}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    expect(screen.getByTestId("empty-section")).toBeInTheDocument();
  });

  it("does not render EmptySection when no tasks and type is todo", () => {
    render(
      <TaskList
        type="todo"
        tasks={[]}
        onAddTask={mockOnAddTask}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    expect(screen.queryByTestId("empty-section")).not.toBeInTheDocument();
  });

  it("renders AddTask component when type is todo", () => {
    render(
      <TaskList
        type="todo"
        tasks={[]}
        onAddTask={mockOnAddTask}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    expect(screen.getByText("Add Task")).toBeInTheDocument();
  });

  it("does not render AddTask component when type is not todo", () => {
    render(
      <TaskList type="inprogress" tasks={[]} onTaskDelete={mockOnTaskDelete} />
    );
    expect(screen.queryByText("Add Task")).not.toBeInTheDocument();
  });

  it("calls onTaskDelete when delete button is clicked", async () => {
    render(
      <TaskList
        type="todo"
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    await userEvent.click(screen.getAllByText("Delete")[0]);
    expect(mockOnTaskDelete).toHaveBeenCalledWith("1", "todo");
  });

  it("calls onAddTask when Add Task button is clicked", async () => {
    render(
      <TaskList
        type="todo"
        tasks={[]}
        onAddTask={mockOnAddTask}
        onTaskDelete={mockOnTaskDelete}
      />
    );
    await userEvent.click(screen.getByText("Add Task"));
    expect(mockOnAddTask).toHaveBeenCalledWith("New Task");
  });
});
