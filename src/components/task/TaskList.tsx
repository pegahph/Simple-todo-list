import { Draggable, Droppable } from "@hello-pangea/dnd";
import React from "react";
import { TaskStateDisplayText } from "../../enums";
import EmptySection from "../emptySection/EmptySection";
import AddTask from "./AddTask";
import Task from "./Task";

interface TaskListProps {
  type: TaskStateType;
  tasks: Task[];
  onAddTask?: (content: string) => void;
  onTaskDelete: (taskId: string, taskState: TaskStateType) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  type,
  tasks,
  onAddTask,
  onTaskDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col">
      <h2 className="font-semibold text-lg bg-gray-50 p-4 border-b border-gray-200 select-none">
        {TaskStateDisplayText[type]}
      </h2>
      <Droppable droppableId={type}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-grow p-4 flex flex-col gap-2 transition-colors duration-200 ${
              snapshot.isDraggingOver ? "bg-blue-50" : ""
            }`}
          >
            {tasks.length === 0 ? (
              type === "todo" ? null : (
                <EmptySection />
              )
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <Task
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onDelete={() => onTaskDelete(task.id, task.state)}
                      className="bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
                    >
                      {task.content}
                    </Task>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
            {type === "todo" && onAddTask && <AddTask onAdd={onAddTask} />}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskList;
