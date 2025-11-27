import { useState, useEffect, useCallback } from "react";
import type { Task } from "../types/Task";
import { getTasks } from "../../api/client";
import { useHandleDeleteTask } from "./useHandleDeleteTask";
import { useUpdateTask } from "./useUpdateTask";
import { useTaskSorting } from "./useTaskSorting";
import { DragAndDrop } from "./useHandleDrag";
import { usehandleCreateTask } from "./useCreateTask";

// --- Hook principal --- //
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { handleDeleteTask } = useHandleDeleteTask(setTasks);
  const { handleUpdateTask, updatePositions } = useUpdateTask(tasks, setTasks);
  const { handleSort, sortedTasks, sortConfig } = useTaskSorting(tasks);
  const { handleDragEnd } = DragAndDrop(tasks, setTasks, updatePositions);
  const { handleNewTask } = usehandleCreateTask(setTasks);

  // Cargar tareas desde la API
  const loadTasks = useCallback(async () => {
    try {
      const response = await getTasks();
      if (response.status === 200) {
        const sorted = response.data.sort(
          (a: Task, b: Task) => a.position - b.position
        );
        setTasks(sorted);
      } else {
        console.log("No tasks found.");
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  }, []);

  // Cargar al inicio
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    sortedTasks,
    handleSort,
    sortConfig,
    handleDragEnd,
    setTasks,
    handleNewTask,
    handleUpdateTask,
    handleDeleteTask,
  };
}
