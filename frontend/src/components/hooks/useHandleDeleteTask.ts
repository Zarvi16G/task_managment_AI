import { deleteTask } from "../../api/client";
import type { Task } from "../types/Task";

export function useHandleDeleteTask(
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
  const handleDeleteTask = async (taskToDelete: Task) => {
    // Guardar estado anterior
    setTasks((currentTasks) => {
      const prevTasks = [...currentTasks];
      // Eliminación optimista
      const filtered = currentTasks.filter(
        (t) => t.task_id !== taskToDelete.task_id
      );

      // Ejecutar API
      deleteTask(taskToDelete.task_id)
        .then(() => console.log("Task deleted:", taskToDelete.task_id))
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
