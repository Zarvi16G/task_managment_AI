import type { Task } from "../types/Task";
import { updatedTask, reorderTasks } from "../../api/client";

// Hook para manejar actualizaciones y reordenamientos
export function useUpdateTask(
  tasks: Task[],
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) {
  // const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // ✅ Actualizar una tarea específica
  const handleUpdateTask = async (editedTask: Task) => {
    try {
      const response = await updatedTask(editedTask);
      setTasks((prev) =>
        prev.map((t) =>
          t.task_id === response.data.task_id ? response.data : t
        )
      );
    } catch (error: any) {
      if (error.response) {
        console.error(`Error ${error.response.status}:`, error.response.data);
      } else {
        console.error("Network error:", error.message);
      }
    }
  };

  // ✅ Actualizar las posiciones (drag & drop)
  const updatePositions = async (tasks: Task[]) => {
    try {
      const updatedTasks = tasks.map((task, index) =>
        task.position !== index ? { ...task, position: index } : task
      );

      await Promise.all(
        updatedTasks.map((task) => reorderTasks(task.task_id, task.position))
      );

      setTasks(updatedTasks);
    } catch (error) {
      console.error("Failed to update task positions:", error);
    }
  };

  // 🔁 Retorna lo necesario al componente
  return { tasks, setTasks, handleUpdateTask, updatePositions };
}
