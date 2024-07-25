import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import React, { useState } from "react";
import TaskList from "./components/task/TaskList";

interface TaskLists {
  [key: string]: Task[];
}

const TodoApp: React.FC = () => {
  const [tasks, setTasks] = useState<TaskLists>({
    todo: [],
    inprogress: [],
    done: [],
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceKey = source.droppableId as TaskStateType;
    const destKey = destination.droppableId as TaskStateType;

    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };

      // Remove the task from the source list
      const sourceList = Array.from(newTasks[sourceKey]);
      const [movedTask] = sourceList.splice(source.index, 1);

      if (sourceKey === destKey) {
        // Moving within the same list
        sourceList.splice(destination.index, 0, movedTask);
        newTasks[sourceKey] = sourceList;
      } else {
        // Moving to a different list
        const destList = Array.from(newTasks[destKey]);
        movedTask.state = destKey;
        destList.splice(destination.index, 0, movedTask);
        newTasks[sourceKey] = sourceList;
        newTasks[destKey] = destList;
      }

      return newTasks;
    });
  };
  const addTask = (content: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      content: content,
      state: "todo",
    };
    setTasks((prevTasks) => ({
      ...prevTasks,
      todo: [...prevTasks.todo, newTask],
    }));
  };

  const onTaskDelete = (taskId: string, taskState: TaskStateType) => {
    setTasks((prevTasks) => {
      const newTasks = { ...prevTasks };
      newTasks[taskState] = newTasks[taskState].filter(
        (task) => task.id !== taskId
      );
      return newTasks;
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <div className="flex-grow flex flex-col p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl w-full mx-auto flex flex-col flex-grow">
          <header className="mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              My Simple Todo List
            </h1>
            <p className="text-gray-600">Organize your tasks with ease</p>
          </header>
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 flex-grow">
              {Object.keys(tasks).map((taskColumn) => (
                <TaskList
                  key={taskColumn}
                  tasks={tasks[taskColumn as TaskStateType]}
                  type={taskColumn as TaskStateType}
                  onAddTask={taskColumn === "todo" ? addTask : undefined}
                  onTaskDelete={onTaskDelete}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
