import React from "react";

const EmptySection: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-6 min-h-[200px] text-center m-auto">
      <img src="/assets/noTask.png" alt="No tasks" className="w-36 h-36 mb-4" />
      <p className="text-lg font-semibold text-gray-700 mb-2">
        No tasks here yet!
      </p>
      <p className="text-sm text-gray-500 italic">
        Start by dragging a task to this section.
      </p>
    </div>
  );
};

export default EmptySection;
