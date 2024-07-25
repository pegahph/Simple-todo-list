import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import Button from "../../ui/Button";
import Task from "../Task";

interface AddTaskProps {
  onAdd: (content: string) => void;
}

const MAX_CHARS = 120;

const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [active, setActive] = useState(false);
  const [taskContent, setTaskContent] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (active && textareaRef.current) {
      textareaRef.current.focus();
      adjustTextareaHeight();
    }
  }, [active]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    if (newContent.length <= MAX_CHARS) {
      setTaskContent(newContent);
      adjustTextareaHeight();
    }
  };

  const handleAddTask = () => {
    if (taskContent.trim() !== "") {
      onAdd(taskContent.trim());
      setTaskContent("");
      setActive(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  return (
    <Task
      onClick={() => setActive(true)}
      className={`cursor-pointer select-none transition-colors duration-150 ${
        active ? "bg-white" : "bg-gray-50 hover:bg-gray-100"
      }`}
    >
      {active ? (
        <div className="flex flex-col gap-3">
          <textarea
            ref={textareaRef}
            value={taskContent}
            onChange={handleTextareaChange}
            placeholder="Enter task content..."
            className="w-full resize-none overflow-hidden bg-transparent transition-colors duration-150 py-1"
            rows={1}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (!taskContent) {
                setActive(false);
              }
            }}
            maxLength={MAX_CHARS}
          />
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {taskContent.length}/{MAX_CHARS}
            </span>
            <div className="flex gap-2">
              <Button
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(false);
                  setTaskContent("");
                }}
              >
                Cancel
              </Button>
              <Button
                className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded transition-colors duration-150"
                onClick={handleAddTask}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-gray-500 hover:text-gray-700 transition-colors duration-150">
          + Add new task
        </div>
      )}
    </Task>
  );
};

export default AddTask;
