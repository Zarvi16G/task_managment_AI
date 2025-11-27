import { deleteTask } from "../../api/client";
import type { Task } from "../types/Task";

export function useHandleDeleteTask(
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
  const handleDeleteTask = async (taskToDelete: number) => {
    // Guardar estado anterior
    setTasks((currentTasks) => {
      const prevTasks = [...currentTasks];
      // Eliminación optimista
      const filtered = currentTasks.filter((id) => id.task_id !== taskToDelete);

      // Ejecutar API
      deleteTask(taskToDelete)
        .then(() => console.log("Task deleted:", taskToDelete))
        .catch((error) => {
          console.error("Error deleting task:", error);
          alert("Error al eliminar la tarea. Se revertirá el cambio.");
          // Revertir si falla
          setTasks(prevTasks);
        });

      return filtered;
    });
  };

  return { handleDeleteTask };
}
