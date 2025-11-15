import { getTasks, updatedTask, deleteTask, reorderTasks } from "../api/client";
import { useEffect, useState } from "react";

import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { closestCorners, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";
import type { Task } from "./types/Task";
import Statistics from "./Statistics";
import TitleSorting from "./TitleSorting";
import { useMemo } from "react";
import Header from "./Header";

export default function TaskList() {
  // Hook Por qué se dice hook:
  // Los hooks son funciones especiales de React que "enganchan" (hook = gancho) a tu componente con
  // el sistema interno de React. Te permiten manejar estado (useState) y
  // ciclo de vida (useEffect) en componentes funcionales.

  // tasks es el estado que contiene la lista de tareas.
  // setTasks es la función para actualizar ese estado.
  // useState([]) inicializa tasks como un array vacío.
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    const response = await getTasks();
    // await getTasks() espera la respuesta de la API.
    // setTasks(response.data) actualiza el estado con las tareas que vinieron.
    switch (response.status) {
      case 200:
        console.log("Tareas cargadas exitosamente.");
        // Sort tasks by position before setting state
        const sortTasks = response.data.sort(
          (a: Task, b: Task) => a.position - b.position
        );
        // If sorting fails, just set the tasks as they are
        updatePositions(sortTasks);
        // Once sorted, show tasks in UI
        setTasks(response.data);
        break;
      case 204:
        console.log("There are no tasks to show.");
        break;
      default:
        console.warn("Unknown response from API:", response);
    }
  };

  // Function to handle the end of a drag event.
  const handleDragEnd = (event: DragEndEvent) => {
    // Destructure active and over from the event.
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return; // If the item was dropped in the same place, do nothing.
    console.log("Active ID:", active.id);
    console.log("Over ID:", over.id);

    let newTasks: Task[];
    // Reorder the tasks array based on the drag event.
    setTasks((currentTasks) => {
      // Find the indices of the dragged item and the item it was dropped over.
      const oldIndex = currentTasks.findIndex(
        (task: Task) => task.task_id === active.id
      ); // Find the index of the dragged item.
      console.log("Old Index:", oldIndex);
      const newIndex = currentTasks.findIndex(
        (task: Task) => task.task_id === over.id
      ); // Find the index of the item it was dropped over.
      console.log("New Index:", newIndex);
      newTasks = arrayMove(currentTasks, oldIndex, newIndex);
      return newTasks;
    });
    // always run this after the state has been updated
    setTimeout(() => {
      if (newTasks) {
        updatePositions(newTasks);
        console.log("Tasks reordered and sent to API:", newTasks);
      }
    }, 0);
  };

  // Esta es la función que va a la API y actualiza el estado local
  const handleUpdateTask = async (editedTask: Task) => {
    try {
      // If the status is 200-299, this line succeeds.
      const response = await updatedTask(editedTask);

      // 2. Local State Update (The CRITICAL step for UI refresh) 🚀
      setTasks((prevTasks: any) => {
        // Create a NEW array to trigger a React re-render.
        return prevTasks.map((t: Task) => {
          // If the IDs match, replace the old task with the newly updated object.
          if (t.task_id === response.data.task_id) {
            return response.data;
          }
          // Otherwise, keep the task as it was.
          return t;
        });
      });
    } catch (error: any) {
      // 🛑 AXIOS THROWS ERROR HERE 🛑
      // This 'catch' block runs for 4xx and 5xx errors.

      // To get the actual HTTP status code, look inside the error object:
      if (error.response) {
        console.error(`Request failed with status: ${error.response.status}`);
        console.error("Server message:", error.response.data);

        // You can re-throw a custom error here if needed
        throw new Error(`Failed to save task: ${error.response.status}`);
      } else {
        // This handles network errors (e.g., server offline, no internet)
        console.error("Network or request setup error:", error.message);
        throw new Error("Network error occurred.");
      }
    }
  };

  const handleDeleteTask = async (taskToDelete: Task) => {
    // 1. Guardamos el estado actual por si necesitamos revertir
    const previousTasks = tasks;

    // 2. Actualización optimista: removemos la tarea de la UI inmediatamente
    setTasks((currentTasks) =>
      currentTasks.filter((task: Task) => task.task_id !== taskToDelete.task_id)
    );
    console.log("Deleting task:", taskToDelete);
    console.log("Deleting task:", taskToDelete.task_id);
    try {
      // 3. Llamada a la API para eliminarla en el backend
      await deleteTask(taskToDelete.task_id); // Es más común enviar solo el ID para borrar

      // Si todo va bien, no hacemos nada más. La UI ya está actualizada.
    } catch (error) {
      // 4. Si la API falla, mostramos un error al usuario y revertimos el estado
      console.error("Failed to delete the task:", error);
      alert("No se pudo eliminar la tarea. Inténtalo de nuevo."); // O usar una notificación más elegante

      // Revertimos al estado anterior para que la tarea reaparezca
      setTasks(previousTasks);
    }
  };

  // Sorting logic
  // State to keep track of the current sort configuration
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  // Function to handle sorting when a column header is clicked
  const handleSort = (key: string) => {
    let direction = "ascending";

    // Si el usuario hace clic en la misma columna que ya está ordenada...
    console.log("Sorting by key:", key);
    console.log("Current sort config:", sortConfig);
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      // ...invertimos la dirección.
      direction = "descending";
    } else if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      // Si ya estaba en descending, volvemos al orden natural (null)
      key = ""; // Esto indica que no hay ordenamiento activo
      direction = "";
    }

    // Actualizamos el estado con la nueva configuración de ordenamiento.
    setSortConfig({ key, direction });
  };

  // En tu componente principal (TaskList.tsx), antes del `return`

  const sortedTasks = useMemo(() => {
    // Hacemos una copia para no mutar el estado original
    let sortableTasks = [...tasks];

    if (sortConfig !== null) {
      sortableTasks.sort((a: Task, b: Task) => {
        // Lógica para la prioridad (boolean)
        if (sortConfig.key === "priority") {
          // En JS, `false` es 0 y `true` es 1.
          // Para ordenar `true` primero, restamos b de a.
          const valA = a.priority ? 1 : 0;
          const valB = b.priority ? 1 : 0;
          if (sortConfig.direction === "ascending") {
            // high -> low
            return valB - valA;
          } else {
            // low -> high
            return valA - valB;
          }
        }

        // Lógica para la fecha (dueDate)
        if (sortConfig.key === "due_date") {
          const dateA = new Date(a.due_date).getTime();
          const dateB = new Date(b.due_date).getTime();
          if (sortConfig.direction === "ascending") {
            // más reciente -> más lejana
            return dateA - dateB;
          } else {
            // más lejana -> más reciente
            return dateB - dateA;
          }
        }

        return 0; // No hay cambios si la clave no coincide
      });
    }

    return sortableTasks;
  }, [tasks, sortConfig]); // Solo se vuelve a ejecutar si `tasks` o `sortConfig` cambian

  //Manage content when there are no tasks
  let content;
  content = (
    <div className="bg-[#000C19] flex flex-col items-center">
      <div className="grid grid-cols-1 gap-4 p-4 justify-center bg-[#CAEAFF] rounded-md">
        <TitleSorting
          onSort={handleSort}
          currentSortKey={sortConfig?.key || null}
        />
        {/* Drag & Drop */}
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext
            items={tasks.map((task: Task) => task.task_id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedTasks.map((task: Task) => (
              // Each SortableTask gets its unique ID and the task data as props.
              <SortableTask
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
  );

  // Y en tu JSX, en lugar de mapear `tasks`, mapeas `sortedTasks`:
  // {sortedTasks.map(task => <TaskItem key={task.id} task={task} />)}

  useEffect(() => {
    loadTasks();
  }, []);
  // El [] vacío significa solo corre una vez al inicio.
  return (
    <div>
      <Header />
      <DndContext collisionDetection={closestCorners} />
      {/* Title section */}
      <h1 className="text-5xl text-center text-[#00FDA4] mt-5 font-bold mb-4">
        Task List
      </h1>
      {content}
    </div>
  );
}
