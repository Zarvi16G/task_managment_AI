import { createTask as apiCreateTask } from "../../api/client";

export const usehandleCreateTask = async () => {
  try {
    // 1. Crear la tarea mediante la API
    const createdTask = await apiCreateTask();
    console.log("✅ Tarea creada:", createdTask);
  } catch (error) {
    console.error("❌ Error creando la tarea:", error);
    alert("No se pudo crear la tarea. Intenta de nuevo.");
  }
};
