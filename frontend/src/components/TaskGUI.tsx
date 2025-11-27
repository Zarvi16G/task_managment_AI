import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TitleSorting from "./TitleSorting";
import Statistics from "./Statistics";
import Header from "./Header";
import DragGUI from "./DragGUI";
import { useTasks } from "./hooks/useTasks";

export default function TaskGUI() {
  const {
    tasks,
    sortedTasks,
    handleSort,
    sortConfig,
    handleDragEnd,
    handleDeleteTask,
    handleUpdateTask,
    handleNewTask,
  } = useTasks();

  return (
    <div>
      <Header />
      <h1 className="text-5xl text-center text-[#00FDA4] mt-5 font-bold mb-4">
        Task List
      </h1>

      <div className="bg-[#000C19] flex flex-col items-center">
        <div className="grid grid-cols-1 gap-4 p-4 justify-center bg-[#CAEAFF] rounded-md">
          <TitleSorting
            onSort={handleSort}
            currentSortKey={sortConfig?.key || null}
            onNewTask={handleNewTask}
          />
          <DndContext onDragEnd={handleDragEnd}>
            <SortableContext
              items={tasks.map((t) => t.task_id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedTasks.map((task) => (
                <DragGUI
                  key={task.task_id}
                  id={task.task_id}
                  task={task}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTask}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <Statistics tasks={tasks} />
      </div>
    </div>
  );
}
