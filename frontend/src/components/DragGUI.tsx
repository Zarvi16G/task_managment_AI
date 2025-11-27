import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { dragGUIProps } from "./types/Task";
import UpdateTask from "./UpdateTask";

const DragGUI = ({ id, task, onUpdateTask, onDeleteTask }: dragGUIProps) => {
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
      className="grid grid-cols-12 bg-[#001E3C] p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors"
    >
      {/* Col 1: Drag Handle (::)*/}
      <button
        {...attributes}
        {...listeners}
        className="text-gray-500 hover:text-[#00FDA4] cursor-grab active:cursor-grabbing transition-colors col-span-1"
        title="Arrastrar para reordenar"
      >
        <span className="text-xl leading-none">::</span>
      </button>
      <UpdateTask
        id={id}
        task={task}
        onUpdateTask={onUpdateTask}
        onDeleteTask={onDeleteTask}
      />
    </div>
  );
};

export default DragGUI;
