import type { UpdateTaskProps } from "./types/Task";

export const UpdateTask: React.FC<UpdateTaskProps> = ({
  task,
  onUpdateTask,
  onDeleteTask,
}) => {
  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = event.target;

    // 1. Determina el valor base: 'checked' para checkbox, 'value' para el resto.
    const updatedValue = type === "checkbox" ? checked : value;

    // 2. Llama a la prop onUpdateTask con la tarea modificada
    onUpdateTask({
      ...task,
      [name]:
        // Si es un selector, convertimos los strings "true"/"false" a booleanos.
        type === "select-one"
          ? updatedValue === "true"
            ? true
            : false
          : // Para los otros campos (checkbox y texto/date), usamos el updatedValue
            updatedValue,
    });
  };

  // Función auxiliar para determinar el color de prioridad
  const getPriorityClasses = (isHighPriority: boolean) =>
    isHighPriority
      ? "bg-red-500/10 text-red-400"
      : "bg-green-500/10 text-green-400";

  return (
    <div className="grid grid-cols-10 gap-2 p-2 border-b border-gray-700 hover:bg-gray-800 transition-colors">
      {/* Col 1: Checkbox de Completado */}
      <div className="col-span-1 flex items-center justify-center">
        <input
          type="checkbox"
          name="completed"
          checked={task.completed}
          onChange={handleFieldChange}
          className="w-5 h-5 rounded border-2 border-gray-600 bg-gray-800 cursor-pointer
                     checked:bg-[#00FDA4] checked:border-[#00FDA4]/50 transition-all
                     focus:outline-none focus:ring-2 focus:ring-[#00FDA4] focus:ring-offset-2 focus:ring-offset-[#001E3C]"
        />
      </div>

      {/* Col 2: Título de la Tarea (Editable) */}
      <div className="col-span-5">
        <input
          type="text"
          name="title"
          value={task.title}
          onChange={handleFieldChange}
          className={`w-full bg-transparent text-base font-semibold outline-none focus:bg-gray-800/50 p-1 rounded-md transition-all ${
            task.completed ? "line-through text-gray-500" : "text-white"
          }`}
          placeholder="Nombre de la tarea"
        />
      </div>

      {/* Col 3: Prioridad (Selector Editable) */}
      <div className="col-span-2">
        {/* Usamos String(task.priority) porque el 'value' del select es siempre un string */}
        <select
          name="priority"
          value={String(task.priority)}
          onChange={handleFieldChange}
          className={`w-full rounded-md px-2 py-1 text-xs font-bold border-0 outline-none focus:ring-2 focus:ring-[#00FDA4] transition-all 
            ${getPriorityClasses(task.priority)}`}
        >
          {/* El valor 'value' es el string que se evalúa en handleFieldChange */}
          <option value="true" className="font-bold text-red-500 bg-gray-800">
            HIGH
          </option>
          <option
            value="false"
            className="font-bold text-green-500 bg-gray-800"
          >
            LOW
          </option>
        </select>
      </div>

      {/* Col 4: Fecha de Vencimiento (Editable) */}
      <div className="col-span-2">
        <input
          type="date"
          name="due_date"
          // Asegúrate de que task.due_date sea una cadena "YYYY-MM-DD" o ajusta
          value={task.due_date || ""}
          onChange={handleFieldChange}
          className="bg-transparent text-sm text-gray-400 p-1 rounded-md outline-none focus:bg-gray-800/50 hover:bg-gray-800/50 w-full"
          style={{ colorScheme: "dark" }}
        />
      </div>
      {/* Col 5: Acción de Eliminar */}
      <div className="col-span-2 flex justify-end">
        <button
          onClick={() => onDeleteTask(task)}
          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-50 group-hover:opacity-100"
          title="Eliminar Tarea"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};
