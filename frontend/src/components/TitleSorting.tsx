import type { SortControlsProps } from "./types/Task";
import React from "react";

const TitleSorting: React.FC<SortControlsProps> = ({ onSort, onNewTask }) => {
  return (
    <div className="grid grid-cols-12 p-4 bg-[#001E3C] rounded-md">
      <button className="col-span-1" onClick={onNewTask}>
        +
      </button>
      <h3 className="col-span-5 text-center">Title</h3>
      {/* En lugar de manejar un evento, llamamos a onSort con la clave que queremos */}
      <h3 className="col-span-1">Priority</h3>
      <button
        onClick={() => onSort("priority")}
        className={`col-span-1 hover:scale-105 cursor-pointer  {$currentSortKey === "priority" ? "active" : ""}`}
      >
        ⬆︎⬇︎
      </button>
      <h3 className="col-span-1">Due Date</h3>

      <button
        onClick={() => onSort("due_date")}
        className={`col-span-1 hover:scale-105 cursor-pointer {$currentSortKey === "due_date" ? "active" : ""}`}
      >
        ⬆︎⬇︎
      </button>
      <h3 className="col-span-2 text-center">Actions</h3>
    </div>
  );
};

export default TitleSorting;
