import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { UpdateTaskProps } from "./types/Task";
import { UpdateTask } from "./UpdateTask";
import { useUpdateTask } from "./hooks/useUpdateTask";
// ============================================
// ---           COMPONENTE               ---
// ============================================

const SortableTask: React.FC<UpdateTaskProps> = ({
  id,
  task,
  onDeleteTask,
}) => {
  // --- 1. HOOKS de DND-Kit ---
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  // Estilos para el drag and drop y la apariencia
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : 1,
    backgroundColor: "#001E3C", // Se mantiene el color de fondo oscuro
  };

  // --- 3. RENDERIZADO (UNA ÚNICA VISTA, SIEMPRE EDITABLE) ---
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`grid gap-1 items-center px-4 py-2 border-b rounded-md border-gray-700/50 group transition-all ${
        task.completed ? "opacity-50" : "" // Reduce opacidad si está completada
      }`}
    >
      {/* Col 1: Drag Handle (::) y Checkbox de Completado */}

      <button
        {...attributes}
        {...listeners}
        className="text-gray-500 hover:text-[#00FDA4] cursor-grab active:cursor-grabbing transition-colors col-span-1"
        title="Arrastrar para reordenar"
      >
        <span className="text-xl leading-none">::</span>
      </button>
      <UpdateTask task={task} onUpdateTask={useUpdateTask} />
    </div>
  );
};

export default SortableTask;
