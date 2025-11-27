export interface Task {
  task_id: number;
  title: string;
  completed: boolean;
  priority: boolean;
  due_date: string; // Using string for simplicity, could be Date or a specific library's type
  position: number; // New field for ordering
}

// Handler function signature
export interface UpdateTaskProps {
  id: number;
  task: Task;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: DeleteTaskProps["onDeleteTask"];
}

//
export interface StatisticsProps {
  tasks: Task[];
}

// El componente recibe una función del padre para poder comunicarse con él
export interface SortControlsProps {
  onSort: (key: string) => void;
  currentSortKey: string | null; // Para saber qué botón resaltar
  onNewTask: CreateTaskProps["onCreateTask"];
}

export interface NewTask {
  title: null;
  priority: null;
  due_date: null;
}

export interface dragGUIProps {
  id: number;
  task: Task;
  onUpdateTask: UpdateTaskProps["onUpdateTask"];
  onDeleteTask: DeleteTaskProps["onDeleteTask"];
}

export interface CreateTaskProps {
  onCreateTask: () => void;
}

export interface DeleteTaskProps {
  id: number;
  onDeleteTask: (taskId: number) => void;
}

// Tipo de la información del usuario (solo los campos editables)
export interface UserProfileData {
  first_name: string;
  last_name: string;
  phone_number: number | undefined; // Usamos number | undefined para flexibilidad
}

// Tipo de los props del componente PersonalInformation
export interface PersonalInformationProps {
  // Datos iniciales del usuario
  initialData: UserProfileData & {
    email: string;
    birth_date: string;
    id: number;
  };
  // Función que se llama al guardar los cambios (recibe los datos modificados)
  onSave: (data: UserProfileData, id: number) => void;
  // Función que se llama al intentar eliminar la cuenta
  onDeleteAccount: (id: number) => void;
  // Estado de carga para deshabilitar el botón mientras se envía
  isSaving: boolean;
}
