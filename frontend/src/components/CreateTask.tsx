import React from "react";
import type { CreateTaskProps } from "./types/Task";

export default function CreateTask({ onCreateTask }: CreateTaskProps) {
  const handleCreateNewTask = () => {
    // Define la estructura de la tarea nueva con valores iniciales/null
    // Asegúrate que esta estructura coincida con lo que espera tu API,
    // OMITIENDO campos generados por el servidor como el ID.

    const newTemporalTask = {
      // ID (NO INCLUIDO - Lo genera el backend)

      // Valores iniciales para campos de texto/contenido
      title: "", // O null
      description: "", // O null

      // Valores por defecto para estados/booleanos
      status: "Pendiente",
      isCompleted: false,

      // Fechas (si las manejas en el frontend)
      createdAt: new Date().toISOString(), // O null, si lo genera el backend
      // ... otros campos
    };

    // Llama a la prop `onCreateTask` enviando el objeto temporal
    onCreateTask(newTemporalTask);
  };
}
