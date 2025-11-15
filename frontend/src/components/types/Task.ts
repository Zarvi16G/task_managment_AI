export interface Task {
  task_id: number;
  title: string;
  completed: boolean;
  priority: boolean;
  due_date: string; // Using string for simplicity, could be Date or a specific library's type
  position: number; // New field for ordering
}

// Handler function signature
export interface SortableTaskProps {
  id: number; // from SortableContext
  task: Task;
  // Handler from the parent TaskList component to save changes to the API
  onUpdateTask: (updatedTask: Task) => void; // Cambiado para ser síncrono, el padre puede manejar el async
}

//
export interface StatisticsProps {
  tasks: Task[];
}

// El componente recibe una función del padre para poder comunicarse con él
export interface SortControlsProps {
  onSort: (key: string) => void;
  currentSortKey: string | null; // Para saber qué botón resaltar
}

export interface NewTask {
  title: null;
  priority: null;
  due_date: null;
}

export interface UpdateTaskProps {
  id: number;
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (deleteTask: Task) => void;
}

export interface CreateTaskProps {
  onCreateTask: (newTask: NewTask) => void;
}
