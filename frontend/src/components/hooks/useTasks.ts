import { useState, useEffect, useCallback } from "react";
import type { Task, NewTask } from "../types/Task";
import {
  getTasks,
  updatedTask,
  deleteTask,
  reorderTasks,
  createTask as apiCreateTask,
} from "../../api/client";
import { arrayMove } from "@dnd-kit/sortable";
import type { DragEndEvent } from "@dnd-kit/core";

// --- Hook principal --- //
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

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

  // Crear tarea
  const handleCreateTask = useCallback(async (newTask: NewTask) => {
    try {
      const response = await apiCreateTask(newTask);
      if (response.status === 201) {
        setTasks((prev) => [...prev, response.data]);
      }
    } catch (error) {
      console.error("Failed to create task:", error);
    }
  }, []);

  // Actualizar tarea
  const handleUpdateTask = useCallback(async (editedTask: Task) => {
    try {
      const response = await updatedTask(editedTask);
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.task_id === response.data.task_id ? response.data : t
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  }, []);

  // Eliminar tarea
  const handleDeleteTask = useCallback(
    async (taskToDelete: Task) => {
      const previousTasks = [...tasks];
      setTasks((current) =>
        current.filter((t) => t.task_id !== taskToDelete.task_id)
      );
      try {
        await deleteTask(taskToDelete.task_id);
      } catch (error) {
        console.error("Failed to delete task:", error);
        alert("No se pudo eliminar la tarea. Inténtalo de nuevo.");
        setTasks(previousTasks); // revertir
      }
    },
    [tasks]
  );

  // Actualizar posiciones en el backend
  const updatePositions = useCallback(async (tasksToUpdate: Task[]) => {
    try {
      const updatedTasks = tasksToUpdate.map((task, index) =>
        task.position !== index ? { ...task, position: index } : task
      );
      await Promise.all(
        updatedTasks.map((task) => reorderTasks(task.task_id, task.position))
      );
    } catch (error) {
      console.error("Failed to update task positions:", error);
    }
  }, []);

  // Reordenar con Drag & Drop
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      setTasks((current) => {
        const oldIndex = current.findIndex((t) => t.task_id === active.id);
        const newIndex = current.findIndex((t) => t.task_id === over.id);
        const newTasks = arrayMove(current, oldIndex, newIndex);
        updatePositions(newTasks);
        return newTasks;
      });
    },
    [updatePositions]
  );

  // Ordenar por campo
  const handleSort = useCallback(
    (key: string) => {
      let direction = "ascending";
      if (sortConfig?.key === key && sortConfig.direction === "ascending")
        direction = "descending";
      else if (sortConfig?.key === key && sortConfig.direction === "descending")
        return setSortConfig(null);

      setSortConfig({ key, direction });
    },
    [sortConfig]
  );

  // Calcular tareas ordenadas
  const sortedTasks = useCallback(() => {
    if (!sortConfig) return tasks;
    return [...tasks].sort((a, b) => {
      if (sortConfig.key === "priority") {
        const valA = a.priority ? 1 : 0;
        const valB = b.priority ? 1 : 0;
        return sortConfig.direction === "ascending" ? valB - valA : valA - valB;
      }
      if (sortConfig.key === "due_date") {
        const dateA = new Date(a.due_date).getTime();
        const dateB = new Date(b.due_date).getTime();
        return sortConfig.direction === "ascending"
          ? dateA - dateB
          : dateB - dateA;
      }
      return 0;
    });
  }, [tasks, sortConfig]);

  // Cargar al inicio
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    sortedTasks: sortedTasks(),
    handleSort,
    sortConfig,
    handleCreateTask,
    handleUpdateTask,
    handleDeleteTask,
    handleDragEnd,
    setTasks,
  };
}
