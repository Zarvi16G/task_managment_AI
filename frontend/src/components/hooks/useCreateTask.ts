import { createTask as apiCreateTask } from "../../api/client";
import type { Task } from "../types/Task";

export const usehandleCreateTask = (
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const handleNewTask = async () => {
    try {
      // 1. Crear la tarea mediante la API
      const response = await apiCreateTask();
      const newTask: Task = await response.data;
      console.log("newTasks corresponding to:", newTask);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      console.log("✅ Tarea creada");
    } catch (error) {
      console.error("❌ Error creando la tarea:", error);
      alert("No se pudo crear la tarea. Intenta de nuevo.");
    }
  };
  return { handleNewTask };
};
