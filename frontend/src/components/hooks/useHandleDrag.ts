import type { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task } from "../types/Task";
import { useUpdateTask } from "./useUpdateTask";

export const handleDragEnd = (
  event: DragEndEvent,
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const { updatePositions } = useUpdateTask(tasks);
  const { active, over } = event;
  if (!over) return;
  if (active.id === over.id) return;

  const oldIndex = tasks.findIndex((t) => t.task_id === active.id);
  const newIndex = tasks.findIndex((t) => t.task_id === over.id);
  const newTasks = arrayMove(tasks, oldIndex, newIndex);

  setTasks(newTasks);

  setTimeout(() => updatePositions(newTasks), 0);
};
