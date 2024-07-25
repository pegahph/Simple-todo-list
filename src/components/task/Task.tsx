import React, { forwardRef } from "react";
import { FaTrash } from "react-icons/fa";

export interface TaskProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onDelete?: () => void;
}

const Task = forwardRef<HTMLDivElement, TaskProps>(
  ({ children, className, onDelete, ...divProps }, ref) => {
    return (
      <div
        ref={ref}
        className={`p-3 rounded border border-gray-200 flex items-center justify-between ${className}`}
        {...divProps}
      >
        <div className="flex-1 min-w-0 mr-2 break-words">
          <div className="whitespace-pre-wrap">{children}</div>
        </div>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200 flex-shrink-0 ml-2"
          >
            <FaTrash />
          </button>
        )}
      </div>
    );
  }
);

Task.displayName = "Task";

export default Task;
