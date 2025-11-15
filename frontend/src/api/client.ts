// Here is the api connection file, axios is the library used for http requests
import axios from "axios";
import type { Task } from "../components/types/Task";

export const tasksApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

tasksApi.defaults.withCredentials = true;

export const login = (email: string, password: string) =>
  tasksApi.post("backend/api/login/", { email, password });
export const signup = (username: string, password: string) =>
  tasksApi.post("backend/api/signup/", { username, password });
// Task API functions
export const getTasks = () => tasksApi.get("backend/api/tasks/");
export const createTask = () => tasksApi.post("backend/api/create/");
export const updatedTask = (task: Task) =>
  tasksApi.put(`backend/api/tasks/${task.task_id}/`, task);
export const deleteTask = (taskId: number) =>
  tasksApi.delete(`backend/api/tasks/${taskId}/`);
export const reorderTasks = (taskId: number, position: number) =>
  tasksApi.patch(`backend/api/tasks/${taskId}/`, { position });
