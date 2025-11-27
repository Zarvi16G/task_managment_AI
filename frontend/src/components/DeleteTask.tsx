import type { DeleteTaskProps } from "./types/Task";

const DeleteTask = ({ id, onDeleteTask }: DeleteTaskProps) => {
  return (
    // Delete action button
    <div className="col-span-2 flex justify-end">
      <button
        onClick={() => onDeleteTask(id)}
        className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-50 group-hover:opacity-100"
        title="Eliminar Tarea"
      >
        🗑️
      </button>
    </div>
  );
};
export default DeleteTask;
